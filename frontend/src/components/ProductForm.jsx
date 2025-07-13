import React, { useState } from "react";

export default function ProductForm({ onSuccess, onClose }) {
  const [formData, setFormData] = useState({
  name: "",
  description: "",
  codeProduct: "",
  stock: "",
  price: "",
  cost: "",
  discount: "",
  images: [],
  collection: "",
  category: "",
  subcategory: "",
  rawMaterialsUsed: "",
  featured: false,
  correlativo: "",
  movementType: "ingreso",
  applicableExpenses: "",
  applyDiscount: false,
});


  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, images: [...files] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    for (const key in formData) {
      if (key === "images") {
        for (const file of formData.images) {
          form.append("images", file);
        }
      } else {
        form.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      if (!res.ok) throw new Error("Error al crear producto");

      const data = await res.json();
      alert("Producto creado con ID: " + data._id);

      onSuccess();
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-6 rounded shadow-lg w-full max-w-2xl space-y-3 overflow-y-auto max-h-[90vh] z-50"
      >
        <h2 className="text-xl font-semibold mb-4">Nuevo Producto</h2>

        {/* Inputs */}
        <input
  name="stock"
  type="number"
  placeholder="Cantidad en stock"
  className="input"
  value={formData.stock}
  onChange={handleChange}
/>

<input
  name="price"
  type="number"
  placeholder="Precio del producto"
  className="input"
  value={formData.price}
  onChange={handleChange}
  step="0.01"
/>

<input
  name="cost"
  type="number"
  placeholder="Coste de elaboración"
  className="input"
  value={formData.cost}
  onChange={handleChange}
  step="0.01"
/>

<input
  name="discount"
  type="number"
  placeholder="Descuento (%)"
  className="input"
  value={formData.discount}
  onChange={handleChange}
  step="0.01"
/>

        <select name="movementType" className="input w-full border p-2 rounded" value={formData.movementType} onChange={handleChange}>
          <option value="ingreso">Ingreso</option>
          <option value="salida">Salida</option>
          <option value="esperando">Esperando</option>
        </select>

        <input name="applicableExpenses" placeholder="Gastos aplicables" className="input w-full border p-2 rounded" value={formData.applicableExpenses} onChange={handleChange} />
        <input name="collection" placeholder="Colección" className="input w-full border p-2 rounded" value={formData.collection} onChange={handleChange} />
        <input name="category" placeholder="Categoría" className="input w-full border p-2 rounded" value={formData.category} onChange={handleChange} />
        <input name="subcategory" placeholder="Subcategoría" className="input w-full border p-2 rounded" value={formData.subcategory} onChange={handleChange} />
        <input name="rawMaterialsUsed" placeholder="Materia prima" className="input w-full border p-2 rounded" value={formData.rawMaterialsUsed} onChange={handleChange} />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
          ¿Destacado?
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="applyDiscount" checked={formData.applyDiscount} onChange={handleChange} />
          ¿Aplica descuento?
        </label>

        <div className="flex flex-col space-y-1">
  <label className="text-sm font-medium text-gray-700">Imágenes</label>
  <input
    type="file"
    name="images"
    accept="image/*"
    multiple
    onChange={handleChange}
    className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100"
  />
</div>

       {/* Botones */}
<div className="flex justify-end gap-2 pt-4">
  <button
    type="button"
    onClick={onClose}
    style={{ backgroundColor: "#FF0000" }}
    className="text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Cancelar
  </button>
  <button
    type="submit"
    style={{ backgroundColor: "#A73249" }}
    className="text-white px-4 py-2 rounded hover:bg-[#8B283A]"
  >
    Guardar
  </button>
</div>

      </form>
    </div>
  );
}
