import { useState, useEffect } from 'hono/jsx'

// Tipe data produk
type Product = {
  id: string
  name: string
  price: number
  image_url: string
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Menembak rute API lokal yang aman (dikendalikan oleh src/api/index.ts)
    fetch('/api/public/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Gagal mengambil data", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center p-10">Memuat Katalog Emas...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
          {/* Menggunakan gambar langsung dari Cloudinary */}
          {product.image_url && (
             <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
          )}
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-yellow-600 font-semibold">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
            Beli Sekarang
          </button>
        </div>
      ))}
    </div>
  )
}
