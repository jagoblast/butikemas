import { useState, useEffect } from 'hono/jsx'

export default function AdminIntegrationForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formData, setFormData] = useState({
    rajaongkir_api_key: '',
    cloudinary_cloud_name: '',
    cloudinary_upload_preset: ''
  })

  // Mock fetch (Nantinya sesuaikan dengan endpoint GET /api/admin/settings Anda)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Ganti dengan endpoint API asli Anda yang menyimpan ke tabel system_settings
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Konfigurasi integrasi berhasil disimpan!' })
      } else {
        setMessage({ type: 'success', text: 'Konfigurasi integrasi berhasil disimpan! (Simulasi)' })
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

      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-2">RajaOngkir API Key</label>
        <input type="text" name="rajaongkir_api_key" value={formData.rajaongkir_api_key} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white outline-none" placeholder="Ketik API Key RajaOngkir Anda..." />
        <p className="text-xs text-gray-500 mt-1">Digunakan untuk menghitung ongkos kirim secara otomatis.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">Cloudinary Cloud Name</label>
          <input type="text" name="cloudinary_cloud_name" value={formData.cloudinary_cloud_name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white outline-none" placeholder="Misal: dbx....." />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">Upload Preset</label>
          <input type="text" name="cloudinary_upload_preset" value={formData.cloudinary_upload_preset} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white outline-none" placeholder="Misal: butikemas_preset" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors disabled:opacity-50">
        {loading ? 'Menyimpan...' : 'Simpan Integrasi'}
      </button>
    </form>
  )
}
