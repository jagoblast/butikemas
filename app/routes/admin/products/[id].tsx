import { createRoute } from 'honox/factory'
import AdminProductForm from '../../../islands/AdminProductForm'

export default createRoute((c) => {
  const productId = c.req.param('id')
  
  return c.render(
    <div className="w-full max-w-4xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <a href="/admin/products" className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-navy-900 transition-colors mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Kembali ke Katalog
          </a>
          <h1 className="text-2xl font-bold text-navy-900">Edit Produk</h1>
          <p className="text-sm text-navy-500 mt-1">Perbarui detail, harga, atau hapus produk dari sistem.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-6 sm:p-8">
        {/* Mengoper productId ke Island Form agar memicu Mode Edit */}
        <AdminProductForm productId={productId} />
      </div>
    </div>,
    { title: 'Edit Produk | Admin Panel' }
  )
})
