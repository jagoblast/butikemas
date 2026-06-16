import { Hono } from 'hono'

const boutiquesApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Publik / Admin: Ambil semua lokasi butik
boutiquesApi.get('/', async (c) => {
  let query = 'SELECT * FROM boutiques ORDER BY sort_order ASC'
  
  // Jika diakses publik, hanya tampilkan yang aktif
  if (c.req.path.includes('/public/')) {
    query = 'SELECT * FROM boutiques WHERE is_active = 1 ORDER BY sort_order ASC'
  }

  const { results } = await c.env.DB.prepare(query).all()
  return c.json({ success: true, data: results })
})

// [POST] Admin: Tambah Butik Baru
boutiquesApi.post('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)

  const { name, slug, city, address, contact_phone, google_maps_url, is_active, sort_order } = await c.req.json()

  try {
    await c.env.DB.prepare(
      `INSERT INTO boutiques (id, name, slug, city, address, contact_phone, google_maps_url, is_active, sort_order) 
       VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(name, slug, city, address, contact_phone, google_maps_url, is_active ? 1 : 0, sort_order || 0).run()

    return c.json({ success: true, message: 'Butik berhasil ditambahkan' })
  } catch (err) {
    return c.json({ success: false, message: 'Slug sudah digunakan atau data tidak valid' }, 400)
  }
})

// [PUT] Admin: Update Data Butik
boutiquesApi.put('/:id', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)
  
  const id = c.req.param('id')
  const { name, slug, city, address, contact_phone, google_maps_url, is_active, sort_order } = await c.req.json()

  await c.env.DB.prepare(
    `UPDATE boutiques SET name = ?, slug = ?, city = ?, address = ?, contact_phone = ?, google_maps_url = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(name, slug, city, address, contact_phone, google_maps_url, is_active ? 1 : 0, sort_order || 0, id).run()

  return c.json({ success: true, message: 'Data butik diperbarui' })
})

// [DELETE] Admin: Hapus Butik
boutiquesApi.delete('/:id', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)
  
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM boutiques WHERE id = ?').bind(id).run()
  return c.json({ success: true, message: 'Butik dihapus' })
})

export default boutiquesApi
