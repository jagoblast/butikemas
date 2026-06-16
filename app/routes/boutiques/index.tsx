import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  // Ambil data langsung dari Edge DB (Cepat tanpa loading spinner)
  const { results: boutiques } = await c.env.DB.prepare(
    'SELECT * FROM boutiques WHERE is_active = 1 ORDER BY sort_order ASC'
  ).all()

  return c.render(
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-navy-900 font-serif mb-4">Jaringan Butik Kami</h1>
        <p className="text-lg text-gray-600">Temukan butik emas Logam Mulia terdekat di kota Anda untuk layanan pembelian dan buyback secara langsung.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boutiques.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">Belum ada lokasi butik yang ditambahkan.</div>
        ) : boutiques.map((b: any) => (
          <div key={b.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center text-gold-600 mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">{b.name}</h2>
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <p className="flex items-start gap-2">
                <span className="font-semibold text-gray-900 shrink-0">Kota:</span> {b.city}
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-gray-900 shrink-0">Alamat:</span> <span className="line-clamp-2">{b.address}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-gray-900 shrink-0">Telp:</span> {b.contact_phone}
              </p>
            </div>
            <a href={b.google_maps_url} target="_blank" rel="noreferrer" className="block w-full py-2.5 text-center text-sm font-bold text-gold-700 bg-gold-50 hover:bg-gold-100 rounded-xl transition-colors border border-gold-200">
              Lihat di Google Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  )
})
