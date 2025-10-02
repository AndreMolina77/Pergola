const customersController = {};
// Importo el modelo de clientes
import Customers from "../models/Customers.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { config } from "../utils/config.js";
// Función helper para validar
import { validateCustomer } from "../validators/validator.js";

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET
});
// CREATE (POST)
customersController.postCustomers = async (req, res) => {
  try {
    const { name, lastName, username, email, phoneNumber, birthDate, DUI, password, address, isVerified, preferredColors, preferredMaterials, preferredJewelStyle, purchaseOpportunity, allergies, jewelSize, budget } = req.body;
    /* // Validación extra de la foto de perfil (porque viene en req.file, no en body)
    if (req.file) {
      const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/jpg", "image/gif"];
      if (!allowedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Formato de imagen no válido (solo jpg, jpeg, png, webp, svg), gif" });
      }
    } */
    // Link de imagen
    let profilePicURL = "";
    // Subir imagen a cloudinary si se proporciona una imagen en la solicitud
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "customers",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg"]
      });
      profilePicURL = result.secure_url;
    }
    // Convertir fecha si existe
    const parsedBirthDate = birthDate ? new Date(birthDate) : null;
    // Convertir arrays si existen y son strings
    const parseArray = (field) => {
      if (field === undefined || field === null) return [];
      if (typeof field === "string") return field.split(",").map(e => e.trim()).filter(e => e !== "");
      if (Array.isArray(field)) return field;
      return [];
    };
    const parsedPreferredColors = parseArray(preferredColors);
    const parsedPreferredMaterials = parseArray(preferredMaterials);
    const parsedPreferredJewelStyle = parseArray(preferredJewelStyle);
    /* // Validar lo que venga en req.body
    const validationError = validateCustomer({ name, lastName, username, email, phoneNumber, birthDate: parsedBirthDate, DUI, password, profilePic: profilePicURL, address, isVerified, preferredColors: parsedPreferredColors, preferredMaterials: parsedPreferredMaterials, preferredJewelStyle: parsedPreferredJewelStyle, purchaseOpportunity, allergies, jewelSize, budget });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    // Construir el nuevo cliente
    const newCustomer = new Customers({name, lastName, username, email, phoneNumber, birthDate: parsedBirthDate, DUI, password, profilePic: profilePicURL, address, isVerified: isVerified || false, preferredColors: parsedPreferredColors, preferredMaterials: parsedPreferredMaterials, preferredJewelStyle: parsedPreferredJewelStyle, purchaseOpportunity, allergies, jewelSize, budget });
    // Guardar cliente
    await newCustomer.save();
    // ESTADO DE CREACIÓN
    res.status(201).json({ message: "Cliente creado con éxito", data: { ...newCustomer.toObject(), password: undefined /* Excluir la contraseña de la respuesta */ }});
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
// READ (GET ALL PUBLIC CUSTOMERS)
customersController.getPublicCustomers = async (req, res) => {
  try {
    // Buscar clientes publicos
    const publicCustomers = await Customers.find().select('-password');
    // ESTADO DE OK
    res.status(200).json(publicCustomers);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener clientes publicos", error: error.message });
  }
};
// READ (GET ONE BY ID)
customersController.getCustomer = async (req, res) => {
  try {
    // Buscar un solo cliente
    const customer = await Customers.findById(req.params.id);
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
        folder: "customers",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg"]
      });
      updates.profilePic = result.secure_url;
    }
    // Convertir fechas si existen
    if (updates.birthDate) {
      updates.birthDate = new Date(updates.birthDate);
    }
    // Convertir arrays si existen y son strings
    const arrayFields = ['preferredColors', 'preferredMaterials', 'preferredJewelStyle'];
    arrayFields.forEach(field => {
      if (updates[field] === undefined || updates[field] === null) {
        updates[field] = [];
      } else if (typeof updates[field] === 'string') {
        // Convertir a array si es string
        updates[field] = updates[field].split(',').map(e => e.trim()).filter(e => e !== "");
      } else if (Array.isArray(updates[field])) {
        // Actualizar array si es array
        updates[field] = updates[field];
      } else {
        // Si es null/undefined o vacío, establecer como array vacío
        updates[field] = [];
      }
    });
    /* // Validar lo que venga en req.body
    const validationError = validateCustomer(updates);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    // Actualizar cliente
    const updatedCustomer = await Customers.findByIdAndUpdate( req.params.id, updates, { new: true } ).select('-password');
    // Validar que el cliente si exista
    if (!updatedCustomer) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    console.log("✅ [PUT] Customer updated successfully:", updatedCustomer);
    // ESTADO DE OK
    res.status(200).json({ message: "Cliente actualizado con éxito", data: updatedCustomer });
  } catch (error) {
    console.error("❌ [PUT] Error updating customer:", error);
    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ message: "Error al actualizar cliente", error: error.message });
  }
};
// DELETE (DELETE)
customersController.deleteCustomers = async (req, res) => {
  try {
    // Primero obtener el cliente 
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
// DELETE PROFILE PICTURE ONLY
customersController.deleteProfilePic = async (req, res) => {
  try {
    // Primero obtener el cliente 
    const customer = await Customers.findById(req.params.id);
    // Validar que el cliente si exista
    if (!customer) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    // Eliminar de Cloudinary si existe
    if (customer.profilePic) {
      const publicId = customer.profilePic.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`customers/${publicId}`);
    }
    // Eliminar solo el campo profilePic
    await Customers.findByIdAndUpdate(req.params.id, { $unset: { profilePic: "" } }, { new: true });
    // ESTADO DE OK
    res.status(200).json({ message: "Foto de perfil eliminada con éxito" });
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({message: "Error al eliminar foto de perfil", error: error.message});
  }
};
export default customersController;