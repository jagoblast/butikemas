import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

import authApi from './auth'
import uploadApi from './upload'
import productsApi from './products'
import adminProductsApi from './admin-products'
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
import shippingApi from './shipping' 
import webhookApi from './webhook' 
import settingsApi from './settings' 
import dashboardApi from './dashboard'

const api = new Hono<{ Bindings: Env['Bindings'] }>()

// =================================================================
//AREA PUBLIK
// =================================================================
api.route('/auth', authApi)
api.route('/public/shipping', shippingApi) 
api.route('/webhook', webhookApi) 
api.route('/public/products', productsApi) // Publik tetap menggunakan productsApi
api.route('/public/articles', articlesApi)
api.route('/public/boutiques', boutiquesApi)
api.route('/public/categories', categoriesApi)
api.route('/public/company-profile', companyProfileApi)
api.route('/public/metal-prices', metalPricesApi)
api.route('/public/payment-methods', paymentMethodsApi)

// =================================================================
// LAPISAN KEAMANAN JWT (MIDDLEWARE SATPAM)
// =================================================================
api.use('/admin/*', async (c, next) => {
  // PERBAIKAN: Gunakan butik_admin_session agar sesuai dengan auth.ts
  const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET, alg: 'HS256', cookie: 'butik_admin_session' })
  return jwtMiddleware(c, next)
})

api.use('/customer/*', async (c, next) => {
  // PERBAIKAN: Gunakan butik_cust_session agar sesuai dengan auth.ts
  const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET, alg: 'HS256', cookie: 'butik_cust_session' })
  return jwtMiddleware(c, next)
})

// =================================================================
// AREA ADMIN
// =================================================================
api.route('/admin/dashboard', dashboardApi)
api.route('/admin/upload', uploadApi)
api.route('/admin/settings', settingsApi) 
api.route('/admin/orders', ordersApi)
api.route('/admin/customers', customersApi)
api.route('/admin/vouchers', vouchersApi)
api.route('/admin/products', adminProductsApi)
api.route('/admin/articles', articlesApi)
api.route('/admin/boutiques', boutiquesApi)
api.route('/admin/categories', categoriesApi)
api.route('/admin/company-profile', companyProfileApi)
api.route('/admin/metal-prices', metalPricesApi)
api.route('/admin/payment-methods', paymentMethodsApi)

// =================================================================
// AREA CUSTOMER
// =================================================================
api.route('/customer/checkout', checkoutApi)
api.route('/customer/orders', ordersApi)
api.route('/customer/profile', customersApi)

export default api
