import Customers from "../models/Customers.js";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: config.CLOUDINARY.cloudinary_name,
    api_key: config.CLOUDINARY.cloudinary_api_key,
    api_secret: config.CLOUDINARY.cloudinary_api_secret

})
const customersController = {};

customersController.postCustomers = async (req,res) => {
    try{
     const {name,lastName, username,email,phone, birthDate,DUI,password, profilePic,address,isVerified, preferredColors,preferredMaterials,preferredJewelStyle,purchaseOpportunity,allergies,jewelSize,budget} = req.body;
     //Verficacion si ya existe el cliente
     const existingCustomers = await Customers.finById(req.params.id);
     if (!existingCustomers){
        return res.status(400).json({message: "El cliente ya existe"})
    }
     const newCustomers = new Customers({name,lastName, username,email,phone,birthDate: birthDate ? new Date(birthDate): null, username,email,phone,DUI,password, profilePic,address,isVerified, preferredColors,preferredMaterials,preferredJewelStyle,purchaseOpportunity,allergies,jewelSize,budget });
     await newCustomers.save();
     res.status(201).json({ message: "Cliente creado con exito", data: newCustomers})
    }catch(error){
        res.status(400).json({message: "Error al crear Cliente", error: error.message});
    }
};

customersController.getCustomers = async (req,res) => {
    try{
     const customers = await Customers.find();
     res.status(200).json(customers);
    }catch(error){
        res.status(500).json({message: "Error al obtener clientes", error: error.message});
    };
};

customersController.getCustomer = async (req,res) => {
    try{
    const customers = await Customers.finById(req.params.id);
    if(!customers){
        return res.status(404).json({message: "Cliente no encontrado"})
    }
    res.status(200).json(customers);
    }catch(error){
        res.status(500).json({message: "Error al obtener clientes", error: error.message});
    }
};

customersController.putCustomers = async (req,res) => {
    try{
        const updates = req.body;
        
        // Actualizar la devolución
        const updatedCustomers = await Customers.findByIdAndUpdate( req.params.id, updates, { new: true })
        // Validar que la devolución si exista
        if (!updatedCustomers) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Cliente actualizado con éxito", data: updatedCustomers });
    }catch(error){
        res.status(500).json({message: "Error al actualizar cliente", error: error.message});  
    }
};


customersController.deleteCustomers = async (req,res) => {
    try{
     const customers = await Customers.findById(req.params.id);
     if(!customers){
        return res.status(404).json({message: "Cliente no encontrado"});
     }
     await Customers.findByIdAndDelete(req.params.id);
     res.status(204).json({message: "Cliente eliminado con exito"})
    }catch(error){
        res.status(500).json({message: "Error al eliminar cliente", error: error.message}); 
    }
}

export default customersController;