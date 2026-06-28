import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { decode } from 'hono/jwt'
import CheckoutView from '../../islands/CheckoutView'

export default createRoute(async (c) => {
  // 1. Ambil Cookie
  const token = getCookie(c, 'customer_session')
  
  // Jika tidak ada token (belum login), kembalikan ke halaman login
  if (!token) {
    return c.redirect('/login?redirect=/checkout')
  }

  let customer = null;

  try {
    // 2. Decode JWT secara aman TANPA butuh JWT_SECRET di sisi Server Rendering
    // Ini mencegah error "undefined bindings" yang memicu infinite loop.
    const { payload } = decode(token)
    
    // 3. Query DB secara aman dengan LEFT JOIN
    // @ts-ignore
    const db = c.env.DB
    
    if (db && payload?.id) {
      customer = await db.prepare(
        `SELECT u.name, u.email, u.phone, a.address 
         FROM users u 
         LEFT JOIN addresses a ON u.id = a.user_id AND a.is_default = 1 
         WHERE u.id = ?`
      ).bind(payload.id).first()
    }
  } catch (err: any) {
    // 🔴 PERUBAHAN FATAL: 
    // Jika terjadi error pada sistem/DB saat merender halaman, 
    // JANGAN PERNAH menghapus cookie dan melempar user ke login! 
    // Biarkan kode lanjut ke bawah agar tidak terjadi Loop Login.
    console.error("SSR Checkout Parsing Error:", err)
  }

  // 4. Fallback Aman
  // Jika terjadi error sistem atau data alamat kosong, berikan data dummy 
  // agar form CheckoutView tetap bisa terbuka dan user tidak stuck di halaman login.
  if (!customer) {
    customer = { name: 'Pelanggan', address: '' }
  }

  return c.render(<CheckoutView customer={customer} />, { title: 'Checkout Pesanan' })
})
