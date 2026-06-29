import { createRoute } from 'honox/factory'
import { getCookie, deleteCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../../islands/CheckoutView'

export default createRoute(async (c) => {
  // PERBAIKAN MUTLAK: Gunakan nama cookie yang baru (butik_cust_session)
  const token = getCookie(c, 'butik_cust_session')
  
  if (!token) {
    return c.redirect('/login?redirect=/customer/checkout')
  }

  try {
    // PERBAIKAN: Wajib deklarasi 'HS256' secara eksplisit
    // @ts-ignore
    const payload = await verify(token, c.env.JWT_SECRET, 'HS256')
    
    // @ts-ignore
    const customer = await c.env.DB.prepare(
      'SELECT id, name, email, phone FROM users WHERE id = ?'
    ).bind(payload.id).first()

    if (!customer) {
      return c.redirect('/login?redirect=/customer/checkout')
    }

    return c.render(
      <div className="max-w-4xl mx-auto">
        <CheckoutView customer={customer} />
      </div>, 
      { title: 'Checkout Pesanan | Logam Mulia' }
    )

  } catch (err) {
    // Tambahkan log merah di console agar ketahuan jika JWT_SECRET bermasalah
    console.error("GAGAL MEMUAT HALAMAN CHECKOUT (Token Rusak/Expired):", err)
    
    // Bersihkan cookie yang rusak
    deleteCookie(c, 'butik_cust_session', { path: '/' })
    return c.redirect('/login?redirect=/customer/checkout')
  }
})
