import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

type CustomEnv = {
  Bindings: Env['Bindings']
  Variables: {
    jwtPayload: any
  }
}

const customersApi = new Hono<CustomEnv>()

// Middleware API khusus untuk memverifikasi token dan mengeset jwtPayload
customersApi.use('*', async (c, next) => {
  const token = getCookie(c, 'butik_cust_session')
  
  if (token) {
    try {
      const decodedPayload = await verify(token, c.env.JWT_SECRET as string, 'HS256')
      c.set('jwtPayload', decodedPayload)
    } catch (error) {
      console.error("⚠️ JWT API Verification failed di customersApi:", error)
    }
  }
  await next()
})

// [GET] Ambil Profil Sendiri (Customer) atau Semua Pelanggan (Admin)
customersApi.get('/', async (c) => {
  if (c.req.path.includes('/admin/')) {
    const { results } = await c.env.DB.prepare(
      'SELECT id, name, email, phone, created_at FROM users WHERE role = "CUSTOMER" ORDER BY created_at DESC'
    ).all()
    return c.json({ success: true, data: results })
  }

  if (c.req.path.includes('/customer/')) {
    const payload = c.get('jwtPayload')
    
    if (!payload || !payload.id) {
      return c.json({ success: false, message: 'Sesi Anda telah berakhir. Silakan login kembali.' }, 401)
    }

    // PERBAIKAN: Gunakan LEFT JOIN ke tabel addresses untuk mengambil alamat utama
    const customer = await c.env.DB.prepare(`
      SELECT u.id, u.name, u.email, u.phone, a.address 
      FROM users u 
      LEFT JOIN addresses a ON a.user_id = u.id AND a.is_default = 1 
      WHERE u.id = ?
    `).bind(payload.id).first()
    
    return c.json({ success: true, data: customer })
  }

  return c.json({ success: false }, 403)
})

// [PUT] Update Profil Sendiri (Customer)
customersApi.put('/update', async (c) => {
  const payload = c.get('jwtPayload')
  
  if (!payload || !payload.id) {
    return c.json({ success: false, message: 'Sesi Anda telah berakhir. Silakan login kembali.' }, 401)
  }

  const { name, phone, address } = await c.req.json()

  // 1. Update data dasar di tabel users (TANPA menyentuh kolom address)
  await c.env.DB.prepare(
    'UPDATE users SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(name, phone, payload.id).run()

  // 2. Cek ketersediaan alamat di tabel addresses
  const existingAddress = await c.env.DB.prepare(
    'SELECT id FROM addresses WHERE user_id = ? AND is_default = 1'
  ).bind(payload.id).first()

  if (existingAddress) {
    // 3A. Jika sudah ada, update tabel addresses
    await c.env.DB.prepare(
      'UPDATE addresses SET address = ?, full_name = ?, phone = ? WHERE user_id = ? AND is_default = 1'
    ).bind(address || '', name, phone, payload.id).run()
  } else if (address) {
    // 3B. Jika belum ada (user baru), insert ke tabel addresses. 
    // Mengisi '-' untuk kolom NOT NULL (city, province, postal_code) sebagai default sementara
    await c.env.DB.prepare(`
      INSERT INTO addresses (id, user_id, label, full_name, phone, address, city, province, postal_code, is_default) 
      VALUES (lower(hex(randomblob(16))), ?, 'Utama', ?, ?, ?, '-', '-', '-', 1)
    `).bind(payload.id, name, phone, address).run()
  }

  return c.json({ success: true, message: 'Profil berhasil diperbarui' })
})

export default customersApi
