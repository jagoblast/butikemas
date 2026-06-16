import { useState, useEffect } from 'hono/jsx'

export default function ProductDetailActions({ product }: { product: any }) {
  const [checkoutHref, setCheckoutHref] = useState('/login?redirect=/checkout')
  const [showToast, setShowToast] = useState(false)

  // Pengganti Lucide Lock Icon
  const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>

  useEffect(() => {
    // Cek apakah ada cookie customer_session (Artinya user sudah login)
    const isLoggedIn = document.cookie.includes('customer_session=')
    const buyNowPath = '/checkout?mode=buy-now'
    
    setCheckoutHref(
      isLoggedIn
        ? buyNowPath
        : `/login?redirect=${encodeURIComponent(buyNowPath)}`
    )
  }, [])

  // Logika Tambah ke Keranjang menggunakan localStorage (Cart Storage)
  function handleAddToCart() {
    const existingCart = JSON.parse(localStorage.getItem('butikemas_cart') || '[]')
    
    const existingItemIndex = existingCart.findIndex((item: any) => item.product.id === product.id)
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push({ product, quantity: 1, checked: true })
    }
    
    localStorage.setItem('butikemas_cart', JSON.stringify(existingCart))
    
    // Tampilkan notifikasi toast
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    
    // Trigger event agar Navbar bisa memperbarui angka keranjang
    window.dispatchEvent(new Event('cartUpdated'))
  }

  // Logika Beli Sekarang (Simpan langsung ke item checkout sementara)
  function handleBuyNow() {
    const buyNowItem = [{ product, quantity: 1, checked: true }]
    localStorage.setItem('butikemas_checkout_items', JSON.stringify(buyNowItem))
  }

  return (
    <>
      {/* Notifikasi Pop-up (Toast) saat berhasil ditambah ke keranjang */}
      {showToast && (
        <div className="fixed top-24 right-4 z-50 bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <div className="font-semibold text-sm">Produk ditambahkan ke keranjang!</div>
        </div>
      )}

      {/* Bagian Actions Identik dengan Next.js Asli */}
      <div className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-stretch gap-3 border-t border-navy-200 bg-white px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] sm:static sm:h-auto sm:border-none sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:mt-6">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex flex-1 items-center justify-center rounded-xl border border-navy-200 bg-white px-3 text-sm font-bold text-navy-900 transition-colors [transition-duration:var(--transition-fast)] hover:bg-navy-50 disabled:text-navy-300 sm:py-3.5"
          aria-label="Tambah ke keranjang"
        >
          Tambah ke Keranjang
        </button>
        
        <a 
          href={checkoutHref} 
          onClick={handleBuyNow} 
          className={`flex flex-1 flex-col items-center justify-center rounded-xl bg-gold-400 text-navy-900 hover:bg-gold-500 transition-colors sm:py-3.5 ${product.stock === 0 ? 'pointer-events-none opacity-50' : ''}`}
        >
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
            <LockIcon />
            <span className="text-xs font-bold uppercase tracking-wider sm:text-sm">Beli Sekarang</span>
          </div>
        </a>
      </div>
    </>
  )
}
