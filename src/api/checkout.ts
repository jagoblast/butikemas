import { Hono } from 'hono'

const checkoutApi = new Hono<{ Bindings: Env['Bindings'] }>()

checkoutApi.post('/', async (c) => {
  // Ambil ID Pelanggan langsung dari token JWT yang sudah diverifikasi middleware
  const payload = c.get('jwtPayload')
  const customerId = payload.id

  const body = await c.req.json()
  const { shipping_address, items, total_amount, payment_method } = body

  try {
    // 1. Ambil data asli pelanggan dari Database
    const customer: any = await c.env.DB.prepare(
      'SELECT name, email, phone FROM users WHERE id = ?'
    ).bind(customerId).first()

    if (!customer) {
      return c.json({ success: false, message: 'Data pengguna tidak valid' }, 401)
    }

    // 2. Generate Invoice ID
    const orderId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // 3. Ambil Kredensial Payment Gateway dari DB
    const dbSettings: any = await c.env.DB.prepare(
      `SELECT setting_data FROM system_settings WHERE setting_key = 'OMNIPAYGATE_CREDENTIALS'`
    ).first()

    if (!dbSettings) {
      return c.json({ success: false, message: 'Gateway pembayaran belum dikonfigurasi.' }, 400)
    }

    const gatewayCreds = JSON.parse(dbSettings.setting_data)

    // 4. Request ke API Omnipaygate (Gunakan data dari DB, bukan dari Frontend)
    const gatewayPayload = {
      amount: total_amount,
      payment_method: payment_method.toLowerCase(), // qris, bca_va
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
      return c.json({ success: false, message: 'Gagal membuat tagihan di Payment Gateway' }, 400)
    }

    // 5. Simpan Data Order dengan 'customer_id' agar masuk ke Riwayat Transaksi!
    await c.env.DB.prepare(
      `INSERT INTO orders (id, customer_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`
    ).bind(
      orderId, customerId, customer.name, customer.email, customer.phone, shipping_address, total_amount, payment_method
    ).run()

    // 6. Simpan Item Keranjang 
    for (const item of items) {
      await c.env.DB.prepare(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_checkout)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(orderId, item.product_id, item.product_name, item.quantity, item.price).run()
      
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
