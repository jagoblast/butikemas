import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
import AdminMobileMenu from '../../islands/AdminMobileMenu' // Memanggil menu Hamburger untuk layar HP

export default jsxRenderer(({ children, title }, c) => {
  // 1. Ambil URL path saat ini dari server Hono (misal: "/admin/products")
  const currentPath = c.req.path

  // 2. Fungsi penentu status aktif
  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin' // Harus sama persis untuk dashboard
    }
    return currentPath.startsWith(path) // Untuk sub-halaman (misal: /admin/products/new)
  }

  // 3. Template Class Tailwind untuk menu Aktif & Tidak Aktif
  const activeClass = "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium bg-gold-400 text-navy-900 shadow-sm transition-all"
  const inactiveClass = "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-navy-200 hover:bg-white/10 hover:text-white transition-all"

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Admin Panel` : 'Admin Panel'}</title>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=JetBrains+Mono&display=swap" rel="stylesheet" />
        
        <Link rel="stylesheet" href="/app/style.css" />
        <Script src="/app/client.ts" />
      </head>
      
      <body className="antialiased min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,222,162,0.2),_transparent_32%),linear-gradient(180deg,_#f8f9fa_0%,_#eef1f4_100%)]">
        <div className="flex min-h-screen">
          
          {/* ========================================== */}
          {/* SIDEBAR ADMIN (Layar Desktop) */}
          {/* ========================================== */}
          <aside className="sticky top-0 h-screen w-72 border-r border-navy-100 bg-navy-900 flex-col transition-[width] duration-300 hidden sm:flex">
            
            <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
              <a href="/admin" className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm p-1.5">
                  <img 
                    src="https://emas.pasdigi.id/images/logo-lm.png" 
                    alt="Logo Logam Mulia" 
                    className="h-full w-full object-contain" 
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">Logam Mulia</p>
                  <p className="truncate text-xs text-navy-300">Admin Console</p>
                </div>
              </a>
            </div>

            {/* Menu Navigasi dengan Logika Aktif Dinamis */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
              <a href="/admin" className={isActive('/admin') ? activeClass : inactiveClass}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span>Dashboard</span>
              </a>
              <a href="/admin/products" className={isActive('/admin/products') ? activeClass : inactiveClass}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <span>Katalog Produk</span>
              </a>
              <a href="/admin/orders" className={isActive('/admin/orders') ? activeClass : inactiveClass}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <span>Daftar Pesanan</span>
              </a>
              <a href="/admin/customers" className={isActive('/admin/customers') ? activeClass : inactiveClass}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span>Pelanggan</span>
              </a>

              {/* MENU PROMO / FLASH SALE */}
              <a href="/admin/promos" className={isActive('/admin/promos') ? activeClass : inactiveClass}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>Promo Event</span>
              </a>
              
              {/* MENU VOUCHER & DISKON */}
              <a href="/admin/vouchers" className={isActive('/admin/vouchers') ? activeClass : inactiveClass}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                <span>Voucher & Diskon</span>
              </a>

              {/* MENU ULASAN PRODUK */}
              <a href="/admin/reviews" className={isActive('/admin/reviews') ? activeClass : inactiveClass}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                <span>Ulasan Produk</span>
              </a>

              <a href="/admin/articles" className={isActive('/admin/articles') ? activeClass : inactiveClass}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" /></svg>
                <span>Artikel & Edukasi</span>
              </a>

              {/* Garis Pemisah untuk Pengaturan */}
              <div className="pt-4 mt-4 border-t border-white/10"></div>

              <a href="/admin/settings" className={isActive('/admin/settings') ? activeClass : inactiveClass}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Pengaturan Sistem</span>
              </a>
            </nav>
          </aside>

          {/* ========================================== */}
          {/* AREA KONTEN UTAMA */}
          {/* ========================================== */}
          <div className="min-w-0 flex-1 flex flex-col">
            
            <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/90 backdrop-blur-md">
              <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center gap-3">
                  {/* Island Hamburger Menu agar responsif di HP */}
                  <AdminMobileMenu />

                  <h1 className="truncate text-xl sm:text-2xl font-semibold leading-tight text-navy-900">
                    {title || 'Admin Panel'}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-50 border border-navy-100 text-xs font-semibold text-navy-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    HonoX SSR Connected
                  </span>

                  <div className="hidden sm:flex items-center gap-2 rounded-xl border border-navy-100 bg-white px-2.5 py-2 shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100 text-xs font-semibold text-gold-700">AD</div>
                    <p className="max-w-[120px] truncate text-sm font-semibold text-navy-900">Administrator</p>
                  </div>

                  {/* Tombol Logout (Menembak rute /api/auth/logout) */}
                  <a href="/api/auth/logout" className="ml-1 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Keluar">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </a>
                </div>

              </div>
            </header>

            <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
              {children}
            </main>

          </div>

        </div>
      </body>
    </html>
  )
})
