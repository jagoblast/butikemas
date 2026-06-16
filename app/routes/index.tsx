import ProductCatalog from '../islands/ProductCatalog'

export default function Home() {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Investasi Emas Masa Depan</h2>
        <p className="text-gray-600 mt-2">Harga terupdate secara real-time dari jaringan Edge Cloudflare.</p>
      </div>

      {/* Memanggil Komponen Island */}
      <ProductCatalog />
    </>
  )
}
