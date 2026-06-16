import { createRoute } from 'honox/factory'
import ProductDetailActions from '../../islands/ProductDetailActions'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')

  // 1. Ambil data produk utama dari database D1
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

  // 2. Ambil produk terkait (Related) untuk bagian bawah
  const { results: relatedProducts } = await c.env.DB.prepare(
    'SELECT * FROM products WHERE category_id = ? AND id != ? AND is_active = 1 LIMIT 4'
  ).bind(product.category_id, product.id).all()

  // Helper format mata uang
  const formatRupiah = (angka: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)

  return c.render(
    <div className="bg-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Section Kiri: Gambar Produk */}
          <section>
            <div className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center p-8 shadow-sm">
              <img src={product.image_url || 'https://emas.pasdigi.id/images/lm.png'} alt={product.name} className="h-full w-full object-contain" />
            </div>
          </section>

          {/* Section Kanan: Detail & Aksi */}
          <section className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-navy-900 text-gold-400 rounded-md text-[10px] font-bold mb-3 uppercase tracking-widest">
                {product.category_id || 'Emas Batangan'}
              </span>
              <h1 className="text-3xl font-bold text-navy-900 leading-tight">{product.name}</h1>
              <p className="mt-3 text-2xl font-bold text-gold-600">{formatRupiah(product.price)}</p>
            </div>

            {/* Island Interaktif */}
            <ProductDetailActions product={product} />

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100">
              {[
                { label: 'Kadar', value: product.kadar || '99.99%' },
                { label: 'Berat', value: `${product.weight_gram}g` },
                { label: 'Stok', value: product.stock > 0 ? `${product.stock} tersedia` : 'Habis' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">{item.label}</p>
                  <p className="font-bold text-sm text-navy-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-bold text-navy-900 mb-3">Deskripsi</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          </section>
        </div>

        {/* Produk Terkait */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Produk Terkait</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item: any) => (
                <a key={item.id} href={`/products/${item.slug}`} className="p-4 border border-gray-200 rounded-2xl hover:shadow-md transition-all">
                  <img src={item.image_url || 'https://emas.pasdigi.id/images/lm.png'} className="h-32 mx-auto object-contain mb-3" />
                  <p className="font-bold text-sm truncate">{item.name}</p>
                  <p className="text-gold-600 font-bold text-sm">{formatRupiah(item.price)}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>,
    { title: product.name }
  )
})
