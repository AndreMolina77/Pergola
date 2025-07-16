import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar la lógica de colecciones
const useDataCollections = () => {
  const API = "http://localhost:4000/api/collections" // URL base de la API de colecciones
  const [collections, setCollections] = useState([])  // Estado para almacenar las colecciones
  const [loading, setLoading] = useState(true)        // Estado de carga

  // Función para obtener las colecciones desde la API
  const fetchCollections = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include" // Incluye cookies (por si hay sesión/autenticación)
      })

      // Si el usuario no tiene permisos (403), no se muestra error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para ver colecciones - usuario no autorizado")
        setCollections([])
        setLoading(false)
        return
      }

      // Si la respuesta no es OK, lanzar error
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las colecciones")
      }

      // Convertir la respuesta a JSON y guardar en estado
      const data = await response.json()
      setCollections(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener las colecciones:", error)
      // Solo mostrar notificación si el error no es por permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar colecciones")
      }
      setLoading(false)
    }
  }

  // Ejecuta `fetchCollections` cuando se monta el componente
  useEffect(() => {
    fetchCollections()
  }, [])

  // Función que devuelve handlers para operaciones CRUD
  const createHandlers = (API) => ({
    data: collections, // Datos actuales
    loading,           // Estado de carga

    // Agregar una nueva colección
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/collections`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar colecciones")
        }

        toast.success("Colección registrada exitosamente")
        fetchCollections() // Refrescar la lista
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar colecciones")
        throw error
      }
    },

    // Editar una colección existente
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/collections/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar colección")
        }

        toast.success("Colección actualizada exitosamente")
        fetchCollections()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar colección")
        throw error
      }
    },

    // Eliminar colección
    onDelete: deleteCollections
  })

  // Función para eliminar una colección por ID
  const deleteCollections = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la colección")
      }

      toast.success("Colección eliminada exitosamente")
      fetchCollections() // Refrescar lista
    } catch (error) {
      console.error("Error al eliminar colección:", error)
      toast.error("Error al eliminar colección")
    }
  }

  // Retornar datos y funciones necesarias para usar el hook
  return {
    collections,
    loading,
    deleteCategory, // ⚠️ ERROR: esta propiedad está mal nombrada, debería ser `deleteCollections`
    fetchCollections,
    createHandlers
  }
}

export default useDataCollections
