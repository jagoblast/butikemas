import { useState } from 'hono/jsx'

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Ikon SVG murni
  const Headset = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
  const Cart = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
  const User = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  const ChevronDown = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
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
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-bold text-navy-900">Beranda</a>
            <a href="/products" className="text-sm font-bold text-navy-900 border-b-2 border-gold-500 pb-1">Produk</a>
            <a href="/boutiques" className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors">Butik</a>
            <a href="/articles" className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors">Artikel</a>
          </div>

          {/* Kanan: Ikon & Auth */}
          <div className="flex items-center gap-5">
            <a href="/contact" className="text-gray-600 hover:text-navy-900 hidden sm:block">
              <Headset />
            </a>
            <a href="/cart" className="text-gray-600 hover:text-navy-900 relative">
              <Cart />
            </a>
            
            <div className="hidden sm:flex items-center">
              <a href="/login" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-all text-sm font-bold text-navy-900">
                <User /> Masuk <ChevronDown />
              </a>
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-navy-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
