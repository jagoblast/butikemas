import { Hono } from 'hono'

// Tipe untuk environment D1 kita
const adminProductsApi = new Hono<{ Bindings: Env['Bindings'] }>()

// Ingat: Rute ini sudah dilindungi oleh middleware JWT di src/api/index.ts

// [POST] Tambah Produk Baru
adminProductsApi.post('/', async (c) => {
  const body = await c.req.json()
  
  try {
    // 1. Eksekusi RAW SQL ke D1 dengan aman (menggunakan ?)
    const result = await c.env.DB.prepare(
      `INSERT INTO products (id, name, slug, price, stock, image_url) 
       VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?)`
    ).bind(
      body.name, 
      body.slug, 
      body.price, 
      body.stock, 
      body.image_url
    ).run()

    // 2. Hapus Cache KV agar pengunjung publik melihat data terbaru
    await c.env.STATIC_KV.delete('static_products_list')

    return c.json({ success: true, message: 'Produk berhasil ditambahkan' })
  } catch (error) {
    console.error(error)
    return c.json({ success: false, message: 'Gagal menyimpan ke database' }, 500)
  }
})

// [DELETE] Hapus Produk
adminProductsApi.delete('/:id', async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
  await c.env.STATIC_KV.delete('static_products_list') // Reset Cache

  return c.json({ success: true, message: 'Produk dihapus' })
})

export default adminProductsApi
