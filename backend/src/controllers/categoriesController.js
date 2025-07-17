import Categories from "../models/Categories.js";
import {v2 as cloudinary} from "cloudinary";
import { config } from '../utils/config.js'

cloudinary.config({
    CLOUD_NAME: config.CLOUDINARY.CLOUD_NAME,
    API_KEY: config.CLOUDINARY.API_KEY,
    API_SECRET: config.CLOUDINARY.API_SECRET
})
const categoriesController = {};

categoriesController.postCategories = async (req,res) => {
    try{
     const {name,description, isActive} = req.body;
     let imageURL = ""
 
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "public",
            allowed_formats: ["jpg", "jpeg", "png", "gif"],
        })
        imageURL = result.secure_url
    }
     //Verficacion si ya existe el cliente
     const existingCategories = await Categories.findById(req.params.id);
     if (!existingCategories){
        return res.status(400).json({message: "La categoria ya existe"})
    }
     const newCategories = new Categories({name,description,image: imageURL,isActive});
     await newCategories.save();
     res.status(201).json({ message: "Categoria creada con exito", data: newCategories})
    }catch(error){
        res.status(400).json({message: "Error al crear Categoria", error: error.message});
    }
};

categoriesController.getCategories = async (req,res) => {
    try{
     const categories = await Categories.find();
     res.status(200).json(categories);
    }catch(error){
        res.status(500).json({message: "Error al encontrar categorias", error: error.message});
    };
};

categoriesController.getCategories = async (req,res) => {
    try{
    const categories = await Categories.findById(req.params.id);
    if(!categories){
        return res.status(404).json({message: "Categoria no encontrada"})
    }
    res.status(200).json(categories);
    }catch(error){
        res.status(500).json({message: "La categoria no se encuentra!", error: error.message});
    }
};

categoriesController.putCategories = async (req,res) => {
    try{
        const  {name,description,isActive} = req.body;
        let imageURL = ""
                   
                      if (req.file) {
                          const result = await cloudinary.uploader.upload(req.file.path, {
                              folder: "public",
                              allowed_formats: ["jpg", "jpeg", "png", "gif"],
                          })
                          imageURL = result.secure_url
                      }
        
        // Actualizar la devolución
        const updatedCategories = await Categories.findByIdAndUpdate( req.params.id, {name,description,image: imageURL,isActive}, { new: true })
        // Validar que la devolución si exista
        if (!updatedCategories) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Categoria no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Categoria actualizada con exito", data: updatedCategories });
    }catch(error){
        res.status(500).json({message: "Error al actualizar la categoria", error: error.message});  
    }
};
categoriesController.deleteCategories = async (req,res) => {
    try{
     const categories = await Categories.findById(req.params.id);
     if(!categories){
        return res.status(404).json({message: "Categoria no encontrada"});
     }
     await Categories.findByIdAndDelete(req.params.id);
     res.status(204).json({message: "Categoria eliminada con exito"})
    }catch(error){
        res.status(500).json({message: "Error al eliminar categoria", error: error.message}); 
    }
}
export default categoriesController;