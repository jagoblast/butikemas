import { css } from 'hono/css'
// Mengimpor Island (Komponen Interaktif)
import ProductCatalog from '../islands/ProductCatalog'

export default function Home() {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Logam Mulia Antam - Edge</title>
        {/* Menyisipkan Tailwind atau Global CSS Anda */}
        <link rel="stylesheet" href="/style.css" />
        {/* Wajib untuk memuat skrip interaktivitas */}
        <script type="module" src="/app/client.ts"></script>
      </head>
      <body className="bg-gray-50 min-h-screen">
        
        {/* Header Statis (Sangat Cepat karena di-render di Edge) */}
        <header className="bg-white shadow-sm p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-yellow-600">Logam Mulia</h1>
            <nav>
              <a href="/login" className="text-sm font-medium px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                Masuk / Daftar
              </a>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto mt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Investasi Emas Masa Depan</h2>
            <p className="text-gray-600 mt-2">Harga terupdate secara real-time dari jaringan Edge Cloudflare.</p>
          </div>

          {/* Memanggil Komponen Island untuk memuat data dari API */}
          <ProductCatalog />
          
        </main>
      </body>
    </html>
  )
}
