import { createRoute } from 'honox/factory'
import ProductCatalog from '../../islands/ProductCatalog'

export default createRoute(async (c) => {
  // 1. Ambil data kategori dari D1
  const { results: categories } = await c.env.DB.prepare(
    'SELECT * FROM categories'
  ).all()

  // 2. Ambil semua produk yang aktif dari D1
  const { results: products } = await c.env.DB.prepare(
    'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC'
  ).all()

  return c.render(
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Halaman Publik */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 font-serif mb-3">
          Katalog Logam Mulia
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Pilih produk investasi emas terbaik dengan sertifikasi resmi. Harga transparan dan diperbarui setiap hari.
        </p>
      </div>

      {/* Memanggil Island dan mengirimkan data dari Server ke Client */}
      <ProductCatalog initialProducts={products} categories={categories} />
    </div>,
    { title: 'Katalog Emas' }
  )
})
