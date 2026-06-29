import { createRoute } from 'honox/factory'
import CheckoutView from '../../islands/CheckoutView'

type Env = {
  Bindings: { DB: any }
  Variables: { jwtPayload: any }
}

export default createRoute<Env>(async (c) => {
  // 1. Ambil payload dari middleware (customer/_middleware.ts)
  const payload = c.get('jwtPayload')
  
  // 2. Tarik data user dari Database beserta Alamat Default
  // PERBAIKAN: Gunakan LEFT JOIN ke tabel addresses agar data alamat ditarik dengan benar
  const customer: any = await c.env.DB.prepare(`
    SELECT u.id, u.name, u.email, u.phone, a.address 
    FROM users u 
    LEFT JOIN addresses a ON a.user_id = u.id AND a.is_default = 1 
    WHERE u.id = ?
  `).bind(payload.id).first()

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
