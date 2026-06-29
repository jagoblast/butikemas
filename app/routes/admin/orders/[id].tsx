import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const orderId = c.req.param('id')
  
  // Ambil data pesanan beserta detailnya
  const order: any = await c.env.DB.prepare(
    'SELECT * FROM orders WHERE id = ?'
  ).bind(orderId).first()

  if (!order) {
    return c.text('Pesanan tidak ditemukan', 404)
  }

  // Ambil item produk untuk pesanan ini
  const { results: items } = await c.env.DB.prepare(
    'SELECT * FROM order_items WHERE order_id = ?'
  ).bind(orderId).all()

  // Render langsung di sini atau panggil Island jika Anda punya AdminOrderDetail
  return c.render(
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <a href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900 underline">
          &larr; Kembali ke Daftar Pesanan
        </a>
      </div>
      
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Detail Pesanan Admin: {order.id}</h1>
        <div className="space-y-4">
          <p><strong>Pelanggan:</strong> {order.customer_name}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> Rp {order.total_amount?.toLocaleString('id-ID')}</p>
        </div>

        <h2 className="font-bold mt-8 mb-4">Daftar Item:</h2>
        <div className="divide-y divide-gray-100">
          {items.map((item: any) => (
            <div key={item.id} className="py-3 flex justify-between">
              <span>{item.product_name} (x{item.quantity})</span>
              <span>Rp {(item.price_at_purchase * item.quantity).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { title: `Detail Pesanan ${orderId}` }
  )
})
