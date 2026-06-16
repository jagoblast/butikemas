import CustomerProfile from '../../islands/CustomerProfile'

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-navy-900">Informasi Pribadi</h2>
        <p className="text-sm text-gray-500">Perbarui data diri dan alamat pengiriman default Anda.</p>
      </div>
      
      {/* Memanggil komponen dinamis island */}
      <CustomerProfile />
    </div>
  )
}
