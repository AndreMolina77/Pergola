import Employees from "../models/Employees.js";
import {v2 as cloudinary} from "cloudinary";
import { config } from '../utils/config.js'

cloudinary.config({
    CLOUD_NAME: config.CLOUDINARY.CLOUD_NAME,
    API_KEY: config.CLOUDINARY.API_KEY,
    API_SECRET: config.CLOUDINARY.API_SECRET
})
const employeesController = {};

employeesController.postEmployees = async (req,res) => {
    try{
     const {name,lastName,username,email,phone, birthDate, DUI,password, userType,hireDate,isVerified} = req.body;
      let imageURL = ""
      
         if (req.file) {
             const result = await cloudinary.uploader.upload(req.file.path, {
                 folder: "public",
                 allowed_formats: ["jpg", "jpeg", "png", "gif"],
             })
             imageURL = result.secure_url
         }
     //Verficacion si ya existe el cliente
     const existingEmployees = await Employees.finById(req.params.id);
     if (!existingEmployees){
        return res.status(400).json({message: "El empleado ya existe"})
    }
     const newEmployees = new Employees({name,lastName,username,email,phone, birthDate: birthDate ? new Date(birthDate): null, DUI,password, userType,image: imageURL,hireDate: hireDate ? new Date(hireDate): null, isVerified});
     await newEmployees.save();
     res.status(201).json({ message: "Empleado creado con exito", data: newEmployees})
    }catch(error){
        res.status(400).json({message: "Error al crear Empleado", error: error.message});
    }
};

employeesController.getEmployees = async (req,res) => {
    try{
     const employees = await Employees.find();
     res.status(200).json(employees);
    }catch(error){
        res.status(500).json({message: "Error al obtener empleados", error: error.message});
    };
};

employeesController.getEmployees = async (req,res) => {
    try{
    const employees = await Employees.finById(req.params.id);
    if(!employees){
        return res.status(404).json({message: "Empleado no encontrado"})
    }
    res.status(200).json(employees);
    }catch(error){
        res.status(500).json({message: "Error al obtener empleados", error: error.message});
    }
};

employeesController.putEmployees = async (req,res) => {
    try{
        const {name,lastName,username,email,phone, birthDate, DUI,password, userType,hireDate,isVerified} = req.body;
        let imageURL = ""
                           
                              if (req.file) {
                                  const result = await cloudinary.uploader.upload(req.file.path, {
                                      folder: "public",
                                      allowed_formats: ["jpg", "jpeg", "png", "gif"],
                                  })
                                  imageURL = result.secure_url
                              }
        // Actualizar la devolución
        const updatedEmployees = await Employees.findByIdAndUpdate( req.params.id, {name,lastName,username,email,phone, birthDate, DUI,password, userType,hireDate,isVerified}, { new: true })
        // Validar que la devolución si exista
        if (!updatedEmployees) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Empleado actualizado con éxito", data: updatedEmployees });
    }catch(error){
        res.status(500).json({message: "Error al actualizar cliente", error: error.message});  
    }
};
employeesController.deleteEmployees = async (req,res) => {
    try{
     const employees = await Employees.findById(req.params.id);
     if(!employees){
        return res.status(404).json({message: "Empleado no encontrado"});
     }
     await Employees.findByIdAndDelete(req.params.id);
     res.status(204).json({message: "Empleado eliminado con exito"})
    }catch(error){
        res.status(500).json({message: "Error al eliminar empleado", error: error.message}); 
    }
}
export default employeesController;