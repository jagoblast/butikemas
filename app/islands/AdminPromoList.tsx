import { useState, useEffect } from 'hono/jsx'

export default function AdminPromoList() {
  const [promos, setPromos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '', discount_type: 'PERCENTAGE', discount_value: '', max_discount: '', starts_at: '', expires_at: '', is_active: 1
  })

  const fetchPromos = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/promos')
    const json = await res.json()
    if (json.success) setPromos(json.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPromos()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const payload = {
      ...formData,
      discount_value: Number(formData.discount_value),
      max_discount: formData.max_discount ? Number(formData.max_discount) : null,
      starts_at: formData.starts_at || null,
      expires_at: formData.expires_at || null
    }

    const res = await fetch('/api/admin/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      alert('Promo berhasil ditambahkan')
      setShowForm(false)
      setFormData({ name: '', discount_type: 'PERCENTAGE', discount_value: '', max_discount: '', starts_at: '', expires_at: '', is_active: 1 })
      fetchPromos()
    } else {
      alert('Gagal menambahkan promo')
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm('Hapus promo ini?')) return
    await fetch(`/api/admin/promos/${id}`, { method: 'DELETE' })
    fetchPromos()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Manajemen Promo</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold py-2 px-4 rounded-xl">
          {showForm ? 'Batal' : '+ Buat Promo Baru'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Nama Promo</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Cth: Flash Sale Ramadhan"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tipe Diskon</label>
            <select value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})} className="w-full border rounded-lg p-2">
              <option value="PERCENTAGE">Persentase (%)</option>
              <option value="FIXED">Nominal Tetap (Rp)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Nilai Diskon</label>
            <input required type="number" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} className="w-full border rounded-lg p-2" placeholder="50000 atau 10"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Maks. Diskon (Rp) - Opsional</label>
            <input type="number" value={formData.max_discount} onChange={e => setFormData({...formData, max_discount: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Maksimal potongan"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Status Aktif</label>
            <select value={formData.is_active} onChange={e => setFormData({...formData, is_active: Number(e.target.value)})} className="w-full border rounded-lg p-2">
              <option value={1}>Aktif</option>
              <option value={0}>Tidak Aktif</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Mulai Berlaku</label>
            <input type="datetime-local" value={formData.starts_at} onChange={e => setFormData({...formData, starts_at: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Berakhir Pada</label>
            <input type="datetime-local" value={formData.expires_at} onChange={e => setFormData({...formData, expires_at: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" className="bg-navy-900 text-white font-bold py-2.5 px-6 rounded-xl w-full md:w-auto">Simpan Promo</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3">Nama Promo</th>
              <th className="px-4 py-3">Diskon</th>
              <th className="px-4 py-3">Masa Berlaku</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={5} className="text-center py-4">Memuat...</td></tr> : 
             promos.length === 0 ? <tr><td colSpan={5} className="text-center py-4">Tidak ada promo.</td></tr> :
             promos.map(p => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-bold text-gray-900">{p.name}</td>
                <td className="px-4 py-3">{p.discount_type === 'FIXED' ? `Rp ${p.discount_value}` : `${p.discount_value}%`}</td>
                <td className="px-4 py-3 text-xs">
                  Mulai: {p.starts_at ? new Date(p.starts_at).toLocaleString('id-ID') : '-'} <br/>
                  Akhir: {p.expires_at ? new Date(p.expires_at).toLocaleString('id-ID') : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-md font-bold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {p.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
