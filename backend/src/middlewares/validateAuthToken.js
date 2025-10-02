import jsonwebtoken from "jsonwebtoken"
import { config } from "../utils/config.js"

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      const { authToken } = req.cookies

      if (!authToken) {
        return res.status(401).json({ 
          message: "Token no proporcionado", 
          success: false
        });
      }
      const decodedToken = jsonwebtoken.verify(authToken, config.JWT.secret)
      // Verificar permisos si se especificaron tipos permitidos
      if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(decodedToken.userType)) {
        return res.status(403).json({ 
          message: "Acceso denegado - Tipo de usuario no autorizado",
          code: "INSUFFICIENT_PERMISSIONS",
          userType: decodedToken.userType,
          allowedTypes: allowedUserTypes
        })
      }      
      req.userId = decodedToken.id
      req.userType = decodedToken.userType
      req.userEmail = decodedToken.email
      req.userName = decodedToken.name      
      req.userLastName = decodedToken.lastName 
      // Para la respuesta, incluir userId
      res.locals.tokenData = {
        userId: decodedToken.id,
        userType: decodedToken.userType,
        email: decodedToken.email
      }               
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: "Token expirado, inicia sesión nuevamente",
          success: false,
          code: "TOKEN_EXPIRED"
        })
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: "Token inválido",
          success: false,
          code: "INVALID_TOKEN"
        })
      } else {
        return res.status(500).json({ 
          message: "Error al validar el token",
          success: false,
          code: "VALIDATION_ERROR"
        })
      }
    }
  }
}