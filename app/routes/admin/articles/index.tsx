import { createRoute } from 'honox/factory'
import AdminArticleList from '../../../islands/AdminArticleList'

export default createRoute(async (c) => {
  // MENGGUNAKAN cover_url SESUAI SCHEMA
  const { results: articles } = await c.env.DB.prepare(
    'SELECT id, title, slug, cover_url, is_published, created_at FROM articles ORDER BY created_at DESC'
  ).all()

  return c.render(
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Manajemen Artikel</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola konten edukasi, wawasan investasi, dan berita promosi.</p>
        </div>
        <a href="/admin/articles/new" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-all shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14"/></svg>
          Tulis Artikel Baru
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AdminArticleList initialArticles={articles} />
      </div>
    </div>,
    { title: 'Manajemen Artikel' }
  )
})
