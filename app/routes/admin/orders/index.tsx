import AdminOrderList from '../../../islands/AdminOrderList'

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Pesanan</h1>
          <p className="text-sm text-gray-500">Kelola semua transaksi, validasi pembayaran, dan pantau status pesanan pelanggan.</p>
        </div>
      </div>
      
      {/* Tabel Interaktif (Island) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AdminOrderList />
      </div>
    </div>
  )
}
