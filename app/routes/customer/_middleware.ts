import { createRoute } from 'honox/factory'
import { getCookie, deleteCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

type Env = {
  Bindings: {
    JWT_SECRET: string
  }
  Variables: {
    jwtPayload: any
  }
}

export default createRoute<Env>(async (c, next) => {
  // PERBAIKAN UTAMA: Tambahkan Header Anti-Cache
  // Ini memaksa browser untuk selalu mengecek sesi ke server, bukan mengandalkan memori cache 302 lama
  c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  c.header('Pragma', 'no-cache')
  c.header('Expires', '0')

  const token = getCookie(c, 'butik_cust_session')

  if (!token) {
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`)
  }

  try {
    if (!c.env.JWT_SECRET) {
      return c.html('<h1>[FATAL ERROR] JWT_SECRET hilang atau tidak diset di Environment Variables (Cloudflare Pages)!</h1>', 500)
    }

    // Verifikasi secara ketat
    const decodedPayload = await verify(token, c.env.JWT_SECRET, 'HS256')
    c.set('jwtPayload', decodedPayload)
    
    await next()

  } catch (error) {
    console.error("⚠️ JWT Verification failed di Middleware:", error)
    
    deleteCookie(c, 'butik_cust_session', { path: '/' })
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`)
  }
})
