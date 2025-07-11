import Suppliers from "../models/Suppliers.js";

const suppliersController = {};

suppliersController.postSuppliers = async (req,res) => {
    try{
     const {name, contactPerson,   phoneNumber, email, address} = req.body;
     //Verficacion si ya existe el cliente
     const existingSuppliers = await Suppliers.finById(req.params.id);
     if (!existingSuppliers){
        return res.status(400).json({message: "El proveedor ya existe"})
    }
     const newSuppliers = new Employees({name, contactPerson,   phoneNumber, email, address});
     await newSuppliers.save();
     res.status(201).json({ message: "Proveedor creado con exito", data: newSuppliers})
    }catch(error){
        res.status(400).json({message: "Error al crear proveedor", error: error.message});
    }
};

suppliersController.getSuppliers = async (req,res) => {
    try{
     const suppliers = await Suppliers.find();
     res.status(200).json(suppliers);
    }catch(error){
        res.status(500).json({message: "Error al obtener proveedores", error: error.message});
    };
};

suppliersController.getSuppliers = async (req,res) => {
    try{
    const suppliers = await Suppliers.finById(req.params.id);
    if(!suppliers){
        return res.status(404).json({message: "Proveedor no encontrado"})
    }
    res.status(200).json(suppliers);
    }catch(error){
        res.status(500).json({message: "Error al obtener proveedor", error: error.message});
    }
};

suppliersController.putSuppliers = async (req,res) => {
    try{
        const updates = req.body;
        
        // Actualizar la devolución
        const updatedSuppliers = await Suppliers.findByIdAndUpdate( req.params.id, updates, { new: true })
        // Validar que la devolución si exista
        if (!updatedSuppliers) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Proveedor actualizado con éxito", data: updatedSuppliers });
    }catch(error){
        res.status(500).json({message: "Error al actualizar proveedor", error: error.message});  
    }
};


suppliersController.deleteSuppliers = async (req,res) => {
    try{
     const suppliers = await Suppliers.findById(req.params.id);
     if(!suppliers){
        return res.status(404).json({message: "Proveedor no encontrado"});
     }
     await Suppliers.findByIdAndDelete(req.params.id);
     res.status(204).json({message: "Proveedor eliminado con exito"})
    }catch(error){
        res.status(500).json({message: "Error al eliminar Proveedor", error: error.message}); 
    }
}

export default suppliersController;