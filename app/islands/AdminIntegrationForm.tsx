import { useState, useEffect } from 'hono/jsx'

export default function AdminIntegrationForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formData, setFormData] = useState({
    cloud_name: '',
    upload_preset: ''
  })

  // (Opsional) Fetch setting yang sudah ada dari DB saat komponen dimuat
  useEffect(() => {
    // fetch('/api/admin/settings/CLOUDINARY_CREDENTIALS').then(...) 
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // API ini harus Anda buat/sesuaikan untuk INSERT/UPDATE ke tabel system_settings
      const payload = {
        setting_key: 'CLOUDINARY_CREDENTIALS',
        setting_data: JSON.stringify({
          cloud_name: formData.cloud_name,
          upload_preset: formData.upload_preset
        })
      }

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: 'Kredensial Cloudinary berhasil disimpan ke Database D1!' })
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal menyimpan konfigurasi.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message && (
        <div className={`p-4 rounded-xl border text-sm font-medium ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">Cloudinary Cloud Name</label>
          <input type="text" name="cloud_name" value={formData.cloud_name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white outline-none" placeholder="Misal: dbx....." />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">Upload Preset (Unsigned)</label>
          <input type="text" name="upload_preset" value={formData.upload_preset} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white outline-none" placeholder="Misal: butikemas_preset" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors disabled:opacity-50">
        {loading ? 'Menyimpan...' : 'Simpan Kredensial Cloudinary'}
      </button>
    </form>
  )
}
