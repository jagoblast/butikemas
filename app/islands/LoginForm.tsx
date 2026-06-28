import { useState } from 'hono/jsx'

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Menggunakan tipe "any" agar kompatibel penuh dengan hono/jsx events
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setError(null)

    if (!formData.email) return setError("Email harus diisi")
    if (!formData.password) return setError("Password harus diisi")

    setIsLoading(true)

    try {
      // 1. Tembak API Backend Hono kita
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      // 2. Tangani jika respons backend gagal (email tidak ada atau password salah)
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login gagal.')
      }
      
      // 3. Arahkan pengguna berdasarkan Role yang dikembalikan oleh backend
      if (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN') {
        window.location.href = '/admin' // Masuk ke Dashboard Admin
      } else {
        // Ambil parameter redirect secara aman di sisi client tanpa merusak hidrasi SSR
        let targetUrl = '/'
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search)
          const redirectParam = urlParams.get('redirect')
          if (redirectParam) {
            targetUrl = redirectParam
          }
        }
        window.location.href = targetUrl 
      }

    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.')
    } finally {
      setIsLoading(false)
    }
  }

  // SVG Ikon murni (Tidak bergantung pada lucide-react / react dom)
  const EyeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
  const EyeSlashIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>

  return (
    <>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} noValidate className="space-y-4">
        {/* Input Email / Phone */}
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Email / No. HP</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
              {/* User Icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <input name="email" type="text" placeholder="Masukkan email atau nomor HP" value={formData.email} onInput={handleChange} required className="w-full bg-white border border-navy-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-navy-900 placeholder:text-navy-300" />
          </div>
        </div>

        {/* Input Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-navy-900">Password</label>
            <a href="/reset-password" className="text-sm font-semibold text-gold-600 hover:text-gold-500 transition-colors">Lupa password?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
              {/* Lock Icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password Anda" value={formData.password} onInput={handleChange} required className="w-full bg-white border border-navy-300 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-navy-900 placeholder:text-navy-300" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy-400 hover:text-navy-700">
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tombol Login */}
        <button type="submit" disabled={isLoading} className="w-full bg-gold-500 text-navy-900 font-bold px-6 py-3.5 rounded-xl hover:bg-gold-400 active:bg-gold-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_-2px_rgba(212,168,75,0.4)] mt-4">
          {isLoading ? 'Memproses...' : 'Masuk'}
        </button>

        <p className="text-center text-sm text-navy-600 mt-4">
          Belum punya akun? <a href="/register" className="text-gold-600 font-bold hover:text-gold-500 transition-colors">Daftar sekarang</a>
        </p>
      </form>
    </>
  )
}
