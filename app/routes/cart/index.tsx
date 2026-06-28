import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import CartView from '../../islands/CartView'

export default createRoute((c) => {
  // Cek otentikasi di server
  const isLoggedIn = !!getCookie(c, 'customer_session')

  return c.render(
    <CartView isLoggedIn={isLoggedIn} />,
    { title: 'Keranjang Belanja' }
  )
})
