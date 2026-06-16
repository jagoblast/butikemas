import { useState } from 'hono/jsx'

// Ikon Murni
const Pencil = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
const Trash2 = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const FileText = () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>

export default function AdminArticleList({ initialArticles }: { initialArticles: any[] }) {
  const [articles, setArticles] = useState(initialArticles)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) return

    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id))
      } else {
        alert("Gagal menghapus artikel.")
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.")
    }
  }

  if (articles.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
        <FileText />
        <h3 className="mt-4 text-lg font-bold text-navy-900">Belum ada artikel</h3>
        <p className="mt-1 text-sm">Mulai buat konten edukasi dan wawasan investasi untuk pelanggan Anda.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
        <thead className="text-xs text-navy-900 uppercase bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 font-bold tracking-wider">Info Artikel</th>
            <th className="px-6 py-4 font-bold tracking-wider">Status</th>
            <th className="px-6 py-4 font-bold tracking-wider">Tanggal Dibuat</th>
            <th className="px-6 py-4 font-bold tracking-wider text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {articles.map((article) => (
            <tr key={article.id} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                    {article.image_url ? (
                      <img src={article.image_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><FileText /></div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-navy-900 mb-0.5">{article.title}</p>
                    <p className="text-xs text-gray-500">/{article.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md border ${
                  article.is_published 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                  {article.is_published ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </td>
              <td className="px-6 py-4">
                {new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <a href={`/admin/articles/${article.id}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                    <Pencil />
                  </a>
                  <button onClick={() => handleDelete(article.id, article.title)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                    <Trash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
