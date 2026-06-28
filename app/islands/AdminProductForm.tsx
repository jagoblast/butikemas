import { useState, useEffect } from 'hono/jsx'

export default function AdminProductForm({ productId }: { productId?: string }) {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!productId)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    weight_gram: '',
    stock: '',
    category_id: '1',
    image_url: ''
  })

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/admin/products/${productId}`)
          const data = await res.json()
          if (res.ok && data.success) {
            const p = data.data
            setFormData({
              name: p.name || '',
              slug: p.slug || '',
              description: p.description || '',
              price: p.price?.toString() || '',
              weight_gram: p.weight_gram?.toString() || '',
              stock: p.stock?.toString() || '',
              category_id: p.category_id?.toString() || '1',
              image_url: p.image_url || ''
            })
          } else {
            setMessage({ type: 'error', text: 'Gagal memuat data produk.' })
          }
        } catch (error) {
          setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan saat memuat data.' })
        } finally {
          setInitialLoading(false)
        }
      }
      fetchProduct()
    }
  }, [productId])

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      if (name === 'name' && !productId) {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }
      return newData
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        weight_gram: Number(formData.weight_gram),
        stock: Number(formData.stock),
        category_id: Number(formData.category_id)
      }

      const method = productId ? 'PUT' : 'POST'
      const endpoint = productId ? `/api/admin/products/${productId}` : '/api/admin/products'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: productId ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!' })
        if (!productId) {
          setFormData({ name: '', slug: '', description: '', price: '', weight_gram: '', stock: '', category_id: '1', image_url: '' })
        } else {
          setTimeout(() => {
            window.location.href = '/admin/products'
          }, 1500)
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal menyimpan produk.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan/server.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen? Data yang dihapus tidak dapat dikembalikan.')) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      const data = await res.json()

      if (res.ok && data.success) {
        alert('Produk berhasil dihapus.')
        window.location.href = '/admin/products'
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal menghapus produk.' })
        setLoading(false)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan/server.' })
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="py-12 text-center text-navy-500 animate-pulse">Memuat data produk...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {message && (
        <div className={`p-4 rounded-xl border font-medium text-sm ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Nama Produk</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none transition-all" placeholder="Contoh: Logam Mulia 10 Gram" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Slug (URL)</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-100 outline-none" placeholder="logam-mulia-10-gram" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Harga (Rp)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none transition-all" placeholder="10500000" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Stok (Pcs)</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none transition-all" placeholder="100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Berat (Gram)</label>
              <input type="number" step="0.01" name="weight_gram" value={formData.weight_gram} onChange={handleInputChange} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none transition-all" placeholder="10" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Kategori ID</label>
              <input type="number" name="category_id" value={formData.category_id} onChange={handleInputChange} required min="1" className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">URL Gambar Eksternal</label>
            <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none transition-all" placeholder="https://contoh.com/gambar-emas.jpg" />
            
            {formData.image_url && (
              <div className="mt-4 p-2 bg-gray-50 border border-navy-100 rounded-xl max-w-xs">
                <p className="text-xs text-navy-500 mb-2 font-medium">Pratinjau Gambar:</p>
                <img src={formData.image_url} alt="Preview" className="w-full h-32 object-contain rounded-lg bg-white" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Deskripsi Produk</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} className="w-full px-4 py-3 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none transition-all resize-none" placeholder="Tuliskan spesifikasi, sertifikasi, atau detail keaslian produk di sini..."></textarea>
          </div>
        </div>

      </div>

      <div className="pt-6 border-t border-navy-100 flex items-center justify-between">
        {productId ? (
          <button type="button" onClick={handleDelete} disabled={loading} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50">
            Hapus Produk
          </button>
        ) : (
          <div></div> 
        )}
        
        <div className="flex items-center gap-3">
          <a href="/admin/products" className="px-5 py-2.5 rounded-xl font-semibold text-sm text-navy-600 hover:bg-navy-50 transition-colors">Batal</a>
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gold-400 text-navy-900 hover:bg-gold-500 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-navy-900/20 border-t-navy-900 rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              productId ? 'Simpan Perubahan' : 'Tambah Produk Baru'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
