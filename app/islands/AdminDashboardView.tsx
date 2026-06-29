import { useState, useEffect } from 'hono/jsx'

export default function AdminDashboardView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/admin/dashboard/summary')
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Error memuat data dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-500 font-medium">Memuat data dashboard...</span>
      </div>
    )
  }

  if (!data) {
    return <div className="text-red-500 p-4 bg-red-50 rounded-xl">Gagal memuat data dashboard.</div>
  }

  // Helper untuk format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka)
  }

  // Helper untuk format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Kartu Statistik Atas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <span className="text-sm font-medium text-gray-400">Total Pendapatan</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">{formatRupiah(data.totalRevenue)}</span>
          <span className="text-xs text-green-500 font-semibold mt-1">Status: Lunas & Selesai</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <span className="text-sm font-medium text-gray-400">Pesanan Baru (Pending)</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">{data.newOrders} Pesanan</span>
          <span className="text-xs text-yellow-500 font-semibold mt-1">Perlu tindakan admin</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <span className="text-sm font-medium text-gray-400">Pelanggan Terdaftar</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">{data.totalCustomers} User</span>
          <span className="text-xs text-blue-500 font-semibold mt-1">Total pengguna aktif</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <span className="text-sm font-medium text-gray-400">Total Stok Fisik</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">
            {data.totalStockGram > 1000 ? `${(data.totalStockGram / 1000).toFixed(2)} Kg` : `${data.totalStockGram} Gram`}
          </span>
          <span className="text-xs text-gray-500 font-semibold mt-1">Berdasarkan berat produk</span>
        </div>
      </div>

      {/* Konten Log Aktivitas Sistem Terbaru */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">5 Transaksi Terbaru</h2>
          <a href="/admin/orders" className="text-sm font-semibold text-yellow-600 hover:text-yellow-500 transition-colors">Lihat Semua</a>
        </div>
        
        {data.recentOrders && data.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">ID Pesanan</th>
                  <th className="px-4 py-3">Pelanggan</th>
                  <th className="px-4 py-3">Grand Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentOrders.map((order: any) => (
                  <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-gray-900">
                      <a href={`/admin/orders/${order.id}`} className="hover:text-gold-500">
                        {order.id.split('-')[0]}-{order.id.slice(-6)}
                      </a>
                    </td>
                    <td className="px-4 py-3.5">{order.customer_name}</td>
                    <td className="px-4 py-3.5 font-medium text-gray-900">{formatRupiah(order.total_amount)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                        order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-xl">
            Belum ada data transaksi masuk.
          </div>
        )}
      </div>
    </div>
  )
}
