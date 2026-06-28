import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
import { getCookie } from 'hono/cookie'
import PublicNavbar from '../islands/PublicNavbar'
import BottomBar from '../islands/BottomBar' 

export default jsxRenderer(({ children, title }, c) => {
  const currentPath = c.req.path
  
  // Cek session langsung dari server
  const isLoggedIn = !!getCookie(c, 'customer_session') 

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Logam Mulia` : 'Logam Mulia - Investasi Emas'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />
        <Link rel="stylesheet" href="/app/style.css" />
        <Script src="/app/client.ts" />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50 antialiased font-sans text-navy-900 pb-16 md:pb-0">
        
        {/* Passing parameter isLoggedIn ke Navbar */}
        <PublicNavbar currentPath={currentPath} isLoggedIn={isLoggedIn} />

        <main className="flex-grow w-full">
          {children}
        </main>

        <footer className="bg-[#0f172a] text-white pt-16 pb-8 border-t border-[#1e293b]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              
              <div className="md:col-span-1">
                <h3 className="text-[#C99738] font-bold text-lg mb-4 font-serif">Logam Mulia Antam</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Distributor resmi logam mulia Antam, menyediakan solusi investasi emas yang aman dan transparan.
                </p>
              </div>

              <div>
                <h3 className="text-[#C99738] font-bold text-sm mb-4">Tautan Cepat</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><a href="/how-to-buy" className="hover:text-white transition-colors">Cara Pembelian</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Hubungi Kami</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#C99738] font-bold text-sm mb-4">Alamat</h3>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <svg className="w-5 h-5 text-[#C99738] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <div>
                    <strong className="text-white block mb-1">Logam Mulia Antam</strong>
                    Unit Bisnis Pengolahan dan Pemurnian Logam Mulia Gedung Graha Dipta, Jakarta 13250
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[#C99738] font-bold text-sm mb-4">Akreditasi</h3>
                <div className="flex items-center gap-4 mb-6">
                  <img src="https://emas.pasdigi.id/images/lbma.png" alt="LBMA" className="h-8 bg-white p-1 rounded" />
                  <img src="https://emas.pasdigi.id/images/kan.png" alt="KAN" className="h-8 bg-white p-1 rounded" />
                  <img src="https://emas.pasdigi.id/images/cert.png" alt="CERT" className="h-8 bg-white p-1 rounded" />
                </div>
                <h3 className="text-[#C99738] font-bold text-sm mb-4">Keamanan</h3>
                <img src="https://emas.pasdigi.id/images/ssl.png" alt="SSL Secure" className="h-10" />
              </div>

            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#1e293b] gap-6">
              <div className="flex items-center gap-3">
                <img src="https://emas.pasdigi.id/images/logo-lm.png" alt="Logam Mulia" className="h-10 brightness-0 invert opacity-80" />
                <div>
                  <p className="font-bold text-lg font-serif">LOGAM MULIA</p>
                  <p className="text-[10px] tracking-[0.2em] text-gray-400">Purity is reliable</p>
                </div>
              </div>
              <img src="https://emas.pasdigi.id/images/antam.png" alt="Antam" className="h-8 brightness-0 invert opacity-80" />
            </div>
          </div>
        </footer>

        {/* Passing parameter isLoggedIn ke BottomBar */}
        <BottomBar currentPath={currentPath} isLoggedIn={isLoggedIn} />
      </body>
    </html>
  )
})
