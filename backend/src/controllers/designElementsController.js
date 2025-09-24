const designElementsController = {};
// Importar modelo de elementos de diseño
import DesignElements from "../models/DesignElements.js";
// Archivo config y libreria cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { config } from "../utils/config.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
});
// POST (CREATE)
designElementsController.postElements = async (req, res) => {
    try {
        const { type, name } = req.body;

        if (
            !type || 
            typeof type !== "string" || 
            type.trim().length === 0 || 
            !["Base", "Decoración", "Cierre"].includes(type)
        ) {
            return res.status(400).json({
                message: "El tipo es obligatorio, no puede estar vacío y debe ser 'Base', 'Decoración' o 'Cierre'."
            });
        }
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
        if (!req.file) {
            return res.status(400).json({
                message: "La imagen es obligatoria y debe ser un archivo válido."
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
        // Validar que el nombre no sea una cadena vacía
        if (name.trim() === '') {
            return res.status(400).json({
                message: "El nombre no puede estar vacío."
            });
        }
        // Validar que el tipo sea uno de los permitidos
        if (!["Base", "Decoración", "Cierre"].includes(type)) {
            return res.status(400).json({
                message: "El tipo debe ser 'Base', 'Decoración' o 'Cierre'."
            });
        }
        // Validar que el nombre tenga una longitud válida
        if (name.trim().length < 2 || name.trim().length > 100)
        {
            return res.status(400).json({
                message: "El nombre debe tener entre 2 y 100 caracteres."
            });
        }
        // Validar que la imagen sea un archivo válido
        if (!req.file || !req.file.mimetype.startsWith("image/")) {
            return res.status(400).json({
                message: "La imagen es obligatoria y debe ser un archivo de imagen válido."
            });
        }
        // Link de imagen
        let imageUrl = ""
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            console.log("Uploading file:", req.file); // DEBUG
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "elements",
                allowed_formats: ["jpg", "jpeg", "png", "gif"],
            })
            imageUrl = result.secure_url
            console.log("Uploading file:", req.file); // DEBUG
        }
        const newElement = new DesignElements({ type, name, image: imageUrl });
        // Guardar elemento
        await newElement.save();
        console.log("Saved element:", newElement); // DEBUG
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Elemento creado con éxito", data: newElement });
    } catch (error) {
        console.error("Error creating element:", error); // DEBUG
        console.error("🔥 ERROR en postDesigns:", error); // log completo
        res.status(400).json({
            message: "Error al crear diseño",
            error: error.message,
            stack: error.stack,   // incluye stack
            body: req.body        // qué datos llegaron
        });
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear el elemento", error: error.message });
    }
};
// READ (GET ALL)
designElementsController.getElements = async (req, res) => {
    try {
        // Buscar elementos
        const elements = await DesignElements.find();
        // ESTADO DE OK
        res.status(200).json(elements);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener elementos", error: error.message });
    }
};
// READ (GET ONE BY ID)
designElementsController.getElement = async (req, res) => {
    try {
        // Buscar un solo elemento
        const element = await DesignElements.findById(req.params.id);
        // Validar que el elemento si exista
        if (!element) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Elemento no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json(element);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener elemento", error: error.message });
    }
};
// UPDATE (PUT)
designElementsController.putElements = async (req, res) => {
    try {
        const { type, name } = req.body;
        // Link de imagen
        let imageUrl = ""
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "elements",
                allowed_formats: ["jpg", "jpeg", "png", "gif"],
            })
            imageUrl = result.secure_url
        }
        // Actualizar elemento
        const updated = await DesignElements.findByIdAndUpdate(req.params.id, { type, name, image: imageUrl }, { new: true } );
        // Validar que el elemento si exista
        if (!updated) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Elemento no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Elemento actualizado con éxito", data: updated });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar elemento", error: error.message });
    }
};
// DELETE
designElementsController.deleteElements = async (req, res) => {
    try {
        // Borrar elemento
        const element = await DesignElements.findById(req.params.id);
        // Validar que el elemento si exista
        if (!element) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Elemento no encontrado" });
        }
        // Borrar elemento
        await DesignElements.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Elemento eliminado con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar elemento", error: error.message });
    }
};
export default designElementsController;