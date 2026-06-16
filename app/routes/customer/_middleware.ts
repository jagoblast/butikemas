import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'

export default createRoute(async (c, next) => {
  // Mengecek cookie sesi login milik customer
  // (Pastikan nama cookie ini sesuai dengan yang di-set saat login customer di auth.ts)
  const token = getCookie(c, 'customer_session')

  if (!token) {
    // Jika belum login, lempar ke halaman login dengan query parameter redirect
    return c.redirect('/login?redirect=/customer/orders')
  }

  // Jika token ada, izinkan render komponen HonoX
  await next()
})
