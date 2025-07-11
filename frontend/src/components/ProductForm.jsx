import React, { useState } from "react";

export default function Products() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    codeProduct: "",
    stock: 0,
    price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aquí haces el fetch para crear el producto en el backend
    try {
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // si usas cookies / autenticación
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al crear producto");

      const data = await res.json();
      alert("Producto creado con ID: " + data._id);

      // Cierra modal y limpia formulario
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        codeProduct: "",
        stock: 0,
        price: 0,
      });

      // Aquí puedes actualizar la lista de productos si tienes estado global o props

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Agregar Producto
      </button>

      {showModal && (
        <>
          {/* Fondo oscuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl mb-4 font-semibold">Nuevo Producto</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Descripción"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  name="codeProduct"
                  placeholder="Código"
                  value={formData.codeProduct}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Precio"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full border px-3 py-2 rounded"
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
