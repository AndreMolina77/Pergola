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
        const employees = await Employees.find().select('-password');
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
        const employee = await Employees.findById(req.params.id).select('-password');
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