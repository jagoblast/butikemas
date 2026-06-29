import { createRoute } from 'honox/factory'
import { getCookie, deleteCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

export default createRoute(async (c, next) => {
  // 1. Ambil token dari cookie
  const token = getCookie(c, 'customer_session')

  if (!token) {
    // Jika tidak ada token sama sekali, lempar ke login
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`)
  }

  try {
    // 2. VERIFIKASI JWT SECARA EKSPLISIT
    // Memastikan token valid, belum expired, dan ditandatangani dengan algoritma HS256
    const decodedPayload = await verify(token, c.env.JWT_SECRET, 'HS256')
    
    // (Opsional) Simpan data user ke context agar bisa diakses di route handler
    c.set('jwtPayload', decodedPayload)

    // Lanjut render halaman checkout/orders
    await next()

  } catch (error) {
    // 3. JIKA TOKEN TIDAK VALID ATAU EXPIRED
    console.error("JWT Verification failed:", error)
    
    // Hapus cookie yang sudah usang/rusak agar tidak menyangkut di browser
    deleteCookie(c, 'customer_session', { path: '/' })
    
    // Lempar kembali ke login
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`)
  }
})
