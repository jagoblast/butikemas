import AdminReviewList from '../../../islands/AdminReviewList'

export default function AdminReviewsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ulasan Produk</h1>
        <p className="text-sm text-gray-500">Daftar ulasan dari pelanggan untuk produk Anda.</p>
      </div>
      <AdminReviewList />
    </div>
  )
}
