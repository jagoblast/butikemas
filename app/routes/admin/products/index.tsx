// Mengimpor Island (Komponen yang hidup di sisi klien untuk interaksi form)
import AdminProductForm from '../../../islands/AdminProductForm'

export default async function AdminProductsPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Produk</h2>
        {/* Tombol ini bisa disetel untuk membuka modal form (ada di dalam island) */}
      </div>

      {/* Kita panggil komponen Island yang bertugas mengelola form input */}
      <AdminProductForm />

      {/* Di sini nantinya akan ada tabel yang menampilkan list produk */}
      <div className="mt-8 border-t pt-6">
        <p className="text-gray-500 text-sm">Tabel produk akan dimuat di sini...</p>
      </div>
    </div>
  )
}
