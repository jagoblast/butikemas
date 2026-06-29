import { Hono } from 'hono'

const ordersApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Ambil Daftar Pesanan
ordersApi.get('/', async (c) => {
  const path = c.req.path
  
  // Jika diakses oleh Admin
  if (path.includes('/admin/')) {
    const { results } = await c.env.DB.prepare(
      'SELECT id, customer_name, total_amount, status, created_at FROM orders ORDER BY created_at DESC'
    ).all()
    return c.json({ success: true, data: results })
  }

  // Jika diakses oleh Customer
  if (path.includes('/customer/')) {
    const payload = c.get('jwtPayload')
    const customerId = payload.id

    // PERBAIKAN: Gunakan 'user_id' agar cocok dengan data checkout yang baru
    const { results } = await c.env.DB.prepare(
      'SELECT id, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(customerId).all()
    
    return c.json({ success: true, data: results })
  }

  return c.json({ success: false, message: 'Akses ditolak' }, 403)
})

// [GET] Ambil Detail Pesanan (TAMBAHAN BARU UNTUK MENGATASI ERROR)
ordersApi.get('/:id', async (c) => {
  const orderId = c.req.param('id')
  const path = c.req.path

  try {
    // 1. Ambil data induk pesanan
    const order: any = await c.env.DB.prepare(
      'SELECT * FROM orders WHERE id = ?'
    ).bind(orderId).first()

    if (!order) {
      return c.json({ success: false, message: 'Pesanan tidak ditemukan' }, 404)
    }

    // 2. Jika diakses Customer, pastikan pesanan ini benar-benar miliknya
    if (path.includes('/customer/')) {
      const payload = c.get('jwtPayload')
      if (order.user_id !== payload.id) {
        return c.json({ success: false, message: 'Akses ditolak, ini bukan pesanan Anda' }, 403)
      }
    }

    // 3. Ambil daftar barang (items) yang ada di pesanan ini
    const { results: items } = await c.env.DB.prepare(
      'SELECT * FROM order_items WHERE order_id = ?'
    ).bind(orderId).all()

    // 4. Gabungkan dan kirim ke frontend
    return c.json({ 
      success: true, 
      data: { 
        ...order, 
        items 
      } 
    })
  } catch (error) {
    console.error("Get Order Detail Error:", error)
    return c.json({ success: false, message: 'Terjadi kesalahan sistem saat mengambil data' }, 500)
  }
})

// [PUT] Update Status Pesanan (Hanya Admin)
ordersApi.put('/:id/status', async (c) => {
  if (!c.req.path.includes('/admin/')) {
    return c.json({ success: false, message: 'Hanya admin yang dapat mengubah status' }, 403)
  }

  const orderId = c.req.param('id')
  const { status } = await c.req.json()

  await c.env.DB.prepare(
    'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(status, orderId).run()

  return c.json({ success: true, message: 'Status pesanan berhasil diperbarui' })
})

export default ordersApi
