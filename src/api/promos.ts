import { Hono } from 'hono'

const promosApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Admin: Lihat semua promo
promosApi.get('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)
  const { results } = await c.env.DB.prepare('SELECT * FROM promos ORDER BY created_at DESC, starts_at DESC').all()
  return c.json({ success: true, data: results })
})

// [POST] Admin: Buat Promo Baru
promosApi.post('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)
  
  const { name, discount_type, discount_value, max_discount, starts_at, expires_at, is_active } = await c.req.json()

  try {
    const newId = crypto.randomUUID().replace(/-/g, '')
    await c.env.DB.prepare(
      `INSERT INTO promos (id, name, discount_type, discount_value, max_discount, starts_at, expires_at, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      newId, 
      name, 
      discount_type, 
      discount_value, 
      max_discount || null, 
      starts_at || null, 
      expires_at || null, 
      is_active !== undefined ? is_active : 1
    ).run()

    return c.json({ success: true, message: 'Promo berhasil dibuat', id: newId })
  } catch (error) {
    return c.json({ success: false, message: 'Terjadi kesalahan saat menyimpan promo.' }, 400)
  }
})

// [DELETE] Admin: Hapus Promo
promosApi.delete('/:id', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)
  const id = c.req.param('id')
  
  // Hapus promo
  await c.env.DB.prepare('DELETE FROM promos WHERE id = ?').bind(id).run()
  // Bersihkan relasi dari tabel pivot
  await c.env.DB.prepare('DELETE FROM _CategoryToPromo WHERE B = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM _ProductToPromo WHERE B = ?').bind(id).run()
  
  return c.json({ success: true, message: 'Promo berhasil dihapus' })
})

// [GET] Publik: Ambil promo aktif
promosApi.get('/active', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM promos 
    WHERE is_active = 1 
    AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP)
    AND (expires_at IS NULL OR expires_at >= CURRENT_TIMESTAMP)
  `).all()
  return c.json({ success: true, data: results })
})

export default promosApi
