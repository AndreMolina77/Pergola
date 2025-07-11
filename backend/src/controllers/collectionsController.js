import Collections from "../models/Collections.js";
import {v2 as cloudinary} from "cloudinary";
import { config } from '../utils/config.js';

cloudinary.config({
    cloud_name: config.CLOUDINARY.cloudinary_name,
    api_key: config.CLOUDINARY.cloudinary_api_key,
    api_secret: config.CLOUDINARY.cloudinary_api_secret

})
const collectionsController = {};

collectionsController.postCollections = async (req,res) => {
    try{
     const {name, description, isActive} = req.body;

     let imageURL = ""
           
              if (req.file) {
                  const result = await cloudinary.uploader.upload(req.file.path, {
                      folder: "public",
                      allowed_formats: ["jpg", "jpeg", "png", "gif"],
                  })
                  imageURL = result.secure_url
              }

     //Verficacion si ya existe la coleccion
     const existingCollections = await Collections.finById(req.params.id);
     if (!existingCollections){
        return res.status(400).json({message: "La coleccion ya existe"})
    }
     const newCollections = new Collections({name, description, image: imageURL, isActive});
     await newCollections.save();
     res.status(201).json({ message: "Coleccion creada con exito", data: newCollections})
    }catch(error){
        res.status(400).json({message: "Error al crear la coleccion", error: error.message});
    }
};

collectionsController.getCollections = async (req,res) => {
    try{
     const collections = await Collections.find();
     res.status(200).json(collections);
    }catch(error){
        res.status(500).json({message: "Error al obtener colecciones", error: error.message});
    };
};

collectionsController.getCollection = async (req,res) => {
    try{
    const collections = await Collections.finById(req.params.id);
    if(!collections){
        return res.status(404).json({message: "Coleccion no encontrada"})
    }
    res.status(200).json(collections);
    }catch(error){
        res.status(500).json({message: "Error al obtener colecciones", error: error.message});
    }
};

collectionsController.putCollections = async (req,res) => {
    try{
        const {name, description, isActive} = req.body;

        let imageURL = ""
           
              if (req.file) {
                  const result = await cloudinary.uploader.upload(req.file.path, {
                      folder: "public",
                      allowed_formats: ["jpg", "jpeg", "png", "gif"],
                  })
                  imageURL = result.secure_url
              }
        
        // Actualizar la devolución
        const updatedCollections = await Collections.findByIdAndUpdate( req.params.id, {name, description, image: imageURL, isActive}, { new: true })
        // Validar que la devolución si exista
        if (!updatedCollections) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Coleccion no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Coleccion actualizada con éxito", data: updatedCollections });
    }catch(error){
        res.status(500).json({message: "Error al actualizar coleccion", error: error.message});  
    }
};


collectionsController.deleteCollections = async (req,res) => {
    try{
     const collections = await Collections.findById(req.params.id);

     if(!collections){
        return res.status(404).json({message: "Coleccion no encontrada"});
     }
     await Collections.findByIdAndDelete(req.params.id);
     res.status(204).json({message: "Coleccion eliminada con exito"})
    }catch(error){
        res.status(500).json({message: "Error al eliminar coleccion", error: error.message}); 
    }
}

export default collectionsController;