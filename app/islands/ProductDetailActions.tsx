import { useState, useEffect } from 'hono/jsx'

export default function ProductDetailActions({ product }: { product: any }) {
  // Hapus state isLoggedIn dan useEffect pengecekan document.cookie

  // Ikon Gembok (Lock)
  const Lock = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>

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
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto flex gap-4">
        <button 
          onClick={handleAddToCart}
          className="flex-1 py-3.5 px-4 bg-white border border-navy-900 text-navy-900 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Tambah ke Keranjang
        </button>
        {/* UBAH href menjadi statis /checkout?mode=buy-now */}
        <a 
          href="/checkout?mode=buy-now"
          onClick={handleBuyNow}
          className="flex-1 py-3.5 px-4 bg-[#D4A84B] text-navy-900 text-sm font-bold rounded-lg hover:bg-[#c2963a] transition-colors flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <Lock /> BELI SEKARANG
        </a>
      </div>
    </div>
  )
}
