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
    
    // @ts-ignore
    const customer = await c.env.DB.prepare(
      'SELECT name, email, phone, address FROM users WHERE id = ?'
    ).bind(payload.id).first()

    // Jika data user terhapus atau tidak ada di DB
    if (!customer) {
      deleteCookie(c, 'customer_session', { path: '/' })
      return c.redirect('/login?redirect=/checkout')
    }

    // Jika semua valid, render halaman checkout
    return c.render(<CheckoutView customer={customer} />, { title: 'Checkout Pesanan' })

  } catch (err: any) {
    // Jika token tidak valid / kedaluwarsa (error saat proses verify), wajib hapus cookie agar tidak merusak state halaman lain
    deleteCookie(c, 'customer_session', { path: '/' })
    return c.redirect('/login?redirect=/checkout')
  }
})
