import { createRoute } from 'honox/factory'
import { getCookie, deleteCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  const token = getCookie(c, 'customer_session')
  
  // Jika belum ada token, memang harus ke login
  if (!token) {
    return c.redirect('/login?redirect=/checkout')
  }

  // @ts-ignore
  const secret = c.env.JWT_SECRET

  try {
    const payload = await verify(token, secret)
    
    // PERBAIKAN: Gunakan JOIN ke tabel addresses agar tidak error
    // @ts-ignore
    const customer = await c.env.DB.prepare(
      `SELECT u.name, u.email, u.phone, a.address 
       FROM users u 
       LEFT JOIN addresses a ON u.id = a.user_id AND a.is_default = 1 
       WHERE u.id = ?`
    ).bind(payload.id).first()

    // Jika customer tidak ditemukan, hapus cookie sesi yang rusak dan redirect
    if (!customer) {
      deleteCookie(c, 'customer_session', { path: '/' })
      return c.redirect('/login?redirect=/checkout')
    }

    // Berhasil: Render CheckoutView dengan data yang valid
    return c.render(<CheckoutView customer={customer} />, { title: 'Checkout Pesanan' })

  } catch (err: any) {
    console.error("Critical Checkout Error:", err)
    // Hapus sesi rusak agar tidak loop
    deleteCookie(c, 'customer_session', { path: '/' })
    return c.redirect('/login?redirect=/checkout')
  }
})
