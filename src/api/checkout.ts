import { Hono } from 'hono'

const checkoutApi = new Hono<{ Bindings: Env['Bindings'] }>()

checkoutApi.post('/', async (c) => {
  const payload = c.get('jwtPayload')
  const customerId = payload.id

  const body = await c.req.json()
  // shipping_address dihapus dari sini
  const { items, total_amount, payment_method } = body

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

    // Payload yang dikirim ke API murni HANYA yang ada di dokumentasi
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

    // shipping_address dihapus dari query INSERT orders
    await c.env.DB.prepare(
      `INSERT INTO orders (id, customer_id, customer_name, customer_email, customer_phone, total_amount, payment_method, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`
    ).bind(
      orderId, customerId, customer.name, customer.email, customer.phone, amountAsInt, method
    ).run()

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
