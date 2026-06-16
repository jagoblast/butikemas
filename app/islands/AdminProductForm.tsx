// app/islands/AdminProductForm.tsx
import { useState } from 'hono/jsx'

export default function AdminProductForm({ initialData }: { initialData?: any }) {
  // Jika initialData ada, berarti kita dalam mode Edit. Jika tidak, mode Tambah Baru.
  const isEditMode = !!initialData

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    category_id: initialData?.category_id || '',
    description: initialData?.description || '',
    weight_gram: initialData?.weight_gram || 0,
    kadar: initialData?.kadar || '99.99%',
  })
  
  const [status, setStatus] = useState<{ type: 'error' | 'success' | 'loading' | '', message: string }>({ type: '', message: '' })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ 
      ...formData, 
      [name]: name === 'price' || name === 'stock' || name === 'weight_gram' ? Number(value) : value 
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Memproses data...' })

    // Tentukan URL dan Metode HTTP berdasarkan mode
    const url = isEditMode ? `/api/admin/products/${initialData.id}` : '/api/admin/products'
    const method = isEditMode ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus({ type: 'success', message: data.message || 'Produk berhasil disimpan!' })
        // Jika mode tambah baru, kosongkan form setelah berhasil
        if (!isEditMode) {
          setFormData({ name: '', slug: '', price: 0, stock: 0, category_id: '', description: '', weight_gram: 0, kadar: '99.99%' })
        }
      } else {
        setStatus({ type: 'error', message: data.message || 'Gagal menyimpan produk.' })
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Terjadi kesalahan jaringan atau server.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status.message && (
        <div className={`p-4 rounded-xl text-sm font-semibold border ${
          status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 
          status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 
          'bg-blue-50 text-blue-600 border-blue-100'
        }`}>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-1.5">Nama Produk</label>
            <input name="name" type="text" value={formData.name} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none transition-all" placeholder="Contoh: Emas Antam 1 Gram" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-1.5">Slug URL</label>
            <input name="slug" type="text" value={formData.slug} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none transition-all" placeholder="Contoh: emas-antam-1-gram" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">Harga (Rp)</label>
              <input name="price" type="number" value={formData.price} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">Stok</label>
              <input name="stock" type="number" value={formData.stock} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-1.5">ID Kategori</label>
            <input name="category_id" type="text" value={formData.category_id} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" placeholder="Masukkan ID Kategori D1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">Berat (Gram)</label>
              <input name="weight_gram" type="number" step="0.01" value={formData.weight_gram} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">Kadar Emas</label>
              <input name="kadar" type="text" value={formData.kadar} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" placeholder="99.99%" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-1.5">Deskripsi Produk</label>
            <textarea name="description" value={formData.description} onInput={handleChange} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all resize-none"></textarea>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
        <a href="/admin/products" className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
          Batal
        </a>
        <button type="submit" disabled={status.type === 'loading'} className="px-6 py-2.5 text-sm font-bold text-navy-900 bg-gold-400 hover:bg-gold-500 rounded-xl transition-all disabled:opacity-50">
          {status.type === 'loading' ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Tambah Produk'}
        </button>
      </div>
    </form>
  )
}
