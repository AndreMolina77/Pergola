import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext)
    
    if (!context) {
        console.error("❌ useAuth debe ser usado dentro de AuthProvider")
        throw new Error("useAuth debe ser usado dentro de AuthProvider")
    }
    
    console.log("🔍 useAuth context:", { 
        hasUser: !!context.user, 
        userType: context?.user?.userType,
        isLoading: context.isLoading 
    })
    
    return context
}