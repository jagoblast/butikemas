import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  const token = getCookie(c, 'customer_session')
  
  if (!token) {
    // Redirect di sini wajar jika user benar-benar belum login
    return c.redirect('/login?redirect=/checkout')
  }

  let payload;
  try {
    // 1. Cek apakah environment variable JWT_SECRET masuk ke route ini
    // @ts-ignore
    const secret = c.env.JWT_SECRET;
    if (!secret) {
      return c.text('ERROR FATAL SERVER: JWT_SECRET kosong atau tidak terbaca di route checkout!', 500)
    }

    // @ts-ignore
    payload = await verify(token, secret)
  } catch (error: any) {
    // 🚨 REDIRECT DIMATIKAN!
    // Jika token gagal diverifikasi, munculkan errornya di layar, jangan lempar ke login!
    return c.text(`ERROR VERIFIKASI TOKEN: Token ditolak oleh server. Alasan: ${error.message}`, 401)
  }

  // @ts-ignore
  const customer = await c.env.DB.prepare(
    'SELECT name, email, phone, address FROM users WHERE id = ?'
  ).bind(payload.id).first()

  if (!customer) {
    return c.text('ERROR FATAL DATABASE: ID Customer di token tidak ditemukan.', 404)
  }

  return c.render(
    <CheckoutView customer={customer} />,
    { title: 'Checkout Pesanan' }
  )
})
