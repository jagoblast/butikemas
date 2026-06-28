import { Hono } from 'hono'

const webhookApi = new Hono<{ Bindings: Env['Bindings'] }>()

webhookApi.post('/payment', async (c) => {
  try {
    // 1. Ambil Signature berdasarkan header dokumentasi Omnipaygate
    const signature = c.req.header('X-Callback-Signature')
    if (!signature) {
      return c.json({ success: false, message: 'Akses ditolak: Missing signature header' }, 401)
    }

    // 2. Ambil raw body murni sebagai teks untuk hashing
    const rawBody = await c.req.text()

    // 3. Ambil Kredensial Callback Key
    const dbSettings: any = await c.env.DB.prepare(
      `SELECT setting_data FROM system_settings WHERE setting_key = 'OMNIPAYGATE_CREDENTIALS'`
    ).first()

    if (!dbSettings) {
      return c.json({ success: false, message: 'Konfigurasi Gateway belum diatur' }, 500)
    }

    const gatewayCreds = JSON.parse(dbSettings.setting_data)
    const callbackKey = gatewayCreds.callback_key

    // 4. Proses Verifikasi HMAC-SHA256 (Cloudflare Web Crypto API Support)
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', 
      encoder.encode(callbackKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false, 
      ['sign']
    )
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
    
    // Konversi ArrayBuffer menjadi Hex String (Format umum HMAC SHA-256 di gateway Indonesia)
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Jika hash dari body dan Callback Key tidak cocok dengan header, tolak.
    if (signature !== expectedSignature) {
      return c.json({ success: false, message: 'Validasi Signature Gagal: Potensi Peretasan' }, 403)
    }

    // 5. Olah payload data JSON webhook
    const payload = JSON.parse(rawBody)
    const invoiceId = payload.merchant_ref_id // Invoice dari DB Sistem
    const newStatus = payload.status // Mendukung: PAID, FAILED, EXPIRED

    // 6. Validasi ketat nama Status dari dokumentasi, menghindari Injection
    const validStatuses = ['PAID', 'FAILED', 'EXPIRED']
    
    if (validStatuses.includes(newStatus)) {
       await c.env.DB.prepare(
         'UPDATE orders SET status = ? WHERE id = ?'
       ).bind(newStatus, invoiceId).run()
    }

    // Webhook dianjurkan membalas Http Code 200 agar sistem pihak ketiga menganggap sukses terkirim.
    return c.json({ success: true, message: 'Webhook sukses diproses' })

  } catch (error) {
    console.error('Webhook Runtime Error:', error)
    return c.json({ success: false, message: 'Internal Server Error' }, 500)
  }
})

export default webhookApi
