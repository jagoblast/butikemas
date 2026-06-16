import type { Context } from 'hono'

export default async function ProductDetailPage(c: Context) {
  // Mengambil parameter URL (slug)
  const slug = c.req.param('slug')

  // Catatan: Karena kita di Server (Edge), idealnya kita bisa langsung fetch ke D1
  // Tapi demi menjaga batas API kita, kita lakukan fetch internal.
  const host = c.req.header('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  
  // Memanggil API rahasia kita di src/api
  const response = await fetch(`${protocol}://${host}/api/public/products/${slug}`)
  const result = await response.json()
  const product = result.data

  if (!product) {
    return c.html(<div className="text-center py-20 text-xl font-bold">Produk Tidak Ditemukan</div>, 404)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-lg shadow">
      <div>
        <img src={product.image_url} alt={product.name} className="w-full h-auto rounded-lg" />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold mb-4">{product.name}</h1>
        <p className="text-2xl text-yellow-600 font-bold mb-6">Rp {product.price.toLocaleString('id-ID')}</p>
        <p className="text-gray-600 mb-8">
          Sertifikat resmi. Emas batangan 99.99% dijamin keasliannya.
        </p>
        
        {/* Island interaktif untuk tombol tambah keranjang */}
        <button className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition">
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  )
}
