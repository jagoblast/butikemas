import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  // 1. CEK COOKIE SECARA RAW
  const allCookies = c.req.raw.headers.get('cookie')
  const token = getCookie(c, 'customer_session')
  
  if (!token) {
    return c.text(`DEBUG MODE: Cookie 'customer_session' TIDAK DITEMUKAN. 
    Header Cookie yang diterima server: ${allCookies || 'NULL'}`, 401)
  }

  // 2. CEK JWT_SECRET
  // @ts-ignore
  const secret = c.env.JWT_SECRET
  if (!secret) {
    return c.text('DEBUG MODE: JWT_SECRET di Cloudflare BINDINGS KOSONG!', 500)
  }

  // 3. COBA VERIFIKASI
  try {
    // @ts-ignore
    const payload = await verify(token, secret)
    
    // @ts-ignore
    const customer = await c.env.DB.prepare(
      'SELECT name, email, phone, address FROM users WHERE id = ?'
    ).bind(payload.id).first()

    if (!customer) {
      return c.text('DEBUG MODE: Token valid, tapi User ID tidak ditemukan di database.', 404)
    }

    // Jika sukses, baru render
    return c.render(<CheckoutView customer={customer} />, { title: 'Checkout Pesanan' })

  } catch (err: any) {
    // MUNCULKAN ERROR ASLI TANPA REDIRECT
    return c.text(`DEBUG MODE: VERIFIKASI GAGAL! Error: ${err.message}. Secret yang dipakai: ${secret.substring(0, 3)}...`, 401)
  }
})
