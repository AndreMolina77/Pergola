const collectionsController = {};
// Importo el modelo de colecciones
import Collections from "../models/Collections.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary'
import { config } from "../utils/config.js"

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
})
// CREATE (POST)
collectionsController.postCollections = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Validaciones manuales antes de llegar a Mongoose
        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: "El nombre de la colección es requerido y debe tener al menos 3 caracteres" });
        }
        if (name.trim().length > 100) {
            return res.status(400).json({ message: "El nombre no puede exceder los 100 caracteres" });
        }
        if (!description || description.trim().length < 10) {
            return res.status(400).json({ message: "La descripción es obligatoria y debe tener al menos 10 caracteres" });
        }
        if (description.trim().length > 500) {
            return res.status(400).json({ message: "La descripción no puede exceder los 500 caracteres" });
        }
        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return res.status(400).json({ message: "El estado de actividad debe ser un booleano" });
        }
        // Validar que no exista una colección con el mismo nombre
        const existingCollection = await Collections.findOne({ name: name.trim() });
        if (existingCollection) {
            return res.status(400).json({ message: "Ya existe una colección con ese nombre" });
        }
        // Validar que la imagen sea una URL válida si se proporciona
        if (req.file && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(req.file.path)) {
            return res.status(400).json({ message: "La imagen debe ser una URL válida (jpg/jpeg/png/webp/svg)" });
        }
        // Si no se proporciona imagen, se deja como cadena vacía
        if (req.file && req.file.path.trim() === '') {
            return res.status(400).json({ message: "La imagen no puede estar vacía" });
        }
        // Si no se proporciona imagen, se deja como cadena vacía
        if (!req.file) {
            req.file = { path: '' }; // Asignar un objeto vacío si no hay archivo
        }
        // Si se proporciona imagen, subirla a Cloudinary
        if (req.file.path) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "collections",
                allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
            });
            req.file.path = result.secure_url; // Actualizar la ruta del archivo con la URL de Cloudinary
        }
        // Si no hay imagen, se deja como cadena vacía
        if (!req.file.path) {
            req.file.path = '';
        };


        // Link de imagen
        let imageURL = ""
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "collections",
                allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
            })
            imageURL = result.secure_url
        } 
        const newCollection = new Collections({ name, description, image: imageURL, isActive });
        // Guardar colección
        await newCollection.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Colección creada con éxito", data: newCollection });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear colección", error: error.message });
    }
};
// READ (GET ALL)
collectionsController.getCollections = async (req, res) => {
    try {
        // Buscar colecciones
        const collections = await Collections.find();
        // ESTADO DE OK
        res.status(200).json(collections);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener colecciones", error: error.message });
    }
};
// READ (GET ONE BY ID)
collectionsController.getCollection = async (req, res) => {
    try {
        // Buscar una sola colección
        const collection = await Collections.findById(req.params.id);
        // Validar que la colección si exista
        if (!collection) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Colección no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(collection);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener colección", error: error.message });
    }
};
// UPDATE (PUT)
collectionsController.putCollections = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Link de imagen
        let imageURL = ""
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "collections",
                allowed_formats: ["jpg", "jpeg", "png", "gif"],
            })
            imageURL = result.secure_url
        }
        // Actualizar categoría
        const updatedCollection = await Collections.findByIdAndUpdate( req.params.id, { name, description, image: imageURL, isActive }, { new: true });
        // Validar que la categoría si exista
        if (!updatedCollection) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Colección no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Colección actualizada con éxito", data: updatedCollection });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar colección", error: error.message });
    }
};
// DELETE (DELETE)
collectionsController.deleteCollections = async (req, res) => {
    try {
        // Primero obtener la colección para eliminar la imagen de Cloudinary si existe
        const collection = await Collections.findById(req.params.id);
        // Validar que la colección si exista
        if (!collection) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Colección no encontrada" });
        }
        // Eliminar imagen de Cloudinary si existe
        if (collection.image) {
            const publicId = collection.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`collections/${publicId}`);
        }
        // Eliminar colección
        await Collections.findByIdAndDelete(req.params.id);
        // ESTADO DE OK
        res.status(200).json({ message: "Colección eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar colección", error: error.message })
    }
};
export default collectionsController;