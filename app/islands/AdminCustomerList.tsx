import { useState, useEffect } from 'hono/jsx'

export default function AdminCustomerList() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCustomers(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-12 text-center text-gray-500 animate-pulse font-medium">Memuat data pelanggan...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 font-bold tracking-wider">Nama Lengkap</th>
            <th className="px-6 py-4 font-bold tracking-wider">Email</th>
            <th className="px-6 py-4 font-bold tracking-wider">No. Telepon</th>
            <th className="px-6 py-4 font-bold tracking-wider">Bergabung Pada</th>
            <th className="px-6 py-4 font-bold tracking-wider text-center">Status Akun</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.length === 0 ? (
            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada pelanggan terdaftar.</td></tr>
          ) : customers.map((user) => (
            <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-100 text-xs font-bold text-navy-800 uppercase">
                    {user.name ? user.name.slice(0, 2) : 'US'}
                  </div>
                  <span className="font-semibold text-gray-900">{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600">{user.email}</td>
              <td className="px-6 py-4 font-medium">{user.phone || '-'}</td>
              <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td className="px-6 py-4 text-center">
                <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md border bg-green-50 text-green-700 border-green-200">
                  Aktif
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
