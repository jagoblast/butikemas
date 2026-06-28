import { NotFoundHandler } from 'hono'

const handler: NotFoundHandler = (c) => {
  return c.render(
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-slate-500 mb-8 max-w-md">Maaf, rute URL yang Anda tuju tidak tersedia di sistem atau Anda salah mengetikkan alamat.</p>
      <a href="/" className="px-6 py-3 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-colors">
        Kembali ke Beranda
      </a>
    </div>,
    { title: '404 Tidak Ditemukan' }
  )
}

export default handler
