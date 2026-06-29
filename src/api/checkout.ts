import { Hono } from 'hono'

const checkoutApi = new Hono<{ Bindings: Env['Bindings'] }>()

checkoutApi.post('/', async (c) => {
  const payload = c.get('jwtPayload')
  const customerId = payload.id

  const body = await c.req.json()
  // PENTING: Tangkap kembali data dari frontend
  const { items, total_amount, payment_method, shipping_address } = body

  try {
    const customer: any = await c.env.DB.prepare(
      'SELECT name, email, phone FROM users WHERE id = ?'
    ).bind(customerId).first()

    if (!customer) {
      return c.json({ success: false, message: 'Data pengguna tidak valid' }, 401)
    }

    const orderId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const dbSettings: any = await c.env.DB.prepare(
      `SELECT setting_data FROM system_settings WHERE setting_key = 'OMNIPAYGATE_CREDENTIALS'`
    ).first()

    if (!dbSettings) {
      return c.json({ success: false, message: 'Gateway pembayaran belum dikonfigurasi.' }, 400)
    }

    const gatewayCreds = JSON.parse(dbSettings.setting_data)

    const amountAsInt = Math.floor(Number(total_amount))
    
    const allowedMethods = ['qris', 'usdt', 'bni', 'bri', 'mandiri', 'cimb', 'permata', 'bsi', 'seabank']
    const method = payment_method.toLowerCase()
    
    if (!allowedMethods.includes(method)) {
      return c.json({ success: false, message: 'Metode pembayaran tidak valid' }, 400)
    }

    const gatewayPayload = {
      amount: amountAsInt,
      payment_method: method,
      reference_id: orderId,
      customer_name: customer.name,
      customer_email: customer.email || ''
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
      console.error("DEBUG GATEWAY RESP:", JSON.stringify(gatewayData))
      return c.json({ 
        success: false, 
        message: 'Gagal membuat tagihan: ' + (gatewayData.message || 'Cek format data') 
      }, 400)
    }

    // PENAMBAHAN: Variabel untuk config JSON
    const paymentConfigString = JSON.stringify(gatewayData.data)

    // PERBAIKAN: Gunakan 'user_id', dan tambahkan field NOT NULL lainnya,
    // SERTA tambahkan payment_method_config ke dalam query INSERT.
    await c.env.DB.prepare(
      `INSERT INTO orders (
        id, user_id, customer_name, customer_email, customer_phone, 
        total_amount, grand_total, shipping_cost, shipping_address, shipping_city,
        payment_method, payment_method_config, status
      ) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`
    ).bind(
      orderId, 
      customerId, // Mengganti customer_id menjadi user_id sesuai DB
      customer.name, 
      customer.email, 
      customer.phone, 
      amountAsInt, // total_amount
      amountAsInt, // grand_total 
      0, // shipping_cost (sementara hardcode 0 atau lempar dari frontend)
      shipping_address || 'Alamat tidak diatur', // shipping_address
      '-', // shipping_city
      method,
      paymentConfigString // <-- PENAMBAHAN DI SINI
    ).run()

    for (const item of items) {
      // Generate ID untuk order_item karena wajib diisi
      const orderItemId = `ITEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      const subtotal = item.price * item.quantity

      // PERBAIKAN: Masukkan id, ganti kolom ke 'price_at_purchase', dan tambahkan 'subtotal'
      await c.env.DB.prepare(
        `INSERT INTO order_items (id, order_id, product_id, product_name, price_at_purchase, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        orderItemId, 
        orderId, 
        item.product_id, 
        item.product_name, 
        item.price, 
        item.quantity, 
        subtotal
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
