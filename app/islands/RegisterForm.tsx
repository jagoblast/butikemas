import { useState } from 'react'

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validasi Sederhana
    if (formData.name.length < 2) return setError("Nama minimal 2 karakter")
    if (formData.password.length < 8) return setError("Password minimal 8 karakter")
    if (formData.password !== formData.confirmPassword) return setError("Password tidak cocok")

    setIsLoading(true)

    try {
      // Ganti URL ini sesuai dengan endpoint API backend Anda nantinya
      // const response = await fetch('https://api.anda.com/auth/register', { ... })
      
      // Simulasi loading API (Hapus ini jika sudah ada API sungguhan)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect setelah sukses
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal. Coba lagi sebentar.')
    } finally {
      setIsLoading(false)
    }
  }

  // SVG Ikon (Murni tanpa library agar aman di HonoX)
  const EyeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
  const EyeSlashIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>

  return (
    <>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} noValidate className="space-y-4">
        {/* Input Nama */}
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Nama Lengkap</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <input name="name" type="text" placeholder="Masukkan nama lengkap" value={formData.name} onChange={handleChange} required className="w-full bg-white border border-navy-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-navy-900 placeholder:text-navy-300" />
          </div>
        </div>

        {/* Input Email */}
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <input name="email" type="email" placeholder="nama@email.com" value={formData.email} onChange={handleChange} required className="w-full bg-white border border-navy-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-navy-900 placeholder:text-navy-300" />
          </div>
        </div>

        {/* Input Nomor HP */}
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Nomor HP</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.02 3.06a1 1 0 01-.27 1.04l-1.72 1.72a16 16 0 006.24 6.24l1.72-1.72a1 1 0 011.04-.27l3.06 1.02a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" /></svg>
            </div>
            <input name="phone" type="tel" placeholder="081234567890" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-navy-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-navy-900 placeholder:text-navy-300" />
          </div>
        </div>

        {/* Input Password */}
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 karakter" value={formData.password} onChange={handleChange} required className="w-full bg-white border border-navy-300 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-navy-900 placeholder:text-navy-300" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy-400 hover:text-navy-700">
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Input Konfirmasi Password */}
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1.5">Konfirmasi Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Ulangi password" value={formData.confirmPassword} onChange={handleChange} required className="w-full bg-white border border-navy-300 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-navy-900 placeholder:text-navy-300" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy-400 hover:text-navy-700">
              {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <p className="text-xs text-navy-500 pt-2">
          Dengan mendaftar, Anda menyetujui <a href="/terms" className="text-gold-600 font-semibold hover:underline">Syarat & Ketentuan</a> dan <a href="/privacy" className="text-gold-600 font-semibold hover:underline">Kebijakan Privasi</a> kami.
        </p>

        {/* Tombol Register */}
        <button type="submit" disabled={isLoading} className="w-full bg-gold-500 text-navy-900 font-bold px-6 py-3.5 rounded-xl hover:bg-gold-400 active:bg-gold-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_-2px_rgba(212,168,75,0.4)] mt-2">
          {isLoading ? 'Memproses...' : 'Buat Akun'}
        </button>

        <p className="text-center text-sm text-navy-600 mt-4">
          Sudah punya akun? <a href="/login" className="text-gold-600 font-bold hover:text-gold-500 transition-colors">Masuk di sini</a>
        </p>
      </form>
    </>
  )
}
