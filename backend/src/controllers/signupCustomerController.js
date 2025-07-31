const signupCustomerController = {}
// Importo el modelo de clientes
import customersModel from "../models/Customers.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { config } from "../utils/config.js"
//Post (CREATE)
signupCustomerController.registerCustomer = async (req, res) => {
    const {name, lastName, username, email, phoneNumber, birthDate, DUI, password, address, isVerified} = req.body
    if (!name || !lastName || !username || !email || !phoneNumber || !birthDate || !DUI || !password || !address) {
        return res.status(400).json({message: "Todos los campos son obligatorios"})
    }
    //Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({message: "El correo electrónico no es válido"})
    }
    //Validar el formato del número de teléfono
    const phoneRegex = /^\d{8}$/
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({message: "El número de teléfono debe tener 8 dígitos"})
    }
    //Validar el formato del DUI
    const duiRegex = /^\d{8}-\d{1}$/
    if (!duiRegex.test(DUI)) {
        return res.status(400).json({message: "El DUI debe tener el formato 00000000-0"})
    }
    //Validar la fecha de nacimiento
    const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!birthDateRegex.test(birthDate)) {
        return res.status(400).json({message: "La fecha de nacimiento debe tener el formato AAAA-MM-DD"})
    }
    //Validar la contraseña
    if (password.length < 8) {
        return res.status(400).json({message: "La contraseña debe tener al menos 8 caracteres"})
    }
    //Validar que el nombre de usuario no contenga espacios
    if (/\s/.test(username)) {
        return res.status(400).json({message: "El nombre de usuario no puede contener espacios"})
    }
    //Validar que el nombre de usuario no contenga caracteres especiales
    const usernameRegex = /^[a-zA-Z0-9]+$/
    if (!usernameRegex.test(username)) {
        return res.status(400).json({message: "El nombre de usuario solo puede contener letras y números"})
    }
    //Validar que el nombre de usuario no tenga más de 20 caracteres
    if (username.length > 20) {
        return res.status(400).json({message: "El nombre de usuario no puede tener más de 20 caracteres"})
    }
    //Validar que el nombre no tenga más de 30 caracteres
    if (name.length > 30) {
        return res.status(400).json({message: "El nombre no puede tener más de 30 caracteres"})
    }
    //Validar que el apellido no tenga más de 30 caracteres
    if (lastName.length > 30) {
        return res.status(400).json({message: "El apellido no puede tener más de 30 caracteres"})
    }
    //Validar que la dirección no tenga más de 100 caracteres
    if (address.length > 100) {
        return res.status(400).json({message: "La dirección no puede tener más de 100 caracteres"})
    }
    //Validar que el correo electrónico no tenga más de 50 caracteres
    if (email.length > 50) {
        return res.status(400).json({message: "El correo electrónico no puede tener más de 50 caracteres"})
    }
    //Validar que el número de teléfono no tenga más de 15 caracteres
    if (phoneNumber.length > 15) {
        return res.status(400).json({message: "El número de teléfono no puede tener más de 15 caracteres"})
    }
    //Validar que el DUI no tenga más de 10 caracteres
    if (DUI.length > 10) {
        return res.status(400).json({message: "El DUI no puede tener más de 10 caracteres"})
    }
    //Validar que la contraseña no tenga más de 100 caracteres
    if (password.length > 100) {
        return res.status(400).json({message: "La contraseña no puede tener más de 100 caracteres"})
    }
    //Validar que la fecha de nacimiento sea una fecha válida
    const birthDateObj = new Date(birthDate)
    if (isNaN(birthDateObj.getTime())) {
        return res.status(400).json({message: "La fecha de nacimiento no es válida"})
    }
    //Validar que la fecha de nacimiento sea anterior a la fecha actual
    if (birthDateObj >= new Date()) {
        return res.status(400).json({message: "La fecha de nacimiento debe ser anterior a la fecha actual"})
    }
    //Validar que el correo electrónico no esté vacío
    if (!email || email.trim() === '') {
        return res.status(400).json({message: "El correo electrónico no puede estar vacío"})
    }
    //Validar que el número de teléfono no esté vacío
    if (!phoneNumber || phoneNumber.trim() === '') {
        return res.status(400).json({message: "El número de teléfono no puede estar vacío"})
    }
    //Validar que el DUI no esté vacío
    if (!DUI || DUI.trim() === '') {
        return res.status(400).json({message: "El DUI no puede estar vacío"})
    }   
    //Validar que la dirección no esté vacía
    if (!address || address.trim() === '') {
        return res.status(400).json({message: "La dirección no puede estar vacía"})
    }
    //Validar que el nombre no esté vacío
    if (!name || name.trim() === '') {
        return res.status(400).json({message: "El nombre no puede estar vacío"})
    }
    //Validar que el apellido no esté vacío
    if (!lastName || lastName.trim() === '') {
        return res.status(400).json({message: "El apellido no puede estar vacío"})
    }
    //Validar que el nombre de usuario no esté vacío
    if (!username || username.trim() === '') {
        return res.status(400).json({message: "El nombre de usuario no puede estar vacío"})
    }
    //Validar que la contraseña no esté vacía
    if (!password || password.trim() === '') {
        return res.status(400).json({message: "La contraseña no puede estar vacía"})
    }
    //Validar que el correo electrónico no esté vacío
    if (!email || email.trim() === '') {
        return res.status(400).json({message: "El correo electrónico no puede estar vacío"})
    }
    

    try {
        const customerExist = await customersModel.findOne({email})
        //Si existe un empleado, entonces se va a responder con un mensaje de error
        if(customerExist){
            return res.status(409).json({message: "El cliente ya existe"})
        }
        //Encriptacion de contraseña
        const hashedPassword = await bcryptjs.hash(password, 10)
        const newCustomer = new customersModel({name, lastName, username, email, phoneNumber, birthDate, DUI, password: hashedPassword, address, isVerified: isVerified || false})

        await newCustomer.save()
        const verCode = crypto.randomBytes(3).toString('hex')
        //TOKEN
        const token = jsonwebtoken.sign({email, verCode}, config.JWT.secret, { expiresIn: "2h"})
        res.cookie("verificationToken", token, {maxAge: 2 * 60 * 60 * 1000})
        //Enviar el correo electrónico con el código aleatorio
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.APPUSER.USER,
                pass: config.APPUSER.PASS
            }
        })
        const mailOptions = {
            from: config.APPUSER.USER,
            to: email,
            subject: 'Verificación de cuenta',
            text: `Por favor, ingrese el siguiente código para verificar su cuenta: ${verCode}`
        } 
        //Enviar el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({message: "Error al enviar el correo electrónico", error: error.message})
            }
            console.log("Correo electrónico enviado", info.response)
            res.json({message: "Código de verificación enviado"}); 
        })
        res.json({message: "Cliente registrado, por favor verifica tu correo"})
    } catch (error) {
        console.log("error", error)
        res.status(500).json({message: "Error al registrar el empleado", error: error.message})
    }
}
//Verificar el código de verificación
signupCustomerController.verifyCodeEmail = async (req, res) => {
    const {verCodeRequest} = req.body
    //TOKEN
    const token = req.cookies.verificationToken
    //Verificar y decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret)
    const {email, verCode: storedCode} = decoded
    //Comparar los códigos
    if (verCodeRequest !== storedCode) {
        return res.status(400).json({message: "Código de verificación incorrecto"})
    } 
    //Si el código es correcto, actualizar el estado del cliente a "verified" 
    const customer = await customersModel.findOne({email})
    customer.isVerified = true
    await customer.save()

    res.clearCookie("verificationToken")
    res.status(200).json({message: "Cuenta verificada exitosamente"})
}
export default signupCustomerController