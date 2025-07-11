import { useEffect, useState } from "react";
import { getAllProducts } from "../services/products";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cerrar" : "Nuevo Producto"}
        </button>
      </div>

      {showForm && (
        <ProductForm onSuccess={loadProducts} onClose={() => setShowForm(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p>{p.description}</p>
            <p className="text-sm text-gray-500">Stock: {p.stock}</p>
            <p className="text-sm text-green-600">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}