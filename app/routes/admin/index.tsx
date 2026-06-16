export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Admin</h1>
        <p className="text-slate-600 mb-8">Selamat datang di Panel Kontrol Butik Emas.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Menu 1 */}
          <a href="/admin/products" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-bold text-lg text-slate-800">📦 Kelola Produk</h2>
            <p className="text-sm text-slate-500 mt-2">Tambah, edit, dan hapus katalog emas.</p>
          </a>

          {/* Card Menu 2 */}
          <a href="#" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-bold text-lg text-slate-800">🛒 Pesanan</h2>
            <p className="text-sm text-slate-500 mt-2">Pantau pesanan masuk dari pelanggan.</p>
          </a>

          {/* Card Menu 3 */}
          <a href="/" target="_blank" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-bold text-lg text-blue-600">🌐 Lihat Website</h2>
            <p className="text-sm text-slate-500 mt-2">Buka tampilan depan toko (Frontend).</p>
          </a>
        </div>
      </div>
    </div>
  )
}
