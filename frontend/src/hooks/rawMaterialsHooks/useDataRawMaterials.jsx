import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar materias primas y sus proveedores
const useDataRawMaterials = () => {
  const API = "http://localhost:4000/api" // URL base de la API
  const [rawmaterials, setRawMaterials] = useState([]) // Lista de materias primas
  const [suppliers, setSuppliers] = useState([]) // Lista de proveedores
  const [loading, setLoading] = useState(true) // Estado de carga

  // Obtener materias primas desde la API
  const fetchRawMaterials = async () => {
    try {
      const response = await fetch(`${API}/rawmaterials`, {
        credentials: "include"
      })

      // Si el usuario no tiene permisos, evitar mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para materias primas - usuario no autorizado")
        setRawMaterials([])
        setLoading(false)
        return
      }

      // Si la respuesta no es exitosa, lanza error
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las materias primas")
      }

      // Guarda los datos obtenidos
      const data = await response.json()
      setRawMaterials(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener materias primas:", error)
      // Mostrar toast solo si no es un error por falta de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar materias primas")
      }
      setLoading(false)
    }
  }

  // Obtener proveedores desde la API
  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API}/suppliers`, {
        credentials: "include"
      })
      // Si la respuesta no es exitosa, lanza error
      if (!response.ok) {
        throw new Error("Error al obtener proveedores")
      }
      // Guarda los datos obtenidos
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error("Error al obtener proveedores:", error)
    }
  }

  // Ejecutar ambas funciones al cargar el componente
  useEffect(() => {
    fetchRawMaterials()
    fetchSuppliers()
  }, [])

  // Eliminar una materia prima por ID
  const deleteRawMaterial = async (id) => {
    try {
      const response = await fetch(`${API}/rawmaterials/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      // Si la respuesta no es exitosa, lanza error
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la materia prima")
      }
      toast.success("Materia prima eliminada exitosamente")
      fetchRawMaterials() // Recargar lista
    } catch (error) {
      console.error("Error al eliminar materia prima:", error)
      toast.error("Error al eliminar materia prima")
    }
  }

  // Función que retorna los manejadores CRUD para materias primas
  const createHandlers = () => ({
    data: rawmaterials,
    loading,

    // Crear nueva materia prima
    onAdd: async (data) => {
      try {
        let body
        let headers = { credentials: "include" }

        // Si se incluye una imagen, usar FormData
        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }

        const response = await fetch(`${API}/rawmaterials`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        })

        // Si la respuesta no es exitosa, lanza error
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar materia prima")
        }

        toast.success("Materia prima registrada exitosamente")
        fetchRawMaterials()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar materia prima")
        throw error
      }
    },

    // Editar materia prima existente
    onEdit: async (id, data) => {
      try {
        let body
        let headers = { credentials: "include" }

        // Si hay imagen, usar FormData
        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }

        const response = await fetch(`${API}/rawmaterials/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        })

        // Si la respuesta no es exitosa, lanza error
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar materia prima")
        }

        toast.success("Materia prima actualizada exitosamente")
        fetchRawMaterials()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar materia prima")
        throw error
      }
    },

    // Eliminar materia prima
    onDelete: deleteRawMaterial
  })

  // Devolver datos y funciones necesarias al componente que use este hook
  return {
    rawmaterials,
    suppliers,
    loading,
    fetchRawMaterials,
    fetchSuppliers,
    deleteRawMaterial,
    createHandlers
  }
}

export default useDataRawMaterials

