import AdminDashboardView from '../../islands/AdminDashboardView'

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Utama</h1>
        <p className="text-sm text-gray-500">Ringkasan aktivitas dan performa sistem Butik Emas Anda hari ini.</p>
      </div>
      
      {/* Panggil Island yang mengambil data asli dari Database */}
      <AdminDashboardView />
    </div>
  )
}
