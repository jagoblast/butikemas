import { createRoute } from 'honox/factory'
import ProductDetailActions from '../../islands/ProductDetailActions'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')

  // 1. Ambil Data Produk Utama
  const product = await c.env.DB.prepare(
    'SELECT * FROM products WHERE slug = ? AND is_active = 1'
  ).bind(slug).first()

  if (!product) {
    return c.render(
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-navy-900">Produk tidak ditemukan</h1>
        <a href="/products" className="text-gold-600 hover:underline">Kembali ke Katalog</a>
      </div>,
      { title: 'Produk Tidak Ditemukan' }
    )
  }

  // 2. Ambil Produk Terkait (Berdasarkan Kategori)
  const { results: relatedProducts } = await c.env.DB.prepare(
    'SELECT * FROM products WHERE category_id = ? AND id != ? AND is_active = 1 LIMIT 4'
  ).bind(product.category_id, product.id).all()

  // 3. Ambil Ulasan Pelanggan (Opsional, jika tabel reviews sudah ada)
  const { results: reviews } = await c.env.DB.prepare(
    'SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT 5'
  ).bind(product.id).all()

  // Helper Formatter
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  }

  // Pengganti Lucide Icons
  const ShieldCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gold-500 flex-shrink-0"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.89 0 5.26 1 7 2a1 1 0 0 1 1 1v7z"/><path d="m9 12 2 2 4-4"/></svg>
  const ShoppingCartFallback = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-14 w-14 opacity-50"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>

  const rating = product.rating || 5
  const roundedRating = Math.round(rating)

  return c.render(
    // Menggunakan class persis seperti di page.tsx asli Anda
    <div className="bg-surface min-h-screen">
      <main className="container-main py-8 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* ================= SECTION KIRI: GAMBAR ================= */}
          <section className="space-y-4">
            <div className="aspect-square bg-white border border-navy-100 rounded-2xl overflow-hidden flex items-center justify-center p-8 shadow-sm relative">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
                  <ShoppingCartFallback />
                </div>
              )}
            </div>
          </section>

          {/* ================= SECTION KANAN: DETAIL ================= */}
          <section className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-navy-900 text-gold-400 rounded-md text-[10px] font-bold mb-3 uppercase tracking-widest">
                {product.category_id || 'Emas Batangan'}
              </span>
              <h1 className="font-heading text-3xl text-navy-900 leading-tight font-bold">{product.name}</h1>
              
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <p className="font-heading text-2xl font-bold text-gold-600">{formatRupiah(product.price)}</p>
              </div>
            </div>

            {/* Island Interaktif: Tombol Beli & Tambah Keranjang */}
            <ProductDetailActions product={product} />

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-navy-200">
              {[
                { label: 'Kadar', value: product.kadar || '99.99%' },
                { label: 'Berat', value: `${product.weight_gram}g` },
                { label: 'Stok', value: product.stock > 0 ? `${product.stock} tersedia` : 'Habis', green: product.stock > 0 },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-navy-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">{item.label}</p>
                  <p className={`font-bold text-sm ${item.green ? 'text-green-600' : 'text-navy-900'}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-navy-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
              <ShieldCheck />
              <div>
                <p className="font-bold text-navy-900">Sertifikat Resmi Terjamin</p>
                <p className="text-xs text-navy-600 mt-1">Jaminan keaslian dengan standar internasional.</p>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-lg font-bold text-navy-900 mb-3 border-b border-navy-200 pb-2">Deskripsi</h2>
              <div className="text-navy-700 text-sm leading-relaxed space-y-4">
                <p>{product.description || 'Deskripsi produk belum tersedia.'}</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Berat: {product.weight_gram} gram</li>
                  <li>Kadar: {product.kadar || '99.99%'}</li>
                </ul>
              </div>
            </div>

            {/* Section Ulasan Pelanggan */}
            <div className="pt-8 border-t border-navy-200">
              <div className="mb-6 flex flex-col gap-3 border-b border-navy-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-heading text-2xl font-bold text-navy-900">Ulasan Pelanggan</h2>
                <div className="flex items-center gap-3 text-navy-700">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg key={index} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${index < roundedRating ? 'fill-gold-600 text-gold-600' : 'fill-navy-200 text-navy-200'}`}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold">{rating.toFixed(1)} · {reviews.length} ulasan</span>
                </div>
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <article key={review.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
                      <p className="font-semibold text-navy-900">{review.customer_name}</p>
                      <p className="mt-3 text-base leading-relaxed text-navy-600">{review.comment}</p>
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

        {/* ================= SECTION BAWAH: PRODUK TERKAIT ================= */}
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
                <a
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="w-[180px] shrink-0 bg-white border border-navy-200 rounded-2xl p-4 group hover:shadow-md transition-all duration-300"
                >
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
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <p className="text-gold-600 font-bold text-sm">{formatRupiah(item.price)}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>,
    { title: `${product.name} | Logam Mulia` }
  )
})
