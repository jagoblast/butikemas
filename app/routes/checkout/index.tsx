import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  // 1. Ambil cookie langsung di dalam route ini
  const token = getCookie(c, 'customer_session')
  
  if (!token) {
    return c.redirect('/login?redirect=/checkout')
  }

  let payload;
  try {
    // 2. Ekstrak dan Verifikasi JWT secara mandiri
    // Menggunakan @ts-ignore agar Cloudflare tidak rewel soal tipe data saat build
    // @ts-ignore
    payload = await verify(token, c.env.JWT_SECRET)
  } catch (error) {
    // Jika token palsu/kadaluarsa, baru lempar ke login
    return c.redirect('/login?redirect=/checkout')
  }

  // 3. Ambil data pelanggan dari database menggunakan ID dari token
  // @ts-ignore
  const customer = await c.env.DB.prepare(
    'SELECT name, email, phone, address FROM users WHERE id = ?'
  ).bind(payload.id).first()

  return c.render(
    <CheckoutView customer={customer} />,
    { title: 'Checkout Pesanan' }
  )
})
