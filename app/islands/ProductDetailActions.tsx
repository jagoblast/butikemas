import { useState } from 'hono/jsx'

export default function ProductDetailActions({ product, isLoggedIn }: { product: any, isLoggedIn: boolean }) {
  const [quantity, setQuantity] = useState(1)

  const handleBuyNow = () => {
    // Validasi login akurat
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=/customer/checkout`
      return
    }

    const checkoutItem = {
      product: product,
      quantity: quantity
    }

    localStorage.setItem('butikemas_checkout_items', JSON.stringify([checkoutItem]))
    // Tembak URL Checkout yang baru
    window.location.href = '/customer/checkout'
  }

  const handleAddToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem('butikemas_cart') || '[]')
    const existingIdx = currentCart.findIndex((item: any) => item.product.id === product.id)
    
    if (existingIdx > -1) {
      currentCart[existingIdx].quantity += quantity
    } else {
      currentCart.push({ product, quantity })
    }
    
    localStorage.setItem('butikemas_cart', JSON.stringify(currentCart))
    window.dispatchEvent(new Event('cartUpdated'))
    alert('Produk ditambahkan ke keranjang!')
  }

  return (
    <div className="flex gap-4 mt-6">
      <button 
        onClick={handleAddToCart}
        className="flex-1 border-2 border-gold-500 text-gold-600 font-bold py-3 rounded-xl hover:bg-gold-50 transition-colors"
      >
        Tambah Keranjang
      </button>
      <button 
        onClick={handleBuyNow}
        className="flex-1 bg-gold-500 text-navy-900 font-bold py-3 rounded-xl hover:bg-gold-600 transition-colors"
      >
        Beli Langsung
      </button>
    </div>
  )
}
