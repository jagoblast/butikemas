import { createApp } from 'honox/server'
import { showRoutes } from 'hono/dev'
import { Hono } from 'hono'

// 1. IMPORT BACKEND DARI SRC (Aman!)
import backendApi from '../src/api/index'

// 2. Inisialisasi Aplikasi Utama
const app = new Hono()

// 3. Pasang Backend API di rute /api
// Semua frontend di app/ harus melakukan fetch ke /api/...
app.route('/api', backendApi)

// 4. Inisialisasi Frontend HonoX (membaca folder app/routes)
const frontApp = createApp({
  app
})

showRoutes(frontApp)

export default frontApp
