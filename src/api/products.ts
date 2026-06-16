import { Hono } from 'hono'

const productsApi = new Hono<{ Bindings: Env['Bindings'] }>()

// ==========================================
// 🌍 AKSES PUBLIK
// ==========================================
// [GET] Ambil Semua Produk (Mendukung pencarian & filter statis)
productsApi.get('/', async (c) => {
  const search = c.req.query('q') || ''
  let query = 'SELECT * FROM products WHERE stock > 0'
  let params: string[] = []

  if (search) {
    query += ' AND name LIKE ?'
    params.push(`%${search}%`)
  }
  
  query += ' ORDER BY created_at DESC'

  const { results } = await c.env.DB.prepare(query).bind(...params).all()
  return c.json({ success: true, data: results })
})

// [GET] Detail Produk berdasarkan Slug
productsApi.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const product = await c.env.DB.prepare(
    'SELECT * FROM products WHERE slug = ?'
  ).bind(slug).first()

  if (!product) return c.json({ success: false, message: 'Produk tidak ditemukan' }, 404)
  return c.json({ success: true, data: product })
})

// ==========================================
// 🛡️ AKSES ADMIN (Dilindungi Middleware di index.ts)
// ==========================================
// [POST] Tambah Produk
productsApi.post('/', async (c) => {
  const { name, slug, price, stock, image_url, description, category_id } = await c.req.json()

  try {
    await c.env.DB.prepare(
      `INSERT INTO products (id, name, slug, price, stock, image_url, description, category_id) 
       VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?)`
    ).bind(name, slug, price, stock, image_url, description, category_id).run()

    await c.env.STATIC_KV.delete('static_products_list') // Hapus cache
    return c.json({ success: true, message: 'Produk berhasil ditambahkan' })
  } catch (error) {
    return c.json({ success: false, message: 'Slug sudah digunakan atau data tidak valid' }, 400)
  }
})

// [PUT] Update Produk
productsApi.put('/:id', async (c) => {
  const id = c.req.param('id')
  const { name, slug, price, stock, image_url, description, category_id } = await c.req.json()

  await c.env.DB.prepare(
    `UPDATE products SET name = ?, slug = ?, price = ?, stock = ?, image_url = ?, description = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`
  ).bind(name, slug, price, stock, image_url, description, category_id, id).run()

  await c.env.STATIC_KV.delete('static_products_list')
  return c.json({ success: true, message: 'Produk diperbarui' })
})

// [DELETE] Hapus Produk
productsApi.delete('/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
  await c.env.STATIC_KV.delete('static_products_list')
  return c.json({ success: true, message: 'Produk dihapus' })
})

export default productsApi
