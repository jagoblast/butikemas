import { useState } from 'hono/jsx'

// Ikon untuk Toast
const CheckCircle = () => <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

export default function ProductDetailActions({ product, isLoggedIn }: { product: any, isLoggedIn: boolean }) {
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false) // State untuk memunculkan notifikasi

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=/customer/checkout`
      return
    }

    // Ambil URL gambar langsung dari layar
    const imgElement = document.querySelector(`img[alt="${product.name}"]`) as HTMLImageElement;
    const currentImageUrl = imgElement ? imgElement.src : null;

    const checkoutItem = {
      product: { ...product, image_url: currentImageUrl },
      quantity: quantity
    }

    localStorage.setItem('butikemas_checkout_items', JSON.stringify([checkoutItem]))
    window.location.href = '/customer/checkout'
  }

  const handleAddToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem('butikemas_cart') || '[]')
    const existingIdx = currentCart.findIndex((item: any) => item.product.id === product.id)
    
    // Ambil URL gambar langsung dari layar
    const imgElement = document.querySelector(`img[alt="${product.name}"]`) as HTMLImageElement;
    const currentImageUrl = imgElement ? imgElement.src : null;
    
    const productWithImage = { ...product, image_url: currentImageUrl };

    if (existingIdx > -1) {
      currentCart[existingIdx].quantity += quantity
      currentCart[existingIdx].product.image_url = currentImageUrl;
    } else {
      currentCart.push({ product: productWithImage, quantity })
    }
    
    localStorage.setItem('butikemas_cart', JSON.stringify(currentCart))
    window.dispatchEvent(new Event('cartUpdated'))
    
    // PANGGIL TOAST CANTIK ALIH-ALIH ALERT()
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000) // Toast akan menghilang otomatis dalam 3 detik
  }

  return (
    <>
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

      {/* TOAST UI NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-navy-900 text-white px-5 py-3 rounded-full shadow-2xl border border-navy-700 flex items-center gap-3">
            <CheckCircle />
            <span className="font-medium text-sm whitespace-nowrap">Berhasil ditambahkan ke keranjang</span>
          </div>
        </div>
      )}
    </>
  )
}
