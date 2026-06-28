import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  const token = getCookie(c, 'customer_session')
  
  // 1. CEK APAKAH COOKIE MASUK KE SERVER
  if (!token) {
    console.error("🚨 DEBUG CHECKOUT: Token tidak ditemukan! Browser tidak mengirimkan cookie 'customer_session'.")
    return c.redirect('/login?redirect=/checkout')
  }

  let payload;
  try {
    // 2. CEK APAKAH VERIFIKASI BERHASIL
    if (!c.env.JWT_SECRET) {
      console.error("🚨 DEBUG CHECKOUT: c.env.JWT_SECRET kosong/undefined di route ini!")
    }
    payload = await verify(token, c.env.JWT_SECRET)
  } catch (error) {
    console.error("🚨 DEBUG CHECKOUT: Verifikasi token gagal!", error)
    return c.redirect('/login?redirect=/checkout')
  }

  const customer = await c.env.DB.prepare(
    'SELECT name, email, phone, address FROM users WHERE id = ?'
  ).bind(payload.id).first()

  if (!customer) {
     console.error("🚨 DEBUG CHECKOUT: User ID di dalam token tidak ditemukan di database!")
  }

  return c.render(
    <CheckoutView customer={customer} />,
    { title: 'Checkout Pesanan' }
  )
})
