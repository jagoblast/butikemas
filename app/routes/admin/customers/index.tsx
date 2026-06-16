import AdminCustomerList from '../../../islands/AdminCustomerList'

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pelanggan</h1>
        <p className="text-sm text-gray-500">Kelola dan pantau data pengguna yang telah terdaftar di sistem ButikEmas.</p>
      </div>
      
      {/* Tabel Interaktif (Island) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AdminCustomerList />
      </div>
    </div>
  )
}
