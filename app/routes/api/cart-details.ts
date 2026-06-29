import { createRoute } from 'honox/factory'

export const POST = createRoute(async (c) => {
  try {
    const body = await c.req.json()
    const { productIds } = body

    // Jika keranjang kosong, langsung return array kosong
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return c.json({ success: true, data: [] })
    }

    // Buat placeholder '?' sesuai jumlah ID untuk menghindari SQL Injection
    const placeholders = productIds.map(() => '?').join(',')

    // Query untuk mengambil detail produk beserta gambar utamanya
    const query = `
      SELECT p.id, p.name, p.slug, p.price, p.weight_gram, p.stock,
        (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as image_url
      FROM products p
      WHERE p.id IN (${placeholders}) AND p.is_active = 1
    `

    const { results } = await c.env.DB.prepare(query).bind(...productIds).all()

    return c.json({ success: true, data: results })
  } catch (error) {
    console.error('Cart Hydration Error:', error)
    return c.json({ success: false, message: 'Gagal mengambil data produk dari database' }, 500)
  }
})
