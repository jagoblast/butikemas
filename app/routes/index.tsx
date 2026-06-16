const ChevronRight = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;
const BadgePercent = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m15 9-6 6"/><path d="M9 9h.01"/><path d="M15 15h.01"/></svg>;
const ShieldCheck = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.89 0 4.79 1.07 6.31 1.9a1.17 1.17 0 0 1 .69 1.1z"/><path d="m9 12 2 2 4-4"/></svg>;
const TrendingUp = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const PackageIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
const StoreIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4h2a2 2 0 0 0 2-2v-8"/><path d="M2 7h20v.5a2.5 2.5 0 0 1-5 0v-.5"/><path d="M12 7v.5a2.5 2.5 0 0 1-5 0v-.5"/><path d="M17 7v.5a2.5 2.5 0 0 1-5 0v-.5"/></svg>;
const MapPinIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;

// Fungsi penggabung class CSS
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')

// Data Dummy agar UI langsung terlihat seperti aslinya
const dummyData = {
  priceCards: [
    {
      label: 'Emas', tone: 'gold', price: 'Rp 1.350.000', previousPrice: 'Rp 1.345.000', changeLabel: '+0,37%', trend: 'up',
      backgroundImage: 'https://emas.pasdigi.id/images/metal-gold.jpg',
    },
    {
      label: 'Perak', tone: 'silver', price: 'Rp 15.400', previousPrice: 'Rp 15.500', changeLabel: '-0,64%', trend: 'down',
      backgroundImage: 'https://emas.pasdigi.id/images/metal-silver.png',
    }
  ],
  products: [
    { id: 1, slug: 'emas-1g', name: 'Emas Batangan 1 Gram', price: 'Rp 1.350.000', badge: 'Terlaris', sold: '1.200 terjual', isPromo: false, imageUrl: 'https://emas.pasdigi.id/images/metal-gold.jpg' },
    { id: 2, slug: 'emas-5g', name: 'Emas Batangan 5 Gram', price: 'Rp 6.500.000', badge: 'Stok Terbatas', sold: '450 terjual', isPromo: true, originalPrice: 'Rp 6.750.000', savingsLabel: '250rb', imageUrl: 'https://emas.pasdigi.id/images/metal-gold.jpg' },
    { id: 3, slug: 'emas-10g', name: 'Emas Batangan 10 Gram', price: 'Rp 12.900.000', badge: '', sold: '300 terjual', isPromo: false, imageUrl: 'https://emas.pasdigi.id/images/metal-gold.jpg' },
    { id: 4, slug: 'perak-100g', name: 'Perak Batangan 100 Gram', price: 'Rp 1.540.000', badge: '', sold: '890 terjual', isPromo: false, imageUrl: 'https://emas.pasdigi.id/images/metal-silver.png' },
  ],
  boutiques: [
    { city: 'Jakarta Pusat', address: 'Gedung Antam, Jl. Letjen TB Simatupang', googleMapsUrl: '#' },
    { city: 'Surabaya', address: 'Jl. Pemuda No. 102, Embong Kaliasin', googleMapsUrl: '#' },
    { city: 'Bandung', address: 'Jl. Ir. H. Juanda No. 84, Lebakgede', googleMapsUrl: '#' },
    { city: 'Medan', address: 'Jl. Balai Kota No. 2, Kesawan', googleMapsUrl: '#' },
  ],
  articles: [
    { slug: 'tips-investasi', tag: 'Edukasi', title: '5 Tips Aman Investasi Emas untuk Pemula', desc: 'Pelajari cara membedakan emas asli dan palsu sebelum mulai berinvestasi.', coverUrl: 'https://emas.pasdigi.id/images/banner-1.png' },
    { slug: 'harga-naik', tag: 'Berita', title: 'Harga Emas Antam Sentuh Rekor Tertinggi Tahun Ini', desc: 'Ketegangan geopolitik dan inflasi global memicu lonjakan harga emas.', coverUrl: 'https://emas.pasdigi.id/images/banner-2.png' },
    { slug: 'perak-alternatif', tag: 'Wawasan', title: 'Mengapa Perak Bisa Jadi Alternatif Investasi?', desc: 'Selain emas, perak juga memiliki nilai lindung nilai (hedging) yang baik.', coverUrl: 'https://emas.pasdigi.id/images/banner-3.jpg' },
  ],
  features: [
    { icon: ShieldCheck, title: 'Terjamin Asli', desc: 'Sertifikasi LBMA standar global.' },
    { icon: TrendingUp, title: 'Harga Kompetitif', desc: 'Update harga real-time harian.' },
    { icon: PackageIcon, title: 'Pengiriman Aman', desc: 'Layanan penuh se-Indonesia.' },
    { icon: StoreIcon, title: 'Butik Fisik', desc: 'Fasilitas pengambilan di butik resmi.' },
  ]
}

