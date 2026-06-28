import { createRoute } from 'honox/factory'
import CustomerOrderDetail from '../../../islands/CustomerOrderDetail'

export default createRoute((c) => {
  const orderId = c.req.param('id')
  
  return c.render(
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <CustomerOrderDetail orderId={orderId} />
    </div>,
    { title: `Detail Pesanan ${orderId}` }
  )
})
