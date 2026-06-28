import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

// 📦 1. IMPORT SEMUA MODUL FITUR API
import authApi from './auth'
import uploadApi from './upload'
import productsApi from './products'
import ordersApi from './orders'
import articlesApi from './articles'
import boutiquesApi from './boutiques'
import categoriesApi from './categories'
import checkoutApi from './checkout'
import companyProfileApi from './company-profile'
import customersApi from './customers'
import metalPricesApi from './metal-prices'
import paymentMethodsApi from './payment-methods'
import vouchersApi from './vouchers'
import shippingApi from './shipping' // <-- Integrasi RajaOngkir
import webhookApi from './webhook' // <-- Integrasi Webhook Payment Gateway (Omnipaygate)
import settingsApi from './settings' // <-- Integrasi Pengaturan Sistem (Simpan API Keys)

// Inisialisasi API Utama dengan tipe Bindings Cloudflare
const api = new Hono<{ Bindings: Env['Bindings'] }>()

// =================================================================
// 🌍 AREA PUBLIK (Bebas Akses Tanpa Token / Guest)
// =================================================================

// Gerbang Autentikasi Login/Register
api.route('/auth', authApi)

// Transaksi, Webhook & Ongkos Kirim Publik
api.route('/public/checkout', checkoutApi)
api.route('/public/shipping', shippingApi) 
api.route('/webhook', webhookApi) // <-- Endpoint otomatis untuk menerima callback dari Payment Gateway

// Katalog & Konten Publik
api.route('/public/products', productsApi)
api.route('/public/articles', articlesApi)
api.route('/public/boutiques', boutiquesApi)
api.route('/public/categories', categoriesApi)
api.route('/public/company-profile', companyProfileApi)
api.route('/public/metal-prices', metalPricesApi)
api.route('/public/payment-methods', paymentMethodsApi)

// =================================================================
// 🔒 LAPISAN KEAMANAN JWT (MIDDLEWARE SATPAM)
// =================================================================

// Melindungi rute Admin
api.use('/admin/*', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: 'HS256',
    cookie: 'admin_session',
  })
  return jwtMiddleware(c, next)
})

// Melindungi rute Customer (Pelanggan Login)
api.use('/customer/*', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: 'HS256',
    cookie: 'customer_session',
  })
  return jwtMiddleware(c, next)
})

// =================================================================
// 🛡️ AREA ADMIN (Super Rahasia - Terproteksi JWT)
// =================================================================

// Manajemen Sistem & Upload File
api.route('/admin/upload', uploadApi)
api.route('/admin/settings', settingsApi) // <-- Endpoint untuk menyimpan konfigurasi API Keys dari AdminPanel

// Manajemen Transaksi & Pelanggan
api.route('/admin/orders', ordersApi)
api.route('/admin/customers', customersApi)
api.route('/admin/vouchers', vouchersApi)

// Manajemen Konten & Katalog
api.route('/admin/products', productsApi)
api.route('/admin/articles', articlesApi)
api.route('/admin/boutiques', boutiquesApi)
api.route('/admin/categories', categoriesApi)
api.route('/admin/company-profile', companyProfileApi)
api.route('/admin/metal-prices', metalPricesApi)
api.route('/admin/payment-methods', paymentMethodsApi)

// =================================================================
// 👤 AREA CUSTOMER (Pelanggan Terdaftar - Terproteksi JWT)
// =================================================================

// Portal Pelanggan
api.route('/customer/orders', ordersApi)
api.route('/customer/profile', customersApi)

export default api
