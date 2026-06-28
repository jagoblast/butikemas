import { useState, useEffect } from 'hono/jsx'

export default function AdminIntegrationForm() {
  const [loadingCloudinary, setLoadingCloudinary] = useState(false)
  const [loadingRajaongkir, setLoadingRajaongkir] = useState(false)
  const [loadingOmnipay, setLoadingOmnipay] = useState(false)
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [cloudinaryData, setCloudinaryData] = useState({ cloud_name: '', upload_preset: '' })
  const [rajaongkirData, setRajaongkirData] = useState({ api_key: '', tier: 'starter' })
  const [omnipayData, setOmnipayData] = useState({ api_key: '', project_id: '', callback_key: '' })

  // FETCH DATA SAAT HALAMAN DIMUAT (MENCEGAH FORM KOSONG)
  useEffect(() => {
    const fetchExistingSettings = async () => {
      try {
        // 1. Ambil data Cloudinary
        const resCloud = await fetch('/api/admin/settings/CLOUDINARY_CREDENTIALS')
        if (resCloud.ok) {
          const dataCloud = await resCloud.json()
          if (dataCloud.success && dataCloud.data?.setting_data) {
            setCloudinaryData(JSON.parse(dataCloud.data.setting_data))
          }
        }

        // 2. Ambil data RajaOngkir
        const resRaja = await fetch('/api/admin/settings/RAJAONGKIR_CREDENTIALS')
        if (resRaja.ok) {
          const dataRaja = await resRaja.json()
          if (dataRaja.success && dataRaja.data?.setting_data) {
            setRajaongkirData(JSON.parse(dataRaja.data.setting_data))
          }
        }

        // 3. Ambil data Omnipaygate
        const resOmni = await fetch('/api/admin/settings/OMNIPAYGATE_CREDENTIALS')
        if (resOmni.ok) {
          const dataOmni = await resOmni.json()
          if (dataOmni.success && dataOmni.data?.setting_data) {
            setOmnipayData(JSON.parse(dataOmni.data.setting_data))
          }
        }
      } catch (error) {
        console.error('Gagal mengambil pengaturan yang ada:', error)
      }
    }

    fetchExistingSettings()
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
        <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
          Integrasi Cloudinary (Gambar)
        </h3>
        <form onSubmit={handleCloudinarySubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Cloud Name</label>
              <input type="text" value={cloudinaryData.cloud_name} onChange={(e) => setCloudinaryData({...cloudinaryData, cloud_name: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none transition-all" placeholder="Misal: dbx....." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Upload Preset</label>
              <input type="text" value={cloudinaryData.upload_preset} onChange={(e) => setCloudinaryData({...cloudinaryData, upload_preset: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none transition-all" placeholder="Misal: butikemas_preset" />
            </div>
          </div>
          <button type="submit" disabled={loadingCloudinary} className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors disabled:opacity-50 flex items-center gap-2">
            {loadingCloudinary && <div className="w-4 h-4 border-2 border-navy-900/20 border-t-navy-900 rounded-full animate-spin"></div>}
            {loadingCloudinary ? 'Menyimpan...' : 'Simpan Cloudinary'}
          </button>
        </form>
      </div>

      {/* KARTU 2: RAJAONGKIR */}
      <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm">
        <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          Integrasi RajaOngkir (Ekspedisi)
        </h3>
        <form onSubmit={handleRajaongkirSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">API Key RajaOngkir</label>
              <input type="text" value={rajaongkirData.api_key} onChange={(e) => setRajaongkirData({...rajaongkirData, api_key: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none transition-all" placeholder="Masukkan API Key Anda" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Tipe Akun (Tier)</label>
              <select value={rajaongkirData.tier} onChange={(e) => setRajaongkirData({...rajaongkirData, tier: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none transition-all">
                <option value="starter">Starter</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loadingRajaongkir} className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors disabled:opacity-50 flex items-center gap-2">
            {loadingRajaongkir && <div className="w-4 h-4 border-2 border-navy-900/20 border-t-navy-900 rounded-full animate-spin"></div>}
            {loadingRajaongkir ? 'Menyimpan...' : 'Simpan RajaOngkir'}
          </button>
        </form>
      </div>

      {/* KARTU 3: OMNIPAYGATE (PAYMENT GATEWAY) */}
      <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm">
        <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Integrasi Omnipaygate (Pembayaran)
        </h3>
        <form onSubmit={handleOmnipaySubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">API Key (Bearer)</label>
              <input type="text" value={omnipayData.api_key} onChange={(e) => setOmnipayData({...omnipayData, api_key: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Project ID</label>
              <input type="text" value={omnipayData.project_id} onChange={(e) => setOmnipayData({...omnipayData, project_id: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Callback Key (Webhook)</label>
              <input type="text" value={omnipayData.callback_key} onChange={(e) => setOmnipayData({...omnipayData, callback_key: e.target.value})} required className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gold-400 outline-none transition-all" />
            </div>
          </div>
          <button type="submit" disabled={loadingOmnipay} className="px-6 py-2.5 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors disabled:opacity-50 flex items-center gap-2">
            {loadingOmnipay && <div className="w-4 h-4 border-2 border-navy-900/20 border-t-navy-900 rounded-full animate-spin"></div>}
            {loadingOmnipay ? 'Menyimpan...' : 'Simpan Omnipaygate'}
          </button>
        </form>
      </div>

    </div>
  )
}
