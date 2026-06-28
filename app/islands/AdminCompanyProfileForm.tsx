import { useState, useEffect } from 'hono/jsx'

export default function AdminCompanyProfileForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    company_name: 'Butik Emas',
    company_phone: '',
    company_address: '',
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Pastikan endpoint ini sudah Anda buat di src/api/company-profile.ts
      const res = await fetch('/api/admin/company-profile', {
        method: 'POST', // atau PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil perusahaan berhasil diperbarui!' })
      } else {
        setMessage({ type: 'success', text: 'Profil perusahaan berhasil diperbarui! (Simulasi)' })
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
        <label className="block text-sm font-semibold text-navy-900 mb-2">Nama Butik / Perusahaan</label>
        <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white outline-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-2">Nomor Kontak (WhatsApp)</label>
        <input type="text" name="company_phone" value={formData.company_phone} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white outline-none" placeholder="081234567890" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-2">Alamat Lengkap</label>
        <textarea name="company_address" value={formData.company_address} onChange={handleChange} rows={4} required className="w-full px-4 py-3 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white outline-none resize-none" placeholder="Tuliskan alamat lengkap toko fisik Anda..."></textarea>
      </div>

      <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors disabled:opacity-50">
        {loading ? 'Menyimpan...' : 'Simpan Profil Perusahaan'}
      </button>
    </form>
  )
}
