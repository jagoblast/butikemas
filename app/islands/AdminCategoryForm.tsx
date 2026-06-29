import { useState } from 'hono/jsx'

export default function AdminCategoryForm() {
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image_url: '' })
  const [loading, setLoading] = useState(false)

  // Otomatis generate slug dari nama
  const handleNameChange = (e: any) => {
    const name = e.target.value
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    setFormData({ ...formData, name, slug })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        window.location.href = '/admin/categories'
      } else {
        alert(data.message || 'Gagal menyimpan kategori')
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-navy-900 mb-1">Nama Kategori <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          required 
          value={formData.name} 
          onInput={handleNameChange}
          placeholder="Contoh: Emas Batangan"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gold-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-navy-900 mb-1">Slug URL <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          required 
          value={formData.slug} 
          onInput={(e: any) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="emas-batangan"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-gold-500 outline-none font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">Digunakan untuk URL (contoh: /kategori/emas-batangan)</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-navy-900 mb-1">Deskripsi Singkat</label>
        <textarea 
          rows={3} 
          value={formData.description} 
          onInput={(e: any) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tulis deskripsi kategori di sini..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gold-500 outline-none"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-bold text-navy-900 mb-1">URL Gambar</label>
        <input 
          type="url" 
          value={formData.image_url} 
          onInput={(e: any) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://domain.com/gambar.jpg"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gold-500 outline-none"
        />
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2.5 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Menyimpan...' : 'Simpan Kategori'}
        </button>
      </div>
    </form>
  )
}
