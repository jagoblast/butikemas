import { useEffect, useState } from 'hono/jsx'

// 1. TAMBAHKAN PROPS isLoggedIn DARI SERVER
export default function BottomBar({ currentPath, isLoggedIn: serverIsLoggedIn = false }: { currentPath: string, isLoggedIn?: boolean }) {
  // 2. Gunakan status dari server sebagai nilai awal
  const [isLoggedIn, setIsLoggedIn] = useState(serverIsLoggedIn)
  const [cartCount, setCartCount] = useState(0)

  const Home = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  const Package = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  const ShoppingCart = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  const User = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="14" cy="7" r="4"/></svg>

  useEffect(() => {
    // 3. HAPUS pengecekan document.cookie yang salah. Cukup andalkan sinkronisasi prop server.
    setIsLoggedIn(serverIsLoggedIn)

    const syncCart = () => {
      const items = JSON.parse(localStorage.getItem('butikemas_cart') || '[]')
      setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0))
    }
    syncCart()
    window.addEventListener('cartUpdated', syncCart)

    return () => {
      window.removeEventListener('cartUpdated', syncCart)
    }
  }, [serverIsLoggedIn])

  // Menyembunyikan bottom bar di rute tertentu (Checkout, Detail Pesanan, dsb)
  const isHidden = 
    currentPath.match(/^\/products\/[^/]+$/) || 
    currentPath.match(/^\/orders\/[^/]+$/) ||
    currentPath.startsWith('/account/profile') ||
    currentPath === '/checkout' ||
    currentPath.startsWith('/payment');

  if (isHidden) return null;

  const bottomNavLinks = [
    { id: 'home', label: 'Beranda', href: '/', icon: Home },
    { id: 'products', label: 'Produk', href: '/products', icon: Package },
    { id: 'cart', label: 'Keranjang', href: '/cart', icon: ShoppingCart },
    { id: 'account', label: 'Akun', href: '/customer', icon: User }
  ]

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/'
    return currentPath.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] bg-navy-900 border-t border-navy-800 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.3)] md:hidden">
      <div className="container-main flex items-center justify-between h-16 pb-1">
        {bottomNavLinks.map((link) => {
          const active = isActive(link.href)
          const Icon = link.icon
          // Redirect logic aman berdasarkan server
          const href = link.id === 'account' && !isLoggedIn ? '/login' : link.href
          const label = link.id === 'account' && !isLoggedIn ? 'Masuk' : link.label

          return (
            <a
              key={link.href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center h-full gap-1 group cursor-pointer"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className={`relative p-1 rounded-xl transition-all [transition-duration:var(--transition-fast)] pointer-events-none ${
                  active 
                    ? 'text-gold-400 bg-gold-400/10' 
                    : 'text-navy-400 group-hover:text-gold-300 group-hover:bg-navy-800'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? 'fill-gold-400/20' : ''}`} />
                {link.id === 'cart' && cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-navy-900 ring-2 ring-navy-900">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                ) : null}
              </div>
              <span 
                className={`text-[10px] font-medium transition-colors pointer-events-none ${
                  active ? 'text-gold-400' : 'text-navy-400 group-hover:text-gold-300'
                }`}
              >
                {label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
