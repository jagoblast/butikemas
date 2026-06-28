import { Hono } from 'hono'

// Tambahkan type Variables untuk menangkap Payload JWT (Hono Middleware)
const checkoutApi = new Hono<{ Bindings: Env['Bindings'], Variables: { jwtPayload: any } }>()

checkoutApi.post('/', async (c) => {
  const body = await c.req.json()
  const { shipping_address, items, payment_method, shipping_method } = body

  try {
    // 1. Ambil Identitas Autentikasi Pengguna Secara Aman
    const jwtPayload = c.get('jwtPayload')
    if (!jwtPayload || !jwtPayload.id) {
      return c.json({ success: false, message: 'Autentikasi gagal. Silakan relogin.' }, 401)
    }

    const user: any = await c.env.DB.prepare('SELECT name, email, phone FROM users WHERE id = ?').bind(jwtPayload.id).first()
    if (!user) {
      return c.json({ success: false, message: 'Data Pengguna tidak valid' }, 401)
    }

    // 2. HITUNG ULANG Harga & Stok Produk langsung di Database! (Celah Keamanan Ditutup)
    let calculatedSubtotal = 0
    const validItems = []

    for (const item of items) {
      const product: any = await c.env.DB.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').bind(item.product_id).first()
      
      if (!product) {
        return c.json({ success: false, message: `Produk ID ${item.product_id} tidak valid/ditemukan.` }, 400)
      }
      if (product.stock < item.quantity) {
        return c.json({ success: false, message: `Stok produk ${product.name} habis/tidak mencukupi.` }, 400)
      }
      
      calculatedSubtotal += product.price * item.quantity
      validItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        price: product.price // Memakai Harga Resmi dari Database
      })
    }

    // 3. Hitung Biaya Tambahan
    const shippingCost = shipping_method === 'JNE' ? 25000 : shipping_method === 'PAXEL' ? 35000 : 0
    const OMNIPAY_METHODS: Record<string, number> = {
      qris: 0, bni: 4000, bri: 4000, mandiri: 4000, cimb: 4000, permata: 4000, bsi: 4000, seabank: 4000
    }
    const pMethod = payment_method.toLowerCase()
    const paymentFee = OMNIPAY_METHODS[pMethod] ?? 0

    const grandTotal = calculatedSubtotal + shippingCost + paymentFee

    // 4. Generate Invoice ID dari sistem
    const orderId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // 5. Ambil Kredensial Payment Gateway dari DB
    const dbSettings: any = await c.env.DB.prepare(
      `SELECT setting_data FROM system_settings WHERE setting_key = 'OMNIPAYGATE_CREDENTIALS'`
    ).first()

    if (!dbSettings) {
      return c.json({ success: false, message: 'Gateway pembayaran belum dikonfigurasi oleh Admin.' }, 400)
    }

    const gatewayCreds = JSON.parse(dbSettings.setting_data)

    // 6. Request ke API Omnipaygate
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
      console.error("Gateway Error:", gatewayData)
      return c.json({ success: false, message: 'Gagal membuat tagihan di Payment Gateway' }, 400)
    }

    // 7. Simpan Data Order Utama
    await c.env.DB.prepare(
      `INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`
    ).bind(
      orderId, user.name, user.email, user.phone, shipping_address, grandTotal, pMethod
    ).run()

    // 8. Simpan Item Keranjang
    for (const item of validItems) {
      await c.env.DB.prepare(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_checkout)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(orderId, item.product_id, item.product_name, item.quantity, item.price).run()
      
      // Kurangi Stok Produk
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
