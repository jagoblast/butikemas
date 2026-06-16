import { jsxRenderer } from 'hono/jsx-renderer'

export default jsxRenderer(({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Statis Admin */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 bg-gray-950 font-bold text-xl text-yellow-500">
          LM Admin Panel
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <a href="/admin" className="p-2 hover:bg-gray-800 rounded">Dashboard</a>
          <a href="/admin/products" className="p-2 hover:bg-gray-800 rounded">Katalog Produk</a>
          <a href="/admin/orders" className="p-2 hover:bg-gray-800 rounded">Pesanan</a>
          <a href="/admin/settings" className="p-2 hover:bg-gray-800 rounded">Pengaturan</a>
        </nav>
        <div className="p-4">
          <button className="w-full text-left p-2 text-red-400 hover:bg-gray-800 rounded">
            Keluar
          </button>
        </div>
      </aside>

      {/* Area Konten Utama Admin */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{title || 'Dashboard Admin'}</h1>
          <div className="text-sm text-gray-500">Mode: Edge Serverless</div>
        </header>
        <div className="p-6 overflow-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  )
})
