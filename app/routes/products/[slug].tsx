import { createRoute } from 'honox/factory'
import ProductDetailActions from '../../islands/ProductDetailActions'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')

  // 1. Ambil Data Produk & Kategori
  const product = await c.env.DB.prepare(`
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.is_active = 1
  `).bind(slug).first()

  if (!product) {
    return c.render(
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 bg-surface min-h-screen">
        <h1 className="text-2xl font-bold text-navy-900">Produk tidak ditemukan</h1>
        <a href="/products" className="text-gold-600 hover:underline font-bold">Kembali ke Katalog</a>
      </div>,
      { title: 'Produk Tidak Ditemukan' }
    )
  }

  // 2. Ambil Gambar Produk
  const { results: imagesData } = await c.env.DB.prepare(`
    SELECT image_url FROM product_images 
    WHERE product_id = ? 
    ORDER BY is_primary DESC, sort_order ASC
  `).bind(product.id).all()
  const images = imagesData.map((img: any) => img.image_url)

  // 3. Ambil Ulasan Pelanggan & Kalkulasi Rating
  const { results: reviews } = await c.env.DB.prepare(`
    SELECT r.*, u.name as reviewer_name 
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ? AND r.is_hidden = 0
    ORDER BY r.created_at DESC LIMIT 5
  `).bind(product.id).all()

  const { avg_rating, review_count } = await c.env.DB.prepare(`
    SELECT AVG(rating) as avg_rating, COUNT(id) as review_count 
    FROM reviews 
    WHERE product_id = ? AND is_hidden = 0
  `).bind(product.id).first() || { avg_rating: 5, review_count: 0 }

  // 4. Ambil Produk Terkait
  const { results: relatedProducts } = await c.env.DB.prepare(`
    SELECT p.*, 
      (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY is_primary DESC LIMIT 1) as image_url
    FROM products p
    WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
    LIMIT 4
  `).bind(product.category_id, product.id).all()

  // Helpers
  const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  const formatReviewDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr))
  }

  // Komponen Ikon (Lucide JSX)
  const ShoppingCartFallback = () => <svg className="h-14 w-14 opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
  const ShieldCheck = () => <svg className="w-8 h-8 text-gold-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.89 0 5.26 1 7 2a1 1 0 0 1 1 1v7z"/><path d="m9 12 2 2 4-4"/></svg>
  const ChevronRight = () => <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
  const StarIcon = ({ active, className = 'h-4 w-4' }: { active: boolean, className?: string }) => <svg className={`${className} ${active ? 'fill-gold-600 text-gold-600' : 'fill-navy-200 text-navy-200'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>

  const displayRating = Number(avg_rating) || 5
  const roundedRating = Math.round(displayRating)

  return c.render(
    <div className="bg-surface min-h-screen">
      <main className="container-main py-8 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* =========== BAGIAN KIRI: GAMBAR PRODUK =========== */}
          <section className="space-y-4">
            <div className="aspect-square bg-white border border-navy-100 rounded-2xl overflow-hidden flex items-center justify-center p-8 shadow-sm relative">
              {images[0] ? (
                <img src={images[0]} alt={product.name} className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                  <ShoppingCartFallback />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img: string, idx: number) => (
                  <div key={idx} className={`flex-shrink-0 w-20 h-20 bg-white border-2 rounded-xl p-2 relative overflow-hidden ${idx === 0 ? 'border-gold-400 shadow-sm' : 'border-navy-100'}`}>
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========== BAGIAN KANAN: DETAIL PRODUK =========== */}
          <section className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-navy-900 text-gold-400 rounded-md text-[10px] font-bold mb-3 uppercase tracking-widest">
                {product.category_name || 'Emas Batangan'}
              </span>
              <h1 className="font-heading text-3xl text-navy-900 leading-tight font-bold">{product.name}</h1>
              <div className="mt-3">
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="font-heading text-2xl font-bold text-gold-600">{formatRupiah(product.price)}</p>
                </div>
              </div>
            </div>

            {/* Tombol Aksi Keranjang / Beli (Island Component) */}
            <ProductDetailActions product={product} />

            {/* Spek Kadar, Berat, Stok */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-navy-200">
              {[
                { label: 'Kadar', value: product.kadar || '-' },
                { label: 'Berat', value: `${product.weight_gram}g` },
                { label: 'Stok', value: product.stock > 0 ? `${product.stock} tersedia` : 'Habis', green: product.stock > 0 },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-navy-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">{item.label}</p>
                  <p className={`font-bold text-sm ${item.green ? 'text-green-600' : 'text-navy-900'}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Sertifikat LBMA */}
            <div className="bg-white border border-navy-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
              <ShieldCheck />
              <div>
                <p className="font-bold text-navy-900">LBMA Certified / SNI</p>
                <p className="text-xs text-navy-600 mt-1">Jaminan keaslian dengan standar internasional.</p>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <h2 className="font-heading text-lg font-bold text-navy-900 mb-3 border-b border-navy-200 pb-2">Deskripsi</h2>
              <div className="text-navy-700 text-sm leading-relaxed space-y-4">
                <p>{product.description || 'Deskripsi produk belum tersedia.'}</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Kategori: {product.category_name}</li>
                  <li>Berat: {product.weight_gram} gram</li>
                  <li>Kadar: {product.kadar || '-'}</li>
                </ul>
              </div>
            </div>

            {/* Ulasan Pelanggan */}
            <div className="pt-8 border-t border-navy-200">
              <div className="mb-6 flex flex-col gap-3 border-b border-navy-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-heading text-2xl font-bold text-navy-900">Ulasan Pelanggan</h2>
                <div className="flex items-center gap-3 text-navy-700">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => <StarIcon key={index} active={index < roundedRating} />)}
                  </div>
                  <span className="text-sm font-semibold">{displayRating.toFixed(1)} · {review_count} ulasan</span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <article key={review.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-navy-900">{review.reviewer_name || 'Pelanggan'}</p>
                          <div className="mt-3 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => <StarIcon key={index} active={index < review.rating} />)}
                          </div>
                        </div>
                        <time className="shrink-0 text-right text-sm text-navy-500">
                          {formatReviewDate(review.created_at)}
                        </time>
                      </div>
                      {review.comment && <p className="mt-7 text-base leading-relaxed text-navy-600">{review.comment}</p>}
                      {review.image_url && (
                        <img src={review.image_url} alt="Foto ulasan" className="mt-5 aspect-[4/5] w-full max-w-[214px] rounded-lg border border-navy-100 object-cover" />
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-navy-100 bg-white p-6 text-sm text-navy-500 shadow-sm">
                  Belum ada ulasan pelanggan yang ditampilkan.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =========== SECTION BAWAH: PRODUK TERKAIT =========== */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-navy-900">Produk Terkait</h2>
              <a href="/products" className="text-gold-600 font-bold text-sm flex items-center gap-1 hover:text-gold-500 transition-colors">
                Lihat Semua <ChevronRight />
              </a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {relatedProducts.map((item: any) => (
                <a key={item.id} href={`/products/${item.slug}`} className="w-[180px] shrink-0 bg-white border border-navy-200 rounded-2xl p-4 group hover:shadow-md transition-all duration-300">
                  <div className="mb-4 aspect-square w-full overflow-hidden rounded-xl bg-surface flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                        <ShoppingCartFallback />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-navy-900 font-bold truncate">{item.name}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <p className="text-gold-600 font-bold text-sm">{formatRupiah(item.price)}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>,
    { title: `${product.name} | Logam Mulia Antam` }
  )
})
