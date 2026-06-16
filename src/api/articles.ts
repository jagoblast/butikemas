import { Hono } from 'hono'

const articlesApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Publik: Ambil Artikel (Bisa Pagination)
articlesApi.get('/', async (c) => {
  // Publik hanya melihat artikel yang sudah di-publish
  const { results } = await c.env.DB.prepare(
    'SELECT id, title, slug, excerpt, thumbnail_url, published_at FROM articles WHERE status = "PUBLISHED" ORDER BY published_at DESC'
  ).all()
  return c.json({ success: true, data: results })
})

// [GET] Publik: Baca Artikel Lengkap
articlesApi.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const article = await c.env.DB.prepare(
    'SELECT * FROM articles WHERE slug = ? AND status = "PUBLISHED"'
  ).bind(slug).first()

  if (!article) return c.json({ success: false, message: 'Artikel tidak ditemukan' }, 404)
  
  // Tambah counter pembaca (View Count)
  c.executionCtx.waitUntil(
    c.env.DB.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').bind(article.id).run()
  )

  return c.json({ success: true, data: article })
})

// [POST] Admin: Tulis Artikel Baru
articlesApi.post('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)

  const { title, slug, excerpt, content, thumbnail_url, status } = await c.req.json()

  await c.env.DB.prepare(
    `INSERT INTO articles (id, title, slug, excerpt, content, thumbnail_url, status, published_at) 
     VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'PUBLISHED' THEN CURRENT_TIMESTAMP ELSE NULL END)`
  ).bind(title, slug, excerpt, content, thumbnail_url, status, status).run()

  return c.json({ success: true, message: 'Artikel disimpan' })
})

export default articlesApi
