import { useState, useEffect } from 'hono/jsx'

export default function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState('')

  // Ambil URL saat Island dimuat di browser
  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  // Fungsi aktif untuk mobile
  const isActive = (path: string) => {
    if (path === '/admin') return currentPath === '/admin'
    return currentPath.startsWith(path)
  }

  // Helper styling mobile
  const activeClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-navy-900 bg-gold-400 font-bold transition-all"
  const inactiveClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-navy-200 hover:text-white hover:bg-white/5 font-medium transition-all"

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-navy-900 rounded-lg hover:bg-navy-50 sm:hidden">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-navy-900/50 backdrop-blur-sm sm:hidden" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-navy-900 transform transition-transform duration-300 ease-in-out sm:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm p-1.5">
              <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="truncate text-sm font-semibold text-white">Logam Mulia</p>
              <p className="text-xs text-navy-300">Menu Admin</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-navy-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="p-4 space-y-1.5">
          <a href="/admin" className={isActive('/admin') ? activeClass : inactiveClass}>Dashboard</a>
          <a href="/admin/products" className={isActive('/admin/products') ? activeClass : inactiveClass}>Katalog Produk</a>
          <a href="/admin/orders" className={isActive('/admin/orders') ? activeClass : inactiveClass}>Pesanan</a>
          <a href="/admin/customers" className={isActive('/admin/customers') ? activeClass : inactiveClass}>Pelanggan</a>
          <a href="/admin/settings" className={isActive('/admin/settings') ? activeClass : inactiveClass}>Pengaturan Sistem</a>
          
          <div className="pt-4 mt-4 border-t border-white/10">
            <a href="/api/auth/logout" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Keluar Sistem
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
