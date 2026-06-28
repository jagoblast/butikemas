import { useEffect, useState } from 'hono/jsx'

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

const ArrowLeft = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
const MapPin = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const Truck = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
const CreditCard = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const ShieldCheck = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.89 0 5.26 1 7 2a1 1 0 0 1 1 1v7z"/><path d="m9 12 2 2 4-4"/></svg>

// Daftar Metode Pembayaran Sesuai Omnipaygate
const OMNIPAY_METHODS = [
  { id: 'qris', name: 'QRIS (Gopay, OVO, Dana, dll)', fee: 0, type: 'QR' },
  { id: 'bni', name: 'BNI Virtual Account', fee: 4000, type: 'VA' },
  { id: 'bri', name: 'BRI Virtual Account', fee: 4000, type: 'VA' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', fee: 4000, type: 'VA' },
  { id: 'cimb', name: 'CIMB Niaga Virtual Account', fee: 4000, type: 'VA' },
  { id: 'permata', name: 'Permata Virtual Account', fee: 4000, type: 'VA' },
  { id: 'bsi', name: 'BSI Virtual Account', fee: 4000, type: 'VA' },
  { id: 'seabank', name: 'SeaBank Virtual Account', fee: 4000, type: 'VA' }
]

export default function CheckoutView({ customer }: { customer: any }) {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [shippingMethod, setShippingMethod] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  
  // Hitung biaya berdasarkan pilihan
  const shippingCost = shippingMethod === 'JNE' ? 25000 : shippingMethod === 'PAXEL' ? 35000 : shippingMethod === 'PICKUP' ? 0 : 0
  const selectedPayment = OMNIPAY_METHODS.find(m => m.id === paymentMethod)
  const paymentFee = selectedPayment ? selectedPayment.fee : 0

  useEffect(() => {
    const checkoutItems = JSON.parse(localStorage.getItem('butikemas_checkout_items') || '[]')
    if (checkoutItems.length === 0) {
      window.location.href = '/cart'
    } else {
      setItems(checkoutItems)
    }
  }, [])

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const grandTotal = subtotal + shippingCost + paymentFee

  const handleProcessPayment = async () => {
    if (!shippingMethod) return alert("Pilih metode pengiriman terlebih dahulu!")
    if (!paymentMethod) return alert("Pilih metode pembayaran terlebih dahulu!")
    
    setIsLoading(true)

    try {
      const payload = {
        customer_name: customer?.name || 'Pelanggan',
        customer_email: customer?.email || '',
        customer_phone: customer?.phone || '',
        shipping_address: customer?.address || '',
        total_amount: grandTotal,
        payment_method: paymentMethod, // Format string akan langsung cocok dengan Omnipaygate (bni, qris, dll)
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        }))
      }

      const response = await fetch('/api/public/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.removeItem('butikemas_checkout_items')
        
        // Membersihkan item yang dicheckout dari keranjang utama juga
        const cartItems = JSON.parse(localStorage.getItem('butikemas_cart') || '[]')
        const remainingCart = cartItems.filter((cartItem: any) => 
          !items.some(checkoutItem => checkoutItem.product.id === cartItem.product.id)
        )
        localStorage.setItem('butikemas_cart', JSON.stringify(remainingCart))
        window.dispatchEvent(new Event('cartUpdated'))

        // Redirect ke halaman detail pesanan untuk melihat instruksi bayar / QRIS
        window.location.href = `/customer/orders/${data.order_id}`
      } else {
        alert(data.message || 'Gagal memproses pesanan ke Payment Gateway.')
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan atau server saat checkout.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-surface min-h-screen pb-44">
      <header className="flex justify-between items-center px-5 py-4 w-full sticky top-0 z-40 bg-navy-900 border-b border-navy-800 shadow-md">
        <div className="flex items-center gap-4">
          <a href="/cart" className="text-gold-400 hover:text-gold-300 transition-colors">
            <ArrowLeft />
          </a>
          <h1 className="font-heading text-gold-400 font-bold text-lg tracking-tight">Checkout</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        
        <section className="bg-white rounded-2xl p-5 border border-navy-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-navy-900">
            <MapPin />
            <h2 className="font-bold text-lg">Alamat Pengiriman</h2>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-navy-900 mb-1">{customer?.name || 'Pelanggan'}</p>
            <p className="text-sm text-gray-600 mb-2">{customer?.phone || 'Nomor HP belum diatur'}</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {customer?.address || 'Anda belum mengatur alamat pengiriman. Silakan perbarui di menu Profil Saya.'}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 border border-navy-100 shadow-sm">
          <h2 className="font-bold text-lg text-navy-900 mb-4">Pesanan Anda</h2>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-16 h-16 bg-surface rounded-lg border border-navy-100 p-1 flex items-center justify-center shrink-0">
                  <img src={item.product.image_url || 'https://emas.pasdigi.id/images/lm.png'} alt={item.product.name} className="object-contain w-full h-full" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-navy-900 text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.product.weight_gram} Gram • {item.quantity} Barang</p>
                  <p className="font-bold text-gold-600 text-sm mt-1">{formatRupiah(item.product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 border border-navy-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-navy-900">
            <Truck />
            <h2 className="font-bold text-lg">Metode Pengiriman</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`cursor-pointer rounded-xl border p-4 flex flex-col transition-colors ${shippingMethod === 'JNE' ? 'border-gold-500 bg-gold-50/20' : 'border-gray-200 hover:border-gold-300'}`}>
              <div className="flex items-center justify-between mb-2">
                <input type="radio" name="shipping" value="JNE" checked={shippingMethod === 'JNE'} onChange={() => setShippingMethod('JNE')} className="w-4 h-4 text-gold-500 focus:ring-gold-500" />
                <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-md">JNE</span>
              </div>
              <span className="font-bold text-navy-900 text-sm">JNE Asuransi</span>
              <span className="text-xs text-gray-500">Estimasi 2-3 Hari • Rp 25.000</span>
            </label>
            
            <label className={`cursor-pointer rounded-xl border p-4 flex flex-col transition-colors ${shippingMethod === 'PAXEL' ? 'border-gold-500 bg-gold-50/20' : 'border-gray-200 hover:border-gold-300'}`}>
              <div className="flex items-center justify-between mb-2">
                <input type="radio" name="shipping" value="PAXEL" checked={shippingMethod === 'PAXEL'} onChange={() => setShippingMethod('PAXEL')} className="w-4 h-4 text-gold-500 focus:ring-gold-500" />
                <span className="text-xs font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-md">PAXEL</span>
              </div>
              <span className="font-bold text-navy-900 text-sm">Paxel Sameday</span>
              <span className="text-xs text-gray-500">Tiba Hari Ini • Rp 35.000</span>
            </label>

            <label className={`sm:col-span-2 cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-colors ${shippingMethod === 'PICKUP' ? 'border-gold-500 bg-gold-50/20' : 'border-gray-200 hover:border-gold-300'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="shipping" value="PICKUP" checked={shippingMethod === 'PICKUP'} onChange={() => setShippingMethod('PICKUP')} className="w-4 h-4 text-gold-500 focus:ring-gold-500" />
                <div>
                  <span className="font-bold text-navy-900 text-sm block">Ambil di Butik (Pickup)</span>
                  <span className="text-xs text-gray-500">Gratis • Silakan kunjungi cabang terdekat</span>
                </div>
              </div>
              <span className="font-bold text-green-600 text-sm">Rp 0</span>
            </label>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 border border-navy-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-navy-900">
            <CreditCard />
            <h2 className="font-bold text-lg">Metode Pembayaran (Omnipaygate)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OMNIPAY_METHODS.map((method) => (
              <label 
                key={method.id} 
                className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-colors ${paymentMethod === method.id ? 'border-gold-500 bg-gold-50/20 shadow-sm' : 'border-gray-200 hover:border-gold-300'}`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    value={method.id} 
                    checked={paymentMethod === method.id} 
                    onChange={() => setPaymentMethod(method.id)} 
                    className="w-4 h-4 text-gold-500 focus:ring-gold-500 shrink-0" 
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-navy-900 text-sm">{method.name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{method.type}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md shrink-0">
                  {method.fee === 0 ? 'Gratis' : `+ Rp ${method.fee.toLocaleString('id-ID')}`}
                </span>
              </label>
            ))}
          </div>
        </section>

      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-navy-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-3xl mx-auto">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Subtotal Produk</span>
              <span className="text-sm font-semibold text-navy-900">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Ongkos Kirim</span>
              <span className="text-sm font-semibold text-navy-900">{shippingCost === 0 ? '-' : formatRupiah(shippingCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Biaya Layanan/Admin</span>
              <span className="text-sm font-semibold text-navy-900">{paymentFee === 0 ? '-' : formatRupiah(paymentFee)}</span>
            </div>
          </div>
          
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-navy-500 font-bold uppercase tracking-wider mb-0.5">Total Tagihan</span>
              <span className="font-heading text-xl font-bold text-gold-600 leading-none">{formatRupiah(grandTotal)}</span>
            </div>
            <button
              onClick={handleProcessPayment}
              disabled={isLoading || !shippingMethod || !paymentMethod}
              className="font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm bg-gold-400 text-navy-900 hover:bg-gold-500 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:pointer-events-none"
            >
              {isLoading ? 'Memproses Gateway...' : (
                <>
                  <ShieldCheck /> Bayar Sekarang
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
