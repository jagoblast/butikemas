import { createRoute } from 'honox/factory'
import AdminSettingsTabs from '../../../islands/AdminSettingsTabs'

export default createRoute((c) => {
  return c.render(
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
        <p className="text-sm text-gray-500">Kelola keamanan akun dan konfigurasi integrasi pihak ketiga.</p>
      </div>

      {/* Memanggil Island yang berisi logika tab yang sudah reaktif */}
      <AdminSettingsTabs />
    </div>,
    { title: 'Pengaturan Sistem | Admin Panel' }
  )
})
