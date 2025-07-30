const employeesController = {};
// Importo el modelo de empleados
import Employees from "../models/Employees.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { config } from "../utils/config.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
});
// CREATE (POST)
employeesController.postEmployees = async (req, res) => {
    try {
        const { name, lastName, username, email, phoneNumber, birthDate, DUI, password, userType, hireDate, isVerified } = req.body;
        if (
            !name ||
            typeof name !== "string" ||
            name.trim().length === 0 ||
            name.trim().length < 2 ||
            name.trim().length > 100
        ) {
            return res.status(400).json({
                message: "El nombre es obligatorio, no puede estar vacío y debe tener entre 2 y 100 caracteres."
            });
        }
        if (
            !lastName ||
            typeof lastName !== "string" ||
            lastName.trim().length === 0 ||
            lastName.trim().length < 2 ||
            lastName.trim().length > 100
        ) {
            return res.status(400).json({
                message: "El apellido es obligatorio, no puede estar vacío y debe tener entre 2 y 100 caracteres."
            });
        }
        if (
            !username ||
            typeof username !== "string" ||
            username.trim().length === 0 ||
            username.trim().length < 5 ||
            username.trim().length > 50
        ) {
            return res.status(400).json({
                message: "El nombre de usuario es obligatorio, no puede estar vacío y debe tener entre 5 y 50 caracteres."
            });
        }
        if (
            !email ||
            typeof email !== "string" ||
            email.trim().length === 0 ||
            !/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(email.trim())
        ) {
            return res.status(400).json({
                message: "El correo electrónico es obligatorio, no puede estar vacío y debe ser válido."
            });
        }
        if (
            !phoneNumber ||
            typeof phoneNumber !== "string" ||
            phoneNumber.trim().length === 0 ||
            !/^(?:\+503\s?)?(6|7)\d{3}-?\d{4}$/.test(phoneNumber.trim())
        ) {
            return res.status(400).json({
                message: "El número de teléfono es obligatorio, no puede estar vacío y debe ser válido en El Salvador."
            }); 
        }
        if (
            !birthDate ||
            isNaN(new Date(birthDate).getTime())
        ) {
            return res.status(400).json({
                message: "La fecha de nacimiento es obligatoria y debe ser una fecha válida."
            });
        }
        if (
            !DUI ||
            typeof DUI !== "string" ||
            DUI.trim().length === 0 ||
            !/^\d{8}-\d{1}$/.test(DUI.trim())
        ) {
            return res.status(400).json({
                message: "El DUI es obligatorio, no puede estar vacío y debe tener el formato 12345678-9."
            });
        }
        if (
            !password ||
            typeof password !== "string" ||
            password.trim().length === 0 ||
            password.trim().length < 8 ||
            password.trim().length > 50
        ) {
            return res.status(400).json({
                message: "La contraseña es obligatoria, no puede estar vacía y debe tener entre 8 y 50 caracteres."
            });
        }
        if (
            !userType ||
            typeof userType !== "string" ||
            !["Administrador", "Empleado"].includes(userType)
        ) {
            return res.status(400).json({
                message: "El tipo de usuario es obligatorio y debe ser 'Administrador' o 'Empleado'."
            });
        } 
        if (
            !hireDate ||
            isNaN(new Date(hireDate).getTime())
        ) {
            return res.status(400).json({
                message: "La fecha de contratación es obligatoria y debe ser una fecha válida."
            });
        }
        // Validar que la imagen sea un archivo válido
        if (!req.file) {
            return res.status(400).json({
                message: "La imagen de perfil es obligatoria y debe ser un archivo válido."
            });
        }
        // Validar tipo de archivo de imagen
        const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validImageTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                message: "El archivo debe ser una imagen válida (jpg, png, gif)."
            });
        }
        if (req.file.size > 2 * 1024 * 1024) { // 2MB
            return res.status(400).json({
                message: "El tamaño de la imagen no puede exceder los 2MB."
            });
        }
        
        // Link de imagen
        let profilePicURL = "";
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "employees",
                allowed_formats: ["jpg", "jpeg", "png", "webp"]
            });
            profilePicURL = result.secure_url;
        }
        const newEmployee = new Employees({ name, lastName, username, email, phoneNumber, birthDate: new Date(birthDate), DUI, password, profilePic: profilePicURL, userType, hireDate: new Date(hireDate), isVerified: isVerified || false });
        // Guardar empleado
        await newEmployee.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Empleado creado con éxito", data: {
                ...newEmployee.toObject(),
                password: undefined // Excluir la contraseña de la respuesta
            }
        });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL EMPLEADO
        res.status(400).json({ message: "Error al crear empleado", error: error.message });
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
        res.status(500).json({ message: "Error al obtener cliente", error: error.message });
    }
};
// UPDATE (PUT)
employeesController.putEmployees = async (req, res) => {
    try {
        const updates = req.body;
        // Manejar la imagen si se proporciona
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "customers",
                allowed_formats: ["jpg", "jpeg", "png", "webp"]
            });
            updates.profilePic = result.secure_url;
        }
        // Actualizar empleado
        const updatedEmployee = await Customers.findByIdAndUpdate( req.params.id, updates, { new: true } ).select('-password');
        // Validar que el cliente si exista
        if (!updatedEmployee) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Empleado actualizado con éxito", data: updatedEmployee });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
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
export default employeesController;