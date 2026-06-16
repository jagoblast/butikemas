import pages from '@hono/vite-cloudflare-pages'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import { defineConfig } from 'vite'

// Import plugin CSS secara manual
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ mode }) => {
  // Konfigurasi wajib untuk memaksa Vite memproses Tailwind
  const cssConfig = {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  }

  if (mode === 'client') {
    return {
      plugins: [client()],
      css: cssConfig
    }
  }
  
  return {
    plugins: [
      honox(),
      pages()
    ],
    css: cssConfig
  }
})
