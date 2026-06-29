import { useState, useRef, useEffect } from 'hono/jsx'

// Helper Format
const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
function formatCount(value: number) {
  if (value >= 1000) {
    const compact = value / 1000
    return `${compact % 1 === 0 ? compact.toFixed(0) : compact.toFixed(1).replace('.', ',')}rb`
  }
  return String(value)
}

// Ikon Murni 
const SearchIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
const ArrowUpDown = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
const Check = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
const Star = ({ className }: { className?: string }) => <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const BadgePercent = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m15 9-6 6"/><path d="M9 9h.01"/><path d="M15 15h.01"/></svg>

const SORT_OPTIONS = [
  { value: 'bestseller', label: 'Terlaris' },
  { value: 'newest',     label: 'Terbaru' },
  { value: 'price-desc', label: 'Harga Tertinggi' },
  { value: 'price-asc',  label: 'Harga Terendah' },
]

export default function ProductCatalog({ initialProducts, categories: rawCategories }: { initialProducts: any[], categories: any[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('bestseller')
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  const categories = [
    { value: 'all', label: 'Semua' },
    ...rawCategories.map((c) => ({ value: c.id, label: c.name }))
  ]

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  // Fungsi Helper Kalkulasi Promo Asli dari Database
  const getPromoDetails = (product: any) => {
    if (!product.promo_discount_value) return null;
    
    let discountAmount = 0;
    let discountStr = '';
    
    if (product.promo_discount_type === 'PERCENTAGE') {
      discountAmount = product.price * (product.promo_discount_value / 100);
      if (product.promo_max_discount && discountAmount > product.promo_max_discount) {
        discountAmount = product.promo_max_discount;
      }
      discountStr = `-${product.promo_discount_value}%`;
    } else {
      discountAmount = product.promo_discount_value;
      discountStr = `-Rp ${formatCount(product.promo_discount_value)}`;
    }
    
    const finalPrice = Math.max(0, product.price - discountAmount);
    return { 
      finalPrice, 
      discountStr, 
      originalPrice: product.price, 
      promoName: product.promo_name || 'Promo Spesial' 
    };
  }

  const filtered = initialProducts
    .filter((p) => category === 'all' || p.category_id === category)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      // Pastikan sorting menggunakan HARGA FINAL setelah dipotong promo (jika ada)
      const promoA = getPromoDetails(a);
      const promoB = getPromoDetails(b);
      const priceA = promoA ? promoA.finalPrice : a.price;
      const priceB = promoB ? promoB.finalPrice : b.price;

      if (sort === 'price-asc') return priceA - priceB
      if (sort === 'price-desc') return priceB - priceA
      if (sort === 'bestseller') return ((b.stock + 1200) || 0) - ((a.stock + 1200) || 0)
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return 0
    })

  return (
    <section className="min-w-0 overflow-x-hidden">
      {/* Search Bar */}
      <div className="relative mb-5">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
        <input
          id="product-search"
          type="text"
          placeholder="Cari koleksi emas..."
          value={search}
          onInput={(e: any) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-navy-200 rounded-2xl text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      <div className="mb-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.value}
                role="tab"
                aria-selected={category === cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                  category === cat.value
                    ? 'bg-[#D4A84B] text-navy-900 border-[#D4A84B] shadow-sm'
                    : 'bg-white text-navy-600 border-navy-200 hover:border-[#D4A84B] hover:text-navy-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full shrink-0 sm:w-auto" ref={sortRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-3 text-sm font-semibold text-navy-700 shadow-sm transition-colors hover:border-gold-400 hover:text-navy-900 sm:w-auto"
          >
            <ArrowUpDown className="w-4 h-4" />
            Urutkan
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-full overflow-hidden rounded-xl border border-navy-200 bg-white shadow-lg animate-in sm:min-w-[180px]">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSort(opt.value); setSortOpen(false) }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                    sort === opt.value ? 'bg-gold-50 text-gold-700 font-semibold' : 'text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  {opt.label}
                  {sort === opt.value && <Check className="w-4 h-4 text-gold-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid Produk */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-navy-400">
          <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-navy-600">Produk tidak ditemukan</p>
          <p className="text-sm mt-1">Coba kata kunci atau kategori yang berbeda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const isOutOfStock = product.stock === 0
            
            // LOGIKA PROMO NYATA (Bukan Dummy Lagi!)
            const promo = getPromoDetails(product)
            const hasPromo = promo !== null

            const displayRating = Number(product.display_rating) || 5
            const soldCount = product.stock + 1200 // Mock indikator terjual, bisa diganti nanti

            return (
              <article
                key={product.id}
                className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  hasPromo
                    ? 'border-2 border-gold-400 bg-[linear-gradient(180deg,#FFF1C2_0%,#FFFFFF_44%,#FFF9EA_100%)] shadow-[0_18px_42px_-18px_rgba(212,168,75,0.9)] ring-2 ring-gold-100/90 hover:shadow-[0_22px_52px_-18px_rgba(184,145,47,0.95)]'
                    : 'border-navy-100/80 hover:shadow-navy-100/70'
                }`}
              >
                <a href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-square bg-navy-900 overflow-hidden">
                    <img
                      src={product.image_url || 'https://emas.pasdigi.id/images/metal-gold.jpg'}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute right-3 top-3 truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900 shadow-sm ${hasPromo ? 'max-w-[58%]' : 'max-w-[75%]'}`}>
                      {product.category_name || 'Kategori'}
                    </div>
                    {hasPromo && (
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 px-3 py-2 text-[11px] font-extrabold uppercase text-navy-900 shadow-lg shadow-navy-900/20">
                        <span className="inline-flex items-center gap-1 truncate"><BadgePercent className="shrink-0 h-3.5 w-3.5" /> {promo.promoName}</span>
                        <span className="shrink-0 rounded-full bg-white/90 px-2 py-0.5 text-[10px] text-[#2E7D32]">{promo.discountStr}</span>
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-sm font-semibold text-white bg-navy-900 px-3 py-1.5 rounded-full">Stok Habis</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between w-full pb-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-gold-500" />
                        <span className="text-xs font-bold text-navy-900">{displayRating.toFixed(1)}</span>
                        <span className="text-[11px] font-medium text-navy-500">({product.review_count || 0})</span>
                      </div>
                      <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-700">
                        {formatCount(soldCount)} terjual
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-navy-900 text-sm leading-snug line-clamp-2">
                      {product.name}
                    </h3>

                    <div className={`pt-1 flex flex-col justify-end min-h-[40px] ${hasPromo ? 'px-0.5' : ''}`}>
                      {hasPromo ? (
                        <p className="mb-1 text-[11px] font-semibold leading-tight text-[#888888] line-through">
                          {formatRupiah(promo.originalPrice)}
                        </p>
                      ) : (
                        <div className="h-[11px] mb-0.5" aria-hidden="true" />
                      )}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-[18px] font-extrabold text-gold-700 leading-tight">
                          {formatRupiah(hasPromo ? promo.finalPrice : product.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
