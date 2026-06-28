import { createRoute } from 'honox/factory'
import { getCookie } from 'hono/cookie'
import CartView from '../../islands/CartView'

export default createRoute((c) => {
  // 1. Cek sesi langsung dari server
  const isLoggedIn = !!getCookie(c, 'customer_session')

  return c.render(
    <div className="w-full">
      {/* 2. Lempar status login ke Island Frontend */}
      <CartView isLoggedIn={isLoggedIn} />
    </div>,
    { title: 'Keranjang Belanja' }
  )
})
