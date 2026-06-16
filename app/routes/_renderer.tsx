import { jsxRenderer } from 'hono/jsx-renderer'
// 1. Tambahkan impor Link dan Script dari honox/server
import { Link, Script } from 'honox/server'

// Ini akan membungkus SEMUA halaman di dalam folder app/routes/
export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Logam Mulia Edge` : 'Logam Mulia Edge'}</title>
        
        {/* 2. Gunakan komponen Link dari HonoX dan arahkan ke path /app/style.css */}
        <Link rel="stylesheet" href="/app/style.css" />
        
        {/* 3. Gunakan komponen Script dari HonoX untuk menghidupkan 'Islands' */}
        <Script src="/app/client.ts" />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* Navbar Statis (Render di Server, tanpa beban JS di browser) */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            {/* Menggunakan tag <a> standar alih-alih router Link (karena ini MPA) */}
            <a href="/" className="text-2xl font-bold text-yellow-600">
              Logam Mulia
            </a>
            <nav className="flex gap-4 items-center">
              <a href="/products" className="text-gray-600 hover:text-black font-medium">Katalog</a>
              <a href="/login" className="px-4 py-2 bg-yellow-500 text-white rounded font-medium hover:bg-yellow-600 transition">
                Masuk
              </a>
            </nav>
          </div>
        </header>

        {/* Konten Utama (Berubah sesuai rute yang diakses) */}
        <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        <footer className="bg-gray-900 text-white py-8 text-center">
          <p>&copy; {new Date().getFullYear()} Logam Mulia Edge. Serverless MPA.</p>
        </footer>
      </body>
    </html>
  )
})
