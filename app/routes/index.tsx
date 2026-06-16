import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const { results: popularProducts } = await c.env.DB.prepare(
    'SELECT * FROM products WHERE is_active = 1 ORDER BY stock DESC LIMIT 4'
  ).all()

  const { results: boutiques } = await c.env.DB.prepare(
    'SELECT * FROM boutiques WHERE is_active = 1 LIMIT 4'
  ).all()

  // Helper yang benar
  const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  const currentDate = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date())

  const ChevronRight = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
  const ShieldCheck = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.89 0 5.26 1 7 2a1 1 0 0 1 1 1v7z"/><path d="m9 12 2 2 4-4"/></svg>
  const TrendingUp = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  const Package = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  const Store = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
  const MapPin = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>

  return c.render(
    <>
      <section className="overflow-hidden border-b border-gold-500/20 bg-navy-900">
        
        <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden md:hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover object-center">
            <source src="https://emas.pasdigi.id/videos/home-hero-clean.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-5 bottom-6">
            <a href="/products" className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-4 text-base font-bold text-navy-900 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all active:scale-95">
              Lihat Katalog Emas
              <ChevronRight />
            </a>
          </div>
        </div>

        <div className="relative isolate hidden overflow-hidden md:block">
          <img src="https://images.pexels.com/photos/321452/pexels-photo-321452.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center opacity-55" />
          <div className="absolute inset-0 -z-20 bg-navy-950/72" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,27,45,0.98)_0%,rgba(15,27,45,0.88)_44%,rgba(15,27,45,0.46)_100%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-navy-950/80 to-transparent" aria-hidden="true" />

          <div className="container-main relative z-10 flex min-h-[560px] items-center py-24 pb-32 md:max-w-6xl">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-gold-400">Logam Mulia Bersertifikat</p>
              <h1 className="max-w-xl font-heading text-[52px] font-bold leading-[1.1] text-white">
                Investasi Emas Mulai dari <span className="text-gold-400">0.5 Gram</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-navy-200">
                Aman, terpercaya, dan bersertifikat ANTAM. Mulai perjalanan investasi finansial kamu hari ini.
              </p>
              <a href="/products" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-7 py-4 text-base font-bold text-navy-950 shadow-[0_16px_34px_-22px_rgba(212,168,75,0.75)] transition-all hover:-translate-y-0.5 hover:bg-gold-400">
                Lihat Katalog Emas
                <ChevronRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="harga-logam" className="container-main relative z-10 mt-8 md:-mt-16 md:mb-10">
        <div className="grid gap-6 lg:grid-cols-2">
          
          <div className="flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-[0_18px_45px_-34px_rgba(15,27,45,0.5)]">
            <div className="flex items-center justify-between gap-4 border-b border-navy-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-600">Harga Logam Mulia</p>
                <h2 className="mt-1 font-body text-xl font-bold text-navy-900">Emas dan Perak Hari Ini</h2>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="grid gap-3">
                <div className="relative overflow-hidden rounded-lg border p-5 shadow-sm border-gold-400/60 bg-[linear-gradient(135deg,#fff7db_0%,#f3c85f_42%,#8b650f_120%)]">
                  <img src="https://emas.pasdigi.id/images/metal-gold.jpg" className="pointer-events-none absolute right-0 top-1/2 h-[130%] max-w-none -translate-y-1/2 object-contain opacity-20 w-[58%] rotate-6" />
                  <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-gold-800">Emas</p>
                        <p className="mt-3 text-xs font-bold uppercase text-navy-600">Harga hari ini</p>
                        <h3 className="mt-1 font-body text-[28px] font-bold leading-none text-navy-900">Rp 1.455.000</h3>
                      </div>
                      <span className="inline-flex min-w-[76px] items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold bg-emerald-100 text-emerald-700">
                        +0,34%
                      </span>
                    </div>
                    <div className="mt-4 rounded-lg bg-white/80 p-3 ring-1 ring-black/5 backdrop-blur-sm">
                      <p className="text-xs font-bold uppercase text-navy-500">Harga kemarin</p>
                      <p className="mt-1 text-base font-bold text-navy-900">Rp 1.450.000</p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border p-5 shadow-sm border-slate-300 bg-[linear-gradient(135deg,#ffffff_0%,#dce1e8_48%,#748091_120%)]">
                  <img src="https://emas.pasdigi.id/images/metal-silver.png" className="pointer-events-none absolute right-0 top-1/2 h-[130%] max-w-none -translate-y-1/2 object-contain opacity-20 w-[48%]" />
                  <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-navy-700">Perak</p>
                        <p className="mt-3 text-xs font-bold uppercase text-navy-600">Harga hari ini</p>
                        <h3 className="mt-1 font-body text-[28px] font-bold leading-none text-navy-900">Rp 19.500</h3>
                      </div>
                      <span className="inline-flex min-w-[76px] items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold bg-red-100 text-red-700">
                        -1,02%
                      </span>
                    </div>
                    <div className="mt-4 rounded-lg bg-white/80 p-3 ring-1 ring-black/5 backdrop-blur-sm">
                      <p className="text-xs font-bold uppercase text-navy-500">Harga kemarin</p>
                      <p className="mt-1 text-base font-bold text-navy-900">Rp 19.700</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4 border-t border-navy-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold leading-5 text-navy-500">Terakhir diupdate: {currentDate} WIB</p>
                <a href="/products" className="inline-flex items-center justify-center gap-1 rounded-lg border border-gold-300 px-4 py-2 text-sm font-bold text-gold-700 hover:bg-gold-50">
                  Lihat Produk <ChevronRight />
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-[0_18px_45px_-34px_rgba(15,27,45,0.5)]">
            <img src="https://emas.pasdigi.id/images/banner-idul-fitri.webp" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="section-full mt-10">
        <div className="container-main">
          <div className="flex justify-between items-end mb-stack-md">
            <h2 className="section-heading">Produk Terpopuler</h2>
            <a href="/products" className="flex items-center gap-1 text-label-md text-gold-500 font-semibold hover:gap-2 transition-all">
              Lihat Semua <ChevronRight />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {popularProducts.map((p: any, i: number) => (
              <a key={p.id} href={`/products/${p.slug}`} className={`card-product p-4 relative overflow-hidden block ${i === 1 ? 'border-2 border-gold-400 bg-[linear-gradient(180deg,#FFF1C2_0%,#FFFFFF_44%,#FFF9EA_100%)] shadow-[0_18px_42px_-18px_rgba(212,168,75,0.9)] ring-2 ring-gold-100/90' : ''}`}>
                <div className="product-img-wrap mb-stack-sm relative">
                  <img src={p.image_url || 'https://emas.pasdigi.id/images/lm.png'} className="h-full w-full object-cover" />
                  {i === 1 && (
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 px-2.5 py-1.5 text-[9px] font-extrabold uppercase text-navy-900 shadow-lg shadow-navy-900/20">
                      Promo <span className="shrink-0 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] text-[#216B35]">-Rp 500Rb</span>
                    </span>
                  )}
                </div>
                <div className="space-y-1 mt-3">
                  {p.stock < 10 && <span className="certified-stamp">Stok Terbatas</span>}
                  <h3 className="font-bold text-sm text-navy-900 truncate">{p.name}</h3>
                  {/* Pemanggilan yang sudah dikoreksi */}
                  {i === 1 && <p className="text-[10px] font-semibold text-[#888888] line-through">{formatRupiah(p.price + 500000)}</p>}
                  <p className={`text-gold-400 font-bold text-sm ${i === 1 ? 'text-gold-700 font-extrabold' : ''}`}>{formatRupiah(p.price)}</p>
                  <p className="text-[10px] text-navy-600/70 font-medium">{p.stock + 1240} terjual</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-900 section-full">
        <div className="container-main">
          <div className="text-center mb-stack-md">
            <h2 className="text-display-md text-gold-400">Beli Emas Di Sini</h2>
            <p className="text-white/60 text-body-md mt-stack-sm">Standar keamanan tertinggi untuk masa depan Anda.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {[
              { title: 'Terjamin Asli', desc: 'Sertifikasi LBMA standar global.', icon: <ShieldCheck /> },
              { title: 'Harga Kompetitif', desc: 'Update harga real-time harian.', icon: <TrendingUp /> },
              { title: 'Pengiriman Aman', desc: 'Layanan penuh se-Indonesia.', icon: <Package /> },
              { title: 'Butik Fisik', desc: 'Fasilitas pengambilan di butik resmi.', icon: <Store /> },
            ].map((f) => (
              <div key={f.title} className="card-dark p-5">
                <div className="w-10 h-10 bg-gold-400/20 rounded-lg flex items-center justify-center mb-stack-sm text-gold-400">
                  {f.icon}
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{f.title}</h4>
                <p className="text-white/50 text-[11px] leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-full">
        <div className="container-main space-y-16">
          
          <div>
            <div className="flex justify-between items-end mb-stack-md">
              <div>
                <h2 className="section-heading">Lokasi Butik</h2>
                <p className="text-navy-600 text-body-md mt-stack-sm">Kunjungi jaringan butik resmi kami di kota Anda.</p>
              </div>
              <a href="/boutiques" className="flex items-center gap-1 text-label-md text-gold-500 font-semibold hover:gap-2 transition-all pb-1">
                Lihat Semua <ChevronRight />
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {boutiques.map((b: any) => (
                <a key={b.id} href={b.google_maps_url || '#'} className="card-surface p-4 flex flex-col hover:border-gold-400/50 transition-colors">
                  <MapPin />
                  <h5 className="font-bold text-navy-900 text-sm mt-3">{b.city}</h5>
                  <p className="text-[11px] text-navy-600 mt-1">{b.address}</p>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-900 font-serif mb-6 border-b border-gray-100 pb-4">Wawasan Investasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Kurban Nanti, Siapinnya Bisa dari Sekarang Lewat Nabung Emas', img: 'https://emas.pasdigi.id/images/banner-2.png' },
                { title: 'Buyback Emas ANTAM: Harga Ngikut Hari Transaksi, Bukan Tahun Produksi', img: 'https://emas.pasdigi.id/images/banner-3.jpg' },
                { title: 'Gempita Hari Raya Idul Fitri 1447 H / 2026', img: 'https://emas.pasdigi.id/images/banner-idul-fitri.webp' }
              ].map((a, i) => (
                <a key={i} href="/articles" className="block border border-gray-200 rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <span className="absolute top-3 left-3 bg-[#0f172a] text-white text-[10px] font-bold px-2 py-1 rounded z-10">ARTIKEL</span>
                    <img src={a.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-navy-900 text-base mb-2 group-hover:text-[#C99738] transition-colors line-clamp-2">{a.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">Banyak orang punya niat untuk berkurban saat Hari Raya Iduladha. Tapi jujur aja, kadang persiapannya baru...</p>
                    <span className="text-xs font-bold text-[#C99738]">Baca Selengkapnya &gt;</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
})
