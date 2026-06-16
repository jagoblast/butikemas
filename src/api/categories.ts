import { Hono } from 'hono'

const categoriesApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Publik / Admin: Ambil Kategori
categoriesApi.get('/', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM categories').all()
  return c.json({ success: true, data: results })
})

// [POST] Admin: Tambah Kategori
categoriesApi.post('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)
  
  const { name, slug, description, image_url } = await c.req.json()
  try {
    await c.env.DB.prepare(
      `INSERT INTO categories (id, name, slug, description, image_url) 
       VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?)`
    ).bind(name, slug, description, image_url).run()

    return c.json({ success: true, message: 'Kategori ditambahkan' })
  } catch (err) {
    return c.json({ success: false, message: 'Slug kategori sudah ada' }, 400)
  }
})

// [PUT] Admin: Edit Kategori
categoriesApi.put('/:id', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)

  const id = c.req.param('id')
  const { name, slug, description, image_url } = await c.req.json()

  await c.env.DB.prepare(
    `UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ? WHERE id = ?`
  ).bind(name, slug, description, image_url, id).run()

  return c.json({ success: true, message: 'Kategori diperbarui' })
})

// [DELETE] Admin: Hapus Kategori
categoriesApi.delete('/:id', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)

  const id = c.req.param('id')
  try {
    await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
    return c.json({ success: true, message: 'Kategori dihapus' })
  } catch (err) {
    return c.json({ success: false, message: 'Gagal: Kategori masih memiliki produk' }, 400)
  }
})

export default categoriesApi
