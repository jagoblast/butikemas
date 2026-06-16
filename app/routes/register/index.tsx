import { createRoute } from 'honox/factory'
import RegisterForm from '../../islands/RegisterForm'

export default createRoute((c) => {
  return c.render(
    <div className="min-h-[calc(100vh-80px)] bg-[#f8f9fa] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        
        {/* Header Register */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-[0_4px_12px_-2px_rgba(15,27,45,0.08)]">
            <div className="relative h-14 w-14">
              <img 
                src="https://emas.pasdigi.id/images/logo-lm.png" 
                alt="Logo Logam Mulia" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
          <h1 className="font-heading text-[28px] text-[#0F1B2D] font-bold">Buat Akun Baru</h1>
          <p className="text-sm text-[#4e4637] mt-2">Daftar untuk lanjut belanja Logam Mulia</p>
        </div>

        {/* Kotak Formulir */}
        <div className="bg-white rounded-2xl border border-[#d2c5b1] shadow-[0_1px_3px_0_rgba(15,27,45,0.08)] p-6 sm:p-8">
          {/* Memanggil Island Client-Side */}
          <RegisterForm />
        </div>
        
      </div>
    </div>,
    { title: 'Daftar Akun Baru' }
  )
})
