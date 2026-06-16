import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  // Ambil hanya artikel yang dipublikasikan (is_published = 1)
  const { results: articles } = await c.env.DB.prepare(
    'SELECT * FROM articles WHERE is_published = 1 ORDER BY created_at DESC'
  ).all()

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
  }

  // Ikon Murni
  const ChevronRight = () => <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>

  return c.render(
    <div className="bg-gray-50 min-h-screen">
      <div className="container-main py-12 md:py-20">
        
        {/* Header Edukasi */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-navy-900 font-serif mb-4">Wawasan & Edukasi</h1>
          <p className="text-navy-600 text-base md:text-lg">Temukan informasi terbaru seputar investasi emas, tips finansial, dan promo menarik dari Logam Mulia.</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
            <p className="text-navy-500 font-medium">Belum ada artikel yang dipublikasikan saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article: any) => (
              <a key={article.id} href={`/articles/${article.slug}`} className="block border border-gray-200 rounded-3xl overflow-hidden group hover:shadow-xl transition-all bg-white flex flex-col h-full">
                <div className="aspect-[16/10] overflow-hidden relative bg-navy-900">
                  <span className="absolute top-4 left-4 bg-navy-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 tracking-wider">ARTIKEL</span>
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold-400">Logam Mulia</div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[11px] text-navy-400 mb-3 font-semibold uppercase tracking-wider">{formatDate(article.created_at)}</p>
                  <h3 className="font-bold text-navy-900 text-lg mb-3 group-hover:text-gold-600 transition-colors line-clamp-2 leading-snug">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-5 line-clamp-3 leading-relaxed flex-1">{article.content}</p>
                  
                  {/* mt-auto memaksa tombol baca selengkapnya menempel di bawah card */}
                  <span className="mt-auto text-sm font-bold text-gold-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Baca Selengkapnya <ChevronRight />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>,
    { title: 'Wawasan & Edukasi | Logam Mulia' }
  )
})
