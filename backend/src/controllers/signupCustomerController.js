const signupCustomerController = {}
// Importo el modelo de clientes
import customersModel from "../models/Customers.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import crypto from 'crypto'
import { config } from "../utils/config.js"
// Función helper para validar
import { validateCustomer } from "../validators/validator.js"
// Función para enviar correo con Brevo
import { sendVerificationEmail } from "../utils/emailService.js"
// POST (CREATE)
signupCustomerController.registerCustomer = async (req, res) => {
  const { name, lastName, username, email, phoneNumber, birthDate, DUI, password, address, isVerified } = req.body
  try {
    const customerExist = await customersModel.findOne({email})
    // Si existe un empleado, entonces se va a responder con un mensaje de error
    if(customerExist){
      return res.status(409).json({message: "El cliente ya existe"})
    }
    // Encriptación de contraseña
    const hashedPassword = await bcryptjs.hash(password, 10)
    /* // Validar lo que venga en req.body
    const validationError = validateCustomer({name, lastName, username, email, phoneNumber, birthDate, DUI, password: hashedPassword, address, isVerified});
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    const newCustomer = new customersModel({name, lastName, username, email, phoneNumber, birthDate, DUI, password: hashedPassword, address, isVerified: isVerified || false})

    await newCustomer.save()
    const verCode = crypto.randomBytes(3).toString('hex')
    // TOKEN
    const token = jsonwebtoken.sign({email, verCode}, config.JWT.secret, { expiresIn: "2h"})
    res.cookie("verificationToken", token, {maxAge: 2 * 60 * 60 * 1000, httpOnly: false, secure: true, sameSite: "none"})
    // NUEVA IMPLEMENTACIÓN: Enviar email con Brevo API (sin SMTP)
    try {
      await sendVerificationEmail(newCustomer.email, verCode, 'customer')
      
      console.log("Email de verificación enviado exitosamente con Brevo API")
      return res.status(201).json({ 
        message: "Cliente registrado. Por favor verifica tu correo electrónico",
        customer: {
          id: newCustomer._id,
          name: newCustomer.name,
          lastName: newCustomer.lastName,
          email: newCustomer.email,
          phoneNumber: newCustomer.phoneNumber,
          birthDate: newCustomer.birthDate,
          DUI: newCustomer.DUI,
          address: newCustomer.address,
          isVerified: newCustomer.isVerified
        }
      })
    } catch (emailError) {
      console.error("Error al enviar el email con Brevo API:", emailError)
      return res.status(500).json({message: "Usuario creado pero error al enviar email de verificación"})
    }
  } catch (error) {
    console.log("error", error)
    res.status(500).json({message: "Error al registrar el cliente", error: error.message})
  }
}
// Verificar el código de verificación
signupCustomerController.verifyCodeEmail = async (req, res) => {
    const { verCodeRequest } = req.body
    try {
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
      // Si el código es correcto, actualizar el estado del cliente a "verified" 
      const customer = await customersModel.findOne({email})
      customer.isVerified = true
      await customer.save()

      res.clearCookie("verificationToken")
      res.status(200).json({message: "Cuenta verificada exitosamente"})
    } catch (error) {
      console.error("Error en la verificación:", error)
      res.status(500).json({message: "Error en la verificación", error: error.message})
    }
}
export default signupCustomerController