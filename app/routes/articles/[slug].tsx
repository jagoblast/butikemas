import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')

  const article = await c.env.DB.prepare(
    'SELECT * FROM articles WHERE slug = ? AND is_published = 1'
  ).bind(slug).first()

  if (!article) {
    return c.render(
      <div className="flex h-[70vh] flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-navy-900 font-serif mb-2">Artikel Tidak Ditemukan</h1>
        <p className="text-navy-600 mb-6">Konten yang Anda cari mungkin telah dihapus atau dipindahkan.</p>
        <a href="/articles" className="px-6 py-3 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors">Kembali ke Daftar Artikel</a>
      </div>,
      { title: 'Artikel Tidak Ditemukan' }
    )
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
  }

  const ArrowLeft = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>

  return c.render(
    <div className="bg-white min-h-screen">
      <div className="w-full h-[40vh] md:h-[60vh] bg-navy-900 relative">
        {/* Gunakan cover_url */}
        {article.cover_url && (
          <img src={article.cover_url} alt={article.title} className="w-full h-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 relative -mt-32 md:-mt-48 z-10 pb-24">
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-gray-100">
          <a href="/articles" className="inline-flex items-center gap-2 text-sm font-bold text-gold-600 hover:text-gold-700 mb-6 transition-colors">
            <ArrowLeft /> Kembali ke Daftar Artikel
          </a>
          
          <span className="block text-[11px] font-bold uppercase tracking-widest text-navy-400 mb-4">
            {formatDate(article.created_at)}
          </span>
          
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 font-serif leading-tight mb-4">
            {article.title}
          </h1>

          {/* Jika ada excerpt, tampilkan sebagai intro paragraf yang dicetak tebal */}
          {article.excerpt && (
            <p className="text-lg text-navy-600 font-medium mb-8 leading-relaxed italic">
              {article.excerpt}
            </p>
          )}

          <div className="w-full h-px bg-gray-100 mb-8" />

          <div className="prose prose-lg prose-navy max-w-none text-navy-700 leading-relaxed space-y-6">
            {article.content.split('\n').map((paragraph: string, idx: number) => (
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>,
    { title: `${article.title} | Logam Mulia` }
  )
})
