import { Hono } from 'hono'

const uploadApi = new Hono<{ Bindings: Env['Bindings'] }>()

// Ingat: Rute ini nantinya dilindungi JWT Admin
uploadApi.post('/', async (c) => {
  try {
    // 1. Tangkap FormData dari browser
    const body = await c.req.parseBody()
    const file = body['file'] as File

    if (!file) {
      return c.json({ success: false, message: 'File tidak ditemukan' }, 400)
    }

    // 2. Ambil Kredensial Cloudinary dari Database D1 (Sesuai kesepakatan kita sebelumnya)
    const configQuery = await c.env.DB.prepare(
      "SELECT setting_data FROM system_settings WHERE setting_key = 'CLOUDINARY_CREDENTIALS'"
    ).first()

    if (!configQuery) {
      return c.json({ success: false, message: 'Cloudinary belum dikonfigurasi' }, 500)
    }

    const cloudinaryConfig = JSON.parse(configQuery.setting_data as string)
    const cloudName = cloudinaryConfig.cloud_name
    const uploadPreset = cloudinaryConfig.upload_preset // Gunakan Unsigned Upload Preset untuk keamanan di Edge

    // 3. Siapkan form data untuk dikirim ke Cloudinary
    const cloudinaryData = new FormData()
    cloudinaryData.append('file', file)
    cloudinaryData.append('upload_preset', uploadPreset)

    // 4. Tembak langsung ke REST API Cloudinary (Sangat Cepat di Edge!)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: cloudinaryData
    })

    const result = await response.json()

    if (result.secure_url) {
      return c.json({ 
        success: true, 
        image_url: result.secure_url // URL ini yang akan disimpan ke database D1
      })
    } else {
      return c.json({ success: false, message: 'Gagal upload ke Cloudinary' }, 500)
    }

  } catch (error) {
    console.error("Upload Error:", error)
    return c.json({ success: false, message: 'Terjadi kesalahan sistem' }, 500)
  }
})

export default uploadApi
