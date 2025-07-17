import SubCategories from "../models/SubCategories.js"
import { v2 as cloudinary } from "cloudinary"
import { config } from '../utils/config.js'

// Configuración de Cloudinary
cloudinary.config({
  CLOUD_NAME: config.CLOUDINARY.CLOUD_NAME,
  API_KEY: config.CLOUDINARY.API_KEY,
  API_SECRET: config.CLOUDINARY.API_SECRET
})

const SubcategoriesController = {}

// Crear Subcategoría
SubcategoriesController.postSubCategories = async (req, res) => {
  try {
    const { name, description, isActive } = req.body
    let imageURL = ""

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "public",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
      })
      imageURL = result.secure_url
    }

    // Validar si ya existe una subcategoría con ese nombre
    const existing = await SubCategories.findOne({ name })
    if (existing) {
      return res.status(400).json({ message: "La Subcategoría ya existe" })
    }

    const newSubCategories = new SubCategories({ name, description, image: imageURL, isActive })
    await newSubCategories.save()

    res.status(201).json({ message: "SubCategoría creada con éxito", data: newSubCategories })
  } catch (error) {
    res.status(400).json({ message: "Error al crear SubCategoría", error: error.message })
  }
}

// Obtener todas las subcategorías
SubcategoriesController.getSubCategories = async (req, res) => {
  try {
    const list = await SubCategories.find()
    res.status(200).json(list)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener subcategorías", error: error.message })
  }
}

// Obtener subcategoría por ID
SubcategoriesController.getSubCategoryById = async (req, res) => {
  try {
    const sub = await SubCategories.findById(req.params.id)
    if (!sub) return res.status(404).json({ message: "SubCategoría no encontrada" })
    res.status(200).json(sub)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener subcategoría", error: error.message })
  }
}

// Actualizar subcategoría
SubcategoriesController.putSubCategories = async (req, res) => {
  try {
    const { name, description, isActive } = req.body
    let imageURL = ""

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "public",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
      })
      imageURL = result.secure_url
    }

    const updateData = { name, description, isActive }
    if (imageURL) updateData.image = imageURL

    const updated = await SubCategories.findByIdAndUpdate(req.params.id, updateData, { new: true })
    if (!updated) return res.status(404).json({ message: "SubCategoría no encontrada" })

    res.status(200).json({ message: "SubCategoría actualizada con éxito", data: updated })
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar subcategoría", error: error.message })
  }
}

// Eliminar subcategoría
SubcategoriesController.deleteSubCategories = async (req, res) => {
  try {
    const sub = await SubCategories.findById(req.params.id)
    if (!sub) return res.status(404).json({ message: "SubCategoría no encontrada" })

    await SubCategories.findByIdAndDelete(req.params.id)
    res.status(204).json({ message: "SubCategoría eliminada con éxito" })
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar subcategoría", error: error.message })
  }
}

export default SubcategoriesController

