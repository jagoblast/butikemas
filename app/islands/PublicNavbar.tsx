import { useState, useEffect, useRef } from 'hono/jsx'

// Ikon Presisi sesuai gambar
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const BoxIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
const StoreIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
const ArticleIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const CartIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
const HelpIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const UserPlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
const LoginIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
const ChevronDown = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
const ChevronUp = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
const XIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPath, setCurrentPath] = useState('')
  const authRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setCurrentPath(window.location.pathname)
    setIsLoggedIn(document.cookie.includes('customer_session='))
    
    const syncCart = () => {
      const items = JSON.parse(localStorage.getItem('butikemas_cart') || '[]')
      setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0))
    }
    syncCart()
    window.addEventListener('cartUpdated', syncCart)

    function handleClickOutside(event: MouseEvent) {
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('cartUpdated', syncCart)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const checkIsActive = (path: string) => {
    if (!currentPath) return false
    if (path === '/') return currentPath === '/'
    return currentPath.startsWith(path)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3">
                <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logam Mulia" className="h-8 w-auto" />
                <span className="font-bold text-[22px] text-navy-900 tracking-tight font-serif">Logam Mulia</span>
              </a>
            </div>

            {/* Menu Tengah Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Produk', href: '/products' },
                { label: 'Butik', href: '/boutiques' },
                { label: 'Artikel', href: '/articles' },
              ].map((item) => {
                const active = checkIsActive(item.href)
                return (
                  <a 
                    key={item.href} 
                    href={item.href} 
                    className={`text-[15px] font-bold transition-colors ${active ? 'text-navy-900 border-b-2 border-gold-500 pb-1' : 'text-gray-600 hover:text-navy-900'}`}
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>

            {/* Ikon Kanan Desktop & Hamburger */}
            <div className="flex items-center gap-6">
              <a href="https://wa.me/6281234567890" className="text-gray-500 hover:text-navy-900 hidden sm:block">
                <HelpIcon />
              </a>
              <a href="/cart" className="text-gray-500 hover:text-navy-900 hidden sm:block relative">
                <CartIcon />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-navy-900 ring-2 ring-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </a>
              
              <div className="hidden sm:block relative" ref={authRef}>
                <button 
                  onClick={() => setIsAuthOpen(!isAuthOpen)} 
                  className={`flex items-center gap-2 px-5 py-2.5 border rounded-full transition-all text-sm font-bold ${
                    isAuthOpen ? 'border-gold-500 text-gold-600 bg-gold-50/20' : 'border-gray-300 text-navy-900 hover:bg-gray-50'
                  }`}
                >
                  <UserIcon /> {isLoggedIn ? 'Akun' : 'Masuk'} {isAuthOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
                {isAuthOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[280px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      {isLoggedIn ? 'Menu Akun' : 'Akses Akun'}
                    </p>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                      {isLoggedIn ? 'Kelola profil, riwayat pesanan, dan keranjang belanja Anda.' : 'Masuk untuk checkout dan menyimpan profil belanja.'}
                    </p>
                    <div className="flex flex-col gap-3">
                      {isLoggedIn ? (
                        <>
                          <a href="/customer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c99738] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#b38632]">
                            <UserIcon /> Akun Saya
                          </a>
                          <a href="/api/auth/logout" className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50">
                            Keluar
                          </a>
                        </>
                      ) : (
                        <>
                          <a href="/login" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c99738] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#b38632]">
                            <UserIcon /> Masuk
                          </a>
                          <a href="/register" className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gray-50">
                            <UserPlusIcon /> Daftar
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-navy-900">
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Drawer Mobile */}
      <div className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logam Mulia" className="h-6 w-auto" />
              <span className="font-bold text-lg text-navy-900 font-serif">Logam Mulia</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-navy-900">
              <XIcon />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {[
              { label: 'Beranda', href: '/', icon: HomeIcon },
              { label: 'Produk', href: '/products', icon: BoxIcon },
              { label: 'Butik', href: '/boutiques', icon: StoreIcon },
              { label: 'Artikel', href: '/articles', icon: ArticleIcon },
              { label: 'Keranjang', href: '/cart', icon: CartIcon },
            ].map((item) => {
              const active = checkIsActive(item.href)
              return (
                <a key={item.href} href={item.href} className={`flex items-center gap-4 px-4 py-3 text-sm font-bold rounded-xl ${active ? 'bg-gold-50/50 text-navy-900' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <item.icon /> {item.label}
                </a>
              )
            })}
            <a href="https://wa.me/6281234567890" className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl"><HelpIcon /> Bantuan</a>
          </div>

          <div className="p-5 border-t border-gray-100 space-y-3 bg-gray-50">
            {isLoggedIn ? (
               <>
                 <a href="/customer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b5852a] px-4 py-3.5 text-sm font-bold text-white shadow-sm">
                   <UserIcon /> Akun Saya
                 </a>
                 <a href="/api/auth/logout" className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-bold text-red-600 shadow-sm">
                   Keluar
                 </a>
               </>
            ) : (
              <>
                <a href="/login" className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-bold text-navy-900 shadow-sm">
                  <LoginIcon /> Masuk
                </a>
                <a href="/register" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b5852a] px-4 py-3.5 text-sm font-bold text-white shadow-sm">
                  <UserPlusIcon /> Daftar
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-[#16213E] border-t-4 border-[#C99738] flex justify-around items-center px-2 py-3 pb-safe">
        {[
          { href: '/', icon: HomeIcon },
          { href: '/products', icon: BoxIcon },
          { href: '/cart', icon: CartIcon },
          { href: isLoggedIn ? '/customer' : '/login', icon: UserIcon },
        ].map((item) => {
          const active = checkIsActive(item.href)
          return (
            <a key={item.href} href={item.href} className={`flex flex-col items-center gap-1 transition-colors relative ${active ? 'text-[#C99738]' : 'text-gray-400 hover:text-white'}`}>
              <item.icon />
              {item.href === '/cart' && cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </a>
          )
        })}
      </div>
    </>
  )
}
