import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  // 1. Ambil token dari cookie sesi pelanggan
  const token = getCookie(c, 'customer_session')
  
  // Jika tidak ada cookie, lempar ke login
  if (!token) {
    return c.redirect('/login?redirect=/checkout')
  }

  let payload;
  try {
    // 2. Verifikasi token secara mandiri menggunakan JWT_SECRET
    payload = await verify(token, c.env.JWT_SECRET)
  } catch (error) {
    // Jika token expired atau tidak valid (dimanipulasi), lempar ke login
    return c.redirect('/login?redirect=/checkout')
  }

  // 3. Ambil detail profil pelanggan dari database (Untuk Alamat Pengiriman) menggunakan id dari payload
  const customer = await c.env.DB.prepare(
    'SELECT name, email, phone, address FROM users WHERE id = ?'
  ).bind(payload.id).first()

  return c.render(
    // Lempar data pelanggan ke Island Checkout
    <CheckoutView customer={customer} />,
    { title: 'Checkout Pesanan' }
  )
})
