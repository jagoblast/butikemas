import AdminCategoryForm from '../../../islands/AdminCategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <a href="/admin/categories" className="p-2 text-gray-400 hover:text-navy-900 bg-white rounded-xl border border-gray-200 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Kategori Baru</h1>
          <p className="text-sm text-gray-500">Masukkan detail kategori produk baru di bawah ini.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <AdminCategoryForm />
      </div>
    </div>
  )
}
