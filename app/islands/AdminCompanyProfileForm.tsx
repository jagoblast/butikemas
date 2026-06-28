import { useState, useEffect } from 'hono/jsx'

export default function AdminCompanyProfileForm() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ company_name: '', address: '', phone: '' })

  useEffect(() => {
    fetch('/api/admin/company-profile')
      .then(res => res.json())
      .then(res => { if (res.success) setData(res.data) })
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/admin/company-profile', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    setLoading(false)
    alert('Profil berhasil diperbarui')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nama Perusahaan</label>
        <input type="text" value={data.company_name} onChange={e => setData({...data, company_name: e.target.value})} className="w-full p-2 border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alamat</label>
        <textarea value={data.address} onChange={e => setData({...data, address: e.target.value})} className="w-full p-2 border rounded-lg" />
      </div>
      <button type="submit" disabled={loading} className="bg-gold-500 text-white px-4 py-2 rounded-lg font-bold">
        {loading ? 'Menyimpan...' : 'Update Profil'}
      </button>
    </form>
  )
}
