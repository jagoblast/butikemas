import ProductCatalog from '../../islands/ProductCatalog'

export default function ProductsPage() {
  // Komponen ini dieksekusi di Server Edge
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Katalog Emas Antam</h1>
        <p className="text-gray-600">Harga diperbarui secara real-time.</p>
      </div>
      
      {/* Memanggil Island yang bertugas melakukan fetch data */}
      <ProductCatalog />
    </div>
  )
}
