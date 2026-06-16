// app/routes/admin/products/[id].tsx
import { createRoute } from 'honox/factory'
import AdminProductForm from '../../../islands/AdminProductForm'

export default createRoute(async (c) => {
  // 1. Tangkap ID dari URL (Misal: /admin/products/b29a8f...)
  const productId = c.req.param('id')

  // 2. Ambil data produk secara langsung dari Edge Database D1 (Super Cepat)
  const product = await c.env.DB.prepare(
    'SELECT * FROM products WHERE id = ?'
  ).bind(productId).first()

  // 3. Jika produk tidak ditemukan di database, tampilkan halaman error
  if (!product) {
    return c.render(
      <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Produk Tidak Ditemukan</h1>
        <p className="text-gray-500 mt-2 mb-6">Produk dengan ID yang Anda cari tidak ada di dalam database.</p>
        <a href="/admin/products" className="inline-flex px-6 py-2.5 bg-navy-900 text-white font-semibold rounded-xl hover:bg-navy-800 transition-colors">
          Kembali ke Katalog
        </a>
      </div>
    )
  }

  // 4. Jika ditemukan, render halaman dan oper data produk ke Form Island
  return c.render(
    <div className="space-y-6">
      {/* Header Halaman Edit */}
      <div className="flex items-center gap-4">
        <a href="/admin/products" className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors bg-white shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
          <p className="text-sm text-gray-500">Memperbarui data produk: <span className="font-semibold text-navy-900">{product.name}</span></p>
        </div>
      </div>

      {/* Konten Form (InitialData dilempar ke mari) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <AdminProductForm initialData={product} />
      </div>
    </div>
  )
})
