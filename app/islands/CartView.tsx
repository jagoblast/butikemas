import { useEffect, useState } from 'hono/jsx'

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

const ArrowLeft = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
const HeadphonesIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
const Check = ({ className }: { className: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ShoppingCart = ({ className }: { className: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
const Trash2 = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const Minus = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
const Plus = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const Tag = ({ className }: { className: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>

// Terima prop isLoggedIn
export default function CartView({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const waLink = 'https://wa.me/6281234567890?text=Halo%20admin,%20saya%20butuh%20bantuan%20terkait%20keranjang%20belanja.'
  const [items, setItems] = useState<any[]>([])

  const readCartItems = () => JSON.parse(localStorage.getItem('butikemas_cart') || '[]')
  const saveCartItems = (nextItems: any[]) => localStorage.setItem('butikemas_cart', JSON.stringify(nextItems))
  const saveCheckoutItems = (nextItems: any[]) => localStorage.setItem('butikemas_checkout_items', JSON.stringify(nextItems))

  useEffect(() => {
    const storedItems = readCartItems()
    setItems(storedItems)
  }, [])

  function persistItems(nextItems: any[]) {
    setItems(nextItems)
    saveCartItems(nextItems)
  }

  const allChecked = items.length > 0 && items.every((item) => item.checked)
  const selectedItems = items.filter((item) => item.checked)
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  
  const subtotalPrice = selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  
  const hasAppliedVoucher = false
  const discount = 0 
  const totalPrice = Math.max(0, subtotalPrice - discount)

  function toggleAll() {
    const newState = !allChecked
    persistItems(items.map((item) => ({ ...item, checked: newState })))
  }

  function toggleItem(id: string) {
    persistItems(items.map((item) => (item.product.id === id ? { ...item, checked: !item.checked } : item)))
  }

  function updateQty(id: string, delta: number) {
    persistItems(
      items.map((item) =>
        item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    )
  }

  function removeItem(id: string) {
    const nextItems = items.filter((item) => item.product.id !== id)
    persistItems(nextItems)
    saveCheckoutItems(nextItems.filter((item) => item.checked))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  // Handle Checkout Click
  const handleCheckoutBtn = (e: any) => {
    e.preventDefault()
    
    // Keamanan Frontend sebelum diproses
    if (!isLoggedIn) {
      window.location.href = '/login?redirect=/customer/checkout'
      return
    }

    saveCheckoutItems(selectedItems)
    window.location.href = '/customer/checkout'
  }

  return (
    <div className="bg-surface min-h-screen pb-44">
      <header className="flex justify-between items-center px-5 py-4 w-full sticky top-0 z-40 bg-navy-900 border-b border-navy-800 shadow-md">
        <div className="flex items-center gap-4">
          <a href="/products" className="text-gold-400 hover:text-gold-300 transition-colors">
            <ArrowLeft />
          </a>
          <h1 className="font-heading text-gold-400 font-bold text-lg tracking-tight">Keranjang</h1>
        </div>
        <a href={waLink} target="_blank" rel="noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors" aria-label="Hubungi CS">
          <HeadphonesIcon />
        </a>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className={`bg-white p-4 rounded-xl border flex gap-4 items-start shadow-sm transition-colors ${item.checked ? 'border-gold-400 bg-gold-50/10' : 'border-navy-200'}`}>
              <div className="pt-1">
                <label className="cursor-pointer group block relative">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-gold-500 border-gold-500' : 'bg-white border-navy-300 group-hover:border-gold-400'}`}>
                    {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={item.checked} onChange={() => toggleItem(item.product.id)} />
                </label>
              </div>
              <div className="flex-grow flex flex-col sm:flex-row gap-4">
                <div className="w-24 h-24 bg-surface rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-navy-200 relative p-2">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name} className="object-contain w-full h-full" />
                  ) : (
                    <ShoppingCart className="w-8 h-8 text-gold-400/60" />
                  )}
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-1 gap-3">
                    <a href={`/products/${item.product.slug}`} className="font-heading text-base font-bold text-navy-900 leading-tight hover:text-gold-600">
                      {item.product.name}
                    </a>
                    <button onClick={() => removeItem(item.product.id)} className="text-navy-300 hover:text-red-500 transition-colors">
                      <Trash2 />
                    </button>
                  </div>
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-navy-900 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
                      {item.product.kadar || '99.99%'} • {item.product.weight_gram}G
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-heading text-lg font-bold text-gold-600">{formatRupiah(item.product.price * item.quantity)}</span>
                    <div className="flex items-center border border-navy-200 rounded-lg bg-surface">
                      <button onClick={() => updateQty(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center text-navy-600 hover:text-gold-600 transition-colors">
                        <Minus />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-navy-900">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center text-navy-600 hover:text-gold-600 transition-colors">
                        <Plus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-navy-200">
              <ShoppingCart className="w-12 h-12 text-navy-200 mx-auto mb-3" />
              <p className="text-navy-500 font-medium">Keranjang kamu kosong</p>
              <a href="/products" className="mt-4 inline-flex rounded-xl bg-gold-400 px-5 py-3 text-sm font-bold text-navy-900">
                Belanja Produk
              </a>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-16 md:bottom-0 left-0 w-full z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className={`w-full px-5 py-2.5 border-t flex justify-between items-center transition-colors ${
          hasAppliedVoucher ? 'border-green-200 bg-[#E8F5E9]' : 'border-navy-100 bg-white'
        }`}>
          <div className="flex items-center gap-2">
            <Tag className={`w-4 h-4 ${hasAppliedVoucher ? 'text-[#2E7D32]' : 'text-navy-500'}`} />
            <span className={`text-xs font-semibold ${hasAppliedVoucher ? 'text-[#2E7D32]' : 'text-navy-700'}`}>
              {hasAppliedVoucher ? 'Voucher sudah diterapkan!' : 'Voucher diterapkan otomatis jika tersedia'}
            </span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${allChecked ? 'bg-gold-500 border-gold-500' : 'bg-white border-navy-300 group-hover:border-gold-400'}`}>
                {allChecked && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={allChecked} onChange={toggleAll} />
              <span className="font-semibold text-sm text-navy-800">Semua</span>
            </label>
            <div className="w-px h-8 bg-navy-200"></div>
            <div className="flex flex-col">
              <span className="text-[11px] text-navy-500 font-bold uppercase tracking-wider mb-0.5">Total</span>
              <span className="font-heading text-xl font-bold text-gold-600 leading-none">{formatRupiah(totalPrice)}</span>
            </div>
          </div>
          
          {/* MENGGUNAKAN BUTTON DAN FUNGSI HANDLE BARU */}
          <button
            onClick={handleCheckoutBtn}
            className={`font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg text-sm whitespace-nowrap ${
              totalPrice > 0 ? 'bg-gold-400 text-navy-900 hover:brightness-105 active:scale-95 shadow-gold-400/20' : 'bg-navy-100 text-navy-400 pointer-events-none'
            }`}
          >
            Checkout ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  )
}
