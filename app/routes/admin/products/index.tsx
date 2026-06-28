import { createRoute } from 'honox/factory'

// Menggunakan createRoute agar kita bisa melempar metadata (seperti title) ke layout
export default createRoute((c) => {
  return c.render(
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Daftar Produk</h2>
        {/* Navigasi MPA untuk pindah halaman tambah produk */}
        <a 
          href="/admin/products/new" 
          className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Tambah Produk
        </a>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="p-4 font-semibold">Nama Produk</th>
              <th className="p-4 font-semibold">Harga</th>
              <th className="p-4 font-semibold">Stok</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {/* Tabel akan diisi data dari database (D1) nantinya */}
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="p-4 font-medium">Emas Batangan 1 Gram</td>
              <td className="p-4">Rp 1.350.000</td>
              <td className="p-4">15</td>
              <td className="p-4">
                {/* PERBAIKAN FATAL: Menghapus /edit agar cocok dengan routing HonoX [id].tsx */}
                <a href="/admin/products/1" className="text-blue-600 font-semibold hover:underline">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>,
    { title: 'Kelola Produk' } // title ini akan diterima oleh _renderer.tsx
  )
})
