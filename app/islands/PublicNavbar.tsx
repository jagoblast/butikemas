import { useState, useEffect, useRef } from 'hono/jsx'

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const authRef = useRef<HTMLDivElement | null>(null)

  // Menutup dropdown auth jika user mengklik area di luar dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Ikon SVG Murni
  const Headset = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
  const Cart = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
  const User = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  const UserPlus = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
  const ChevronDown = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
  const ChevronUp = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>

  return (
    // Class sticky top-0 dan z-50 memastikan navbar menempel di atas dan menutupi konten bawahnya
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Kiri: Logo */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logam Mulia" className="h-8 w-auto" />
              <span className="font-bold text-xl text-navy-900 tracking-tight font-serif">Logam Mulia</span>
            </a>
          </div>

          {/* Tengah: Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors">Beranda</a>
            <a href="/products" className="text-sm font-bold text-navy-900 border-b-2 border-gold-500 pb-1">Produk</a>
            <a href="/boutiques" className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors">Butik</a>
            <a href="/articles" className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors">Artikel</a>
          </div>

          {/* Kanan: Ikon & Auth Dropdown */}
          <div className="flex items-center gap-5">
            {/* Tautan WhatsApp */}
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-navy-900 hidden sm:block" title="Hubungi WhatsApp">
              <Headset />
            </a>
            
            <a href="/cart" className="text-gray-600 hover:text-navy-900 relative">
              <Cart />
            </a>
            
            {/* Dropdown Masuk/Daftar (Desktop) */}
            <div className="hidden sm:block relative" ref={authRef}>
              <button 
                onClick={() => setIsAuthOpen(!isAuthOpen)} 
                className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all text-sm font-bold ${
                  isAuthOpen ? 'border-gold-500 text-gold-600 bg-gold-50/20' : 'border-gray-300 text-navy-900 hover:bg-gray-50'
                }`}
              >
                <User /> Masuk {isAuthOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {/* Panel Dropdown (Sesuai Gambar) */}
              {isAuthOpen && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[280px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Akses Akun</p>
                  <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                    Masuk untuk checkout dan menyimpan profil belanja.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a href="/login" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4A84B] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c2963a]">
                      <User /> Masuk
                    </a>
                    <a href="/register" className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gray-50">
                      <UserPlus /> Daftar
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Hamburger (Mobile) */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-navy-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a href="/" className="block px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gold-50 hover:text-gold-600 rounded-xl">Beranda</a>
            <a href="/products" className="block px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gold-50 hover:text-gold-600 rounded-xl">Produk</a>
            <a href="/boutiques" className="block px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gold-50 hover:text-gold-600 rounded-xl">Butik</a>
            <a href="/articles" className="block px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gold-50 hover:text-gold-600 rounded-xl">Artikel</a>
            
            <div className="pt-4 mt-2 border-t border-gray-100 grid grid-cols-2 gap-3">
              <a href="/login" className="px-4 py-3 text-center text-sm font-bold text-navy-900 bg-gray-50 rounded-xl border border-gray-200">Masuk</a>
              <a href="/register" className="px-4 py-3 text-center text-sm font-bold text-white bg-[#D4A84B] rounded-xl shadow-sm">Daftar</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
