import { useState, useEffect, useRef } from 'hono/jsx'

const Headphones = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
const ShoppingCart = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
const User = ({ className = "w-[18px] h-[18px]" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="14" cy="7" r="4"/></svg>
const UserPlus = () => <svg className="w-4 h-4 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
const LogOut = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const ClipboardList = () => <svg className="w-4 h-4 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
const ChevronDown = ({ className = "w-4 h-4" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
const Menu = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
const X = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
const MapPin = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const FileText = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const PackageIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>

export default function PublicNavbar({ currentPath: initialPath, initialIsLoggedIn }: { currentPath?: string, initialIsLoggedIn?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  
  // Menggunakan props dari server
  const [isLoggedIn] = useState(initialIsLoggedIn || false)
  const [userName] = useState(initialIsLoggedIn ? 'Pelanggan' : '')
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState(initialPath || '')
  
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })

    const syncCartCount = () => {
      const items = JSON.parse(localStorage.getItem('butikemas_cart') || '[]')
      setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0))
    }
    syncCartCount()
    window.addEventListener('cartUpdated', syncCartCount)

    function handleOutsideClick(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('cartUpdated', syncCartCount)
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    }
    return () => { 
      if (typeof document !== 'undefined') document.body.style.overflow = '' 
    }
  }, [isMenuOpen])

  const checkIsActive = (path: string) => {
    if (!currentPath) return false
    if (path === '/') return currentPath === '/'
    return currentPath.startsWith(path)
  }

  return (
    <>
      <div className="h-16 w-full md:h-20" aria-hidden="true" />
      
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b border-navy-100 transition-all [transition-duration:var(--transition-slow)] ${
          scrolled
            ? 'bg-white/95 shadow-[0_10px_30px_-24px_rgba(15,27,45,0.6)] backdrop-blur-md'
            : 'bg-white'
        }`}
      >
        <nav className="relative flex h-16 w-full items-center gap-6 px-5 md:grid md:h-20 md:grid-cols-[minmax(260px,1fr)_auto_minmax(260px,1fr)] md:px-7 lg:px-10 max-w-[1400px] mx-auto">
          
          <a href="/" className="flex min-w-0 items-center group relative z-10 md:justify-self-start" aria-label="Beranda">
            <div className="relative h-9 w-9 flex-shrink-0 md:flex md:h-12 md:w-14 md:items-center md:justify-center md:rounded-lg md:bg-navy-950 md:p-2">
              <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logo" className="w-full h-full object-contain drop-shadow-sm transition-all group-hover:drop-shadow-md md:p-1.5" />
            </div>
            <span className="ml-3 hidden whitespace-nowrap font-heading text-[24px] font-bold tracking-wide text-navy-900 md:block font-serif">
              Logam Mulia
            </span>
          </a>

          <a href="/" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center z-10 md:hidden">
            <div className="leading-tight">
              <span className="block text-[22px] font-heading font-bold text-navy-900 tracking-wide font-serif">Logam Mulia</span>
            </div>
          </a>

          <div className="hidden items-center justify-center gap-10 md:flex md:justify-self-center">
            {[
              { id: 'home', label: 'Beranda', href: '/' },
              { id: 'products', label: 'Katalog Produk', href: '/products' },
              { id: 'boutiques', label: 'Jaringan Butik', href: '/boutiques' },
              { id: 'articles', label: 'Artikel', href: '/articles' }
            ].map((item) => {
              const active = checkIsActive(item.href)
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative py-2 text-[15px] font-bold transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:mx-auto after:h-0.5 after:w-0 after:rounded-full after:bg-gold-500 after:transition-all ${
                    active ? 'text-navy-900 after:w-full' : 'text-navy-700 hover:text-navy-950'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 ml-auto md:ml-0 md:justify-self-end">
            
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-navy-800 transition-all hover:bg-navy-50 hover:text-gold-700">
              <Headphones />
            </a>
            
            <a href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full text-navy-800 transition-all hover:bg-navy-50 hover:text-gold-700 md:ml-0">
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-navy-900 ring-2 ring-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </a>

            <div ref={profileRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-[15px] font-bold transition-all ${
                  isProfileOpen
                    ? 'border-gold-500 bg-white text-gold-700 shadow-[0_8px_22px_-18px_rgba(15,27,45,0.8)]'
                    : 'border-gray-300 bg-white text-navy-900 hover:border-gold-400 hover:text-gold-700 hover:bg-gray-50'
                }`}
              >
                <User />
                <span className="max-w-32 truncate">{isLoggedIn ? userName : 'Masuk'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-[360px] overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-[0_24px_70px_-34px_rgba(15,27,45,0.55)]">
                  <div className="border-b border-navy-100 px-6 py-5 bg-gray-50/50">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400">
                      {isLoggedIn ? 'Menu Akun' : 'Akses Akun'}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-navy-900">
                      {isLoggedIn ? 'Kelola profil, riwayat pesanan, dan transaksi Anda.' : 'Masuk untuk checkout dan menyimpan profil belanja.'}
                    </p>
                  </div>
                  <div className="p-6">
                    {isLoggedIn ? (
                      <>
                        <a href="/customer" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50 transition-colors">
                          <User className="h-4 w-4 text-gold-600" /> Akun Saya
                        </a>
                        <a href="/customer/orders" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50 transition-colors">
                          <ClipboardList /> Pesanan Saya
                        </a>
                        <a href="/api/auth/logout" className="mt-2 flex w-full items-center gap-3 rounded-xl border-t border-navy-100 px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut /> Keluar
                        </a>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <a href="/login" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c99738] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#b38632] shadow-sm">
                          <User /> Masuk
                        </a>
                        <a href="/register" className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gray-50">
                          <UserPlus /> Daftar
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button type="button" onClick={() => setIsMenuOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-900 transition-colors hover:bg-navy-50 md:hidden">
              <Menu />
            </button>
          </div>
        </nav>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[10000] md:hidden">
          <button type="button" className="absolute inset-0 bg-navy-900/45 backdrop-blur-sm cursor-default" onClick={() => setIsMenuOpen(false)} aria-label="Close menu" />
          <aside className="absolute right-0 top-0 flex h-full w-[86vw] max-w-sm flex-col bg-white shadow-2xl transition-transform transform slide-in-from-right animate-in">
            
            <div className="flex h-16 items-center justify-between border-b border-navy-100 px-5">
              <div className="flex items-center gap-3">
                <div className="relative h-7 w-7">
                  <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logo Logam Mulia" className="w-full h-full object-contain" />
                </div>
                <span className="font-heading text-lg font-bold text-navy-900 font-serif">Logam Mulia</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-lg text-navy-700 hover:bg-navy-50 transition-colors">
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-1">
                {[
                  { label: 'Beranda', href: '/', icon: HomeIcon },
                  { label: 'Katalog Produk', href: '/products', icon: PackageIcon },
                  { label: 'Jaringan Butik', href: '/boutiques', icon: MapPin },
                  { label: 'Edukasi Emas', href: '/articles', icon: FileText }
                ].map((item) => {
                  const active = checkIsActive(item.href)
                  return (
                    <a key={item.href} href={item.href} className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors ${active ? 'bg-gold-50 text-gold-700' : 'text-navy-800 hover:bg-navy-50'}`}>
                      <span className="flex items-center gap-3"><item.icon /> {item.label}</span>
                    </a>
                  )
                })}
              </div>

              <div className="mt-5 border-t border-navy-100 pt-4">
                {isLoggedIn ? (
                  <div className="space-y-1">
                    <a href="/customer" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-navy-800 hover:bg-navy-50 transition-colors"><User /> Akun Saya</a>
                    <a href="/customer/orders" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-navy-800 hover:bg-navy-50 transition-colors"><ClipboardList /> Pesanan Saya</a>
                    <a href="/api/auth/logout" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 mt-2"><LogOut /> Keluar</a>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <a href="/login" className="flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold border border-navy-200 text-navy-800 hover:bg-navy-50 transition-colors">
                      <User /> Masuk Akun
                    </a>
                    <a href="/register" className="flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold bg-[#c99738] text-white hover:bg-[#b38632] transition-colors shadow-sm">
                      <UserPlus /> Daftar Akun Baru
                    </a>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
