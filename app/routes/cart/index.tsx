import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import CartView from '../../islands/CartView'

export default createRoute((c) => {
  // PERBAIKAN: Gunakan nama cookie yang BARU agar tombol checkout tidak melempar ke halaman login
  const isLoggedIn = !!getCookie(c, 'butik_cust_session')

  return c.render(
    <CartView isLoggedIn={isLoggedIn} />,
    { title: 'Keranjang Belanja' }
  )
})
