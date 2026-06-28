import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  // 1. CEK KEDUA COOKIE: Mengakomodasi jika yang sedang checkout/testing adalah Admin
  const customerToken = getCookie(c, 'customer_session')
  const adminToken = getCookie(c, 'admin_session')
  const token = customerToken || adminToken
  
  if (!token) {
    // Jika memang tidak ada sesi sama sekali (Real Guest), arahkan ke login
    return c.redirect('/login?redirect=/checkout')
  }

  let payload;
  try {
    // @ts-ignore
    const secret = c.env.JWT_SECRET
    
    if (!secret) {
      // STOP REDIRECT: Jika secret key Cloudflare hilang, tampilkan error aslinya!
      return c.text('CRITICAL ERROR: Variabel JWT_SECRET tidak terbaca di environment Cloudflare!', 500)
    }
    
    // 2. Verifikasi token secara mandiri
    // @ts-ignore
    payload = await verify(token, secret)
  } catch (error: any) {
    // STOP REDIRECT: Jangan melempar kembali ke login jika token kadaluarsa/rusak. 
    // Tampilkan di layar agar tidak terjadi loop!
    return c.text(`CRITICAL ERROR: Gagal memverifikasi Token JWT! Alasan: ${error.message}`, 401)
  }

  // 3. Ambil data pelanggan dari database
  // @ts-ignore
  const customer = await c.env.DB.prepare(
    'SELECT name, email, phone, address FROM users WHERE id = ?'
  ).bind(payload.id).first()

  if (!customer) {
    return c.text('CRITICAL ERROR: Data user tidak ditemukan di Database D1.', 404)
  }

  // Jika semua lolos, render Island Checkout
  return c.render(
    <CheckoutView customer={customer} />,
    { title: 'Checkout Pesanan' }
  )
})
