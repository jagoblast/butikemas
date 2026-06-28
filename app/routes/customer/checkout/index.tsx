import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import CheckoutView from '../../../islands/CheckoutView'

export default createRoute(async (c) => {
  const token = getCookie(c, 'customer_session')
  
  // Keamanan ekstra: Jika entah bagaimana middleware terlewat, lemparkan ke login
  if (!token) return c.redirect('/login')

  try {
    // @ts-ignore
    const payload = await verify(token, c.env.JWT_SECRET)
    
    // @ts-ignore
    const customer = await c.env.DB.prepare(
      'SELECT id, name, email, phone, address FROM users WHERE id = ?'
    ).bind(payload.id).first()

    if (!customer) return c.redirect('/login')

    // Render Island Checkout
    return c.render(
      <CheckoutView customer={customer} />, 
      { title: 'Checkout Pesanan | Butik Emas' }
    )

  } catch (err) {
    return c.redirect('/login')
  }
})
