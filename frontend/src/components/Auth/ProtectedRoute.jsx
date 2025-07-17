import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'

const ProtectedRoute = ({ children }) => {
  const { user, authCookie, logout } = useAuth()
  const [isValidating, setIsValidating] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasShownError, setHasShownError] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const validateAuth = async () => {
      // Si no hay usuario ni token, redirigir inmediatamente
      if (!user && !authCookie) {
        setIsAuthenticated(false)
        setIsValidating(false)
        return
      }
      try {
        // Verificar token con el servidor
        const response = await fetch('http://localhost:4000/api/validateAuthToken', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          console.log("✅ Token válido - user authenticated")
          setIsAuthenticated(true)
          setHasShownError(false) // Reset error flag
        } else {
          // Token inválido, limpiar datos locales
          await logout() // Esto limpiará localStorage y cookies
          setIsAuthenticated(false)
          // Solo mostrar error una vez
          if (!hasShownError) {
            setHasShownError(true)
            if (response.status === 401) {
              toast.error('Sesión expirada. Por favor, inicia sesión.')
            } else if (response.status === 403) {
              toast.error('Acceso no autorizado.')
            } else {
              toast.error('Error de autenticación.')
            }
          }
        }
      } catch (error) {
        console.error('Error validando auth:', error)
        // Error de conexion, limpiar datos
        await logout()
        setIsAuthenticated(false)
        
        if (!hasShownError) {
          setHasShownError(true)
          toast.error('Error de conexión. Redirigiendo al login.')
        }
      } finally {
        setIsValidating(false)
      }
    }
    validateAuth()
  }, [user, authCookie, logout, hasShownError])
  // Mostrar loading mientras valida
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8E1D8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A73249] mx-auto mb-4"></div>
          <p className="text-[#3D1609] font-[Nunito]">Verificando sesión...</p>
        </div>
      </div>
    )
  }
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  // Si está autenticado, mostrar el contenido
  return children
}
export default ProtectedRoute