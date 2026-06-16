import { useState } from 'hono/jsx'

export default function AdminArticleForm({ initialData }: { initialData?: any }) {
  const isEditMode = !!initialData

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    cover_url: initialData?.cover_url || '',
    is_published: initialData?.is_published !== undefined ? initialData.is_published : 1,
    // author_id biasanya disuntikkan di sisi backend/API melalui session, 
    // namun jika API Anda membutuhkannya dari payload:
    author_id: initialData?.author_id || 'admin-id' 
  })

  const [status, setStatus] = useState<{ type: 'error' | 'success' | 'loading' | '', message: string }>({ type: '', message: '' })

  const handleTitleChange = (e: any) => {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    setFormData({ ...formData, title, slug: isEditMode ? formData.slug : slug })
  }

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value 
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Menyimpan artikel...' })

    const url = isEditMode ? `/api/admin/articles/${initialData.id}` : '/api/admin/articles'
    const method = isEditMode ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus({ type: 'success', message: 'Artikel berhasil disimpan!' })
        if (!isEditMode) {
          window.location.href = '/admin/articles'
        }
      } else {
        setStatus({ type: 'error', message: data.message || 'Gagal menyimpan artikel.' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Terjadi kesalahan sistem.' })
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

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-1.5">Judul Artikel</label>
          <input 
            name="title" 
            type="text" 
            value={formData.title} 
            onInput={handleTitleChange} 
            required 
            placeholder="Contoh: Manfaat Investasi Emas Jangka Panjang"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-navy-900 mb-1.5">URL Slug</label>
          <input 
            name="slug" 
            type="text" 
            value={formData.slug} 
            onInput={handleChange} 
            required 
            placeholder="manfaat-investasi-emas"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" 
          />
        </div>

        {/* Menggunakan cover_url */}
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-1.5">URL Gambar Cover (cover_url)</label>
          <input 
            name="cover_url" 
            type="text" 
            value={formData.cover_url} 
            onInput={handleChange} 
            placeholder="https://emas.pasdigi.id/images/banner-2.png"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" 
          />
          {formData.cover_url && (
            <div className="mt-3 w-48 h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
              <img src={formData.cover_url} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Field Excerpt Sesuai Schema */}
        <div>
          <label className="block text-sm font-bold text-navy-900 mb-1.5">Kutipan Singkat (Excerpt)</label>
          <textarea 
            name="excerpt" 
            value={formData.excerpt} 
            onInput={handleChange} 
            rows={3} 
            placeholder="Ringkasan atau kalimat pembuka artikel yang menarik..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-navy-900 mb-1.5">Isi Konten Artikel</label>
          <textarea 
            name="content" 
            value={formData.content} 
            onInput={handleChange} 
            required 
            rows={10} 
            placeholder="Tulis isi artikel lengkap di sini..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all resize-y"
          ></textarea>
        </div>

        <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              name="is_published" 
              checked={formData.is_published === 1} 
              onChange={handleChange} 
              className="w-5 h-5 text-gold-500 rounded border-gray-300 focus:ring-gold-500 cursor-pointer"
            />
          </div>
          <div>
            <span className="font-bold text-navy-900 text-sm block">Publikasikan Artikel</span>
            <span className="text-xs text-gray-500 block">Jika dicentang, artikel akan langsung terlihat oleh pengunjung website.</span>
          </div>
        </label>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
        <a href="/admin/articles" className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
          Batal
        </a>
        <button type="submit" disabled={status.type === 'loading'} className="px-8 py-3 text-sm font-bold text-navy-900 bg-[#C99738] hover:bg-[#b38632] rounded-xl transition-all shadow-sm disabled:opacity-50">
          {status.type === 'loading' ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
        </button>
      </div>
    </form>
  )
}
