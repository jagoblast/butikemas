import { createRoute } from 'honox/factory'
import AdminProductList from '../../../islands/AdminProductList'

export default createRoute((c) => {
  return c.render(
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Daftar Produk</h2>
        
        <a 
          href="/admin/products/new" 
          className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all"
        >
          + Tambah Produk
        </a>
      </div>

      {/* Memanggil komponen Island yang berisi tabel dinamis dan interaktif */}
      <AdminProductList />

    </div>,
    { title: 'Kelola Produk | Admin Panel' }
  )
})
