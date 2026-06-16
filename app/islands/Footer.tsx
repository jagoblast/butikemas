import { Globe2, MapPin, MessageCircle, ExternalLink } from 'lucide-react'

export default function Footer() {
  const profile = {
    companyName: 'Logam Mulia Butik Emas',
    companyDescription: 'Penyedia layanan dan produk emas berkualitas dengan sertifikasi resmi. Investasi aman dan terpercaya untuk masa depan Anda.',
    address: 'Jl. Jend. Sudirman Kav. 1, Jakarta Pusat, Indonesia',
    whatsAppContact: '6281234567890',
  }

  return (
    <footer id="footer" className="bg-navy-900 text-white border-t border-gold-400/15">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Desc */}
          <div className="lg:col-span-1">
            <h2 className="text-[24px] font-heading font-bold text-gold-400 mb-4">
              {profile.companyName}
            </h2>
            <p className="text-sm text-white/70 max-w-xl leading-relaxed">
              {profile.companyDescription}
            </p>
          </div>

          {/* Tautan Cepat */}
          <div>
            <h3 className="font-bold text-gold-400 mb-4 text-[16px]">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <a href="/cara-pembelian" className="text-sm text-white/70 hover:text-white transition-colors">
                  Cara Pembelian
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${profile.whatsAppContact}`} target="_blank" rel="noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Alamat */}
          <div>
            <h3 className="font-bold text-gold-400 mb-4 text-[16px]">Alamat</h3>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm mb-1">{profile.companyName}</h4>
                <p className="text-sm text-white/70 leading-relaxed">
                  {profile.address}
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
               <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/75 hover:bg-gold-400 hover:text-navy-900 transition-colors">
                 <MessageCircle className="h-4 w-4" />
               </a>
            </div>
          </div>

          {/* Akreditasi & Keamanan */}
          <div>
            <div className="mb-6">
              <h3 className="font-bold text-gold-400 mb-3 text-[16px]">Akreditasi</h3>
              <div className="flex items-center gap-4">
                <img src="/images/lbma.png" alt="LBMA" className="object-contain h-10 w-auto" />
                <img src="/images/kan.png" alt="KAN" className="object-contain h-10 w-auto" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gold-400 mb-3 text-[16px]">Keamanan</h3>
              <div className="flex items-center gap-4">
                <img src="/images/ssl.png" alt="SSL" className="object-contain h-10 w-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Logos */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-6">
          <img src="/images/lm.png" alt="Logam Mulia" className="h-auto w-[220px] max-w-[76vw] object-contain sm:w-[240px]" />
          <img src="/images/antam.png" alt="Antam" className="h-auto w-[168px] max-w-[58vw] object-contain sm:w-[190px]" />
        </div>
      </div>
    </footer>
  )
}
