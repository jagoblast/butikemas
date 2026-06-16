import { useState } from 'hono/jsx'

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo & Desktop Menu */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3">
              <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logam Mulia" className="h-10 w-auto" />
              <span className="font-bold text-xl text-navy-900 hidden sm:block tracking-tight">Logam Mulia</span>
            </a>
            
            <div className="hidden md:flex space-x-1">
              <a href="/" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-all">Beranda</a>
              <a href="/products" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-all">Katalog Emas</a>
              <a href="/boutiques" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-all">Lokasi Butik</a>
              <a href="/articles" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-all">Edukasi</a>
            </div>
          </div>

          {/* Kanan: Cart & Login */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="/cart" className="p-2.5 text-gray-600 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-all relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {/* Badge Dinamis (Bisa ditambahkan logic keranjang nanti) */}
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </a>
            
            <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
              <a href="/login" className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors">Masuk</a>
              <a href="/register" className="px-5 py-2.5 bg-gold-400 text-navy-900 text-sm font-bold rounded-xl hover:bg-gold-500 transition-all shadow-sm">Daftar</a>
            </div>

            {/* Hamburger Button (Mobile) */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl ml-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a href="/" className="block px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gold-50 hover:text-gold-600 rounded-xl">Beranda</a>
            <a href="/products" className="block px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gold-50 hover:text-gold-600 rounded-xl">Katalog Emas</a>
            <a href="/boutiques" className="block px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gold-50 hover:text-gold-600 rounded-xl">Lokasi Butik</a>
            <a href="/articles" className="block px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gold-50 hover:text-gold-600 rounded-xl">Edukasi</a>
            
            <div className="pt-4 mt-2 border-t border-gray-100 grid grid-cols-2 gap-3">
              <a href="/login" className="px-4 py-3 text-center text-sm font-bold text-navy-900 bg-gray-50 rounded-xl border border-gray-200">Masuk</a>
              <a href="/register" className="px-4 py-3 text-center text-sm font-bold text-navy-900 bg-gold-400 rounded-xl shadow-sm">Daftar</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