const HERO_BACKGROUND_IMAGE = 'https://images.pexels.com/photos/321452/pexels-photo-321452.jpeg?auto=compress&cs=tinysrgb&w=1800'

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden border-b border-gold-500/20 bg-navy-900">
        <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden md:hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover object-center">
            <source src="https://emas.pasdigi.id/videos/promo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />
          <div className="absolute inset-x-5 bottom-6">
            <a href="/products" className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-4 text-base font-bold text-navy-900 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all active:scale-95">
              Mulai Investasi <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="relative isolate hidden overflow-hidden md:block">
          <img src={HERO_BACKGROUND_IMAGE} alt="Background" className="absolute inset-0 -z-30 h-full w-full object-cover object-center opacity-55" />
          <div className="absolute inset-0 -z-20 bg-navy-950/72" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,27,45,0.98)_0%,rgba(15,27,45,0.88)_44%,rgba(15,27,45,0.46)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-navy-950/80 to-transparent" />

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
                Mulai Investasi <ChevronRight className="h-5 w-5" />
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
                {dummyData.priceCards.map((card) => (
                  <div key={card.label} className={cn('relative overflow-hidden rounded-lg border p-5 shadow-sm', card.tone === 'gold' ? 'border-gold-400/60 bg-[linear-gradient(135deg,#fff7db_0%,#f3c85f_42%,#8b650f_120%)]' : 'border-slate-300 bg-[linear-gradient(135deg,#ffffff_0%,#dce1e8_48%,#748091_120%)]')}>
                    <img src={card.backgroundImage} alt="" className={cn('pointer-events-none absolute right-0 top-1/2 h-[130%] max-w-none -translate-y-1/2 object-contain opacity-20', card.tone === 'gold' ? 'w-[58%] rotate-6' : 'w-[48%]')} />
                    <div className="absolute inset-0 bg-white/10" />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className={cn('text-sm font-bold', card.tone === 'gold' ? 'text-gold-800' : 'text-navy-700')}>{card.label}</p>
                          <p className="mt-3 text-xs font-bold uppercase text-navy-600">Harga hari ini</p>
                          <h3 className="mt-1 font-body text-[28px] font-bold leading-none text-navy-900">{card.price}</h3>
                        </div>
                        <span className={cn('inline-flex min-w-[76px] items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold', card.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>{card.changeLabel}</span>
                      </div>
                      <div className="mt-4 rounded-lg bg-white/80 p-3 ring-1 ring-black/5 backdrop-blur-sm">
                        <p className="text-xs font-bold uppercase text-navy-500">Harga kemarin</p>
                        <p className="mt-1 text-base font-bold text-navy-900">{card.previousPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-4 border-t border-navy-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold leading-5 text-navy-500">Terakhir diupdate: Hari ini 08:30 WIB</p>
                <a href="/products" className="inline-flex items-center justify-center gap-1 rounded-lg border border-gold-300 px-4 py-2 text-sm font-bold text-gold-700 hover:bg-gold-50">
                  Lihat Produk <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-[0_18px_45px_-34px_rgba(15,27,45,0.5)]">
             <img src="https://emas.pasdigi.id/images/banner-simfoni.webp" alt="Promo" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="section-full">
        <div className="container-main">
          <div className="flex justify-between items-end mb-stack-md">
            <h2 className="section-heading">Produk Terpopuler</h2>
            <a href="/products" className="flex items-center gap-1 text-label-md text-gold-500 font-semibold hover:gap-2 transition-all">Lihat Semua <ChevronRight className="w-4 h-4" /></a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {dummyData.products.map((product) => (
              <a key={product.id} href={`/products/${product.slug}`} className={cn('card-product p-4 relative overflow-hidden block', product.isPromo && 'border-2 border-gold-400 bg-[linear-gradient(180deg,#FFF1C2_0%,#FFFFFF_44%,#FFF9EA_100%)] shadow-[0_18px_42px_-18px_rgba(212,168,75,0.9)] ring-2 ring-gold-100/90')}>
                <div className="product-img-wrap mb-stack-sm relative">
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  {product.isPromo && (
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 px-2.5 py-1.5 text-[9px] font-extrabold uppercase text-navy-900 shadow-lg shadow-navy-900/20">
                      <span className="inline-flex items-center gap-1"><BadgePercent className="h-3 w-3" /> Promo</span>
                      <span className="shrink-0 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] text-[#216B35]">-{product.savingsLabel}</span>
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {product.badge && <span className="certified-stamp">{product.badge}</span>}
                  <h3 className="font-bold text-sm text-navy-900 truncate">{product.name}</h3>
                  {product.isPromo && <p className="text-[10px] font-semibold text-[#888888] line-through">{product.originalPrice}</p>}
                  <p className={cn('text-gold-400 font-bold text-sm', product.isPromo && 'text-gold-700 font-extrabold')}>{product.price}</p>
                  <p className="text-[10px] text-navy-600/70 font-medium">{product.sold}</p>
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
            {dummyData.features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="card-dark p-5">
                  <div className="w-10 h-10 bg-gold-400/20 rounded-lg flex items-center justify-center mb-stack-sm text-gold-400"><Icon className="w-5 h-5" /></div>
                  <h4 className="text-white font-bold text-sm mb-1">{feature.title}</h4>
                  <p className="text-white/50 text-[11px] leading-tight">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-full">
        <div className="container-main">
          <div className="flex justify-between items-end mb-stack-md">
            <div>
              <h2 className="section-heading">Lokasi Butik</h2>
              <p className="text-navy-600 text-body-md mt-stack-sm">Kunjungi jaringan butik resmi kami di kota Anda.</p>
            </div>
            <a href="/boutiques" className="flex items-center gap-1 text-label-md text-gold-500 font-semibold hover:gap-2 transition-all pb-1">Lihat Semua <ChevronRight className="w-4 h-4" /></a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dummyData.boutiques.map((boutique) => (
              <a key={boutique.city} href={boutique.googleMapsUrl} className="card-surface p-4 flex flex-col hover:border-gold-400/50 transition-colors">
                <MapPinIcon className="w-5 h-5 text-gold-400 mb-stack-sm" />
                <h5 className="font-bold text-navy-900 text-sm">{boutique.city}</h5>
                <p className="text-[11px] text-navy-600">{boutique.address}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="artikel" className="pb-stack-lg overflow-hidden">
        <div className="container-main">
          <h2 className="section-heading mb-stack-md">Wawasan Investasi</h2>
        </div>
        <div className="container-main">
          <div className="flex gap-gutter overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
            {dummyData.articles.map((article) => (
              <article key={article.title} className="min-w-[85%] md:min-w-[30%] snap-center card-surface rounded-2xl overflow-hidden flex flex-col shadow-elevation-mid">
                <div className="relative aspect-video bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center overflow-hidden">
                  <img src={article.coverUrl} alt={article.title} className="h-full w-full object-cover" />
                  <div className="absolute top-4 left-4"><span className="bg-navy-900/80 backdrop-blur-md text-gold-400 text-[8px] font-bold px-2 py-1 rounded uppercase tracking-wider">{article.tag}</span></div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-[17px] font-bold text-navy-900 mb-stack-sm leading-tight">{article.title}</h3>
                  <p className="text-navy-600 text-xs line-clamp-2 mb-stack-md flex-grow">{article.desc}</p>
                  <a href={`/articles/${article.slug}`} className="flex items-center gap-1 font-bold text-gold-500 text-xs group">Baca Selengkapnya <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
