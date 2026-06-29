import { createRoute } from 'honox/factory'
import { getCookie, deleteCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

// PERBAIKAN: Beritahu TypeScript bahwa middleware ini punya akses ke Bindings (Env Vars)
type Env = {
  Bindings: {
    JWT_SECRET: string
  }
  Variables: {
    jwtPayload: any
  }
}

export default createRoute<Env>(async (c, next) => {
  // 1. GUNAKAN NAMA COOKIE BARU: 'butik_cust_session' (Bypass cache lama browser)
  const token = getCookie(c, 'butik_cust_session')

  if (!token) {
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`)
  }

  try {
    // 2. CEK FATAL ERROR: Pastikan JWT_SECRET benar-benar terbaca di production!
    if (!c.env.JWT_SECRET) {
      return c.html('<h1>[FATAL ERROR] JWT_SECRET hilang atau tidak diset di Environment Variables (Cloudflare Pages)!</h1>', 500)
    }

    // 3. Verifikasi secara ketat
    const decodedPayload = await verify(token, c.env.JWT_SECRET, 'HS256')
    c.set('jwtPayload', decodedPayload)
    
    await next()

  } catch (error) {
    console.error("⚠️ JWT Verification failed di Middleware:", error)
    
    // Hapus cookie BARU karena kedaluwarsa atau dimanipulasi
    deleteCookie(c, 'butik_cust_session', { path: '/' })
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`)
  }
})
