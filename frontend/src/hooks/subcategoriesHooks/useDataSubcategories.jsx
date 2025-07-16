import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar la lógica de las subcategorías
const useDataSubcategories = () => {
  const API = "http://localhost:4000/api/subcategories" // Ruta base para la API
  const [subcategories, setSubcategories] = useState([]) // Estado para guardar las subcategorías
  const [loading, setLoading] = useState(true) // Estado de carga

  // Función para obtener las subcategorías desde la API
  const fetchSubcategories = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include" // Incluir cookies (para autenticación)
      })

      // Si el usuario no tiene permisos (403), no mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para subcategorías - usuario no autorizado")
        setSubcategories([])
        setLoading(false)
        return
      }

      // Si la respuesta es incorrecta, lanzar error
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las subcategorías")
      }

      // Obtener datos de la respuesta
      const data = await response.json()
      setSubcategories(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener subcategorías:", error)

      // Mostrar error solo si no es por falta de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar subcategorías")
      }
      setLoading(false)
    }
  }

  // Ejecutar `fetchSubcategories` al montar el componente
  useEffect(() => {
    fetchSubcategories()
  }, [])

  // Función que devuelve manejadores para agregar, editar y eliminar
  const createHandlers = (API) => ({
    data: subcategories, // Lista de datos actuales
    loading,             // Estado de carga

    // Agregar nueva subcategoría
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/subcategories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar subcategoría")
        }

        toast.success("SubCategoría registrada exitosamente")
        fetchSubcategories() // Actualizar lista
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar subcategoría")
        throw error
      }
    },

    // Editar subcategoría existente
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/subcategories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar subcategoría")
        }

        toast.success("SubCategoría actualizada exitosamente")
        fetchSubcategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar subcategoría")
        throw error
      }
    },

    // Eliminar subcategoría
    onDelete: deleteSubcategory
  })

  // Función para eliminar una subcategoría por ID
  const deleteSubcategory = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la subcategoría")
      }

      toast.success("SubCategoría eliminada exitosamente")
      fetchSubcategories() // Refrescar lista
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error)
      toast.error("Error al eliminar subcategoría")
    }
  }

  // Retornar estados y funciones necesarias para usar este hook
  return {
    subcategories,
    loading,
    deleteSubcategory,
    fetchSubcategories,
    createHandlers
  }
}

export default useDataSubcategories
