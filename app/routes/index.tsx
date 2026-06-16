export default function Index() {
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Contoh Memanggil Image Banner dari URL Anda */}
      <section className="w-full bg-navy-900">
        <div className="container-main py-0">
          <div className="w-full aspect-[21/9] md:aspect-[3/1] relative overflow-hidden rounded-b-2xl shadow-elevation-high">
            <img 
              src="https://emas.pasdigi.id/images/banner-simfoni.webp" 
              alt="Promo Logam Mulia" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contoh Memanggil Video dari URL Anda */}
      <section className="section-main w-full">
        <div className="container-main text-center">
          <h2 className="section-heading mx-auto mb-8">Video Edukasi</h2>
          <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-elevation-mid border border-navy-100">
            <video 
              controls 
              preload="metadata"
              className="w-full aspect-video object-cover bg-navy-900"
              poster="https://emas.pasdigi.id/images/banner-1.png"
            >
              {/* Ganti dengan nama file video Anda jika sudah diunggah ke server */}
              <source src="https://emas.pasdigi.id/videos/profil-antam.mp4" type="video/mp4" />
              Browser Anda tidak mendukung pemutaran video.
            </video>
          </div>
        </div>
      </section>

    </div>
  )
}
