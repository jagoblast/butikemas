import { Hono } from 'hono'

const shippingApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [POST] Hitung Ongkos Kirim via RajaOngkir
shippingApi.post('/cost', async (c) => {
  const { origin_city_id, destination_city_id, weight_grams, courier } = await c.req.json()

  // 1. Ambil API Key RajaOngkir dari Database D1 (Keamanan level Production)
  const configQuery = await c.env.DB.prepare(
    "SELECT setting_data FROM system_settings WHERE setting_key = 'RAJAONGKIR_API_KEY'"
  ).first()

  if (!configQuery) {
    return c.json({ success: false, message: 'Konfigurasi kurir belum disetel admin' }, 500)
  }
  const apiKey = configQuery.setting_data as string

  try {
    // 2. Fetch langsung ke RajaOngkir API dari Edge Worker
    const response = await fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        'key': apiKey,
        'content-type': 'application/x-www-form-urlencoded'
      },
      // RajaOngkir Starter menggunakan x-www-form-urlencoded
      body: new URLSearchParams({
        origin: origin_city_id,
        destination: destination_city_id,
        weight: weight_grams.toString(),
        courier: courier // 'jne', 'pos', atau 'tiki'
      }).toString()
    })

    const result = await response.json()

    // 3. Kembalikan data yang sudah diformat ke frontend
    return c.json({
      success: true,
      data: result.rajaongkir.results[0].costs
    })
  } catch (error) {
    console.error("RajaOngkir Error:", error)
    return c.json({ success: false, message: 'Gagal menghubungi server kurir' }, 502)
  }
})

export default shippingApi
