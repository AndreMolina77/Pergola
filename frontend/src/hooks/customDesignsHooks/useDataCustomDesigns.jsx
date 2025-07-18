import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar datos de diseños únicos
const useDataCustomDesigns = () => {
  const API = "http://localhost:4000/api/customdesigns"
  const [customdesigns, setCustomDesigns] = useState([]) // estado de diseños
  const [loading, setLoading] = useState(true) // estado de carga

  // Obtiene los diseños desde el backend
  const fetchCustomDesigns = async () => {
    try {
      const response = await fetch(API, { credentials: "include" })
      if (response.status === 403) { // sin permisos
        console.log("⚠️ Sin permisos para diseños únicos")
        setCustomDesigns([])
        setLoading(false)
        return
      }
      if (!response.ok) throw new Error("Hubo un error al obtener los diseños únicos")
      const data = await response.json()
      setCustomDesigns(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener diseños únicos:", error)
      if (!error.message.includes("403")) toast.error("Error al cargar diseños únicos")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomDesigns() // carga al montar
  }, [])

  // Genera handlers para CRUD
  const createHandlers = (API) => ({
    data: customdesigns,
    loading,
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/customdesigns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar diseño único")
        }
        toast.success('Diseño único registrado exitosamente')
        fetchCustomDesigns() 
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar diseño único")
        throw error
      }
    },
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/customdesigns/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar diseño único")
        }
        toast.success('Diseño único actualizado exitosamente')
        fetchCustomDesigns() 
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar diseño único")
        throw error
      }
    }, onDelete: deleteCustomDesign // usa la función de borrar
  })

  // Borra diseño por ID
  const deleteCustomDesign = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar el diseño único")
      toast.success('Diseño único eliminada exitosamente')
      fetchCustomDesigns()
    } catch (error) {
      console.error("Error al eliminar diseño único:", error)
      toast.error("Error al eliminar diseño único")
    }
  }

  // Retorna estados y funciones
  return {
    customdesigns,
    loading,
    deleteCustomDesign,
    fetchCustomDesigns,
    createHandlers
  }
}

export default useDataCustomDesigns
