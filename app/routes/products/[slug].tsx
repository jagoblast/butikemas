import { createRoute } from 'honox/factory'
import ProductDetailActions from '../../islands/ProductDetailActions'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')

  const product = await c.env.DB.prepare(
    'SELECT * FROM products WHERE slug = ? AND is_active = 1'
  ).bind(slug).first()

  if (!product) {
    return c.render(
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-navy-900">Produk tidak ditemukan</h1>
      </div>
    )
  }

  // Format Rupiah
  const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  
  // Memperbaiki string Kategori (Misal: "CAT-EMAS-BATANGAN" menjadi "EMAS BATANGAN")
  const categoryName = (product.category_id || 'EMAS BATANGAN').replace('CAT-', '').replace(/-/g, ' ')

  const Shield = () => <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
  const Star = ({ active }: { active?: boolean }) => <svg className={`w-4 h-4 ${active ? 'fill-gold-600 text-gold-600' : 'fill-gray-200 text-gray-200'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>

  return c.render(
    <div className="bg-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* KIRI: Gambar Produk */}
          <section className="sticky top-28">
            <div className="aspect-square bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center p-4">
              <img src={product.image_url || 'https://emas.pasdigi.id/images/lm.png'} alt={product.name} className="h-full w-full object-contain" />
            </div>
          </section>

          {/* KANAN: Informasi Produk */}
          <section className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 bg-navy-900 text-gold-400 rounded text-[10px] font-bold mb-3 uppercase tracking-widest">
                {categoryName}
              </span>
              <h1 className="text-3xl font-bold text-navy-900 font-serif leading-tight">{product.name}</h1>
              <p className="mt-2 text-2xl font-bold text-gold-600">{formatRupiah(product.price)}</p>
            </div>

            {/* Spek Produk */}
            <div className="grid grid-cols-3 gap-4 py-5 border-y border-gray-100">
              <div className="text-center border-r border-gray-100">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Kadar</p>
                <p className="font-bold text-sm text-navy-900">{product.kadar || '99.99%'}</p>
              </div>
              <div className="text-center border-r border-gray-100">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Berat</p>
                <p className="font-bold text-sm text-navy-900">{product.weight_gram}g</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Stok</p>
                {/* Warna stok hijau seperti aslinya */}
                <p className="font-bold text-sm text-green-600">{product.stock} tersedia</p>
              </div>
            </div>

            {/* Kotak LBMA Certified */}
            <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-start gap-4 shadow-sm">
              <Shield />
              <div>
                <p className="font-bold text-navy-900 text-sm">LBMA Certified</p>
                <p className="text-xs text-gray-500 mt-1">Jaminan keaslian dengan standar internasional.</p>
              </div>
            </div>

            {/* Deskripsi dengan format List */}
            <div>
              <h2 className="text-base font-bold text-navy-900 mb-3">Deskripsi</h2>
              <div className="text-gray-700 text-sm leading-relaxed space-y-4">
                <p>{product.description || `Emas Batangan - ${product.weight_gram} gram asli ANTAM LM dengan kadar 99.99%. Produk emas batangan ini disiapkan untuk katalog uji coba dengan data dari web customer lama.`}</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Kategori: {categoryName}</li>
                  <li>Berat: {product.weight_gram} gram</li>
                  <li>Kadar: {product.kadar || '99.99%'}</li>
                </ul>
              </div>
            </div>

            {/* Ulasan Pelanggan (Sesuai Gambar Asli) */}
            <div className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-bold text-navy-900">Ulasan Pelanggan</h2>
                <div className="flex items-center gap-2">
                  <div className="flex"><Star active/><Star active/><Star active/><Star active/><Star active/></div>
                  <span className="text-xs font-bold text-navy-900">5.0 <span className="text-gray-500 font-normal">· 23 ulasan</span></span>
                </div>
              </div>

              {/* Contoh Mock Review Sesuai Gambar */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-sm text-navy-900">Alexa Withona</p>
                  <p className="text-xs text-gray-400">26 Apr 2026, 01.40</p>
                </div>
                <div className="flex mb-3"><Star active/><Star active/><Star active/><Star active/><Star active/></div>
                <p className="text-sm text-gray-700 mb-4">Pesan melalui website, lalu pilih pengambilan langsung ke butik, beli langsung 3 keping 😍😍😍</p>
                <img src={product.image_url || 'https://emas.pasdigi.id/images/lm.png'} alt="Ulasan" className="h-24 w-24 object-cover rounded-lg border border-gray-200" />
              </div>
            </div>

          </section>
        </div>
      </main>

      {/* Memanggil Island Bottom Bar */}
      <ProductDetailActions product={product} />
    </div>,
    { title: `${product.name} - Logam Mulia` }
  )
})
