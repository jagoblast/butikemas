import AdminCategoryList from '../../../islands/AdminCategoryList'

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Kategori</h1>
          <p className="text-sm text-gray-500">Kelola kategori produk untuk mempermudah navigasi pelanggan.</p>
        </div>
        <a 
          href="/admin/categories/new" 
          className="px-4 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Tambah Kategori
        </a>
      </div>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AdminCategoryList />
      </div>
    </div>
  )
}
