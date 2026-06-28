import { useState, useEffect } from 'hono/jsx'

export default function CustomerOrderList() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/customer/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-8 text-center text-gray-500 animate-pulse">Memuat riwayat transaksi...</div>

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center flex flex-col items-center">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <p className="text-gray-500 font-medium mb-4">Anda belum memiliki riwayat transaksi.</p>
        <a href="/products" className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors shadow-sm">
          Mulai Belanja
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-100 rounded-2xl p-4 sm:p-5 hover:border-gold-300 transition-colors bg-gray-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h3 className="font-bold text-navy-900">{order.id}</h3>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-md border ${
                order.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' :
                order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {order.status === 'PENDING' ? 'Menunggu Pembayaran' : order.status}
              </span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Belanja</p>
              <p className="font-bold text-lg text-gold-600 mt-0.5">Rp {order.total_amount?.toLocaleString('id-ID')}</p>
            </div>
            
            {/* Mengganti tag button menjadi anchor (a) untuk memfasilitasi navigasi Detail Order */}
            <a href={`/customer/orders/${order.id}`} className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 text-center w-full sm:w-auto block">
              Lihat Detail Pesanan
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
