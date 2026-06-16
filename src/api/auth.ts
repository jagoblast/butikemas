import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { setCookie } from 'hono/cookie'

const authApi = new Hono<{ Bindings: Env['Bindings'] }>()

authApi.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  // 1. Cek Admin di Database D1
  const admin = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ? AND role = "ADMIN"'
  ).bind(email).first()

  if (!admin) {
    return c.json({ success: false, message: 'Email tidak ditemukan atau bukan Admin.' }, 401)
  }

  // Catatan: Di production, gunakan Web Crypto API untuk memvalidasi hash password.
  // Untuk contoh ini, kita asumsikan verifikasi password berhasil.
  const isPasswordValid = password === admin.password_hash // GANTI DENGAN FUNGSI HASH EDGE

  if (!isPasswordValid) {
    return c.json({ success: false, message: 'Katasandi salah.' }, 401)
  }

  // 2. Buat JWT Token (Algoritma HS256)
  const payload = {
    id: admin.id,
    role: admin.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // Expired dalam 24 Jam
  }

  const token = await sign(payload, c.env.JWT_SECRET, 'HS256')

  // 3. Set Cookie untuk MPA HonoX (Biar middleware frontend otomatis mendeteksi)
  setCookie(c, 'admin_session', token, {
    path: '/',
    secure: true,      // Wajib HTTPS
    httpOnly: true,    // Mencegah XSS (hacker tidak bisa baca token via javascript)
    maxAge: 60 * 60 * 24, // 1 hari
    sameSite: 'Strict'
  })

  return c.json({ success: true, message: 'Login berhasil!' })
})

export default authApi
