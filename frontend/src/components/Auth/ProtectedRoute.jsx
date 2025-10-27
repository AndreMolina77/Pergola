import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth() // ← Remover authCookie
  const [isValidating, setIsValidating] = useState(!authLoading && !user)
  const location = useLocation()

  useEffect(() => {
    // Solo validar si hay usuario pero queremos verificar con el servidor
    const validateAuth = async () => {
      // Si no hay usuario, no validar
      if (!user) {
        setIsValidating(false)
        return
      }

      try {
        const response = await fetch('https://pergola.onrender.com/api/validateAuthToken', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          // Token válido, todo está bien
          setIsValidating(false)
        } else {
          // Token inválido - NO llamar a logout aquí para evitar ciclos
          console.warn("Token inválido en ProtectedRoute")
          setIsValidating(false)
          // Mostrar error pero no redirigir automáticamente
          if (response.status === 401) {
            toast.error('Sesión expirada. Por favor, inicia sesión.')
          }
        }
      } catch (error) {
        console.error('Error validando auth:', error)
        setIsValidating(false)
        toast.error('Error de conexión.')
      }
    }

    // Solo validar si hay usuario y no está cargando
    if (user && !authLoading) {
      validateAuth()
    } else {
      setIsValidating(false)
    }
  }, [user, authLoading]) 

  // Mostrar loading mientras valida
  if (authLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8E1D8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A73249] mx-auto mb-4"></div>
          <p className="text-[#3D1609] font-[Nunito]">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si está autenticado, muestra el contenido protegido
  return children
}

export default ProtectedRoute