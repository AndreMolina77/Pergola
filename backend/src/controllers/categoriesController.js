const categoriesController = {};
// Importo el modelo de subcategorías
import Categories from "../models/Categories.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary'
import { config } from "../utils/config.js"
// Función helper para validar
import { validateCategory } from "../validators/validator.js";

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET
})
// CREATE (POST)
categoriesController.postCategories = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
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
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
      })
      imageURL = result.secure_url
    }
    /* // Validar lo que venga en req.body
    const error = validateCategory({name, description, image: imageURL, isActive});
    if (error) {
      return res.status(400).json({ message: error }); // si hay error, corto aquí
    } */
    const newCategory = new Categories({ name, description, image: imageURL, isActive });
    // Guardar categoría
    await newCategory.save();
    // ESTADO DE CREACIÓN
    res.status(201).json({ message: "Categoría creada con éxito", data: newCategory });
  } catch (error) {
    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ message: "Error al crear categoría", error: error.message });
  }
};
// READ (GET ALL)
categoriesController.getCategories = async (req, res) => {
  try {
    // Buscar categorías
    const categories = await Categories.find();
    // ESTADO DE OK
    res.status(200).json(categories);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener categorías", error: error.message });
  }
};
// READ (GET ALL PUBLIC CATEGORIES)
categoriesController.getPublicCategories = async (req, res) => {
  try {
    // Buscar categorías publicas
    const publicCategories = await Categories.find({ isActive: true });
    // ESTADO DE OK
    res.status(200).json(publicCategories);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener categorías publicas", error: error.message });
  }
};
// READ (GET ONE BY ID)
categoriesController.getCategory = async (req, res) => {
  try {
    // Buscar una sola categoría
    const category = await Categories.findById(req.params.id);
    // Validar que la categoría si exista
    if (!category) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    // ESTADO DE OK
    res.status(200).json(category);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener categoría", error: error.message });
  }
};
// UPDATE (PUT)
categoriesController.putCategories = async (req, res) => {
  try {
    const updates = req.body;
    /* // Validación extra de la imagen (porque viene en req.file, no en body)
    if (req.file) {
      const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/jpg", "image/gif"];
      if (!allowedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Formato de imagen no válido (solo jpg, jpeg, png, webp, svg), gif" });
      }
    } */
    // Subir imagen a cloudinary si se proporciona una imagen en la solicitud
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
      })
      updates.image = result.secure_url
    }
    /* // Validar lo que venga en req.body
    const error = validateCategory(updates);
    if (error) {
      return res.status(400).json({ message: error }); // si hay error, corto aquí
    } */
    // Actualizar categoría
    const updatedCategory = await Categories.findByIdAndUpdate( req.params.id, { updates }, { new: true });
    // Validar que la categoría si exista
    if (!updatedCategory) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    // ESTADO DE OK
    res.status(200).json({ message: "Categoría actualizada con éxito", data: updatedCategory });
  } catch (error) {
    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ message: "Error al actualizar categoría", error: error.message });
  }
};
// DELETE (DELETE)
categoriesController.deleteCategories = async (req, res) => {
  try {
    // Primero obtener la categoría para eliminar la imagen de Cloudinary si existe
    const category = await Categories.findById(req.params.id);
    // Validar que la categoría si exista
    if (!category) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    // Eliminar imagen de Cloudinary si existe
    if (category.image) {
      const publicId = category.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`categories/${publicId}`);
    }
    // Eliminar categoría
    await Categories.findByIdAndDelete(req.params.id);
    // ESTADO DE OK
    res.status(200).json({ message: "Categoría eliminada con éxito" });
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al eliminar categoría", error: error.message })
  }
};
export default categoriesController;