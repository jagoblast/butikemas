import { useState, useEffect } from 'hono/jsx'

export default function AdminProductList() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ambil data produk saat komponen dimuat
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      
      if (res.ok && data.success) {
        setProducts(data.data)
      } else {
        setError(data.message || 'Gagal memuat data produk')
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()

      if (res.ok && data.success) {
        // Hapus produk dari state agar hilang dari tabel tanpa perlu refresh halaman
        setProducts(products.filter(p => p.id !== id))
        alert('Produk berhasil dihapus.')
      } else {
        alert(data.message || 'Gagal menghapus produk.')
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan saat menghapus.')
    }
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka)
  }

  if (loading) {
    return <div className="p-12 text-center text-slate-500 animate-pulse">Memuat data produk...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl">{error}</div>
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="p-4 font-semibold">Nama Produk</th>
              <th className="p-4 font-semibold">Harga</th>
              <th className="p-4 font-semibold">Stok</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Belum ada produk yang ditambahkan.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{product.name}</td>
                  <td className="p-4">{formatRupiah(product.price)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock} Pcs
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <a 
                        href={`/admin/products/${product.id}`} 
                        className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </a>
                      <span className="text-slate-300">|</span>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 font-semibold hover:text-red-800 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
