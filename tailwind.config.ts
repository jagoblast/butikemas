import type { Config } from 'tailwindcss'

export default {
  // Fokuskan pemindaian class CSS pada area Frontend (app/) saja
  content: [
    './app/**/*.tsx',
    './app/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        // Tambahkan warna brand Logam Mulia Anda di sini
        primary: {
          50: '#fefce8',
          500: '#eab308', // Kuning Emas
          600: '#ca8a04',
          900: '#713f12',
        }
      }
    },
  },
  plugins: [],
} satisfies Config
