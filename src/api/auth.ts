import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { setCookie } from 'hono/cookie'

const authApi = new Hono<{ Bindings: Env['Bindings'] }>()

// ==========================================
// 🔐 FUNGSI KRIPTOGRAFI PASSWORD EDGE
// ==========================================
// Menggunakan Web Crypto API bawaan browser/V8 (Tanpa perlu install library berat).
// Ditambah 'secret salt' agar aman dari serangan Rainbow Table.
async function hashPassword(password: string, secret: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ==========================================
// ENDPOINT LOGIN (Mendukung Admin & Customer)
// ==========================================
authApi.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  // 1. Cari User berdasarkan Email
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first()

  if (!user) {
    return c.json({ success: false, message: 'Email tidak ditemukan.' }, 401)
  }

  // 2. Validasi Kriptografi Password
  // Lakukan hash pada input user, lalu bandingkan dengan hash di database
  const inputHash = await hashPassword(password, c.env.JWT_SECRET)
  const isPasswordValid = inputHash === user.password_hash

  if (!isPasswordValid) {
    return c.json({ success: false, message: 'Kata sandi salah.' }, 401)
  }

  // 3. Buat JWT Token
  const payload = {
    id: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 Jam
  }

  const token = await sign(payload, c.env.JWT_SECRET, 'HS256')

  // 4. Set Cookie Dinamis
  const cookieName = user.role === 'ADMIN' ? 'admin_session' : 'customer_session'

  setCookie(c, cookieName, token, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    sameSite: 'Strict'
  })

  return c.json({ 
    success: true, 
    message: 'Login berhasil!',
    role: user.role 
  })
})


// ==========================================
// ENDPOINT REGISTRASI BARU (Khusus Customer)
// ==========================================
authApi.post('/register', async (c) => {
  const { name, email, phone, password } = await c.req.json()

  // 1. Validasi Keunikan Email
  const existingUser = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first()

  if (existingUser) {
    return c.json({ success: false, message: 'Email sudah terdaftar. Silakan login.' }, 400)
  }

  // 2. HASH PASSWORD SEBELUM DISIMPAN (Production Ready!)
  const passwordHash = await hashPassword(password, c.env.JWT_SECRET)

  try {
    // 3. Eksekusi ke D1
    await c.env.DB.prepare(
      `INSERT INTO users (id, name, email, phone, password_hash, role, is_active) 
       VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, 'CUSTOMER', 1)`
    ).bind(name, email, phone, passwordHash).run()

    return c.json({ success: true, message: 'Registrasi berhasil!' })
  } catch (error) {
    console.error("Register Error:", error)
    return c.json({ success: false, message: 'Gagal menyimpan data ke sistem.' }, 500)
  }
})

export default authApi
