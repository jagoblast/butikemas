import { useState, useEffect } from 'hono/jsx'

export default function AdminVoucherList() {
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // State form tambah voucher
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '', discount_type: 'FIXED', discount_value: '', min_purchase: '0', max_discount: '', usage_limit: '', expires_at: ''
  })

  const fetchVouchers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/vouchers')
    const json = await res.json()
    if (json.success) setVouchers(json.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const payload = {
      ...formData,
      discount_value: Number(formData.discount_value),
      min_purchase: Number(formData.min_purchase),
      max_discount: formData.max_discount ? Number(formData.max_discount) : null,
      usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
      expires_at: formData.expires_at || null
    }

    const res = await fetch('/api/admin/vouchers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      alert('Voucher berhasil ditambahkan')
      setShowForm(false)
      setFormData({ code: '', discount_type: 'FIXED', discount_value: '', min_purchase: '0', max_discount: '', usage_limit: '', expires_at: '' })
      fetchVouchers()
    } else {
      alert('Gagal menambahkan voucher')
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm('Hapus voucher ini?')) return
    await fetch(`/api/admin/vouchers/${id}`, { method: 'DELETE' })
    fetchVouchers()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Manajemen Voucher</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold py-2 px-4 rounded-xl">
          {showForm ? 'Batal' : '+ Buat Voucher Baru'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kode Voucher</label>
            <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full border rounded-lg p-2 uppercase" placeholder="PROMO2026"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tipe Diskon</label>
            <select value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})} className="w-full border rounded-lg p-2">
              <option value="FIXED">Nominal Tetap (Rp)</option>
              <option value="PERCENTAGE">Persentase (%)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Nilai Diskon</label>
            <input required type="number" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} className="w-full border rounded-lg p-2" placeholder="50000 atau 10"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Min. Belanja (Rp)</label>
            <input type="number" value={formData.min_purchase} onChange={e => setFormData({...formData, min_purchase: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Batas Kuota Penggunaan</label>
            <input type="number" value={formData.usage_limit} onChange={e => setFormData({...formData, usage_limit: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Kosongkan jika tanpa batas"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Berlaku Hingga</label>
            <input type="datetime-local" value={formData.expires_at} onChange={e => setFormData({...formData, expires_at: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" className="bg-navy-900 text-white font-bold py-2.5 px-6 rounded-xl w-full md:w-auto">Simpan Voucher</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Diskon</th>
              <th className="px-4 py-3">Min. Belanja</th>
              <th className="px-4 py-3">Dipakai / Kuota</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={5} className="text-center py-4">Memuat...</td></tr> : 
             vouchers.length === 0 ? <tr><td colSpan={5} className="text-center py-4">Tidak ada voucher.</td></tr> :
             vouchers.map(v => (
              <tr key={v.id}>
                <td className="px-4 py-3 font-bold text-gray-900">{v.code}</td>
                <td className="px-4 py-3">{v.discount_type === 'FIXED' ? `Rp ${v.discount_value}` : `${v.discount_value}%`}</td>
                <td className="px-4 py-3">Rp {v.min_purchase}</td>
                <td className="px-4 py-3">{v.usage_count} / {v.usage_limit || '∞'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
