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

        // Verifica que 'name' exista, sea una cadena y no sea solo espacios en blanco
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({ message: "El nombre es obligatorio y no puede estar vacío." });
        }

        // Verifica que 'lastName' exista, sea una cadena y no sea solo espacios en blanco
        if (!lastName || typeof lastName !== "string" || lastName.trim().length === 0) {
            return res.status(400).json({ message: "El apellido es obligatorio y no puede estar vacío." });
        }

        // Verifica que 'username' exista, sea una cadena y no sea solo espacios en blanco
        if (!username || typeof username !== "string" || username.trim().length === 0) {
            return res.status(400).json({ message: "El nombre de usuario es obligatorio y no puede estar vacío." });
        }

        // Verifica que 'email' exista, sea una cadena y cumpla con un patrón básico de email válido
        if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "El correo electrónico es obligatorio y debe ser válido." });
        }

        // Verifica que 'phoneNumber' exista, sea una cadena y no sea solo espacios en blanco
        if (!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim().length === 0) {
            return res.status(400).json({ message: "El número de teléfono es obligatorio y no puede estar vacío." });
        }

        // Verifica que 'birthDate' exista y sea una fecha válida (que no sea NaN)
        if (!birthDate || isNaN(new Date(birthDate).getTime())) {
            return res.status(400).json({ message: "La fecha de nacimiento es obligatoria y debe ser una fecha válida." });
        }

        // Verifica que 'DUI' exista, sea una cadena y tenga el formato específico de 8 dígitos, guion y 1 dígito
        if (!DUI || typeof DUI !== "string" || !/^\d{8}-\d{1}$/.test(DUI)) {
            return res.status(400).json({ message: "El DUI es obligatorio y debe tener el formato correcto (8 dígitos seguidos de un guion y un dígito)." });
        }

        // Verifica que 'password' exista, sea una cadena y tenga al menos 6 caracteres no vacíos
        if (!password || typeof password !== "string" || password.trim().length < 6) {
            return res.status(400).json({ message: "La contraseña es obligatoria, no puede estar vacía y debe tener al menos 6 caracteres." });
        }

        // Verifica que 'address' exista, sea una cadena y no sea solo espacios en blanco
        if (!address || typeof address !== "string" || address.trim().length === 0) {
            return res.status(400).json({ message: "La dirección es obligatoria y no puede estar vacía." });
        }

        // Si 'preferredColors' fue enviado, verifica que sea un array y que no esté vacío
        if (preferredColors !== undefined && (!Array.isArray(preferredColors) || preferredColors.length === 0)) {
            return res.status(400).json({ message: "Los colores preferidos deben ser un array no vacío si se proporcionan." });
        }

        // Si 'preferredMaterials' fue enviado, verifica que sea un array y que no esté vacío
        if (preferredMaterials !== undefined && (!Array.isArray(preferredMaterials) || preferredMaterials.length === 0)) {
            return res.status(400).json({ message: "Los materiales preferidos deben ser un array no vacío si se proporcionan." });
        }

        // Si 'preferredJewelStyle' fue enviado, verifica que sea un array y que no esté vacío
        if (preferredJewelStyle !== undefined && (!Array.isArray(preferredJewelStyle) || preferredJewelStyle.length === 0)) {
            return res.status(400).json({ message: "El estilo de joya preferido debe ser un array no vacío si se proporciona." });
        }

        // Si 'allergies' fue enviado, verifica que sea un array y que no esté vacío
        if (allergies !== undefined && (!Array.isArray(allergies) || allergies.length === 0)) {
            return res.status(400).json({ message: "Las alergias deben ser un array no vacío si se proporcionan." });
        }

        // Si 'purchaseOpportunity' fue enviado, verifica que sea una cadena no vacía (string con contenido)
        if (purchaseOpportunity !== undefined && (typeof purchaseOpportunity !== "string" || purchaseOpportunity.trim().length === 0)) {
            return res.status(400).json({ message: "La oportunidad de compra debe ser una cadena no vacía si se proporciona." });
        }

        // Si 'jewelSize' fue enviado, verifica que sea una cadena no vacía
        if (jewelSize !== undefined && (typeof jewelSize !== "string" || jewelSize.trim().length === 0)) {
            return res.status(400).json({ message: "El tamaño de la joya debe ser una cadena no vacía si se proporciona." });
        }

        // Si 'budget' fue enviado, verifica que sea un número y que sea positivo (mayor o igual a 0)
        if (budget !== undefined && (typeof budget !== "number" || budget < 0)) {
            return res.status(400).json({ message: "El presupuesto debe ser un número positivo si se proporciona." });
        }

        // Verifica que no exista un cliente ya registrado con el mismo email
        const existingCustomer = await Customers.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Ya existe un cliente con este correo electrónico." });
        }

        // Si se subió una imagen de perfil, verifica que su formato sea jpg, png o webp
        if (req.file && !["image/jpeg", "image/png", "image/webp"].includes(req.file.mimetype)) {
            return res.status(400).json({ message: "El formato de la imagen debe ser jpg, png o webp." });
        }

        // Inicializar URL de imagen de perfil

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