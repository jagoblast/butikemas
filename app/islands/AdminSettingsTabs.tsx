import { useState } from 'hono/jsx'
import AdminChangePassword from './AdminChangePassword'

export default function AdminSettingsTabs() {
  const [activeTab, setActiveTab] = useState('password')

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Kolom Navigasi Setting */}
      <div className="md:col-span-1 space-y-2">
        <button 
          onClick={() => setActiveTab('password')}
          className={`w-full text-left px-4 py-3 font-semibold rounded-xl transition-colors border shadow-sm ${
            activeTab === 'password' 
              ? 'bg-white text-navy-900 border-navy-100' 
              : 'bg-transparent text-gray-600 border-transparent hover:bg-white hover:text-navy-900'
          }`}
        >
          Keamanan & Password
        </button>
        <button 
          onClick={() => setActiveTab('integration')}
          className={`w-full text-left px-4 py-3 font-semibold rounded-xl transition-colors border shadow-sm ${
            activeTab === 'integration' 
              ? 'bg-white text-navy-900 border-navy-100' 
              : 'bg-transparent text-gray-600 border-transparent hover:bg-white hover:text-navy-900'
          }`}
        >
          Integrasi (RajaOngkir & Cloudinary)
        </button>
        <button 
          onClick={() => setActiveTab('company')}
          className={`w-full text-left px-4 py-3 font-semibold rounded-xl transition-colors border shadow-sm ${
            activeTab === 'company' 
              ? 'bg-white text-navy-900 border-navy-100' 
              : 'bg-transparent text-gray-600 border-transparent hover:bg-white hover:text-navy-900'
          }`}
        >
          Informasi Perusahaan
        </button>
      </div>

      {/* Kolom Konten Setting */}
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          
          {activeTab === 'password' && (
            <div>
              <h2 className="text-lg font-bold text-navy-900 mb-4 border-b border-gray-100 pb-4">Ubah Kata Sandi</h2>
              <AdminChangePassword />
            </div>
          )}

          {activeTab === 'integration' && (
            <div>
              <h2 className="text-lg font-bold text-navy-900 mb-4 border-b border-gray-100 pb-4">Integrasi Sistem</h2>
              <p className="text-sm text-gray-500">Pengaturan API Key untuk pihak ketiga akan diletakkan di sini.</p>
              {/* Nanti Anda bisa memasukkan <AdminIntegrationForm /> di sini */}
            </div>
          )}

          {activeTab === 'company' && (
            <div>
              <h2 className="text-lg font-bold text-navy-900 mb-4 border-b border-gray-100 pb-4">Informasi Perusahaan</h2>
              <p className="text-sm text-gray-500">Form untuk mengubah profil, alamat, dan logo perusahaan.</p>
              {/* Nanti Anda bisa memasukkan <AdminCompanyProfileForm /> di sini */}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
