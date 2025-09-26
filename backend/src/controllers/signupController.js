const signupController = {}
// Importo el modelo de empleados
import employeesModel from "../models/Employees.js"
import bcryptjs from "bcryptjs"
import crypto from 'crypto'
import jsonwebtoken from "jsonwebtoken"
import { config } from "../utils/config.js"
// Función helper para validar
import { validateEmployee } from "../validators/validator.js"
// Función para enviar correo con Brevo
import { sendVerificationEmail } from "../utils/emailService.js"
// POST (CREATE)
signupController.registerEmployee = async (req, res) => {
  const { name, lastName, username, email, phoneNumber, birthDate, DUI, password, hireDate, isVerified } = req.body

  try {
    // Verificacion de si el empleado ya existe
    const employeeExist = await employeesModel.findOne({email})
    // Si existe un empleado, entonces se va a responder con un mensaje de error
    if(employeeExist){
      return res.status(409).json({ message: "El empleado ya existe" }) // 409 Conflict
    }
    // Encriptación de contraseña
    const hashedPassword = await bcryptjs.hash(password, 10)
    /* // Validar lo que venga en req.body
    const validationError = validateEmployee({name, lastName, username, email, phoneNumber, birthDate, DUI, password: hashedPassword, hireDate, isVerified});
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    const newUser = new employeesModel({ name, lastName, username, email, phoneNumber, birthDate: new Date(birthDate), DUI, password: hashedPassword, hireDate: new Date(hireDate), isVerified: isVerified || false })

    await newUser.save()
    // Generar código de verificación
    const verCode = crypto.randomBytes(3).toString('hex')
    // TOKEN de verificación
    const token = jsonwebtoken.sign({ email: newUser.email, verCode }, config.JWT.secret, { expiresIn: "2h" })
    res.cookie("verificationToken", token, {maxAge: 2 * 60 * 60 * 1000, httpOnly: false, secure: true, sameSite: "none"}) // 2 horas
    // NUEVA IMPLEMENTACIÓN: Enviar email con Brevo API (sin SMTP)
    try {
      await sendVerificationEmail(newUser.email, verCode, 'employee')
      
      console.log("Email de verificación enviado exitosamente con Brevo API")
      return res.status(201).json({ 
        message: "Empleado registrado. Por favor verifica tu correo electrónico",
        employee: {
          id: newUser._id,
          name: newUser.name,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          birthDate: newUser.birthDate,
          DUI: newUser.DUI,
          hireDate: newUser.hireDate,
          isVerified: newUser.isVerified
        }
      })
    } catch (emailError) {
      console.error("Error al enviar el email con Brevo API:", emailError)
      return res.status(500).json({message: "Usuario creado pero error al enviar email de verificación"})
    }
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: "Error interno del servidor", error: error.message })
  }
}
// Verificar el código de verificación
signupController.verifyCodeEmail = async (req, res) => {
  const { verCodeRequest } = req.body
  try {
    console.log('=== VERIFY CODE EMAIL DEBUG ===')
    console.log('All cookies:', req.cookies)
    console.log('verificationToken:', req.cookies.verificationToken)
    console.log('authToken:', req.cookies.authToken)
    // TOKEN
    const token = req.cookies.verificationToken
    // Verificar si el token existe y es válido
    if (!token) {
        return res.status(400).json({message: "No se encontró el token de verificación"})
    }
    // Verificar y decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret)
    const {email, verCode: storedCode} = decoded
    // Comparar los códigos
    if (verCodeRequest !== storedCode) {
      return res.status(400).json({message: "Código de verificación incorrecto"})
    }
    // Si el código es correcto, actualizar el estado del empleado a "verified"
    const employee = await employeesModel.findOne({email})
    if (!employee) {
      return res.status(404).json({message: "Empleado no encontrado"})
    }
    employee.isVerified = true
    // Guardar el empleado con el estado actualizado
    await employee.save()

    res.clearCookie("verificationToken")
    res.status(200).json({message: "Cuenta verificada exitosamente"})
  } catch (error) {
    console.error("Error en la verificación:", error)
    res.status(500).json({message: "Error en la verificación", error: error.message})
  }
}
export default signupController