import { Hono } from 'hono'

const checkoutApi = new Hono<{ Bindings: Env['Bindings'], Variables: { jwtPayload: any } }>()

checkoutApi.post('/', async (c) => {
  const body = await c.req.json()
  const { shipping_address, items, payment_method, shipping_method } = body

  try {
    const jwtPayload = c.get('jwtPayload')
    if (!jwtPayload || !jwtPayload.id) {
      return c.json({ success: false, message: 'Autentikasi gagal. Silakan relogin.' }, 401)
    }

    const user: any = await c.env.DB.prepare('SELECT id, name, email, phone FROM users WHERE id = ?').bind(jwtPayload.id).first()
    if (!user) {
      return c.json({ success: false, message: 'Data Pengguna tidak valid' }, 401)
    }

    // Validasi Metode Pembayaran Secara Keseluruhan (Termasuk menolak BCA jika ada yg menebak API)
    const validMethods = ['qris', 'usdt', 'bni', 'bri', 'mandiri', 'cimb', 'permata', 'bsi', 'seabank']
    const pMethod = payment_method.toLowerCase()
    
    if (!validMethods.includes(pMethod)) {
       return c.json({ success: false, message: `Metode pembayaran ${pMethod} tidak didukung.` }, 400)
    }

    // Kalkulasi Total Terpercaya di Server 
    let calculatedSubtotal = 0
    const validItems = []

    for (const item of items) {
      const product: any = await c.env.DB.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').bind(item.product_id).first()
      
      if (!product) {
        return c.json({ success: false, message: `Produk ID tidak valid.` }, 400)
      }
      if (product.stock < item.quantity) {
        return c.json({ success: false, message: `Stok produk ${product.name} habis.` }, 400)
      }
      
      calculatedSubtotal += product.price * item.quantity
      validItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        price: product.price 
      })
    }

    const shippingCost = shipping_method === 'JNE' ? 25000 : shipping_method === 'PAXEL' ? 35000 : 0
    const OMNIPAY_METHODS: Record<string, number> = {
      qris: 0, usdt: 0, bni: 4000, bri: 4000, mandiri: 4000, cimb: 4000, permata: 4000, bsi: 4000, seabank: 4000
    }
    
    const paymentFee = OMNIPAY_METHODS[pMethod] ?? 0
    const grandTotal = calculatedSubtotal + shippingCost + paymentFee

    // VALIDASI LIMIT QRIS 999.999
    if (pMethod === 'qris' && grandTotal > 999999) {
       return c.json({ success: false, message: 'Batas maksimal transaksi metode QRIS adalah Rp 999.999' }, 400)
    }

    const orderId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const dbSettings: any = await c.env.DB.prepare(
      `SELECT setting_data FROM system_settings WHERE setting_key = 'OMNIPAYGATE_CREDENTIALS'`
    ).first()

    if (!dbSettings) {
      return c.json({ success: false, message: 'Gateway pembayaran belum dikonfigurasi.' }, 400)
    }

    const gatewayCreds = JSON.parse(dbSettings.setting_data)

    const gatewayPayload = {
      amount: grandTotal,
      payment_method: pMethod, 
      reference_id: orderId,
      customer_name: user.name,
      customer_email: user.email || ''
    }

    const gatewayRes = await fetch('https://omnipaygate.com/api/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${gatewayCreds.api_key}`,
        'X-Project-ID': gatewayCreds.project_id,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gatewayPayload)
    })

    const gatewayData: any = await gatewayRes.json()

    if (!gatewayRes.ok || !gatewayData.success) {
      return c.json({ success: false, message: 'Gagal membuat tagihan di Payment Gateway' }, 400)
    }

    // FIX: Tambah user_id saat insert order
    await c.env.DB.prepare(
      `INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, shipping_cost, grand_total, payment_method, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`
    ).bind(
      orderId, user.id, user.name, user.email, user.phone, shipping_address, calculatedSubtotal, shippingCost, grandTotal, pMethod
    ).run()

    for (const item of validItems) {
      await c.env.DB.prepare(
        `INSERT INTO order_items (id, order_id, product_id, product_name, price_at_purchase, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        `${orderId}-${item.product_id}`,
        orderId, 
        item.product_id, 
        item.product_name, 
        item.price, 
        item.quantity,
        item.price * item.quantity
      ).run()
      
      await c.env.DB.prepare(
        'UPDATE products SET stock = stock - ? WHERE id = ?'
      ).bind(item.quantity, item.product_id).run()
    }

    return c.json({ 
      success: true, 
      message: 'Checkout berhasil', 
      order_id: orderId,
      payment_data: gatewayData.data 
    })

  } catch (error) {
    console.error("Checkout Exception:", error)
    return c.json({ success: false, message: 'Terjadi kesalahan sistem saat checkout' }, 500)
  }
})

export default checkoutApi
