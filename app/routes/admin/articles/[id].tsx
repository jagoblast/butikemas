import { createRoute } from 'honox/factory'
import AdminArticleForm from '../../../islands/AdminArticleForm'

export default createRoute(async (c) => {
  const articleId = c.req.param('id')

  const article = await c.env.DB.prepare(
    'SELECT * FROM articles WHERE id = ?'
  ).bind(articleId).first()

  if (!article) {
    return c.render(
      <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-navy-900">Artikel Tidak Ditemukan</h1>
        <a href="/admin/articles" className="mt-4 inline-block text-gold-600 font-bold hover:underline">Kembali ke Daftar</a>
      </div>
    )
  }

  return c.render(
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <a href="/admin/articles" className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors bg-white shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Edit Artikel</h1>
          <p className="text-sm text-gray-500">Memperbarui: <span className="font-bold text-navy-900">{article.title}</span></p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <AdminArticleForm initialData={article} />
      </div>
    </div>,
    { title: 'Edit Artikel' }
  )
})
