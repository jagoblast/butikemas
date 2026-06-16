// src/api/auth.ts

import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { setCookie } from 'hono/cookie'

const authApi = new Hono<{ Bindings: Env['Bindings'] }>()

// ... (Kode authApi.post('/login') biarkan tetap seperti aslinya) ...

// ==========================================
// ENDPOINT REGISTRASI BARU
// ==========================================
authApi.post('/register', async (c) => {
  const { name, email, phone, password } = await c.req.json()

  // 1. Validasi: Cek apakah email sudah terdaftar di D1
  const existingUser = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first()

  if (existingUser) {
    return c.json({ success: false, message: 'Email sudah terdaftar. Silakan login.' }, 400)
  }

  // 2. Hash Password
  // CATATAN: Untuk Production Edge, Anda harus mem-build fungsi hash dengan Web Crypto API.
  // Untuk saat ini, pastikan variabel ini nanti diganti dengan hasil hashing yang sebenarnya.
  const passwordHash = password 

  try {
    // 3. Simpan ke database D1 (Role otomatis diatur sebagai CUSTOMER)
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
