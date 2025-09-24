const designElementsController = {};
// Importo el modelo de elementos de diseño
import DesignElements from "../models/DesignElements.js";
// Archivo config y libreria cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { config } from "../utils/config.js";
// Función helper para validar
import { validateDesignElement } from "../validators/validator.js";

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET
});
// POST (CREATE)
designElementsController.postElements = async (req, res) => {
  try {
    const { type, name } = req.body;
    /* // Validación extra de la imagen (porque viene en req.file, no en body)
    if (req.file) {
      const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/jpg", "image/gif"];
      if (!allowedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Formato de imagen no válido (solo jpg, jpeg, png, webp, svg), gif" });
      }
    } */
    // Link de imagen
    let imageURL = ""
    // Subir imagen a cloudinary si se proporciona una imagen en la solicitud
    if (req.file) {
      console.log("Uploading file:", req.file); // DEBUG
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "elements",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
      })
      imageURL = result.secure_url
      console.log("Uploading file:", req.file); // DEBUG
    }
    /* // Validar lo que venga en req.body
    const validationError = validateDesignElement({ type, name, image: imageURL });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    const newElement = new DesignElements({ type, name, image: imageURL });
    // Guardar elemento
    await newElement.save();
    console.log("Saved element:", newElement); // DEBUG
    // ESTADO DE CREACIÓN
    res.status(201).json({ message: "Elemento creado con éxito", data: newElement });
  } catch (error) {
    console.error("Error creating element:", error); // DEBUG
    console.error("🔥 ERROR en postDesigns:", error); // log completo
    res.status(400).json({ message: "Error al crear diseño", error: error.message, stack: error.stack, /* incluye stack */ body: req.body /* qué datos llegaron */ });
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
    const updates = req.body;
    /* // Validación extra de la imagen (porque viene en req.file, no en body)
    if (req.file) {
      const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/jpg", "image/gif"];
      if (!allowedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Formato de imagen no válido (solo jpg, jpeg, png, webp, svg), gif" });
      }
    }  */
    // Subir imagen a cloudinary si se proporciona una imagen en solicitud
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "elements",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
      })
      updates.image = result.secure_url
    }
    /* // Validar lo que venga en req.body
    const validationError = validateDesignElement(updates);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    // Actualizar elemento
    const updated = await DesignElements.findByIdAndUpdate(req.params.id, { updates }, { new: true } );
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