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
        const newElement = new DesignElements({ type, name, image: imageUrl });
        // Guardar elemento
        await newElement.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Elemento creado con éxito", data: newElement });
    } catch (error) {
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