import { Hono } from 'hono'

const paymentMethodsApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Publik / Admin: Ambil List Metode Pembayaran
paymentMethodsApi.get('/', async (c) => {
  let query = 'SELECT * FROM payment_methods ORDER BY sort_order ASC'
  
  if (c.req.path.includes('/public/')) {
    query = 'SELECT * FROM payment_methods WHERE is_active = 1 AND status = "READY" ORDER BY sort_order ASC'
  }

  const { results } = await c.env.DB.prepare(query).all()
  return c.json({ success: true, data: results })
})

// [POST] Admin: Tambah Metode Pembayaran Baru
paymentMethodsApi.post('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)

  const { code, label, description, category, is_active, status, config, sort_order } = await c.req.json()

  try {
    await c.env.DB.prepare(
      `INSERT INTO payment_methods (code, label, description, category, is_active, status, config, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      code, label, description, category, 
      is_active ? 1 : 0, status || 'READY', 
      JSON.stringify(config || {}), sort_order || 0
    ).run()

    return c.json({ success: true, message: 'Metode pembayaran ditambahkan' })
  } catch (err) {
    return c.json({ success: false, message: 'Kode pembayaran sudah ada' }, 400)
  }
})

// [PUT] Admin: Update Metode Pembayaran
paymentMethodsApi.put('/:code', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)

  const codeParam = c.req.param('code')
  const { label, description, category, is_active, status, config, sort_order } = await c.req.json()

  // Cek apakah payment method ini is_locked (bawaan sistem yang tidak boleh dihapus/diubah strukturnya)
  const existing = await c.env.DB.prepare('SELECT is_locked FROM payment_methods WHERE code = ?').bind(codeParam).first()
  if (existing && existing.is_locked === 1) {
    // Jika locked, biasanya config/nama tetap bisa diubah, tapi bukan code/category. Disesuaikan dengan kebutuhan bisnis.
  }

  await c.env.DB.prepare(
    `UPDATE payment_methods 
     SET label = ?, description = ?, category = ?, is_active = ?, status = ?, config = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE code = ?`
  ).bind(
    label, description, category, 
    is_active ? 1 : 0, status, 
    JSON.stringify(config || {}), sort_order || 0, codeParam
  ).run()

  return c.json({ success: true, message: 'Metode pembayaran diperbarui' })
})

export default paymentMethodsApi
