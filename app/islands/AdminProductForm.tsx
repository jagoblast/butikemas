import { useState } from 'react'

export default function AdminProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: 0,
    stock: 0,
    image_url: '' // Nantinya didapat dari hasil upload Cloudinary
  })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Menyimpan...')

    try {
      // Menembak rute rahasia backend
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Opsi: Jika Anda menggunakan cookie untuk JWT, browser akan mengirimkannya otomatis.
          // Jika menggunakan Bearer token di LocalStorage, Anda menambahkannya di sini:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        setStatus('Berhasil ditambahkan!')
        // Reset form
        setFormData({ name: '', slug: '', price: 0, stock: 0, image_url: '' })
      } else {
        setStatus(`Gagal: ${data.message}`)
      }
    } catch (err) {
      setStatus('Terjadi kesalahan jaringan.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded border">
      <h3 className="col-span-full font-bold text-lg mb-2">Tambah Produk Baru</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nama Produk</label>
        <input 
          type="text" required
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
        <input 
          type="text" required
          value={formData.slug}
          onChange={e => setFormData({...formData, slug: e.target.value})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
        <input 
          type="number" required
          value={formData.price}
          onChange={e => setFormData({...formData, price: Number(e.target.value)})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stok Awal</label>
        <input 
          type="number" required
          value={formData.stock}
          onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
          className="w-full p-2 border rounded" 
        />
      </div>

      <div className="col-span-full">
        <label className="block text-sm font-medium mb-1">URL Gambar (Cloudinary)</label>
        <input 
          type="url" required
          value={formData.image_url}
          onChange={e => setFormData({...formData, image_url: e.target.value})}
          className="w-full p-2 border rounded" 
          placeholder="https://res.cloudinary.com/..."
        />
      </div>

      <div className="col-span-full mt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
          Simpan Produk
        </button>
        {status && <span className="ml-4 text-sm font-medium text-gray-700">{status}</span>}
      </div>
    </form>
  )
}
