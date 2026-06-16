import LoginForm from '../../islands/LoginForm'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-2">Selamat Datang Kembali</h1>
        <p className="text-center text-gray-500 mb-6">Masuk untuk melihat pesanan Anda</p>
        
        {/* Memanggil Island Form Login */}
        <LoginForm />
        
      </div>
    </div>
  )
}
