import { Hono } from 'hono'

const productsApi = new Hono<{ Bindings: Env['Bindings'] }>()

// ==========================================
// 🌍 AKSES PUBLIK
// ==========================================
// [GET] Ambil Semua Produk (Mendukung pencarian, filter statis, & PROMO AKTIF)
productsApi.get('/', async (c) => {
  const search = c.req.query('q') || ''
  
  // Query canggih: Ambil produk dan cek apakah ada promo aktif yang terhubung 
  // via _ProductToPromo (A=product_id) atau _CategoryToPromo (A=category_id).
  let query = `
    SELECT 
      p.*,
      COALESCE(pr_prod.name, pr_cat.name) as promo_name,
      COALESCE(pr_prod.discount_type, pr_cat.discount_type) as promo_discount_type,
      COALESCE(pr_prod.discount_value, pr_cat.discount_value) as promo_discount_value,
      COALESCE(pr_prod.max_discount, pr_cat.max_discount) as promo_max_discount
    FROM products p
    LEFT JOIN _ProductToPromo ptp ON p.id = ptp.A
    LEFT JOIN promos pr_prod ON ptp.B = pr_prod.id AND pr_prod.is_active = 1 AND (pr_prod.starts_at IS NULL OR pr_prod.starts_at <= CURRENT_TIMESTAMP) AND (pr_prod.expires_at IS NULL OR pr_prod.expires_at >= CURRENT_TIMESTAMP)
    LEFT JOIN _CategoryToPromo ctp ON p.category_id = ctp.A
    LEFT JOIN promos pr_cat ON ctp.B = pr_cat.id AND pr_cat.is_active = 1 AND (pr_cat.starts_at IS NULL OR pr_cat.starts_at <= CURRENT_TIMESTAMP) AND (pr_cat.expires_at IS NULL OR pr_cat.expires_at >= CURRENT_TIMESTAMP)
    WHERE p.stock > 0
  `
  let params: string[] = []

  if (search) {
    query += ' AND p.name LIKE ?'
    params.push(`%${search}%`)
  }
  
  query += ' ORDER BY p.created_at DESC'

  const { results } = await c.env.DB.prepare(query).bind(...params).all()
  return c.json({ success: true, data: results })
})

// [GET] Detail Produk berdasarkan Slug (Termasuk Promo Aktif)
productsApi.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const product = await c.env.DB.prepare(`
    SELECT 
      p.*,
      COALESCE(pr_prod.name, pr_cat.name) as promo_name,
      COALESCE(pr_prod.discount_type, pr_cat.discount_type) as promo_discount_type,
      COALESCE(pr_prod.discount_value, pr_cat.discount_value) as promo_discount_value,
      COALESCE(pr_prod.max_discount, pr_cat.max_discount) as promo_max_discount
    FROM products p
    LEFT JOIN _ProductToPromo ptp ON p.id = ptp.A
    LEFT JOIN promos pr_prod ON ptp.B = pr_prod.id AND pr_prod.is_active = 1 AND (pr_prod.starts_at IS NULL OR pr_prod.starts_at <= CURRENT_TIMESTAMP) AND (pr_prod.expires_at IS NULL OR pr_prod.expires_at >= CURRENT_TIMESTAMP)
    LEFT JOIN _CategoryToPromo ctp ON p.category_id = ctp.A
    LEFT JOIN promos pr_cat ON ctp.B = pr_cat.id AND pr_cat.is_active = 1 AND (pr_cat.starts_at IS NULL OR pr_cat.starts_at <= CURRENT_TIMESTAMP) AND (pr_cat.expires_at IS NULL OR pr_cat.expires_at >= CURRENT_TIMESTAMP)
    WHERE p.slug = ?
  `).bind(slug).first()

  if (!product) return c.json({ success: false, message: 'Produk tidak ditemukan' }, 404)
  return c.json({ success: true, data: product })
})

// ==========================================
// 🛡️ AKSES ADMIN
// ==========================================
productsApi.post('/', async (c) => {
  const { name, slug, price, stock, image_url, description, category_id } = await c.req.json()
  try {
    await c.env.DB.prepare(
      `INSERT INTO products (id, name, slug, price, stock, image_url, description, category_id) VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?)`
    ).bind(name, slug, price, stock, image_url, description, category_id).run()
    await c.env.STATIC_KV.delete('static_products_list')
    return c.json({ success: true, message: 'Produk berhasil ditambahkan' })
  } catch (error) {
    return c.json({ success: false, message: 'Slug sudah digunakan atau data tidak valid' }, 400)
  }
})

productsApi.put('/:id', async (c) => {
  const id = c.req.param('id')
  const { name, slug, price, stock, image_url, description, category_id } = await c.req.json()
  await c.env.DB.prepare(
    `UPDATE products SET name = ?, slug = ?, price = ?, stock = ?, image_url = ?, description = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(name, slug, price, stock, image_url, description, category_id, id).run()
  await c.env.STATIC_KV.delete('static_products_list')
  return c.json({ success: true, message: 'Produk diperbarui' })
})

productsApi.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
  await c.env.STATIC_KV.delete('static_products_list')
  return c.json({ success: true, message: 'Produk dihapus' })
})

export default productsApi
