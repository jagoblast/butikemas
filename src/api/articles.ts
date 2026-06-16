import { Hono } from 'hono'

const articlesApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Publik: Ambil Artikel (Bisa Pagination)
articlesApi.get('/', async (c) => {
  // Menggunakan is_published dan cover_url sesuai SCHEMA
  const { results } = await c.env.DB.prepare(
    'SELECT id, title, slug, excerpt, cover_url, published_at FROM articles WHERE is_published = 1 ORDER BY published_at DESC'
  ).all()
  return c.json({ success: true, data: results })
})

// [GET] Publik: Baca Artikel Lengkap
articlesApi.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const article = await c.env.DB.prepare(
    'SELECT * FROM articles WHERE slug = ? AND is_published = 1'
  ).bind(slug).first()

  if (!article) return c.json({ success: false, message: 'Artikel tidak ditemukan' }, 404)

  return c.json({ success: true, data: article })
})

// [POST] Admin: Tulis Artikel Baru
articlesApi.post('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false, message: 'Akses ditolak' }, 403)

  // Sesuai dengan payload dari AdminArticleForm.tsx
  const { title, slug, excerpt, content, cover_url, is_published, author_id } = await c.req.json()

  try {
    await c.env.DB.prepare(
      `INSERT INTO articles (id, title, slug, excerpt, content, cover_url, author_id, is_published, published_at, created_at, updated_at) 
       VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      title, 
      slug, 
      excerpt || null, 
      content, 
      cover_url || null, 
      author_id || 'admin-system', // Wajib ada karena schema RESTRICT NOT NULL
      is_published ? 1 : 0, 
      is_published ? 1 : 0
    ).run()

    return c.json({ success: true, message: 'Artikel disimpan' })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// [PUT] Admin: Edit Artikel
articlesApi.put('/:id', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false, message: 'Akses ditolak' }, 403)
  
  const id = c.req.param('id')
  const { title, slug, excerpt, content, cover_url, is_published } = await c.req.json()

  try {
    await c.env.DB.prepare(
      `UPDATE articles 
       SET title = ?, slug = ?, excerpt = ?, content = ?, cover_url = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      title, 
      slug, 
      excerpt || null, 
      content, 
      cover_url || null, 
      is_published ? 1 : 0, 
      id
    ).run()
    
    return c.json({ success: true, message: 'Artikel diperbarui' })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// [DELETE] Admin: Hapus Artikel
articlesApi.delete('/:id', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false, message: 'Akses ditolak' }, 403)
  
  const id = c.req.param('id')
  
  try {
    await c.env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run()
    return c.json({ success: true, message: 'Artikel dihapus' })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

export default articlesApi
