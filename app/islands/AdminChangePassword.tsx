import { useState } from 'hono/jsx'

export default function AdminChangePassword() {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState<{ type: 'error' | 'success' | 'loading' | '', message: string }>({ type: '', message: '' })

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'Konfirmasi password baru tidak cocok!' })
    }
    if (formData.newPassword.length < 8) {
      return setStatus({ type: 'error', message: 'Password baru minimal 8 karakter!' })
    }

    setStatus({ type: 'loading', message: 'Memproses...' })

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: formData.oldPassword, newPassword: formData.newPassword })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus({ type: 'success', message: 'Password berhasil diubah.' })
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setStatus({ type: 'error', message: data.message })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Terjadi kesalahan sistem.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status.message && (
        <div className={`p-3 text-sm rounded-lg ${status.type === 'error' ? 'bg-red-50 text-red-600' : status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
          {status.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-1.5">Password Lama</label>
        <input name="oldPassword" type="password" value={formData.oldPassword} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-1.5">Password Baru</label>
        <input name="newPassword" type="password" value={formData.newPassword} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-1.5">Konfirmasi Password Baru</label>
        <input name="confirmPassword" type="password" value={formData.confirmPassword} onInput={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none" />
      </div>

      <div className="pt-2">
        <button type="submit" disabled={status.type === 'loading'} className="w-full sm:w-auto px-6 py-2.5 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 disabled:opacity-50">
          {status.type === 'loading' ? 'Menyimpan...' : 'Update Password'}
        </button>
      </div>
    </form>
  )
}
