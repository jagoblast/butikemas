import { useState, useEffect } from 'hono/jsx'

export default function CustomerProfile() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<{ type: 'success'|'error'|'loading'|'', message: string }>({ type: '', message: '' })

  // Ambil profil diri sendiri saat halaman dimuat
  useEffect(() => {
    fetch('/api/customer/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormData({
            name: data.data.name || '',
            email: data.data.email || '', // Email biasanya readonly (tidak bisa diedit)
            phone: data.data.phone || '',
            address: data.data.address || ''
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Menyimpan perubahan...' })

    try {
      const res = await fetch('/api/customer/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus({ type: 'success', message: 'Profil berhasil diperbarui!' })
      } else {
        setStatus({ type: 'error', message: data.message || 'Gagal memperbarui profil.' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Terjadi kesalahan jaringan.' })
    }
  }

  if (loading) return <div className="py-8 text-center text-gray-500 animate-pulse">Memuat profil...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {status.message && (
        <div className={`p-4 rounded-xl text-sm font-semibold border ${
          status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 
          status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
        }`}>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Nama Lengkap</label>
          <input name="name" type="text" value={formData.name} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Alamat Email (Tidak dapat diubah)</label>
          <input name="email" type="email" value={formData.email} disabled className="w-full bg-gray-100 text-gray-500 border border-gray-200 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Nomor HP (WhatsApp aktif)</label>
          <input name="phone" type="tel" value={formData.phone} onInput={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Alamat Pengiriman Lengkap</label>
          <textarea name="address" rows={4} value={formData.address} onInput={handleChange} placeholder="Masukkan nama jalan, RT/RW, kelurahan, kecamatan, dan kode pos" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all resize-none"></textarea>
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={status.type === 'loading'} className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-navy-900 bg-gold-400 hover:bg-gold-500 rounded-xl transition-all disabled:opacity-50 shadow-sm">
          {status.type === 'loading' ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  )
}
