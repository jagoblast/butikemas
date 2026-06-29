import { createRoute } from 'honox/factory'
import AdminCategoryEditForm from '../../../islands/AdminCategoryEditForm'

export default createRoute(async (c) => {
  const id = c.req.param('id')
  
  // Ambil data kategori saat ini dari database
  const category: any = await c.env.DB.prepare(
    'SELECT * FROM categories WHERE id = ?'
  ).bind(id).first()

  if (!category) return c.text('Kategori tidak ditemukan', 404)

  return c.render(
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <a href="/admin/categories" className="p-2 text-gray-400 hover:text-navy-900 bg-white rounded-xl border border-gray-200 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Kategori</h1>
          <p className="text-sm text-gray-500">Perbarui informasi kategori produk.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <AdminCategoryEditForm category={category} />
      </div>
    </div>,
    { title: `Edit Kategori - ${category.name}` }
  )
})
