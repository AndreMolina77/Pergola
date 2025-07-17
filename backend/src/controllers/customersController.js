const customersController = {};
// Importo el modelo de clientes
import Customers from "../models/Customers.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { config } from "../utils/config.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
});
// CREATE (POST)
customersController.postCustomers = async (req, res) => {
    try {
        const { name, lastName, username, email, phoneNumber, birthDate, DUI, password, address, isVerified, preferredColors, preferredMaterials, preferredJewelStyle, purchaseOpportunity, allergies, jewelSize, budget } = req.body;
        // Link de imagen
        let profilePicURL = "";
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "customers",
                allowed_formats: ["jpg", "jpeg", "png", "webp"]
            });
            profilePicURL = result.secure_url;
        }
        const newCustomer = new Customers({ name, lastName, username, email, phoneNumber, birthDate: new Date(birthDate), DUI, password, profilePic: profilePicURL, address, isVerified: isVerified || false,
            preferredColors: preferredColors ? preferredColors.split(',') : [],
            preferredMaterials: preferredMaterials ? preferredMaterials.split(',') : [],
            preferredJewelStyle: preferredJewelStyle ? preferredJewelStyle.split(',') : [],
            purchaseOpportunity, allergies, jewelSize, budget });
        // Guardar cliente
        await newCustomer.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Cliente creado con éxito", data: {
                ...newCustomer.toObject(),
                password: undefined // Excluir la contraseña de la respuesta
            }
        });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear cliente", error: error.message });
    }
};
// READ (GET ALL)
customersController.getCustomers = async (req, res) => {
    try {
        // Buscar clientes
        const customers = await Customers.find().select('-password');
        // ESTADO DE OK
        res.status(200).json(customers);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener clientes", error: error.message });
    }
};
// READ (GET ONE BY ID)
customersController.getCustomer = async (req, res) => {
    try {
        // Buscar un solo cliente
        const customer = await Customers.findById(req.params.id).select('-password');
        // Validar que el cliente si exista
        if (!customer) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json(customer);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener cliente", error: error.message });
    }
};
// UPDATE (PUT)
customersController.putCustomers = async (req, res) => {
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
        // Convertir fechas si existen
        if (updates.birthDate) {
            updates.birthDate = new Date(updates.birthDate);
        }
        // Convertir arrays si existen
        if (updates.preferredColors) {
            updates.preferredColors = updates.preferredColors.split(',');
        }
        if (updates.preferredMaterials) {
            updates.preferredMaterials = updates.preferredMaterials.split(',');
        }
        if (updates.preferredJewelStyle) {
            updates.preferredJewelStyle = updates.preferredJewelStyle.split(',');
        }
        // Actualizar cliente
        const updatedCustomer = await Customers.findByIdAndUpdate( req.params.id, updates, { new: true } ).select('-password');
        // Validar que el cliente si exista
        if (!updatedCustomer) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Cliente actualizado con éxito", data: updatedCustomer });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar cliente", error: error.message });
    }
};
// DELETE (DELETE)
customersController.deleteCustomers = async (req, res) => {
    try {
        // Primero obtener el cliente para eliminar la imagen de Cloudinary si existe
        const customer = await Customers.findById(req.params.id);
        // Validar que el cliente si exista
        if (!customer) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        // Eliminar imagen de Cloudinary si existe
        if (customer.profilePic) {
            const publicId = customer.profilePic.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`customers/${publicId}`);
        }
        // Eliminar el cliente
        await Customers.findByIdAndDelete(req.params.id);
        // ESTADO DE OK
        res.status(200).json({ message: "Cliente eliminado con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar cliente", error: error.message });
    }
};
export default customersController;