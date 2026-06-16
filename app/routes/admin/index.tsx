// app/routes/admin/index.tsx

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Kartu Statistik Atas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-gray-400">Total Pendapatan</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">Rp 150.250.000</span>
          <span className="text-xs text-green-500 font-semibold mt-1">↑ 12% dari bulan lalu</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-gray-400">Pesanan Baru</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">34 Pesanan</span>
          <span className="text-xs text-yellow-500 font-semibold mt-1">Perlu diproses segera</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-gray-400">Pelanggan Terdaftar</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">1.240 User</span>
          <span className="text-xs text-green-500 font-semibold mt-1">↑ 4% minggu ini</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-gray-400">Stok Emas Batangan</span>
          <span className="text-2xl font-bold text-gray-900 mt-2">4,250 Kg</span>
          <span className="text-xs text-red-500 font-semibold mt-1">Sisa 15 varian produk</span>
        </div>
      </div>

      {/* Konten Log Aktivitas Sistem Terbaru */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Log Transaksi Terbaru</h2>
          <a href="/admin/orders" className="text-sm font-semibold text-yellow-600 hover:text-yellow-500 transition-colors">Lihat Semua</a>
        </div>
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
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-4 py-3.5 font-semibold text-gray-900">INV-20260616-001</td>
                <td className="px-4 py-3.5">Dimas Sululum</td>
                <td className="px-4 py-3.5 font-medium text-gray-900">Rp 12.450.000</td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded-md">PAID</span>
                </td>
                <td className="px-4 py-3.5">Hari ini, 10:24</td>
              </tr>
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-4 py-3.5 font-semibold text-gray-900">INV-20260615-089</td>
                <td className="px-4 py-3.5">Jago Blast User</td>
                <td className="px-4 py-3.5 font-medium text-gray-900">Rp 1.230.000</td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-50 rounded-md">PENDING</span>
                </td>
                <td className="px-4 py-3.5">Kemarin, 17:40</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
