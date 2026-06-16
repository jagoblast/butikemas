import { jsxRenderer } from 'hono/jsx-renderer'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Admin Logam Mulia` : 'Admin Logam Mulia'}</title>
        
        {/* WAJIB: Memanggil CSS Tailwind agar tidak berantakan */}
        <link rel="stylesheet" href="/style.css" />
        <script type="module" src="/app/client.ts"></script>
      </head>
      
      {/* Background Shell Asli dari AdminShell.tsx */}
      <body className="antialiased min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,222,162,0.2),_transparent_32%),linear-gradient(180deg,_#f8f9fa_0%,_#eef1f4_100%)]">
        <div className="flex min-h-screen">
          
          {/* ========================================== */}
          {/* SIDEBAR (Diambil dari AdminSidebar.tsx) */}
          {/* ========================================== */}
          <aside className="sticky top-0 h-screen w-72 border-r border-navy-100 bg-navy-900 flex-col transition-[width] duration-300 hidden sm:flex">
            
            <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
              <a href="/admin" className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-elevation-low">
                  <img 
                    src="/images/logo-lm.png" 
                    alt="Logo Logam Mulia" 
                    className="h-8 w-8 object-contain" 
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">Logam Mulia</p>
                  <p className="truncate text-xs text-navy-300">Admin Console</p>
                </div>
              </a>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              <a href="/admin" className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium bg-gold-400 text-navy-900 shadow-elevation-gold transition-all">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span>Dashboard</span>
              </a>
              <a href="/admin/products" className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-navy-200 hover:bg-white/10 hover:text-white transition-all">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <span>Katalog Produk</span>
              </a>
              <a href="/admin/orders" className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-navy-200 hover:bg-white/10 hover:text-white transition-all">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <span>Daftar Pesanan</span>
              </a>
              <a href="/admin/customers" className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-navy-200 hover:bg-white/10 hover:text-white transition-all">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span>Pelanggan</span>
              </a>
            </nav>
          </aside>


          {/* ========================================== */}
          {/* AREA KONTEN UTAMA */}
          {/* ========================================== */}
          <div className="min-w-0 flex-1 flex flex-col">
            
            {/* TOPBAR (Diambil dari AdminTopbar.tsx) */}
            <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/90 backdrop-blur-md">
              <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-2xl font-semibold leading-tight text-navy-900 sm:text-[1.75rem]">
                    {title || 'Admin Panel'}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  {/* Badge Notifikasi Sistem */}
                  <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-50 border border-navy-100 text-xs font-semibold text-navy-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    HonoX SSR Connected
                  </span>

                  {/* Profil Topbar Asli */}
                  <div className="flex items-center gap-2 rounded-xl border border-navy-100 bg-white px-2.5 py-2 shadow-elevation-low sm:px-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100 text-xs font-semibold text-gold-700">
                      AD
                    </div>
                    <div className="hidden sm:block">
                      <p className="max-w-[120px] truncate text-sm font-semibold text-navy-900">Administrator</p>
                    </div>
                  </div>

                  {/* Tombol Logout */}
                  {/* Nantinya bisa diarahkan ke fungsi hapus cookie */}
                  <a href="/login" className="ml-1 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Keluar">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </a>
                </div>

              </div>
            </header>

            {/* INJECTION HALAMAN (Diambil dari struktur main AdminShell) */}
            <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
              {children}
            </main>

          </div>

        </div>
      </body>
    </html>
  )
})
