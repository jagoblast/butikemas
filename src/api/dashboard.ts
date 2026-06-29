import { Hono } from 'hono'

const dashboardApi = new Hono<{ Bindings: Env['Bindings'] }>()

dashboardApi.get('/summary', async (c) => {
  try {
    // 1. Hitung Total Pendapatan (dari pesanan berstatus PAID atau COMPLETED)
    const revenueQuery = await c.env.DB.prepare(`
      SELECT SUM(total_amount) as total 
      FROM orders 
      WHERE status IN ('PAID', 'COMPLETED')
    `).first()
    const totalRevenue = revenueQuery?.total || 0

    // 2. Hitung Pesanan Baru (status PENDING)
    const newOrdersQuery = await c.env.DB.prepare(`
      SELECT COUNT(id) as count 
      FROM orders 
      WHERE status = 'PENDING'
    `).first()
    const newOrders = newOrdersQuery?.count || 0

    // 3. Hitung Total Pelanggan
    const customersQuery = await c.env.DB.prepare(`
      SELECT COUNT(id) as count 
      FROM users 
      WHERE role = 'customer'
    `).first()
    const totalCustomers = customersQuery?.count || 0

    // 4. Hitung Total Stok Emas (dalam Gram)
    const stockQuery = await c.env.DB.prepare(`
      SELECT SUM(stock * weight_gram) as total_gram 
      FROM products 
      WHERE is_active = 1
    `).first()
    const totalStockGram = stockQuery?.total_gram || 0

    // 5. Ambil 5 Pesanan Terbaru
    const { results: recentOrders } = await c.env.DB.prepare(`
      SELECT id, customer_name, total_amount, status, created_at 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all()

    return c.json({
      success: true,
      data: {
        totalRevenue,
        newOrders,
        totalCustomers,
        totalStockGram,
        recentOrders
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard summary:', error)
    return c.json({ success: false, message: 'Gagal memuat ringkasan dashboard' }, 500)
  }
})

export default dashboardApi
