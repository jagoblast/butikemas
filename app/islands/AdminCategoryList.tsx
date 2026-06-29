import { useState, useEffect } from 'hono/jsx'

export default function AdminCategoryList() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-12 text-center text-gray-500 animate-pulse font-medium">Memuat data kategori...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 font-bold tracking-wider">Kategori</th>
            <th className="px-6 py-4 font-bold tracking-wider">Slug URL</th>
            <th className="px-6 py-4 font-bold tracking-wider">Deskripsi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.length === 0 ? (
            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Belum ada kategori.</td></tr>
          ) : categories.map((cat) => (
            <tr key={cat.id} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">IMG</div>
                    )}
                  </div>
                  <span className="font-bold text-navy-900">{cat.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-gray-600">{cat.slug}</td>
              <td className="px-6 py-4">
                <p className="truncate max-w-[250px]" title={cat.description}>{cat.description || '-'}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
