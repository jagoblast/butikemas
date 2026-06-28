import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  // 1. Debug Cookie
  const token = getCookie(c, 'customer_session')
  if (!token) {
    return c.text('DEBUG: TIDAK ADA COOKIE "customer_session" DITEMUKAN. Token tidak dikirim browser atau cookie tidak ada.', 401)
  }

  // 2. Debug Environment Secret
  // @ts-ignore
  const secret = c.env.JWT_SECRET
  if (!secret) {
    return c.text('DEBUG: ERROR FATAL! JWT_SECRET di Cloudflare kosong (undefined). Anda harus setting Variables di Dashboard!', 500)
  }

  // 3. Debug JWT Verification
  try {
    // @ts-ignore
    const payload = await verify(token, secret)
    
    // Jika sampai di sini, artinya Login Valid. 
    // Ambil data DB
    // @ts-ignore
    const customer = await c.env.DB.prepare('SELECT name, email, phone, address FROM users WHERE id = ?').bind(payload.id).first()
    
    if (!customer) {
        return c.text('DEBUG: Token Valid, tapi ID User tidak ditemukan di Database!', 404)
    }

    return c.render(<CheckoutView customer={customer} />, { title: 'Checkout Pesanan' })
    
  } catch (err: any) {
    // Tampilkan alasan kenapa token ditolak
    return c.text(`DEBUG: JWT VERIFICATION FAILED! Alasan: ${err.message}`, 401)
  }
})
