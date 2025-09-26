const recoveryPasswordController = {}
// Importo el modelo de clientes
import customersModel from "../models/Customers.js"
// Importo el modelo de empleados
import employeesModel from "../models/Employees.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { sendRecoveryEmail } from "../utils/emailService.js"
import { config } from "../utils/config.js"
// POST (CREATE)
recoveryPasswordController.requestCode = async (req, res) => {
  // Obtener el email del cuerpo de la solicitud
  const email = req.body.email
  try {
    let userFound
    let userType
    // Primero buscar en clientes
    userFound = await customersModel.findOne({email: req.body.email})
    if (userFound) {
      userType = "customer"
      console.log("Usuario encontrado en clientes - Tipo: " + userType)
    } else {
      // Si no se encuentra en clientes, buscar en empleados
      userFound = await employeesModel.findOne({email: req.body.email})
      if (userFound) {
        // El userType se establece como empleado
        userType = "employee"
        console.log("Usuario encontrado en empleados - Tipo: " + userType)
      } else {
        return res.status(400).json({message: "El usuario no existe"})
      }
    }
    const code = Math.floor(10000 + Math.random() * 90000).toString()
    // TOKEN
    const token = jsonwebtoken.sign({email, code, userType, verified: false}, config.JWT.secret, { expiresIn: "20m"})
    res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000, httpOnly: true, sameSite: "lax" })
    // NUEVA IMPLEMENTACIÓN: Enviar email con Brevo API (sin SMTP)
    try {
      await sendRecoveryEmail(email, code)
      
      console.log("Email de recuperación enviado exitosamente con Brevo API")
      res.status(200).json({message: "Código de recuperación enviado"})
    } catch (emailError) {
      console.error("Error al enviar email de recuperación con Brevo API:", emailError)
      res.status(500).json({message: "Error al enviar el código de recuperación"})
    }
  } catch (error) {
    console.log("error: ", error)
  }
}
// Verificación de código: POST (CREATE)
recoveryPasswordController.verifyCode = async (req, res) => {
  const { code } = req.body
  try {
    const token = req.cookies.tokenRecoveryCode
    // Verificar si el token existe
    if (!token) {
      return res.status(401).json({ message: "No hay token de recuperación" })
    }
    // Extraer el código del token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret)
    // Comparar los códigos
    if (decoded.code !== code) {
      res.json({message: "Código incorrecto"})
    }
    // TOKEN
    const newToken = jsonwebtoken.sign({email: decoded.email, code: decoded.code, userType: decoded.userType, verified: true}, config.JWT.secret, { expiresIn: "20m"})
    // El token se almacenará en una cookie
    res.cookie("tokenRecoveryCode", newToken, {maxAge: 24*60*1000, httpOnly: true, sameSite: "lax"})
    res.status(200).json({message: "Código de recuperación verificado"})
  } catch (error) {
    console.log("error: ", error)
  }
}
// Cambiar contraseña: POST (CREATE)
recoveryPasswordController.changePassword = async (req, res) => {
  const { newPassword } = req.body
  try {
    const token = req.cookies.tokenRecoveryCode
    // Verificar si el código existe
    if (!token) {
      return res.status(401).json({ message: "No hay token de recuperación" })
    }
    const decoded = jsonwebtoken.verify(token, config.JWT.secret)
    // Comprobar si el código fue verificado
    if (!decoded.verified) {
      return res.status(400).json({message: "Código no verificado"})
    }
    // Obteniendo el email y el tipo de usuario
    const { email, userType } = decoded
    // Encriptar la contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 8)
    // Nuevo usuario
    let updatedUser
    // Actualizar la contraseña del usuario
    if (userType === "customer") {
      updatedUser = await customersModel.findOneAndUpdate({email}, {password: hashedPassword}, {new: true})
    } else if (userType === "employee") {
      updatedUser = await employeesModel.findOneAndUpdate({email}, {password: hashedPassword}, {new: true})
    } else {
      return res.status(400).json({message: "Tipo de usuario no válido"})
    }
    // Eliminar la cookie
    res.clearCookie("tokenRecoveryCode")
    res.status(200).json({message: "Contraseña cambiada"})
  } catch (error) {
    console.log("error: ", error)
  }
}
export default recoveryPasswordController