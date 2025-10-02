// Como dije antes, este controlador solo sirve para la configuración del usuario de admin
const adminProfileController = {}
// Importo el modelo de admin
import adminModel from "../models/Admin.js"
// Importación de librerías para encriptar, cloudinary y archivo config
import bcrypt from "bcrypt"
import { config } from "../utils/config.js"
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
})
// Obtener datos de admin SIN autenticacion (para login)
adminProfileController.getProfilePublic = async (req, res) => {
  try {
    console.log("Obteniendo datos públicos del perfil de administrador...")
    console.log("Revisando email:", config.CREDENTIALS.email)
    // Buscar al admin en la base de datos
    const adminUser = await adminModel.findOne({ email: config.CREDENTIALS.email })
    console.log("Usuario de admin encontrado:", adminUser)
    // Si no existe el admin, crearlo
    if (!adminUser) {
      // Si no existe el admin, crearlo
      console.log("Creando nuevo usuario de admin...")
      const newAdmin = new adminModel({ name: "Admin", lastName: "Pergola", email: config.CREDENTIALS.email, profilePic: ""})
      // Guardar admin
      await newAdmin.save()
      console.log("Nuevo admin creado:", newAdmin)
      // ESTADO DE CREACIÓN
      res.status(201).json({ message: "Usuario de administrador creado con éxito", data: newAdmin })
    }   
  } catch (error) {
    console.error("Error en getProfilePublic:", error)
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error del servidor" })
  }
}
// Obtener datos de admin
adminProfileController.getProfile = async (req, res) => {
  try {
    const adminUser = await adminModel.findOne({ email: config.CREDENTIALS.email })

    if (!adminUser) {
      // Si no existe, crearlo
      const newAdmin = new adminModel({ name: "Admin", lastName: "Pérgola", email: config.CREDENTIALS.email, profilePic: "" })
      await newAdmin.save()
      return res.json(newAdmin)
    }
    // ESTADO DE OK
    res.status(200).json(adminUser)
  } catch (error) {
    console.error("Error:", error)
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error del servidor" })
  }
}
// Actualizar perfil de admin
adminProfileController.updateProfile = async (req, res) => {
  try {
    console.log('Admin actualización del perfil - req.body:', req.body)
    console.log('Admin actualización del perfil - req.file:', req.file)
    const { name, lastName, email } = req.body
    let updateData = { name, lastName, email }
    // Si hay imagen, procesarla
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "admin",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
      })
      updateData.profilePic = result.secure_url
    }
    // Actualizar admin en BD
    const updatedAdmin = await adminModel.findOneAndUpdate( { email: config.CREDENTIALS.email }, updateData, { new: true } )
    // ESTADO DE OK
    res.status(200).json({ message: "Perfil de administrador actualizado correctamente", user: updatedAdmin })
  } catch (error) {
    console.error("Error:", error)
    // ESTADO DE ERROR DEL CLIENTE
    res.status(500).json({ message: "Error del servidor" })
  }
}
// Cambiar contraseña de admin
adminProfileController.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const adminUser = await adminModel.findOne({ email: config.CREDENTIALS.email })

    if (!adminUser) {
      return res.status(404).json({ message: "Administrador no encontrado" })
    }
    // Verificar contraseña actual
    const isMatch = await adminUser.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" })
    }
    // Hashear nueva contraseña y guardar
    const salt = await bcrypt.genSalt(10)
    adminUser.password = await bcrypt.hash(newPassword, salt)
    await adminUser.save()

    res.status(200).json({ message: "Contraseña actualizada correctamente" })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: "Error del servidor al cambiar contraseña" })
  }
}
// Actualizar notificaciones de email para admin
adminProfileController.updateNotifications = async (req, res) => {
  try {
    const { emailNotifications } = req.body
    // Actualizar admin
    const updatedAdmin = await adminModel.findOneAndUpdate({ email: config.CREDENTIALS.email }, { emailNotifications: emailNotifications }, { new: true })
    // ESTADO DE OK
    if (!updatedAdmin) {
      // ESTADO DE ERROR DE NO ENCONTRADO
      return res.status(404).json({ message: "Admin no encontrado" })
    }
    // ESTADO DE OK
    res.status(200).json({ message: "Preferencias de notificación actualizadas", emailNotifications: updatedAdmin.emailNotifications })
  } catch (error) {
    console.error("Error:", error)
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error del servidor" })
  }
}
// Eliminar foto de perfil del admin
adminProfileController.deleteProfilePic = async (req, res) => {
  try {
    console.log("Eliminando foto de perfil del admin...");
    // Obtener el admin actual
    const adminUser = await adminModel.findOne({ email: config.CREDENTIALS.email });
    // Validar que el admin exista
    if (!adminUser) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    // Validar que tenga foto de perfil
    if (!adminUser.profilePic) {
      return res.status(400).json({ message: "El administrador no tiene foto de perfil" });
    }
    // Eliminar imagen de Cloudinary si existe
    if (adminUser.profilePic) {
      try {
        const publicId = adminUser.profilePic.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`admin/${publicId}`);
        console.log("Foto eliminada de Cloudinary");
      } catch (cloudinaryError) {
        console.error("Error al eliminar de Cloudinary:", cloudinaryError);
        // Continuar aunque falle Cloudinary para eliminar la referencia en BD
      }
    }
    // Eliminar solo la URL de la foto de perfil en la base de datos
    const updatedAdmin = await adminModel.findOneAndUpdate({ email: config.CREDENTIALS.email }, { $unset: { profilePic: 1 } }, { new: true } );
    console.log("Foto de perfil eliminada correctamente");
    res.status(200).json({ message: "Foto de perfil eliminada con éxito", user: updatedAdmin });
    
  } catch (error) {
    console.error("Error al eliminar foto de perfil del admin:", error);
    res.status(500).json({ message: "Error al eliminar foto de perfil", error: error.message });
  }
};
export default adminProfileController