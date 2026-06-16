import AdminChangePassword from '../../../islands/AdminChangePassword'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
        <p className="text-sm text-gray-500">Kelola keamanan akun dan konfigurasi integrasi pihak ketiga.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Navigasi Setting */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-white text-navy-900 font-semibold rounded-xl border border-navy-100 shadow-sm">
            Keamanan & Password
          </button>
          <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-white hover:text-navy-900 font-medium rounded-xl transition-colors">
            Integrasi (RajaOngkir & Cloudinary)
          </button>
          <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-white hover:text-navy-900 font-medium rounded-xl transition-colors">
            Informasi Perusahaan
          </button>
        </div>

        {/* Kolom Konten Setting (Ganti Password) */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-navy-900 mb-4 border-b border-gray-100 pb-4">Ubah Kata Sandi</h2>
            <AdminChangePassword />
          </div>
        </div>
      </div>
    </div>
  )
}
