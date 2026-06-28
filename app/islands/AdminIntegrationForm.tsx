import { useState, useEffect } from 'hono/jsx'

export default function AdminIntegrationForm() {
  const [loadingCloudinary, setLoadingCloudinary] = useState(false)
  const [loadingRajaongkir, setLoadingRajaongkir] = useState(false)
  const [loadingOmnipay, setLoadingOmnipay] = useState(false)
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [cloudinaryData, setCloudinaryData] = useState({ cloud_name: '', upload_preset: '' })
  const [rajaongkirData, setRajaongkirData] = useState({ api_key: '', tier: 'starter' })
  const [omnipayData, setOmnipayData] = useState({ api_key: '', project_id: '', callback_key: '' })

  useEffect(() => {
    // Idealnya melakukan fetch ke endpoint GET /api/admin/settings/... untuk pre-fill data form
  }, [])

  const saveSetting = async (key: string, data: any, setLoading: Function, successMsg: string) => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting_key: key, setting_data: JSON.stringify(data) })
      })
      const result = await res.json()
      if (res.ok) setMessage({ type: 'success', text: successMsg })
      else setMessage({ type: 'error', text: result.message || 'Gagal menyimpan konfigurasi.' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' })
    } finally {
      setLoading(false)
    }
  }

  const handleCloudinarySubmit = (e: any) => {
    e.preventDefault()
    saveSetting('CLOUDINARY_CREDENTIALS', cloudinaryData, setLoadingCloudinary, 'Kredensial Cloudinary berhasil disimpan!')
  }

  const handleRajaongkirSubmit = (e: any) => {
    e.preventDefault()
    saveSetting('RAJAONGKIR_CREDENTIALS', rajaongkirData, setLoadingRajaongkir, 'API Key RajaOngkir berhasil disimpan!')
  }

  const handleOmnipaySubmit = (e: any) => {
    e.preventDefault()
    saveSetting('OMNIPAYGATE_CREDENTIALS', omnipayData, setLoadingOmnipay, 'Kredensial Payment Gateway berhasil disimpan!')
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl border text-sm font-medium ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* KARTU 1: CLOUDINARY */}
      <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm">
        <h3 className="text-lg font-bold text-navy-900 mb-4">Integrasi Cloudinary (Gambar)</h3>
        <form onSubmit={handleCloudinarySubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Cloud Name</label>
              <input type="text" value={cloudinaryData.cloud_name} onChange={(e) => setCloudinaryData({...cloudinaryData, cloud_name: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Upload Preset</label>
              <input type="text" value={cloudinaryData.upload_preset} onChange={(e) => setCloudinaryData({...cloudinaryData, upload_preset: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none" />
            </div>
          </div>
          <button type="submit" disabled={loadingCloudinary} className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 disabled:opacity-50">
            {loadingCloudinary ? 'Menyimpan...' : 'Simpan Cloudinary'}
          </button>
        </form>
      </div>

      {/* KARTU 2: RAJAONGKIR */}
      <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm">
        <h3 className="text-lg font-bold text-navy-900 mb-4">Integrasi RajaOngkir (Ekspedisi)</h3>
        <form onSubmit={handleRajaongkirSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">API Key</label>
              <input type="text" value={rajaongkirData.api_key} onChange={(e) => setRajaongkirData({...rajaongkirData, api_key: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Tipe Akun (Tier)</label>
              <select value={rajaongkirData.tier} onChange={(e) => setRajaongkirData({...rajaongkirData, tier: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none">
                <option value="starter">Starter</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loadingRajaongkir} className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 disabled:opacity-50">
            {loadingRajaongkir ? 'Menyimpan...' : 'Simpan RajaOngkir'}
          </button>
        </form>
      </div>

      {/* KARTU 3: OMNIPAYGATE (PAYMENT GATEWAY) */}
      <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm">
        <h3 className="text-lg font-bold text-navy-900 mb-4">Integrasi Omnipaygate (Pembayaran)</h3>
        <form onSubmit={handleOmnipaySubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">API Key (Bearer)</label>
              <input type="text" value={omnipayData.api_key} onChange={(e) => setOmnipayData({...omnipayData, api_key: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Project ID</label>
              <input type="text" value={omnipayData.project_id} onChange={(e) => setOmnipayData({...omnipayData, project_id: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Callback Key (Webhook)</label>
              <input type="text" value={omnipayData.callback_key} onChange={(e) => setOmnipayData({...omnipayData, callback_key: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none" />
            </div>
          </div>
          <button type="submit" disabled={loadingOmnipay} className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 disabled:opacity-50">
            {loadingOmnipay ? 'Menyimpan...' : 'Simpan Omnipaygate'}
          </button>
        </form>
      </div>

    </div>
  )
}
