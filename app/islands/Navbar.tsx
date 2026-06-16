import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Headphones, LogOut, Menu, ShoppingCart, User, UserPlus, X } from 'lucide-react'

// Utility class merger
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState('/')
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentPath(window.location.pathname)
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Katalog', href: '/products' },
    { label: 'Artikel', href: '/articles' },
  ]

  return (
    <>
      <div className="h-16 w-full md:h-20" aria-hidden="true" />
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 border-b border-navy-100 transition-all duration-300',
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_10px_30px_-24px_rgba(15,27,45,0.6)]' : 'bg-white'
        )}
      >
        <nav className="relative flex h-16 w-full items-center gap-6 px-5 md:grid md:h-20 md:grid-cols-[minmax(260px,1fr)_auto_minmax(260px,1fr)] md:px-7 lg:px-10">
          
          {/* Logo dengan URL Eksternal */}
          <a href="/" className="flex min-w-0 items-center group relative z-10 md:justify-self-start">
            <div className="relative h-9 w-9 flex-shrink-0 md:flex md:h-12 md:w-14 md:items-center md:justify-center md:rounded-lg md:bg-navy-950 md:p-2">
              <img 
                src="https://emas.pasdigi.id/images/logo-lm.png" 
                alt="Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="ml-3 hidden whitespace-nowrap font-heading text-[24px] font-bold tracking-wide text-navy-900 md:block">
              Butik Emas
            </span>
          </a>

          {/* Links Tengah */}
          <div className="hidden items-center justify-center gap-10 md:flex md:justify-self-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  'relative py-2 text-[17px] font-bold transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:mx-auto after:h-0.5 after:w-0 after:rounded-full after:bg-gold-500 after:transition-all',
                  currentPath === item.href ? 'text-navy-900 after:w-full' : 'text-navy-700 hover:text-navy-950'
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Aksi Kanan */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto md:ml-0 md:justify-self-end">
            <a href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full text-navy-800 hover:bg-navy-50 hover:text-gold-700">
              <ShoppingCart className="w-5 h-5" />
            </a>

            <div ref={profileRef} className="relative hidden md:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn(
                  'inline-flex h-12 items-center gap-2 rounded-full border px-5 text-[16px] font-bold transition-all',
                  isProfileOpen ? 'border-gold-500 bg-white text-gold-700' : 'border-gold-300 bg-white text-gold-700 hover:border-gold-500'
                )}
              >
                <User className="h-[18px] w-[18px]" />
                <span>Akun</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-[360px] rounded-2xl border border-navy-100 bg-white p-6 shadow-xl">
                  <a href="/login" className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-3 py-4 text-base font-bold text-white hover:bg-gold-600">
                    <User className="h-4 w-4" /> Masuk
                  </a>
                  <a href="/register" className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-navy-200 px-3 py-4 text-base font-bold text-navy-800 hover:bg-navy-50">
                    <UserPlus className="h-4 w-4 text-gold-600" /> Daftar
                  </a>
                </div>
              )}
            </div>

            <button onClick={() => setIsMenuOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-900 hover:bg-navy-50 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-navy-900/45 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-[86vw] max-w-sm flex-col bg-white">
            <div className="flex h-16 items-center justify-between border-b px-5">
              <span className="font-heading text-xl font-bold text-navy-900">Butik Emas</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 space-y-2">
               {navItems.map(item => (
                 <a key={item.label} href={item.href} className="block px-4 py-3 font-bold text-navy-800 bg-navy-50 rounded-xl">{item.label}</a>
               ))}
               <a href="/login" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3 text-sm font-bold text-white">
                  Masuk Akun
               </a>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
