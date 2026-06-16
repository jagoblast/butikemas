import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
// Kita bisa menggunakan ikon Lucide biasa karena dirender di server
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Admin Panel` : 'Admin Panel'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Link rel="stylesheet" href="/app/style.css" />
        <Script src="/app/client.ts" />
      </head>
      <body className="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
        
        {/* SIDEBAR ADMIN (Statik, dirender murni di Server) */}
        <aside className="w-64 bg-navy-900 text-white flex flex-col hidden md:flex shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-white/10">
            <span className="font-bold text-lg tracking-wide text-gold-400">ButikEmas Admin</span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Navigasi MPA murni menggunakan tag <a> */}
            <a href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-gold-400" />
              <span className="font-medium text-sm">Dashboard</span>
            </a>
            <a href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
              <Package className="w-5 h-5 text-gold-400" />
              <span className="font-medium text-sm">Kelola Produk</span>
            </a>
            <a href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
              <ShoppingCart className="w-5 h-5 text-gold-400" />
              <span className="font-medium text-sm">Pesanan</span>
            </a>
          </nav>

          <div className="p-4 border-t border-white/10">
            <a href="/logout" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-white/10 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Keluar</span>
            </a>
          </div>
        </aside>

        {/* AREA KONTEN UTAMA */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar Statik */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <h1 className="font-semibold text-slate-800">{title || 'Panel Kontrol'}</h1>
            <div className="flex items-center gap-4">
               <span className="text-sm font-medium text-slate-600">Halo, Admin</span>
            </div>
          </header>

          {/* Konten Halaman akan disuntikkan ke {children} ini */}
          <div className="flex-1 overflow-auto p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
})
