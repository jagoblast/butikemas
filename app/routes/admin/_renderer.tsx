// app/routes/admin/_renderer.tsx
import { jsxRenderer } from 'hono/jsx-renderer'

export default jsxRenderer(({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Panel Admin */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-5 bg-slate-950 font-bold text-lg tracking-wide text-yellow-400 border-b border-slate-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ButikEmas Admin
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1.5 text-sm font-medium">
          <a href="/admin" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-yellow-400 rounded-xl transition-all">
            Dashboard
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            Katalog Produk
          </a>
          <a href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            Daftar Pesanan
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <a href="/api/auth/logout" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-semibold">
            Keluar Sistem
          </a>
        </div>
      </aside>

      {/* Sisi Kanan / Area Utama */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-lg font-bold text-gray-800">{title || 'Dashboard Ringkasan'}</h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Serverless V8 Connected</span>
          </div>
        </header>

        {/* Suntikan halaman utama akan masuk ke variabel ini */}
        <div className="p-8 overflow-y-auto flex-grow max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
})
