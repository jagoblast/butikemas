import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../../islands/CheckoutView'

export default createRoute(async (c) => {
  const token = getCookie(c, 'customer_session')
  
  // Jika tidak ada sesi, lempar ke login dan kembalikan ke checkout setelah berhasil login
  if (!token) {
    return c.redirect('/login?redirect=/customer/checkout')
  }

  try {
    // @ts-ignore
    const payload = await verify(token, c.env.JWT_SECRET)
    
    // Mengambil data user berdasarkan token.
    // Catatan: Sesuai skema DB Anda, alamat ada di tabel 'addresses', bukan 'users'. 
    // Jadi kita hanya mengambil data dasar di sini.
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
    // Jika token kedaluwarsa atau invalid
    return c.redirect('/login?redirect=/customer/checkout')
  }
})
