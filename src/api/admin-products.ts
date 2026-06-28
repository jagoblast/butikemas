import { Hono } from 'hono'

// Tipe untuk environment D1 kita
const adminProductsApi = new Hono<{ Bindings: Env['Bindings'] }>()

// Ingat: Rute ini sudah dilindungi oleh middleware JWT di src/api/index.ts

// ==========================================
// [GET] Ambil 1 Produk (Untuk Prefill Form Edit)
// ==========================================
adminProductsApi.get('/:id', async (c) => {
  const id = c.req.param('id')
  
  try {
    const product = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
    
    if (!product) {
      return c.json({ success: false, message: 'Produk tidak ditemukan' }, 404)
    }
    
    return c.json({ success: true, data: product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return c.json({ success: false, message: 'Gagal mengambil data produk dari database' }, 500)
  }
})

// ==========================================
// [POST] Tambah Produk Baru
// ==========================================
adminProductsApi.post('/', async (c) => {
  try {
    const body = await c.req.json()
    
    // Mengeksekusi RAW SQL ke D1 dengan aman (termasuk field lengkap)
    await c.env.DB.prepare(
      `INSERT INTO products (id, name, slug, description, price, weight_gram, stock, category_id, image_url) 
       VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      body.name, 
      body.slug, 
      body.description || null,
      body.price || 0, 
      body.weight_gram || 0,
      body.stock || 0, 
      body.category_id || null,
      body.image_url || null
    ).run()

    // Hapus Cache KV agar pengunjung publik melihat data terbaru
    if (c.env.STATIC_KV) {
      await c.env.STATIC_KV.delete('static_products_list')
    }

    return c.json({ success: true, message: 'Produk berhasil ditambahkan' })
  } catch (error) {
    console.error('Error insert product:', error)
    return c.json({ success: false, message: 'Gagal menyimpan produk ke database' }, 500)
  }
})

// ==========================================
// [PUT] Simpan Perubahan Edit Produk
// ==========================================
adminProductsApi.put('/:id', async (c) => {
  const id = c.req.param('id')
  
  try {
    const body = await c.req.json()
    
    await c.env.DB.prepare(
      `UPDATE products 
       SET name = ?, slug = ?, description = ?, price = ?, weight_gram = ?, stock = ?, category_id = ?, image_url = ?
       WHERE id = ?`
    ).bind(
      body.name, 
      body.slug, 
      body.description || null,
      body.price || 0, 
      body.weight_gram || 0,
      body.stock || 0, 
      body.category_id || null,
      body.image_url || null,
      id
    ).run()

    // Reset Cache
    if (c.env.STATIC_KV) {
      await c.env.STATIC_KV.delete('static_products_list')
      await c.env.STATIC_KV.delete(`static_product_${body.slug}`) // Jika ada cache detail
    }

    return c.json({ success: true, message: 'Data produk berhasil diperbarui' })
  } catch (error) {
    console.error('Error update product:', error)
    return c.json({ success: false, message: 'Gagal memperbarui database' }, 500)
  }
})

// ==========================================
// [DELETE] Hapus Produk
// ==========================================
adminProductsApi.delete('/:id', async (c) => {
  const id = c.req.param('id')
  
  try {
    await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
    
    // Reset Cache
    if (c.env.STATIC_KV) {
      await c.env.STATIC_KV.delete('static_products_list')
    }

    return c.json({ success: true, message: 'Produk berhasil dihapus' })
  } catch (error) {
    console.error('Error delete product:', error)
    return c.json({ success: false, message: 'Gagal menghapus produk' }, 500)
  }
})

export default adminProductsApi
