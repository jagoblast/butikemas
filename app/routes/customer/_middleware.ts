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
  // Matikan cache agresif browser agar tidak terjadi loop redirect
  c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  c.header('Pragma', 'no-cache')
  c.header('Expires', '0')

  const token = getCookie(c, 'butik_cust_session')

  if (!token) {
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`)
  }

  if (!c.env.JWT_SECRET) {
    return c.html('<h1>[FATAL ERROR] JWT_SECRET hilang atau tidak diset di Environment Variables (Cloudflare Pages)!</h1>', 500)
  }

  let decodedPayload;

  // 1. BLOK TRY-CATCH HANYA UNTUK VERIFIKASI JWT
  try {
    decodedPayload = await verify(token, c.env.JWT_SECRET, 'HS256')
  } catch (error) {
    console.error("⚠️ JWT Verification failed di Middleware:", error)
    
    // Jika token benar-benar kadaluarsa/rusak, hapus dan redirect
    deleteCookie(c, 'butik_cust_session', { path: '/' })
    return c.redirect(`/login?redirect=${encodeURIComponent(c.req.path)}`)
  }

  // 2. SET PAYLOAD JIKA BERHASIL
  c.set('jwtPayload', decodedPayload)
  
  // 3. JALANKAN HALAMAN DI LUAR TRY-CATCH! 
  // Jika checkout.tsx error, sekarang ia akan menampilkan Error 500 normal, bukan menendang user ke halaman login.
  await next()
})
