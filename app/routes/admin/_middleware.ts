import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'

export default createRoute(async (c, next) => {
  // Mengecek apakah ada cookie sesi login yang valid
  const token = getCookie(c, 'admin_session')

  if (!token) {
    // Jika tidak ada token, paksa kembali ke halaman login
    return c.redirect('/login')
  }

  // Catatan: Validasi kriptografi JWT yang sebenarnya (algoritma HS256) 
  // dilakukan di level src/api/index.ts saat fetch data. 
  // Middleware ini hanya untuk melindungi struktur UI /admin agar tidak bocor.

  await next()
})
