import { Hono } from 'hono'

const webhookApi = new Hono<{ Bindings: Env['Bindings'] }>()

webhookApi.post('/payment', async (c) => {
  try {
    // 1. Ambil Signature dari Header
    const signature = c.req.header('X-Callback-Signature')
    if (!signature) {
      return c.json({ success: false, message: 'Missing signature' }, 401)
    }

    // 2. Ambil raw JSON body sebagai teks murni (Wajib untuk Hash)
    const rawBody = await c.req.text()

    // 3. Ambil Callback Key dari Database
    const dbSettings: any = await c.env.DB.prepare(
      `SELECT setting_data FROM system_settings WHERE setting_key = 'OMNIPAYGATE_CREDENTIALS'`
    ).first()

    if (!dbSettings) {
      return c.json({ success: false, message: 'Gateway not configured' }, 500)
    }

    const gatewayCreds = JSON.parse(dbSettings.setting_data)
    const callbackKey = gatewayCreds.callback_key

    // 4. Validasi HMAC-SHA256 menggunakan Web Crypto API (Kompatibel dengan Cloudflare Workers)
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', 
      encoder.encode(callbackKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false, 
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
    
    // Convert ArrayBuffer to Hex String
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Jika hash tidak sama, tolak request (Upaya peretasan)
    if (signature !== expectedSignature) {
      return c.json({ success: false, message: 'Invalid signature' }, 403)
    }

    // 5. Parse Data Webhook yang sudah tervalidasi
    const payload = JSON.parse(rawBody)
    const invoiceId = payload.merchant_ref_id // Ini adalah orderId sistem kita (contoh: INV-12345...)
    const newStatus = payload.status // PAID, FAILED, EXPIRED

    // 6. Update Status Pesanan di Database D1
    await c.env.DB.prepare(
      'UPDATE orders SET status = ? WHERE id = ?'
    ).bind(newStatus, invoiceId).run()

    return c.json({ success: true, message: 'Webhook processed' })

  } catch (error) {
    console.error('Webhook Error:', error)
    return c.json({ success: false, message: 'Internal Server Error' }, 500)
  }
})

export default webhookApi
