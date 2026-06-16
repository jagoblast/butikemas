import { useState, useEffect } from 'hono/jsx'

export default function AdminOrderList() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-12 text-center text-gray-500 animate-pulse font-medium">Memuat data transaksi...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 font-bold tracking-wider">ID Pesanan</th>
            <th className="px-6 py-4 font-bold tracking-wider">Pelanggan</th>
            <th className="px-6 py-4 font-bold tracking-wider">Grand Total (Rp)</th>
            <th className="px-6 py-4 font-bold tracking-wider">Status</th>
            <th className="px-6 py-4 font-bold tracking-wider">Tanggal Dibuat</th>
            <th className="px-6 py-4 font-bold tracking-wider text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Belum ada pesanan yang masuk.</td></tr>
          ) : orders.map((order) => (
            <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-semibold text-navy-900">{order.id}</td>
              <td className="px-6 py-4 font-medium text-gray-800">{order.customer_name || '-'}</td>
              <td className="px-6 py-4 font-semibold text-gold-600">{order.total_amount?.toLocaleString('id-ID')}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md border ${
                  order.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' :
                  order.status === 'PENDING' || order.status === 'UNPAID' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td className="px-6 py-4 text-center">
                <a href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Detail
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
