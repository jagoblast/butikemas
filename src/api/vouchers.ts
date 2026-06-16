import { Hono } from 'hono'

const vouchersApi = new Hono<{ Bindings: Env['Bindings'] }>()

// [POST] Publik/Customer: Validasi Voucher saat Checkout
vouchersApi.post('/validate', async (c) => {
  const { code, cart_total } = await c.req.json()

  // Cari voucher berdasarkan kode yang aktif
  const voucher = await c.env.DB.prepare(
    `SELECT * FROM vouchers 
     WHERE code = ? AND is_active = 1 
     AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)
     AND (usage_limit IS NULL OR usage_count < usage_limit)`
  ).bind(code.toUpperCase()).first()

  if (!voucher) {
    return c.json({ success: false, message: 'Kode voucher tidak valid, kadaluarsa, atau kuota habis.' }, 400)
  }

  const minPurchase = voucher.min_purchase as number
  if (minPurchase && cart_total < minPurchase) {
    return c.json({ success: false, message: `Minimal belanja Rp ${minPurchase.toLocaleString()} untuk voucher ini.` }, 400)
  }

  // Hitung nilai diskon
  let discountAmount = 0
  if (voucher.discount_type === 'PERCENTAGE') {
    discountAmount = cart_total * ((voucher.discount_value as number) / 100)
    // Cek max discount jika ada
    const maxDiscount = voucher.max_discount as number
    if (maxDiscount && discountAmount > maxDiscount) {
      discountAmount = maxDiscount
    }
  } else {
    discountAmount = voucher.discount_value as number
  }

  return c.json({
    success: true,
    data: {
      code: voucher.code,
      discount_amount: discountAmount
    }
  })
})

// [POST] Admin: Buat Voucher Baru
vouchersApi.post('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)
  
  const { code, discount_type, discount_value, min_purchase, max_discount, usage_limit, valid_until } = await c.req.json()

  try {
    await c.env.DB.prepare(
      `INSERT INTO vouchers (id, code, discount_type, discount_value, min_purchase, max_discount, usage_limit, valid_until) 
       VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      code.toUpperCase(), discount_type, discount_value, min_purchase, max_discount, usage_limit, valid_until
    ).run()

    return c.json({ success: true, message: 'Voucher berhasil dibuat' })
  } catch (error) {
    return c.json({ success: false, message: 'Kode voucher sudah ada.' }, 400)
  }
})

// [GET] Admin: Lihat semua voucher
vouchersApi.get('/', async (c) => {
  if (!c.req.path.includes('/admin/')) return c.json({ success: false }, 403)
  const { results } = await c.env.DB.prepare('SELECT * FROM vouchers ORDER BY created_at DESC').all()
  return c.json({ success: true, data: results })
})

export default vouchersApi
