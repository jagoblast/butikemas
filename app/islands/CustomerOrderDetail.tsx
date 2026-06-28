import { useState, useEffect } from 'hono/jsx'

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function CustomerOrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/customer/orders/${orderId}`)
        const data = await res.json()
        
        if (res.ok && data.success) {
          setOrder(data.data)
        } else {
          setError(data.message || 'Gagal memuat detail pesanan.')
        }
      } catch (err) {
        setError('Terjadi kesalahan jaringan saat memuat data pesanan.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-navy-200 border-t-gold-500 rounded-full animate-spin mb-4"></div>
        <p className="text-navy-500 font-medium">Memuat detail pesanan...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <h3 className="text-red-800 font-bold text-lg mb-2">Pesanan Tidak Ditemukan</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <a href="/customer/orders" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
          Kembali ke Riwayat
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <a href="/customer/orders" className="p-2 text-navy-500 hover:bg-navy-50 rounded-xl transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </a>
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Detail Pesanan</h1>
          <p className="text-sm text-navy-500">ID: <span className="font-mono text-navy-700">{order.id}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-navy-100 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-navy-50 mb-4">
              <div>
                <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">Status Transaksi</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-bold ${
                  order.status === 'PAID' ? 'bg-green-50 border-green-200 text-green-700' :
                  order.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                  order.status === 'SHIPPED' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                  'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${order.status === 'PAID' ? 'bg-green-500' : order.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-500'}`}></span>
                  {order.status === 'PENDING' ? 'Menunggu Pembayaran' : order.status}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">Tanggal Pemesanan</p>
                <p className="text-sm font-semibold text-navy-900">{formatDate(order.created_at)}</p>
              </div>
            </div>

            <h3 className="font-bold text-navy-900 mb-4">Daftar Produk</h3>
            <div className="space-y-4">
              {order.items && order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-20 h-20 bg-surface rounded-xl border border-navy-100 p-2 flex shrink-0 items-center justify-center">
                    <img src={item.image_url || 'https://emas.pasdigi.id/images/lm.png'} alt={item.product_name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-navy-900 leading-tight mb-1">{item.product_name}</h4>
                    <p className="text-xs text-navy-500 mb-2">{item.quantity} x {formatRupiah(item.price)}</p>
                    <p className="text-sm font-bold text-gold-600">{formatRupiah(item.quantity * item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-navy-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-4">Informasi Pengiriman</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-navy-400 font-medium uppercase tracking-wider">Kurir</p>
                <p className="text-sm font-semibold text-navy-900">{order.shipping_method || 'Standard Delivery'}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400 font-medium uppercase tracking-wider">Penerima</p>
                <p className="text-sm font-semibold text-navy-900">{order.customer_name}</p>
                <p className="text-sm text-navy-600 mt-1">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400 font-medium uppercase tracking-wider">Alamat</p>
                <p className="text-sm text-navy-600 leading-relaxed mt-1">
                  {order.shipping_address || 'Tidak ada alamat tercatat.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-navy-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-4">Rincian Pembayaran</h3>
            <div className="space-y-2 mb-4 pb-4 border-b border-navy-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-navy-600">Metode</span>
                <span className="text-sm font-semibold text-navy-900">{order.payment_method || 'Bank Transfer'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-navy-600">Total Harga Produk</span>
                <span className="text-sm font-semibold text-navy-900">
                  {formatRupiah(order.total_amount - (order.shipping_cost || 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-navy-600">Ongkos Kirim</span>
                <span className="text-sm font-semibold text-navy-900">
                  {order.shipping_cost ? formatRupiah(order.shipping_cost) : 'Rp 0'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-navy-900">Total Tagihan</span>
              <span className="text-xl font-bold text-gold-600 font-heading">
                {formatRupiah(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
