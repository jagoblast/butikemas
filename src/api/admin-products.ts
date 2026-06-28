import { Hono } from 'hono'

// Tipe untuk environment D1 dan KV Cloudflare
const adminProductsApi = new Hono<{ Bindings: Env['Bindings'] }>()

// ==========================================
// [GET] Ambil Semua Produk (Untuk Tabel)
// ==========================================
adminProductsApi.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT * FROM products ORDER BY created_at DESC`
    ).all()
    
    return c.json({ success: true, data: results })
  } catch (error) {
    console.error('Error fetching all products:', error)
    return c.json({ success: false, message: 'Gagal mengambil daftar produk' }, 500)
  }
})
// ==========================================
// [POST] Streaming Upload ke Cloudinary
// ==========================================
adminProductsApi.post('/upload', async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body['file'] as File

    if (!file) {
      return c.json({ success: false, message: 'Tidak ada berkas file yang diunggah' }, 400)
    }

    // Ambil konfigurasi Cloudinary dari Environment Variables
    const cloudName = c.env.CLOUDINARY_CLOUD_NAME || 'isi_cloud_name_anda'
    const uploadPreset = c.env.CLOUDINARY_UPLOAD_PRESET || 'isi_upload_preset_anda'

    // Susun multipart form data untuk streaming forward ke Cloudinary API
    const cloudinaryForm = new FormData()
    cloudinaryForm.append('file', file)
    cloudinaryForm.append('upload_preset', uploadPreset)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: cloudinaryForm,
    })

    const data = await response.json() as any

    if (response.ok && data.secure_url) {
      return c.json({ success: true, url: data.secure_url })
    } else {
      return c.json({ 
        success: false, 
        message: data.error?.message || 'Gagal melakukan streaming upload ke Cloudinary' 
      }, 400)
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return c.json({ success: false, message: 'Terjadi kesalahan internal server saat upload' }, 500)
  }
})

// ==========================================
// [GET] Ambil 1 Produk Beserta Gambar Utamanya
// ==========================================
adminProductsApi.get('/:id', async (c) => {
  const id = c.req.param('id')
  
  try {
    // JOIN dengan product_images untuk mengambil image_url yang ditandai sebagai is_primary
    const product = await c.env.DB.prepare(`
      SELECT p.*, pi.image_url 
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE p.id = ?
    `).bind(id).first()
    
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
    
    // Generate UUID/ID unik aman di level JavaScript 
    const productId = crypto.randomUUID().replace(/-/g, '')
    const imageId = crypto.randomUUID().replace(/-/g, '')

    // Eksekusi batch statement untuk menjaga integritas data antar tabel
    await c.env.DB.batch([
      c.env.DB.prepare(
        `INSERT INTO products (id, category_id, name, slug, description, price, weight_gram, kadar, stock, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
      ).bind(
        productId,
        body.category_id, // String ID (bukan number)
        body.name, 
        body.slug, 
        body.description || null,
        body.price || 0, 
        body.weight_gram || 0,
        body.kadar || '999.9', // Memenuhi constraint NOT NULL
        body.stock || 0
      ),
      c.env.DB.prepare(
        `INSERT INTO product_images (id, product_id, image_url, is_primary, sort_order)
         VALUES (?, ?, ?, 1, 1)`
      ).bind(
        imageId,
        productId,
        body.image_url || ''
      )
    ])

    // Hapus Cache KV jika tersedia
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
    const statements = [
      // Statement 1: Perbarui data produk utama
      c.env.DB.prepare(
        `UPDATE products 
         SET name = ?, slug = ?, description = ?, price = ?, weight_gram = ?, kadar = ?, stock = ?, category_id = ?
         WHERE id = ?`
      ).bind(
        body.name, 
        body.slug, 
        body.description || null,
        body.price || 0, 
        body.weight_gram || 0,
        body.kadar || '999.9',
        body.stock || 0, 
        body.category_id, 
        id
      )
    ]

    // Statement 2 & 3: Reset dan Tulis ulang gambar utama jika dikirim gambar baru
    if (body.image_url) {
      const newImageId = crypto.randomUUID().replace(/-/g, '')
      statements.push(
        c.env.DB.prepare(`DELETE FROM product_images WHERE product_id = ? AND is_primary = 1`).bind(id)
      )
      statements.push(
        c.env.DB.prepare(`INSERT INTO product_images (id, product_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, 1, 1)`).bind(newImageId, id, body.image_url)
      )
    }

    await c.env.DB.batch(statements)

    // Reset Cache Publik
    if (c.env.STATIC_KV) {
      await c.env.STATIC_KV.delete('static_products_list')
      await c.env.STATIC_KV.delete(`static_product_${body.slug}`)
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
