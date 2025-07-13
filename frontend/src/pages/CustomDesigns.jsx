import { useEffect, useState } from "react";

export default function CustomDesigns() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/customdesigns");
      const data = await res.json();
      setDesigns(data);
    } catch (error) {
      console.error("Error al cargar diseños personalizados:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro que quieres eliminar este diseño?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/customdesigns/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar diseño");
      alert("Diseño eliminado");
      loadDesigns();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (id) => {
    alert(`Editar diseño con ID: ${id}`);
    // Aquí podrías abrir un modal con el formulario para editar
  };

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Diseños Personalizados</h1>
      </div>

      {loading ? (
        <p>Cargando diseños...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 table-fixed text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">Código Solicitud</th>
                <th className="border px-2 py-1">Pieza</th>
                <th className="border px-2 py-1">Base</th>
                <th className="border px-2 py-1">Longitud Base</th>
                <th className="border px-2 py-1">Decoración</th>
                <th className="border px-2 py-1">Cierre</th>
                <th className="border px-2 py-1">Comentarios Cliente</th>
                <th className="border px-2 py-1">Fecha Creación</th>
                <th className="border px-2 py-1 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {designs.length > 0 ? (
                designs.map((design) => (
                  <tr key={design._id}>
                    <td className="border px-2 py-1">{design.codeRequest}</td>
                    <td className="border px-2 py-1">{design.piece || "—"}</td>
                    <td className="border px-2 py-1">{design.base || "—"}</td>
                    <td className="border px-2 py-1">{design.baseLength || "—"}</td>
                    <td className="border px-2 py-1">{design.decoration || "—"}</td>
                    <td className="border px-2 py-1">{design.clasp || "—"}</td>
                    <td className="border px-2 py-1">{design.customerComments || "—"}</td>
                    <td className="border px-2 py-1">{new Date(design.createdAt).toLocaleDateString()}</td>
                    <td className="border px-2 py-1 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(design._id)}
                        className="text-blue-600 underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(design._id)}
                        className="text-red-600 underline"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No hay diseños personalizados registrados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
