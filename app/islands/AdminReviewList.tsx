import { useState, useEffect } from 'hono/jsx'

export default function AdminReviewList() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reviews/admin')
      const json = await res.json()
      if (json.success) setReviews(json.data)
    } catch (error) {
      console.error('Gagal memuat ulasan:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-3">Produk</th>
            <th className="px-4 py-3">Pelanggan</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Komentar</th>
            <th className="px-4 py-3">Waktu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr><td colSpan={5} className="text-center py-4">Memuat data...</td></tr>
          ) : reviews.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-4">Belum ada ulasan.</td></tr>
          ) : (
            reviews.map((r: any) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-semibold text-gray-900">{r.product_name}</td>
                <td className="px-4 py-3">{r.customer_name}</td>
                <td className="px-4 py-3 font-bold text-gold-600">{r.rating} / 5</td>
                <td className="px-4 py-3 italic">"{r.comment}"</td>
                <td className="px-4 py-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
