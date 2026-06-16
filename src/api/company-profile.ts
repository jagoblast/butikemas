import { Hono } from 'hono'

const companyProfileApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [GET] Publik: Ambil semua data profil perusahaan
companyProfileApi.get('/', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT key, value, type FROM company_profile').all()
  return c.json({ success: true, data: results })
})

// [PUT] Admin: Simpan atau Update Konfigurasi (Bersifat Upsert/Bulk)
companyProfileApi.put('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)

  const { settings } = await c.req.json() 
  // Ekspektasi: settings = [{ key: "hero_title", value: "Logam Mulia", type: "text" }, ...]

  // D1 mendukung eksekusi batch untuk mempercepat banyak query sekaligus
  const statements = settings.map((s: any) => {
    return c.env.DB.prepare(
      `INSERT INTO company_profile (id, key, value, type) 
       VALUES (lower(hex(randomblob(16))), ?, ?, ?) 
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, type = excluded.type, updated_at = CURRENT_TIMESTAMP`
    ).bind(s.key, s.value, s.type)
  })

  await c.env.DB.batch(statements)

  return c.json({ success: true, message: 'Profil perusahaan diperbarui' })
})

export default companyProfileApi
