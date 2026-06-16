import { useState, useEffect } from 'hono/jsx'

export default function ProductDetailActions({ product }: { product: any }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Cek apakah user sudah login melalui cookie
    setIsLoggedIn(document.cookie.includes('customer_session='))
  }, [])

  function handleAddToCart() {
    const cart = JSON.parse(localStorage.getItem('butikemas_cart') || '[]')
    const index = cart.findIndex((item: any) => item.product.id === product.id)
    
    if (index > -1) cart[index].quantity += 1
    else cart.push({ product, quantity: 1, checked: true })
    
    localStorage.setItem('butikemas_cart', JSON.stringify(cart))
    alert("Produk berhasil ditambahkan ke keranjang!")
  }

  function handleBuyNow() {
    localStorage.setItem('butikemas_checkout_items', JSON.stringify([{ product, quantity: 1, checked: true }]))
  }

  return (
    <div className="flex gap-3">
      <button 
        onClick={handleAddToCart}
        className="flex-1 py-3 px-4 border border-navy-900 text-navy-900 font-bold rounded-xl hover:bg-gray-50 transition-all"
      >
        Tambah Keranjang
      </button>
      <a 
        href={isLoggedIn ? '/checkout?mode=buy-now' : '/login?redirect=/checkout?mode=buy-now'}
        onClick={handleBuyNow}
        className="flex-1 py-3 px-4 bg-gold-400 text-navy-900 font-bold rounded-xl text-center hover:bg-gold-500 transition-all shadow-md"
      >
        Beli Sekarang
      </a>
    </div>
  )
}
