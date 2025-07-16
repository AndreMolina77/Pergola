import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar categorías
const useDataCategories = () => {
  const API = "http://localhost:4000/api/categories" // URL base para la API de categorías
  const [categories, setCategories] = useState([])   // Estado que almacena las categorías
  const [loading, setLoading] = useState(true)       // Estado que indica si está cargando

  // Función para obtener las categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include" // Incluye cookies (para autenticación con sesión)
      })

      // Si no tiene permisos, simplemente se informa por consola y se evita mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para categorías - usuario no autorizado")
        setCategories([])
        setLoading(false)
        return
      }

      // Si hay otro tipo de error, se lanza una excepción
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las categorías")
      }

      const data = await response.json()
      setCategories(data) // Se actualiza el estado con las categorías recibidas
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener categorías:", error)

      // Solo mostrar toast si el error NO es de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar categorías")
      }
      setLoading(false)
    }
  }

  // Se ejecuta automáticamente cuando el componente que usa este hook se monta
  useEffect(() => {
    fetchCategories()
  }, [])

  // Función que devuelve los handlers para crear, editar y eliminar categorías
  const createHandlers = (API) => ({
    data: categories,
    loading,

    // Handler para crear una nueva categoría
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar categoría")
        }

        toast.success("Categoría registrada exitosamente")
        fetchCategories() // Actualizar datos después de crear
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar categoría")
        throw error
      }
    },

    // Handler para editar una categoría existente
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar categoría")
        }

        toast.success("Categoría actualizada exitosamente")
        fetchCategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar categoría")
        throw error
      }
    },

    // Handler para eliminar una categoría (llama a la función deleteCategory)
    onDelete: deleteCategory
  })

  // Función para eliminar una categoría específica por ID
  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la categoría")
      }

      toast.success("Categoría eliminada exitosamente")
      fetchCategories() // Se refrescan los datos
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
      toast.error("Error al eliminar categoría")
    }
  }

  // Retornamos los datos y funciones para usar en componentes
  return {
    categories,
    loading,
    deleteCategory,
    fetchCategories,
    createHandlers
  }
}

export default useDataCategories
