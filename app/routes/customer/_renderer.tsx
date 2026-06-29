import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
import { getCookie } from 'hono/cookie' // 1. Import getCookie untuk SSR Auth
import BottomBar from '../../islands/BottomBar' // 2. Import BottomBar

export default jsxRenderer(({ children, title }, c) => {
  const currentPath = c.req.path
  
  const isActive = (path: string) => {
    if (path === '/customer') return currentPath === '/customer'
    return currentPath.startsWith(path)
  }

  const activeTab = "border-gold-500 text-gold-600 font-bold border-b-2"
  const inactiveTab = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium border-b-2"

  // PERBAIKAN ERROR "reading 'slice'":
  // Ambil Payload JWT, pastikan variabel userName selalu berupa string
  const payload = c.get('jwtPayload') || {}
  const userName = payload.name || 'Member'
  
  // 3. Cek Status Login untuk BottomBar
  const isLoggedIn = !!getCookie(c, 'butik_cust_session')

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Member Area` : 'Member Area | Logam Mulia'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Link rel="stylesheet" href="/app/style.css" />
        <Script src="/app/client.ts" />
      </head>
      {/* 4. Tambahkan pb-16 khusus mobile agar konten tidak tertutup BottomBar */}
      <body className="bg-gray-50 min-h-screen font-sans antialiased text-navy-900 flex flex-col pb-16 md:pb-0">
        
        {/* Header Sederhana Member */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="/" className="flex items-center gap-3">
                <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logo" className="h-8 w-8 object-contain" />
                <span className="font-bold text-lg text-navy-900 hidden sm:block">Logam Mulia</span>
              </a>
              
              <div className="flex items-center gap-4">
                <a href="/products" className="text-sm font-semibold text-gray-600 hover:text-gold-600 transition-colors hidden sm:block">Katalog</a>
                <span className="h-5 w-px bg-gray-200 hidden sm:block"></span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-bold text-sm">
                    {/* Menggunakan userName yang dijamin berupa string */}
                    {userName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-navy-900 hidden sm:block">{userName}</span>
                </div>
                <a href="/api/auth/logout" className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors ml-2 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">
                  Keluar
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Konten Dashboard Member */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-navy-900">Akun Saya</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola informasi profil dan riwayat belanja emas Anda.</p>
          </div>

          <div className="border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
            <nav className="-mb-px flex space-x-8 min-w-max">
              <a href="/customer" className={`whitespace-nowrap pb-4 px-2 text-sm transition-colors ${isActive('/customer') ? activeTab : inactiveTab}`}>
                Profil Saya
              </a>
              <a href="/customer/orders" className={`whitespace-nowrap pb-4 px-2 text-sm transition-colors ${isActive('/customer/orders') ? activeTab : inactiveTab}`}>
                Riwayat Pesanan
              </a>
            </nav>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
            {children}
          </div>

        </main>

        <footer className="bg-white border-t border-gray-200 py-6 mt-auto text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Logam Mulia Member Portal.</p>
        </footer>

        {/* 5. Render BottomBar */}
        <BottomBar currentPath={currentPath} isLoggedIn={isLoggedIn} />
        
      </body>
    </html>
  )
})
