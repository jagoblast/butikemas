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
    // Ekstrak ID dari token JWT yang sudah dilewati middleware
    const payload = c.get('jwtPayload')
    const customerId = payload.id

    const { results } = await c.env.DB.prepare(
      'SELECT id, total_amount, status, created_at FROM orders WHERE customer_id = ? ORDER BY created_at DESC'
    ).bind(customerId).all()
    
    return c.json({ success: true, data: results })
  }

  return c.json({ success: false, message: 'Akses ditolak' }, 403)
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
