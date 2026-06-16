import { Hono } from 'hono'

const customersApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Ambil Profil Sendiri (Customer) atau Semua Pelanggan (Admin)
customersApi.get('/', async (c) => {
  if (c.req.path.includes('/admin/')) {
    const { results } = await c.env.DB.prepare(
      'SELECT id, name, email, phone, created_at FROM users WHERE role = "CUSTOMER" ORDER BY created_at DESC'
    ).all()
    return c.json({ success: true, data: results })
  }

  if (c.req.path.includes('/customer/')) {
    const payload = c.get('jwtPayload')
    const customer = await c.env.DB.prepare(
      'SELECT id, name, email, phone, address FROM users WHERE id = ?'
    ).bind(payload.id).first()
    
    return c.json({ success: true, data: customer })
  }

  return c.json({ success: false }, 403)
})

// [PUT] Update Profil Sendiri (Customer)
customersApi.put('/update', async (c) => {
  const payload = c.get('jwtPayload')
  const { name, phone, address } = await c.req.json()

  await c.env.DB.prepare(
    'UPDATE users SET name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(name, phone, address, payload.id).run()

  return c.json({ success: true, message: 'Profil berhasil diperbarui' })
})

export default customersApi
