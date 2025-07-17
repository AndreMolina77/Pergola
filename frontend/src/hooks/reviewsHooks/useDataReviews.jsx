import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar reseñas, clientes y productos
const useDataReviews = () => {
  const API = "http://localhost:4000/api/reviews"
  const [reviews, setReviews] = useState([]) // Lista de reseñas
  const [customers, setCustomers] = useState([]) // Lista de clientes
  const [products, setProducts] = useState([]) // Lista de productos
  const [loading, setLoading] = useState(true) // Estado de carga

  // Obtener reseñas desde el servidor
  const fetchReviews = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include" // Incluye cookies de sesión
      })
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para reseñas - usuario no autorizado")
        setReviews([])
        setLoading(false)
        return
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las reseñas")
      }
      const data = await response.json()
      setReviews(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener reseñas:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar reseñas") // Muestra error si no es por permisos
      }
      setLoading(false)
    }
  }

  // Obtener clientes desde el servidor
  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/customers", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener clientes")
      }
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error al obtener clientes:", error)
    }
  }

  // Obtener productos desde el servidor
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/products", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener productos")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error al obtener productos:", error)
    }
  }

  // Llama a las funciones cuando el componente se monta
  useEffect(() => {
    fetchReviews()
    fetchCustomers()
    fetchProducts()
  }, [])

  // Funciones para agregar, editar y borrar reseñas
  const createHandlers = (API) => ({
    data: reviews, // Devuelve las reseñas
    loading, // Devuelve el estado de carga

    // Agrega una nueva reseña
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar reseña")
        }
        toast.success('Reseña registrada exitosamente')
        fetchReviews()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar reseña")
        throw error
      }
    },

    // Edita una reseña existente
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/reviews/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar reseña")
        }
        toast.success('Reseña actualizada exitosamente')
        fetchReviews()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar reseña")
        throw error
      }
    },

    onDelete: deleteReview // Usa la función para borrar reseñas
  })

  // Borra una reseña por su ID
  const deleteReview = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la reseña")
      }
      toast.success('Reseña eliminada exitosamente')
      fetchReviews()
    } catch (error) {
      console.error("Error al eliminar reseña:", error)
      toast.error("Error al eliminar reseña")
    }
  }

  // Devuelve funciones y datos para usar en el componente
  return {
    reviews,
    customers,
    products,
    loading,
    deleteReview,
    fetchReviews,
    fetchCustomers,
    fetchProducts,
    createHandlers
  }
}

export default useDataReviews
