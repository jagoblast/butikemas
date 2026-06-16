import { createRoute } from 'honox/factory'
import CartView from '../../islands/CartView'

export default createRoute((c) => {
  return c.render(
    // Kita panggil Island komponen interaktif keranjang
    <CartView />,
    { title: 'Keranjang Belanja' }
  )
})
