import pages from '@hono/vite-cloudflare-pages'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  // Jika sedang mem-build frontend (browser)
  if (mode === 'client') {
    return {
      plugins: [client()]
    }
  }
  
  // Jika sedang mem-build server (Cloudflare Edge)
  return {
    plugins: [
      honox(),
      pages()
    ]
  }
})
