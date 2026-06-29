import { Hono } from 'hono'

const reviewsApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Publik: Ambil Review berdasarkan Produk
reviewsApi.get('/product/:product_id', async (c) => {
  const productId = c.req.param('product_id')
  const { results } = await c.env.DB.prepare(`
    SELECT r.id, r.rating, r.comment, r.created_at, u.name as customer_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ? AND r.is_hidden = 0
    ORDER BY r.created_at DESC
  `).bind(productId).all()
  
  return c.json({ success: true, data: results })
})

// [POST] Customer: Buat Review Baru
reviewsApi.post('/', async (c) => {
  // Hanya bisa diakses melalui rute /customer/reviews (dilindungi JWT)
  const payload = c.get('jwtPayload')
  if (!payload || !payload.id) return c.json({ success: false, message: 'Unauthorized' }, 401)
  
  const { product_id, order_id, rating, comment } = await c.req.json()

  try {
    await c.env.DB.prepare(`
      INSERT INTO reviews (id, user_id, product_id, order_id, rating, comment)
      VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?)
    `).bind(payload.id, product_id, order_id, rating, comment).run()

    return c.json({ success: true, message: 'Ulasan berhasil dikirim' })
  } catch (error) {
    return c.json({ success: false, message: 'Anda sudah mengulas produk ini.' }, 400)
  }
})

// [GET] Admin: Lihat Semua Review
reviewsApi.get('/admin', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT r.*, u.name as customer_name, p.name as product_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC
  `).all()
  
  return c.json({ success: true, data: results })
})

export default reviewsApi
