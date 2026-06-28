import { Hono } from 'hono'

const checkoutApi = new Hono<{ Bindings: Env['Bindings'] }>()

checkoutApi.post('/', async (c) => {
  const body = await c.req.json()
  const { customer_name, customer_email, customer_phone, shipping_address, items, total_amount, payment_method } = body

  try {
    // 1. Generate Invoice ID dari sistem kita
    const orderId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // 2. Ambil Kredensial Payment Gateway dari DB (Atau gunakan ENV sebagai fallback)
    const dbSettings: any = await c.env.DB.prepare(
      `SELECT setting_data FROM system_settings WHERE setting_key = 'OMNIPAYGATE_CREDENTIALS'`
    ).first()

    if (!dbSettings) {
      return c.json({ success: false, message: 'Gateway pembayaran belum dikonfigurasi oleh Admin.' }, 400)
    }

    const gatewayCreds = JSON.parse(dbSettings.setting_data)

    // 3. Request ke API Omnipaygate
    const gatewayPayload = {
      amount: total_amount,
      payment_method: payment_method.toLowerCase(), // pastikan lower case (qris, bni, dll)
      reference_id: orderId,
      customer_name: customer_name,
      customer_email: customer_email || ''
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

    // 4. Simpan Data Order Utama ke database lokal (Status UNPAID/PENDING)
    await c.env.DB.prepare(
      `INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`
    ).bind(
      orderId, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method
    ).run()

    // 5. Simpan Item Keranjang 
    for (const item of items) {
      await c.env.DB.prepare(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_checkout)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(orderId, item.product_id, item.product_name, item.quantity, item.price).run()
      
      // Kurangi Stok Produk
      await c.env.DB.prepare(
        'UPDATE products SET stock = stock - ? WHERE id = ?'
      ).bind(item.quantity, item.product_id).run()
    }

    // Kembalikan Order ID dan Data dari Gateway (QR String, Transaction ID Gateway) ke Frontend
    return c.json({ 
      success: true, 
      message: 'Checkout berhasil', 
      order_id: orderId,
      payment_data: gatewayData.data // Frontend bisa merender QR dari data ini
    })

  } catch (error) {
    console.error("Checkout Exception:", error)
    return c.json({ success: false, message: 'Terjadi kesalahan sistem saat checkout' }, 500)
  }
})

export default checkoutApi
