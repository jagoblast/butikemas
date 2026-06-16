import { createRoute } from 'honox/factory'
import AdminArticleForm from '../../../islands/AdminArticleForm'

export default createRoute((c) => {
  return c.render(
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <a href="/admin/articles" className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors bg-white shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </a>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Tulis Artikel Baru</h1>
          <p className="text-sm text-gray-500">Buat konten baru untuk diterbitkan di halaman wawasan investasi.</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <AdminArticleForm />
      </div>
    </div>,
    { title: 'Tulis Artikel Baru' }
  )
})
