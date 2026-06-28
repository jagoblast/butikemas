import { Hono } from 'hono'

// Inisialisasi API dengan tipe Bindings Cloudflare D1
const settingsApi = new Hono<{ Bindings: Env['Bindings'] }>()

// ==========================================
// [GET] Ambil Semua Pengaturan Sistem
// ==========================================
settingsApi.get('/', async (c) => {
  try {
    const settings = await c.env.DB.prepare('SELECT * FROM system_settings').all()
    return c.json({ success: true, data: settings.results })
  } catch (error) {
    console.error('Error fetching all settings:', error)
    return c.json({ success: false, message: 'Gagal mengambil pengaturan dari database' }, 500)
  }
})

// ==========================================
// [GET] Ambil Pengaturan Berdasarkan Key
// ==========================================
settingsApi.get('/:key', async (c) => {
  const key = c.req.param('key')
  
  try {
    const setting = await c.env.DB.prepare(
      'SELECT setting_data FROM system_settings WHERE setting_key = ?'
    ).bind(key).first()
    
    if (!setting) {
      return c.json({ success: false, message: 'Pengaturan tidak ditemukan' }, 404)
    }
    
    return c.json({ success: true, data: setting })
  } catch (error) {
    console.error('Error fetching setting by key:', error)
    return c.json({ success: false, message: 'Gagal mengambil data pengaturan' }, 500)
  }
})

// ==========================================
// [POST] Simpan / Perbarui Pengaturan
// ==========================================
settingsApi.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { setting_key, setting_data } = body

    if (!setting_key || !setting_data) {
      return c.json({ success: false, message: 'Parameter setting_key dan setting_data wajib diisi' }, 400)
    }

    // Cek apakah key tersebut sudah ada di database
    const existing = await c.env.DB.prepare(
      'SELECT setting_key FROM system_settings WHERE setting_key = ?'
    ).bind(setting_key).first()

    if (existing) {
      // Jika sudah ada, lakukan UPDATE
      await c.env.DB.prepare(
        'UPDATE system_settings SET setting_data = ? WHERE setting_key = ?'
      ).bind(setting_data, setting_key).run()
    } else {
      // Jika belum ada, lakukan INSERT
      await c.env.DB.prepare(
        'INSERT INTO system_settings (setting_key, setting_data) VALUES (?, ?)'
      ).bind(setting_key, setting_data).run()
    }

    // Hapus Cache Sistem (Jika Anda menggunakan KV untuk pengaturan)
    if (c.env.STATIC_KV) {
      await c.env.STATIC_KV.delete(`setting_${setting_key}`)
    }

    return c.json({ success: true, message: 'Konfigurasi berhasil disimpan' })
  } catch (error) {
    console.error('Error saving setting:', error)
    return c.json({ success: false, message: 'Gagal menyimpan konfigurasi ke database' }, 500)
  }
})

export default settingsApi
