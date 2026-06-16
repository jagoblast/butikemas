import { createRoute } from 'honox/factory'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  // 1. Ambil data sesi dari middleware (Hanya user login yang bisa akses)
  const payload = c.get('jwtPayload')
  
  if (!payload) {
    return c.redirect('/login?redirect=/checkout')
  }

  // 2. Ambil detail profil pelanggan dari database (Untuk Alamat Pengiriman)
  const customer = await c.env.DB.prepare(
    'SELECT name, email, phone, address FROM users WHERE id = ?'
  ).bind(payload.id).first()

  return c.render(
    // Kita lemparkan data pelanggan ke Island Checkout
    <CheckoutView customer={customer} />,
    { title: 'Checkout Pesanan' }
  )
})
