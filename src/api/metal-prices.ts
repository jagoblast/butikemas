import { Hono } from 'hono'

const metalPricesApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Publik: Ambil Harga Emas Hari Ini (Terbaru)
metalPricesApi.get('/current', async (c) => {
  // Ambil 1 baris terakhir berdasarkan waktu pembuatan
  const price = await c.env.DB.prepare(
    'SELECT buyback_price, sell_price, updated_at FROM metal_prices ORDER BY created_at DESC LIMIT 1'
  ).first()

  if (!price) {
    return c.json({ success: false, message: 'Harga emas belum diatur' }, 404)
  }

  return c.json({ success: true, data: price })
})

// [GET] Publik/Admin: Ambil Riwayat Grafik Harga (Contoh: 30 hari terakhir)
metalPricesApi.get('/history', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM metal_prices ORDER BY created_at DESC LIMIT 30'
  ).all()
  return c.json({ success: true, data: results })
})

// [POST] Admin: Update Harga Emas Baru (Menambah Riwayat Baru)
metalPricesApi.post('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)

  const { buyback_price, sell_price } = await c.req.json()

  await c.env.DB.prepare(
    'INSERT INTO metal_prices (id, buyback_price, sell_price) VALUES (lower(hex(randomblob(16))), ?, ?)'
  ).bind(buyback_price, sell_price).run()

  return c.json({ success: true, message: 'Harga emas harian berhasil diupdate!' })
})

export default metalPricesApi
