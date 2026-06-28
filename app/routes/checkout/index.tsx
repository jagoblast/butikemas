import { createRoute } from 'honox/factory'
import { getCookie, deleteCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  // 1. Ambil Cookie
  const token = getCookie(c, 'customer_session')
  
  // Jika tidak ada token (belum login), kembalikan ke halaman login
  if (!token) {
    return c.redirect('/login?redirect=/checkout')
  }

  // 2. Persiapkan JWT Secret
  // @ts-ignore
  const secret = c.env.JWT_SECRET

  // 3. Verifikasi Token di Sisi Server
  try {
    // @ts-ignore
    const payload = await verify(token, secret)
    
    // PERBAIKAN ULTIMATE: Menggunakan LEFT JOIN ke tabel addresses
    // Mengambil alamat yang di-set sebagai default (is_default = 1)
    // @ts-ignore
    const customer = await c.env.DB.prepare(
      `SELECT u.name, u.email, u.phone, a.address 
       FROM users u 
       LEFT JOIN addresses a ON u.id = a.user_id AND a.is_default = 1 
       WHERE u.id = ?`
    ).bind(payload.id).first()

    // Jika data user terhapus atau tidak ada di DB
    if (!customer) {
      deleteCookie(c, 'customer_session', { path: '/' })
      return c.redirect('/login?redirect=/checkout')
    }

    // Jika semua valid, render halaman checkout
    return c.render(<CheckoutView customer={customer} />, { title: 'Checkout Pesanan' })

  } catch (err: any) {
    // Jika token tidak valid / kedaluwarsa (error saat proses verify)
    deleteCookie(c, 'customer_session', { path: '/' })
    return c.redirect('/login?redirect=/checkout')
  }
})
