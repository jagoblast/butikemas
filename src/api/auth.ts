import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { setCookie, deleteCookie } from 'hono/cookie'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const authApi = new Hono<{ Bindings: Bindings }>()

async function hashPassword(password: string, secret: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

authApi.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first<any>()

  if (!user) {
    return c.json({ success: false, message: 'Email tidak ditemukan.' }, 401)
  }

  const inputHash = await hashPassword(password, c.env.JWT_SECRET)
  
  if (inputHash !== user.password_hash) {
    return c.json({ success: false, message: 'Kata sandi salah.' }, 401)
  }

  const payload = {
    id: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 
  }

  const token = await sign(payload, c.env.JWT_SECRET, 'HS256')

  // PERBAIKAN 1: Nama Cookie BARU
  const cookieName = user.role === 'ADMIN' ? 'butik_admin_session' : 'butik_cust_session'

  // PERBAIKAN 2: Deteksi HTTPS (Jika jalan di Localhost HTTP, jadikan false)
  const isSecureMode = new URL(c.req.url).protocol === 'https:'

  setCookie(c, cookieName, token, {
    path: '/',
    secure: isSecureMode, // <-- Lebih pintar
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    sameSite: 'Lax'
  })

  return c.json({ 
    success: true, 
    message: 'Login berhasil!',
    role: user.role 
  })
})

authApi.post('/register', async (c) => {
  const { name, email, phone, password } = await c.req.json()

  const existingUser = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first()

  if (existingUser) {
    return c.json({ success: false, message: 'Email sudah terdaftar. Silakan login.' }, 400)
  }

  const passwordHash = await hashPassword(password, c.env.JWT_SECRET)

  try {
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

authApi.get('/logout', async (c) => {
  // Hapus cookie dengan nama BARU
  deleteCookie(c, 'butik_cust_session', { path: '/' })
  deleteCookie(c, 'butik_admin_session', { path: '/' })
  return c.redirect('/login')
})

export default authApi
