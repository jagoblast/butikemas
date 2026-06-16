import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
import PublicNavbar from '../islands/PublicNavbar'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Logam Mulia` : 'Butik Emas Logam Mulia'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
        <Link rel="stylesheet" href="/app/style.css" />
        <Script src="/app/client.ts" />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50 antialiased font-sans text-navy-900">
        
        {/* Island Navbar yang interaktif */}
        <PublicNavbar />

        {/* Konten Halaman (Index, Products, dll) */}
        <main className="flex-grow w-full">
          {children}
        </main>

        {/* Footer Statis Server-Side */}
        <footer className="bg-navy-900 text-white border-t border-navy-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logam Mulia" className="h-12 w-auto mb-6 brightness-0 invert" />
                <p className="text-navy-300 text-sm leading-relaxed max-w-md">
                  Investasi emas aman dan tepercaya. Menyediakan produk Logam Mulia bersertifikat resmi dengan harga transparan dan kompetitif.
                </p>
              </div>
              <div>
                <h3 className="text-gold-400 font-bold tracking-wider uppercase text-sm mb-4">Layanan</h3>
                <ul className="space-y-3 text-sm text-navy-300">
                  <li><a href="/products" className="hover:text-white transition-colors">Katalog Produk</a></li>
                  <li><a href="/boutiques" className="hover:text-white transition-colors">Jaringan Butik</a></li>
                  <li><a href="/articles" className="hover:text-white transition-colors">Edukasi Investasi</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-gold-400 font-bold tracking-wider uppercase text-sm mb-4">Bantuan</h3>
                <ul className="space-y-3 text-sm text-navy-300">
                  <li><a href="/faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Hubungi Kami</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-navy-800 mt-12 pt-8 text-center text-sm text-navy-400">
              <p>&copy; {new Date().getFullYear()} Logam Mulia. Hak Cipta Dilindungi.</p>
            </div>
          </div>
        </footer>
        
      </body>
    </html>
  )
})
