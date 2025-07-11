import SubCategories from "../models/SubCategories.js";
import {v2 as cloudinary} from "cloudinary";
import { config } from '../utils/config.js'


cloudinary.config({
    CLOUD_NAME: config.CLOUDINARY.CLOUD_NAME,
    API_KEY: config.CLOUDINARY.API_KEY,
    API_SECRET: config.CLOUDINARY.API_SECRET
})
const SubcategoriesController = {};

SubcategoriesController.postSubCategories = async (req,res) => {
    try{
     const {name,description,isActive} = req.body;
     let imageURL = ""
           
              if (req.file) {
                  const result = await cloudinary.uploader.upload(req.file.path, {
                      folder: "public",
                      allowed_formats: ["jpg", "jpeg", "png", "gif"],
                  })
                  imageURL = result.secure_url
              }
     //Verficacion si ya existe el cliente
     const existingSubCategories = await SubCategories.finById(req.params.id);
     if (!existingSubCategories){
        return res.status(400).json({message: "La Subcategoria ya existe"})
    }
     const newSubCategories = new SubCategories({name,description,image: imageURL,isActive});
     await newSubCategories.save();
     res.status(201).json({ message: "SubCategoria creada con exito", data: newSubCategories})
    }catch(error){
        res.status(400).json({message: "Error al crear SubCategoria", error: error.message});
    }
};

SubcategoriesController.getSubCategories = async (req,res) => {
    try{
     const Subcategories = await SubCategories.find();
     res.status(200).json(Subcategories);
    }catch(error){
        res.status(500).json({message: "Error al encontrar Subcategorias", error: error.message});
    };
};

SubcategoriesController.getSubCategories = async (req,res) => {
    try{
    const Subcategories = await SubCategories.finById(req.params.id);
    if(!Subcategories){
        return res.status(404).json({message: "SubCategoria no encontrada"})
    }
    res.status(200).json(Subcategories);
    }catch(error){
        res.status(500).json({message: "La Subcategoria no se encuentra!", error: error.message});
    }
};

SubcategoriesController.putSubCategories = async (req,res) => {
    try{
        const updates = req.body;
        
        // Actualizar la devolución
        const updatedSubCategories = await SubCategories.findByIdAndUpdate( req.params.id, updates, { new: true })
        // Validar que la devolución si exista
        if (!updatedSubCategories) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "SubCategoria no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "SubCategoria actualizada con exito", data: updatedSubCategories });
    }catch(error){
        res.status(500).json({message: "Error al actualizar la Subcategoria", error: error.message});  
    }
};
SubcategoriesController.deleteSubCategories = async (req,res) => {
    try{
     const Subcategories = await SubCategories.findById(req.params.id);
     if(!Subcategories){
        return res.status(404).json({message: "SubCategoria no encontrada"});
     }
     await SubCategories.findByIdAndDelete(req.params.id);
     res.status(204).json({message: "SubCategoria eliminada con exito"})
    }catch(error){
        res.status(500).json({message: "Error al eliminar Subcategoria", error: error.message}); 
    }
}
export default SubcategoriesController;