import { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      if (data.success) {
        // Simpan token JWT di Cookie/Storage dan arahkan ke Dashboard
        window.location.href = '/admin' // Navigasi MPA konvensional
      } else {
        setError(data.message || 'Login gagal.')
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded focus:ring-yellow-500 focus:border-yellow-500" 
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded focus:ring-yellow-500 focus:border-yellow-500" 
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="mt-4 w-full bg-yellow-500 text-white font-bold py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        {loading ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  )
}
