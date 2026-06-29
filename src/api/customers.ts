import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

// Perbaikan Tipe: Tambahkan Variables untuk jwtPayload agar dikenali TypeScript dan tidak error
type CustomEnv = {
  Bindings: Env['Bindings']
  Variables: {
    jwtPayload: any
  }
}

const customersApi = new Hono<CustomEnv>()

// TAMBAHAN: Middleware API khusus untuk memverifikasi token dan mengeset jwtPayload
customersApi.use('*', async (c, next) => {
  const token = getCookie(c, 'butik_cust_session')
  
  if (token) {
    try {
      // Pastikan JWT_SECRET diambil dari environment variables
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
    
    // TAMBAHAN: Cegah crash sistem jika payload kosong (Sesi kedaluwarsa/hilang)
    if (!payload || !payload.id) {
      return c.json({ success: false, message: 'Sesi Anda telah berakhir. Silakan login kembali.' }, 401)
    }

    const customer = await c.env.DB.prepare(
      'SELECT id, name, email, phone, address FROM users WHERE id = ?'
    ).bind(payload.id).first()
    
    return c.json({ success: true, data: customer })
  }

  return c.json({ success: false }, 403)
})

// [PUT] Update Profil Sendiri (Customer)
customersApi.put('/update', async (c) => {
  const payload = c.get('jwtPayload')
  
  // TAMBAHAN: Cegah crash sistem jika payload kosong saat menyimpan update
  if (!payload || !payload.id) {
    return c.json({ success: false, message: 'Sesi Anda telah berakhir. Silakan login kembali.' }, 401)
  }

  const { name, phone, address } = await c.req.json()

  await c.env.DB.prepare(
    'UPDATE users SET name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(name, phone, address, payload.id).run()

  return c.json({ success: true, message: 'Profil berhasil diperbarui' })
})

export default customersApi
