import { useState } from 'hono/jsx'

export default function ProductCatalog({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('newest')

  // Logika Filter & Sorting
  let filteredProducts = initialProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'ALL' || p.category_id === selectedCategory
    return matchSearch && matchCategory
  })

  if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* ========================================== */}
      {/* SIDEBAR FILTER */}
      {/* ========================================== */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        
        {/* Pencarian */}
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-2">Cari Produk</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari emas..." 
              value={search}
              onInput={(e: any) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all shadow-sm"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-3">Kategori</label>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setSelectedCategory('ALL')}
              className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === 'ALL' ? 'bg-navy-900 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Semua Produk
            </button>
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id ? 'bg-navy-900 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Urutkan Berdasarkan */}
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-3">Urutkan Harga</label>
          <select 
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all shadow-sm cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
          </select>
        </div>

      </aside>

      {/* ========================================== */}
      {/* GRID PRODUK */}
      {/* ========================================== */}
      <div className="flex-1">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <h3 className="text-lg font-bold text-navy-900 mb-1">Produk Tidak Ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba gunakan kata kunci pencarian atau kategori lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <a href={`/products/${product.slug}`} key={product.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gold-300 transition-all duration-300 flex flex-col h-full">
                
                {/* Gambar Produk */}
                <div className="aspect-square bg-gray-50 relative p-6 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                  <img 
                    src={product.image_url || 'https://emas.pasdigi.id/images/lm.png'} 
                    alt={product.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" 
                  />
                  {product.stock <= 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      Habis
                    </div>
                  )}
                </div>

                {/* Detail Produk */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs font-bold text-gold-600 mb-1 tracking-wider uppercase">{product.kadar || '99.99%'}</p>
                  <h3 className="text-navy-900 font-bold text-base mb-1 line-clamp-2 group-hover:text-gold-600 transition-colors">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{product.weight_gram} Gram</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-lg font-bold text-navy-900">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-600 group-hover:bg-gold-400 group-hover:text-navy-900 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
