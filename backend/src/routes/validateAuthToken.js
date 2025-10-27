// Libreria para enrutamiento express
import express from "express"
// Importo el middleware de validación del token
import { validateAuthToken } from "../middlewares/validateAuthToken.js"

const router = express.Router()
// Ruta para validar el token de autenticación
router.post("/", validateAuthToken(["admin", "employee", "customer"]), (req, res) => {
  // Si llegamos aqui, significa que el token es válido
  console.log("🔐 validateAuthToken endpoint - Token válido para:", {
    userId: req.userId,
    userType: req.userType,
    email: req.userEmail
  })
  // ESTADO DE OK
  res.status(200).json({ message: "Token válido", valid: true, userType: req.userType || 'unknown', userId: req.userId, email: req.userEmail, name: req.userName, lastName: req.userLastName })
})
export default router