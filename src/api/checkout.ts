import { Hono } from 'hono'

const checkoutApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [POST] Proses Checkout Baru
checkoutApi.post('/', async (c) => {
  const body = await c.req.json()
  const { customer_name, customer_email, customer_phone, shipping_address, items, total_amount, payment_method } = body

  try {
    // 1. Generate Order ID yang unik (Format: ORD-TIMESTAMP-RANDOM)
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // 2. Simpan Data Order Utama ke tabel orders
    await c.env.DB.prepare(
      `INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'UNPAID')`
    ).bind(
      orderId, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method
    ).run()

    // 3. Simpan Item Keranjang (Order Details)
    // Di Edge Worker, jika items berupa array, kita loop dan eksekusi
    for (const item of items) {
      await c.env.DB.prepare(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_checkout)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(orderId, item.product_id, item.product_name, item.quantity, item.price).run()
      
      // 4. Kurangi Stok Produk (Opsional / Tergantung bisnis logic Anda)
      await c.env.DB.prepare(
        'UPDATE products SET stock = stock - ? WHERE id = ?'
      ).bind(item.quantity, item.product_id).run()
    }

    return c.json({ 
      success: true, 
      message: 'Checkout berhasil', 
      order_id: orderId 
    })

  } catch (error) {
    console.error("Checkout gagal:", error)
    return c.json({ success: false, message: 'Terjadi kesalahan sistem saat checkout' }, 500)
  }
})

export default checkoutApi
