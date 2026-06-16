import AdminProductForm from '../../../islands/AdminProductForm'

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex items-center gap-4">
        <a href="/admin/products" className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors bg-white shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
          <p className="text-sm text-gray-500">Masukkan detail informasi produk logam mulia yang akan ditambahkan ke katalog.</p>
        </div>
      </div>

      {/* Konten Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <AdminProductForm />
      </div>
    </div>
  )
}
