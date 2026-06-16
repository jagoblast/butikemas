import CustomerOrderList from '../../../islands/CustomerOrderList'

export default function CustomerOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-navy-900">Riwayat Pesanan</h2>
        <p className="text-sm text-gray-500">Daftar semua transaksi yang pernah Anda lakukan.</p>
      </div>
      
      {/* Memanggil komponen dinamis island */}
      <CustomerOrderList />
    </div>
  )
}
