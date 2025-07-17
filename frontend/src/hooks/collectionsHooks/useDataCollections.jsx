import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar datos de colecciones
const useDataCollections = () => {
  const API = "http://localhost:4000/api/collections"
  const [collections, setCollections] = useState([]) // estado con colecciones
  const [loading, setLoading] = useState(true) // estado de carga

  // Trae las colecciones del backend
  const fetchCollections = async () => {
    try {
      const response = await fetch(API, { credentials: "include" })
      if (response.status === 403) { // sin permisos
        console.log("⚠️ Sin permisos para colecciones")
        setCollections([])
        setLoading(false)
        return
      }
      if (!response.ok) throw new Error("Hubo un error al obtener las colecciones")
      const data = await response.json()
      setCollections(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener colecciones:", error)
      if (!error.message.includes("403")) toast.error("Error al cargar colecciones")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections() // carga inicial al montar
  }, [])

  // Handlers para CRUD
  const createHandlers = (API) => ({
    data: collections,
    loading,
    onAdd: async (data) => {
      try {
        let body
        let headers = { credentials: "include" }
        // Usa FormData si hay imagen
        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => formData.append(key, data[key]))
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/collections`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar colección")
        }
        toast.success('Colección registrada exitosamente')
        fetchCollections()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar colección")
        throw error
      }
    },
    onEdit: async (id, data) => {
      try {
        let body
        let headers = { credentials: "include" }
        // Igual: usa FormData si hay imagen
        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => formData.append(key, data[key]))
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/collections/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar colección")
        }
        toast.success('Colección actualizada exitosamente')
        fetchCollections()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar colección")
        throw error
      }
    },
    onDelete: deleteCollection // usa la función de borrar
  })

  // Borra colección por ID
  const deleteCollection = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar la colección")
      toast.success('Colección eliminada exitosamente')
      fetchCollections() // recarga lista
    } catch (error) {
      console.error("Error al eliminar colección:", error)
      toast.error("Error al eliminar colección")
    }
  }

  // Retorna estados y funciones
  return {
    collections,
    loading,
    deleteCollection,
    fetchCollections,
    createHandlers
  }
}

export default useDataCollections
