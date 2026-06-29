import { createRoute } from 'honox/factory'
import CheckoutView from '../../islands/CheckoutView'

type Env = {
  Bindings: { DB: any }
  Variables: { jwtPayload: any }
}

export default createRoute<Env>(async (c) => {
  // 1. Ambil payload dari middleware (customer/_middleware.ts)
  const payload = c.get('jwtPayload')
  
  // 2. Tarik data user dari Database
  // Menggunakan payload.id yang sudah diverifikasi oleh middleware
  const customer: any = await c.env.DB.prepare(
    'SELECT id, name, email, phone FROM users WHERE id = ?'
  ).bind(payload.id).first()

  if (!customer) {
    return c.text("Data pengguna tidak ditemukan di database.", 404)
  }

  // 3. Render langsung tanpa proses verifikasi ganda
  return c.render(
    <div className="max-w-4xl mx-auto">
      <CheckoutView customer={customer} />
    </div>, 
    { title: 'Checkout' }
  )
})
