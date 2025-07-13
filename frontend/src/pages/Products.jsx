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
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  return (
  <div className="p-6 overflow-x-auto">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Productos</h1>
      <button
        style={{ backgroundColor: "#A73249" }}
        className="text-white px-4 py-2 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cerrar" : "Añadir Datos"}
      </button>
    </div>

    {showForm && (
      <ProductForm onSuccess={loadProducts} onClose={() => setShowForm(false)} />
    )}


      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 table-fixed text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">Nombre</th>
              <th className="border px-2 py-1">Descripción</th>
              <th className="border px-2 py-1">Código</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Precio</th>
              <th className="border px-2 py-1">Coste</th>
              <th className="border px-2 py-1">Descuento</th>
              <th className="border px-2 py-1">Imágenes</th>
              <th className="border px-2 py-1">Colección</th>
              <th className="border px-2 py-1">Categoría</th>
              <th className="border px-2 py-1">Subcategoría</th>
              <th className="border px-2 py-1">Materia Prima</th>
              <th className="border px-2 py-1">Destacado</th>
              <th className="border px-2 py-1">Correlativo</th>
              <th className="border px-2 py-1">Tipo Movimiento</th>
              <th className="border px-2 py-1">Gastos</th>
              <th className="border px-2 py-1">Aplica Descuento</th>
              <th className="border px-2 py-1">Acciones</th> {/* Nueva columna */}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="border px-2 py-1">{product.name}</td>
                  <td className="border px-2 py-1">{product.description}</td>
                  <td className="border px-2 py-1">{product.codeProduct}</td>
                  <td className="border px-2 py-1">{product.stock}</td>
                  <td className="border px-2 py-1">${product.price}</td>
                  <td className="border px-2 py-1">${product.cost}</td>
                  <td className="border px-2 py-1">{product.discount}%</td>
                  <td className="border px-2 py-1">
                    {product.images?.length > 0
                      ? `${product.images.length} imagen(es)`
                      : "Ninguna"}
                  </td>
                  <td className="border px-2 py-1">{product.collection?.name || "—"}</td>
                  <td className="border px-2 py-1">{product.category?.name || "—"}</td>
                  <td className="border px-2 py-1">{product.subcategory?.name || "—"}</td>
                  <td className="border px-2 py-1">{product.rawMaterialsUsed?.name || "—"}</td>
                  <td className="border px-2 py-1">{product.featured ? "Sí" : "No"}</td>
                  <td className="border px-2 py-1">{product.correlativo}</td>
                  <td className="border px-2 py-1">{product.movementType}</td>
                  <td className="border px-2 py-1">{product.applicableExpenses}</td>
                  <td className="border px-2 py-1">{product.applyDiscount ? "Sí" : "No"}</td>
                  <td className="border px-2 py-1 text-center space-x-2">
                    <button
                      onClick={() => alert(`Editar producto: ${product._id}`)}
                      className="text-blue-600 underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => alert(`Eliminar producto: ${product._id}`)}
                      className="text-red-600 underline"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="18" className="text-center py-4 text-gray-500">
                  No hay productos registrados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
