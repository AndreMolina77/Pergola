import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
 
const useDataSubcategories = () => {
  const API = "http://localhost:4000/api/subcategories"
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
 
  const fetchSubcategories = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      })
      // Si es 403 (sin permisos), no mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para subcategorías - usuario no autorizado")
        setSubcategories([])
        setLoading(false)
        return
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las subcategorías")
      }
      const data = await response.json()
      setSubcategories(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener subcategorías:", error)
      // Solo mostrar toast si NO es error de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar subcategorías")
      }
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchSubcategories()
  }, [])
  //Funcion para crear el manejo de la creacion y edicion de registros 
  const createHandlers = (API) => ({
    data: subcategories,
    loading,
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
        toast.success('SubCategoría registrada exitosamente')
        fetchSubcategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar subcategoría")
        throw error
      }
    }, onEdit: async (id, data) => {
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
        toast.success('SubCategoría actualizada exitosamente')
        fetchSubcategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar subcategoría")
        throw error
      }
    }, onDelete: deleteSubcategory
  })
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
      toast.success('SubCategoría eliminada exitosamente')
      fetchSubcategories()
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error)
      toast.error("Error al eliminar subcategoría")
    }
  }
  return {
    subcategories,
    loading,
    deleteSubcategory,
    fetchSubcategories,
    createHandlers
  }
}
export default useDataSubcategories