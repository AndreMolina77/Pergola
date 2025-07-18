import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const useDataCategories = () => {
  const API = "http://localhost:4000/api/categories"
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      })
      // Si es 403 (sin permisos), no mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para categorías - usuario no autorizado")
        setCategories([])
        setLoading(false)
        return
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las categorías")
      }
      const data = await response.json()
      setCategories(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener categorías:", error)
      // Solo mostrar toast si NO es error de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar categorías")
      }
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCategories()
  }, [])
  const createHandlers = (API) => ({
    data: categories,
    loading,
    onAdd: async (data) => {
      try {
        // Usar FormData si hay imagen
        let body
        let headers = { credentials: "include" }

        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
          // No se establece el Content-Type para FormData, dejar que el navegador lo establezca
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/categories`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar categoría")
        }
        toast.success('Categoría registrada exitosamente')
        fetchCategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar categoría")
        throw error
      }
    }, onEdit: async (id, data) => {
      try {
        // Usar FormData si hay imagen
        let body
        let headers = { credentials: "include" }

        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
          // No se establece el Content-Type para FormData, dejar que el navegador lo establezca
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/categories/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar categoría")
        }
        toast.success('Categoría actualizada exitosamente')
        fetchCategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar categoría")
        throw error
      }
    }, onDelete: deleteCategory
  })
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
      toast.success('Categoría eliminada exitosamente')
      fetchCategories()
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
      toast.error("Error al eliminar categoría")
    }
  }
  return {
    categories,
    loading,
    deleteCategory,
    fetchCategories,
    createHandlers
  }
}
export default useDataCategories