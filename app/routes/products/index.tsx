import { createRoute } from 'honox/factory'
import ProductCatalog from '../../islands/ProductCatalog'

export default createRoute(async (c) => {
  const { results: categories } = await c.env.DB.prepare(
    'SELECT * FROM categories'
  ).all()

  // PERBAIKAN QUERY: Ambil gambar utama, nama kategori, dan rating
  const { results: products } = await c.env.DB.prepare(`
    SELECT p.*,
      c.name as category_name,
      (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY is_primary DESC LIMIT 1) as image_url,
      (SELECT COUNT(id) FROM reviews r WHERE r.product_id = p.id AND r.is_hidden = 0) as review_count,
      (SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id AND r.is_hidden = 0) as display_rating
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1 
    ORDER BY p.created_at DESC
  `).all()

  return c.render(
    <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-8 md:px-8 md:py-12">
      {products.length === 0 ? (
        <div className="text-center py-20">Belum ada produk atau gagal memuat dari server.</div>
      ) : (
        <ProductCatalog initialProducts={products} categories={categories} />
      )}
    </div>,
    { title: 'Katalog Produk Emas | Logam Mulia Antam' }
  )
})
