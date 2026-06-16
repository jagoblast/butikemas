import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  // 1. Ambil Data Terkini dari D1 (Dengan Subquery Gambar yang benar)
  const { results: popularProducts } = await c.env.DB.prepare(`
    SELECT p.*, 
      (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY is_primary DESC LIMIT 1) as image_url
    FROM products p 
    WHERE p.is_active = 1 
    ORDER BY p.stock DESC 
    LIMIT 4
  `).all()

  const { results: boutiques } = await c.env.DB.prepare(
    'SELECT * FROM boutiques WHERE is_active = 1 LIMIT 4'
  ).all()

  // 2. Helper Format
  const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  const currentDate = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date())

  // 3. Ikon Murni
  const ChevronRight = () => <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
  const ShieldCheck = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.89 0 5.26 1 7 2a1 1 0 0 1 1 1v7z"/><path d="m9 12 2 2 4-4"/></svg>
  const TrendingUp = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  const Package = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  const Store = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
  const MapPin = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>

  return c.render(
    <div className="flex flex-col w-full bg-gray-50">
      
      {/* ================= HERO SECTION ================= */}
      <section className="overflow-hidden border-b border-gold-500/20 bg-navy-900">
        {/* MOBILE VIDEO BACKGROUND */}
        <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden md:hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover object-center">
            <source src="https://emas.pasdigi.id/videos/home-hero-clean.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-5 bottom-8">
            <a href="/products" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-4 text-base font-bold text-navy-900 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all active:scale-95">
              Lihat Katalog Emas <ChevronRight />
            </a>
          </div>
        </div>

        {/* DESKTOP BACKGROUND */}
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
              <a href="/products" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-7 py-4 text-base font-bold text-navy-950 shadow-[0_16px_34px_-22px_rgba(212,168,75,0.75)] transition-all hover:-translate-y-0.5 hover:bg-gold-400">
                Lihat Katalog Emas <ChevronRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HARGA LOGAM MULIA ================= */}
      <section id="harga-logam" className="container-main relative z-10 mt-8 md:-mt-16 mb-8 md:mb-16">
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
                {/* Kartu Emas */}
                <div className="relative overflow-hidden rounded-xl border p-5 shadow-sm border-gold-400/60 bg-[linear-gradient(135deg,#fff7db_0%,#f3c85f_42%,#8b650f_120%)]">
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
                    <div className="mt-4 rounded-xl bg-white/80 p-3 ring-1 ring-black/5 backdrop-blur-sm">
                      <p className="text-xs font-bold uppercase text-navy-500">Harga kemarin</p>
                      <p className="mt-1 text-base font-bold text-navy-900">Rp 1.450.000</p>
                    </div>
                  </div>
                </div>

                {/* Kartu Perak */}
                <div className="relative overflow-hidden rounded-xl border p-5 shadow-sm border-slate-300 bg-[linear-gradient(135deg,#ffffff_0%,#dce1e8_48%,#748091_120%)]">
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
                    <div className="mt-4 rounded-xl bg-white/80 p-3 ring-1 ring-black/5 backdrop-blur-sm">
                      <p className="text-xs font-bold uppercase text-navy-500">Harga kemarin</p>
                      <p className="mt-1 text-base font-bold text-navy-900">Rp 19.700</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4 border-t border-navy-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold leading-5 text-navy-500">Terakhir diupdate: {currentDate} WIB</p>
                <a href="/products" className="inline-flex items-center justify-center gap-1 rounded-xl border border-gold-300 px-4 py-2.5 text-sm font-bold text-gold-700 hover:bg-gold-50 transition-colors">
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

      {/* ================= PRODUK TERPOPULER ================= */}
      {/* Penggunaan py-16 memberikan gap atas-bawah yang pas agar tidak tabrakan */}
      <section className="py-12 md:py-20 bg-gray-50 border-t border-gray-100">
        <div className="container-main">
          <div className="flex justify-between items-end mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 font-serif">Produk Terpopuler</h2>
            <a href="/products" className="flex items-center gap-1 text-sm text-gold-600 font-bold hover:gap-2 transition-all">
              Lihat Semua <ChevronRight />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {popularProducts.map((p: any, i: number) => (
              <a 
                key={p.id} 
                href={`/products/${p.slug}`} 
                // KUNCI PERBAIKAN: flex flex-col h-full memastikan card memanjang secara elegan
                className={`flex flex-col h-full rounded-2xl p-4 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${
                  i === 1 
                  ? 'border-2 border-gold-400 bg-[linear-gradient(180deg,#FFF1C2_0%,#FFFFFF_44%,#FFF9EA_100%)] shadow-[0_18px_42px_-18px_rgba(212,168,75,0.9)] ring-2 ring-gold-100/90' 
                  : 'border border-gray-200 bg-white hover:border-gold-300'
                }`}
              >
                <div className="relative aspect-square w-full mb-4 bg-white/50 rounded-xl p-2 flex items-center justify-center mix-blend-multiply">
                  <img src={p.image_url || 'https://emas.pasdigi.id/images/lm.png'} className="h-full w-full object-contain" />
                  {i === 1 && (
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 px-2.5 py-1.5 text-[9px] font-extrabold uppercase text-navy-900 shadow-lg shadow-navy-900/20 rounded-b-xl">
                      Promo <span className="shrink-0 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] text-[#216B35]">-Rp 500Rb</span>
                    </span>
                  )}
                </div>
                
                {/* Flex-1 memaksa teks memenuhi sisa ruang */}
                <div className="flex-1 flex flex-col space-y-1">
                  {p.stock < 10 && <span className="inline-block self-start mb-1 text-[10px] bg-red-50 border border-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Stok Terbatas</span>}
                  <h3 className="font-bold text-sm text-navy-900 line-clamp-2 leading-snug">{p.name}</h3>
                  <p className="text-[10px] text-gray-500 font-medium">{p.stock + 1240} terjual</p>
                  
                  {/* mt-auto memastikan harga mentok di bawah card! Tidak akan nabrak keluar! */}
                  <div className="mt-auto pt-3">
                    {i === 1 && <p className="text-[10px] font-semibold text-gray-400 line-through mb-0.5">{formatRupiah(p.price + 500000)}</p>}
                    <p className={`font-bold text-base ${i === 1 ? 'text-gold-700 font-extrabold text-lg' : 'text-gold-600'}`}>{formatRupiah(p.price)}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BELI EMAS DI SINI ================= */}
      {/* Ditambahkan padding besar py-16 (Mobile) & py-24 (Desktop) untuk memecah rapat */}
      <section className="bg-navy-900 py-16 md:py-24">
        <div className="container-main">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gold-400 font-serif">Beli Emas Di Sini</h2>
            <p className="text-navy-300 text-sm md:text-base mt-3">Standar keamanan tertinggi untuk masa depan Anda.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: 'Terjamin Asli', desc: 'Sertifikasi LBMA standar global.', icon: <ShieldCheck /> },
              { title: 'Harga Kompetitif', desc: 'Update harga real-time harian.', icon: <TrendingUp /> },
              { title: 'Pengiriman Aman', desc: 'Layanan penuh se-Indonesia.', icon: <Package /> },
              { title: 'Butik Fisik', desc: 'Fasilitas pengambilan di butik resmi.', icon: <Store /> },
            ].map((f) => (
              <div key={f.title} className="bg-navy-800/50 border border-navy-700 rounded-2xl p-5 md:p-6 hover:border-gold-500/50 transition-colors">
                <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center mb-4 text-gold-400">
                  {f.icon}
                </div>
                <h4 className="text-white font-bold text-sm md:text-base mb-2">{f.title}</h4>
                <p className="text-navy-300 text-xs md:text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LOKASI BUTIK & WAWASAN ================= */}
      {/* Background disetel penuh ke putih, tanpa margin di akhir agar menyatu mulus ke footer */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-main flex flex-col gap-16 md:gap-24">
          
          {/* LOKASI BUTIK */}
          <div>
            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy-900 font-serif">Lokasi Butik</h2>
                <p className="text-gray-500 text-sm mt-2">Kunjungi jaringan butik resmi kami di kota Anda.</p>
              </div>
              <a href="/boutiques" className="hidden sm:flex items-center gap-1 text-sm text-gold-600 font-bold hover:gap-2 transition-all pb-1">
                Lihat Semua <ChevronRight />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {boutiques.map((b: any) => (
                <a key={b.id} href={b.google_maps_url || '#'} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col hover:border-gold-400 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 mb-3 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                    <MapPin />
                  </div>
                  <h5 className="font-bold text-navy-900 text-sm">{b.city}</h5>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{b.address}</p>
                </a>
              ))}
            </div>
          </div>

          {/* WAWASAN (ARTIKEL) */}
          <div>
            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-navy-900 font-serif">Wawasan Investasi</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { title: 'Kurban Nanti, Siapinnya Bisa dari Sekarang Lewat Nabung Emas', img: 'https://emas.pasdigi.id/images/banner-2.png' },
                { title: 'Buyback Emas ANTAM: Harga Ngikut Hari Transaksi, Bukan Tahun Produksi', img: 'https://emas.pasdigi.id/images/banner-3.jpg' },
                { title: 'Gempita Hari Raya Idul Fitri 1447 H / 2026', img: 'https://emas.pasdigi.id/images/banner-idul-fitri.webp' }
              ].map((a, i) => (
                <a key={i} href="/articles" className="block border border-gray-200 rounded-3xl overflow-hidden group hover:shadow-xl transition-all bg-white">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <span className="absolute top-4 left-4 bg-navy-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 tracking-wider">ARTIKEL</span>
                    <img src={a.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-navy-900 text-base mb-3 group-hover:text-gold-600 transition-colors line-clamp-2 leading-snug">{a.title}</h3>
                    <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">Banyak orang punya niat untuk berkurban saat Hari Raya Iduladha. Tapi jujur aja, kadang persiapannya baru disadari ketika sudah dekat...</p>
                    <span className="text-sm font-bold text-gold-600 flex items-center gap-1 group-hover:gap-2 transition-all">Baca Selengkapnya <ChevronRight /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  )
})
