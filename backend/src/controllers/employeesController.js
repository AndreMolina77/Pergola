const employeesController = {};
// Importo el modelo de empleados
import Employees from "../models/Employees.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { config } from "../utils/config.js";
// Función helper para validar
import { validateEmployee } from "../validators/validator.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
});
// CREATE (POST)
employeesController.postEmployees = async (req, res) => {
  try {
    const { name, lastName, username, email, phoneNumber, birthDate, DUI, password, hireDate } = req.body;
    // Validación extra de la foto de perfil (porque viene en req.file, no en body)
    if (req.file) {
      const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/jpg", "image/gif"];
      if (!allowedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Formato de imagen no válido (solo jpg, jpeg, png, webp, svg), gif" });
      }
    } 
    // Encriptación de contraseña
    const hashedPassword = await bcryptjs.hash(password, 10)
    // Link de imagen
    let profilePicURL = "";
    // Subir imagen a cloudinary si se proporciona una imagen en la solicitud
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "employees",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg"]
      });
      profilePicURL = result.secure_url;
    }
    /* // Validar lo que venga en req.body
    const validationError = validateEmployee({name, lastName, username, email, phoneNumber, birthDate, DUI, password, profilePic: profilePicURL, hireDate});
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    const newEmployee = new Employees({ name, lastName, username, email, phoneNumber, birthDate: new Date(birthDate), DUI, password: hashedPassword, profilePic: profilePicURL, hireDate: new Date(hireDate) });
    // Guardar empleado
    await newEmployee.save();
    // ESTADO DE CREACIÓN
    res.status(201).json({ message: "Empleado creado con éxito", data: {...newEmployee.toObject(), /* password: undefined  Excluir la contraseña de la respuesta */ }});
  } catch (error) {        
    // Error de duplicados
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `El ${field} ya existe en el sistema` });
    }
    // Error de validación de mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: "Error de validación", errors });
    }
    res.status(400).json({ 
        message: "Error al crear empleado", 
        error: error.message 
    });
  }
};
// READ (GET ALL)
employeesController.getEmployees = async (req, res) => {
  try {
    // Buscar empleados
    const employees = await Employees.find();
    // ESTADO DE OK
    res.status(200).json(employees);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener empleados", error: error.message });
  }
};
// READ (GET ONE BY ID)
employeesController.getEmployee = async (req, res) => {
  try {
    // Buscar un solo empleado
    const employee = await Employees.findById(req.params.id);
    // Validar que el empleado si exista
    if (!employee) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    // ESTADO DE OK
    res.status(200).json(employee);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener empleado", error: error.message });
  }
};
// UPDATE (PUT)
employeesController.putEmployees = async (req, res) => {
  try {
    const updates = req.body;
    /* // Validación extra de la foto de perfil (porque viene en req.file, no en body)
    if (req.file) {
      const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/jpg", "image/gif"];
      if (!allowedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Formato de imagen no válido (solo jpg, jpeg, png, webp, svg), gif" });
      }
    } */
    // Subir imagen a cloudinary si se proporciona una imagen en la solicitud
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "employees",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg"]
      });
      updates.profilePic = result.secure_url;
    }
    /* // Validar lo que venga en req.body
    const validationError = validateEmployee(updates);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    // Actualizar empleado
    const updatedEmployee = await Employees.findByIdAndUpdate( req.params.id, updates, { new: true } ).select('-password');
    // Validar que el empleado si exista
    if (!updatedEmployee) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    // ESTADO DE OK
    res.status(200).json({ message: "Empleado actualizado con éxito", data: updatedEmployee });
  } catch (error) {
    // ESTADO DE ERROR EN INPUT DEL EMPLEADO
    res.status(400).json({ message: "Error al actualizar empleado", error: error.message });
  }
};
// DELETE (DELETE)
employeesController.deleteEmployees = async (req, res) => {
  try {
    // Primero obtener el empleado para eliminar la imagen de Cloudinary si existe
    const employee = await Employees.findById(req.params.id);
    // Validar que el empleado si exista
    if (!employee) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    // Eliminar imagen de Cloudinary si existe
    if (employee.profilePic) {
      const publicId = employee.profilePic.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`employees/${publicId}`);
    }
    // Eliminar el empleado
    await Employees.findByIdAndDelete(req.params.id);
    // ESTADO DE OK
    res.status(200).json({ message: "Empleado eliminado con éxito" });
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al eliminar empleado", error: error.message });
  }
};
// DELETE PROFILE PICTURE ONLY
employeesController.deleteProfilePic = async (req, res) => {
  try {
    // Primero obtener el empleado 
    const employee = await Employees.findById(req.params.id);
    // Validar que el empleado si exista
    if (!employee) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    // Eliminar de Cloudinary si existe
    if (employee.profilePic) {
      const publicId = employee.profilePic.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`employees/${publicId}`);
    }
    // Eliminar solo el campo profilePic
    await Employees.findByIdAndUpdate(req.params.id, { $unset: { profilePic: "" } }, { new: true });
    // ESTADO DE OK
    res.status(200).json({ message: "Foto de perfil eliminada con éxito" });
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({message: "Error al eliminar foto de perfil", error: error.message});
  }
};
export default employeesController;