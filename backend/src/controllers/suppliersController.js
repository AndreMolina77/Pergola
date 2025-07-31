const suppliersController = {};
// Importo el modelo de proveedores
import Suppliers from "../models/Suppliers.js";
// CREATE (POST)
suppliersController.postSuppliers = async (req, res) => {
    try {
        const { name, contactPerson, phoneNumber, email, address } = req.body;
        if (!name || !contactPerson || !phoneNumber || !email || !address) {
            // ESTADO DE ERROR EN INPUT DEL CLIENTE
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }
        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "El correo electrónico no es válido" });
        }
        // Validar el formato del número de teléfono
        const phoneRegex = /^\d{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ message: "El número de teléfono debe tener 8 dígitos" });
        }
        // Validar que el nombre no tenga más de 50 caracteres
        if (name.length > 50) {
            return res.status(400).json({ message: "El nombre no puede tener más de 50 caracteres" });
        }
        // Validar que la persona de contacto no tenga más de 50 caracteres
        if (contactPerson.length > 50) {
            return res.status(400).json({ message: "La persona de contacto no puede tener más de 50 caracteres" });
        }
        // Validar que la dirección no tenga más de 100 caracteres
        if (address.length > 100) {
            return res.status(400).json({ message: "La dirección no puede tener más de 100 caracteres" });
        }
        // Validar que el correo electrónico no tenga más de 50 caracteres
        if (email.length > 50) {
            return res.status(400).json({ message: "El correo electrónico no puede tener más de 50 caracteres" });
        }
        // Validar que el número de teléfono no tenga más de 8 dígitos
        if (phoneNumber.length > 8) {
            return res.status(400).json({ message: "El número de teléfono no puede tener más de 8 dígitos" });
        }
        // Validar que el nombre de la empresa no tenga más de 50 caracteres
        if (name.length > 50) {
            return res.status(400).json({ message: "El nombre de la empresa no puede tener más de 50 caracteres" });
        }
        //Validar que la persona de contacto no tenga más de 50 caracteres
        if (contactPerson.length > 50) {
            return res.status(400).json({ message: "La persona de contacto no puede tener más de 50 caracteres" });
        }
        // Validar que la dirección no tenga más de 100 caracteres
        if (address.length > 100) {
            return res.status(400).json({ message: "La dirección no puede tener más de 100 caracteres" });
        }
        // Validar que el correo electrónico no tenga más de 50 caracteres
        if (email.length > 50) {
            return res.status(400).json({ message: "El correo electrónico no puede tener más de 50 caracteres" });
        }
        
        
        const newSupplier = new Suppliers({ name, contactPerson, phoneNumber, email, address });
        // Guardar proveedor
        await newSupplier.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Proveedor creado con éxito", data: newSupplier });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear proveedor", error: error.message });
    }
};
// READ (GET ALL)
suppliersController.getSuppliers = async (req, res) => {
    try {
        // Buscar proveedores
        const suppliers = await Suppliers.find();
        // ESTADO DE OK
        res.status(200).json(suppliers);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener proveedores", error: error.message });
    }
};
// READ (GET ONE BY ID)
suppliersController.getSupplier = async (req, res) => {
    try {
        // Buscar un solo proveedor
        const supplier = await Suppliers.findById(req.params.id);
        // Validar que el proveedor si exista
        if (!supplier) {
            return res.status(404).json({ message: "Proveeedor no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json(supplier);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener proveedor", error: error.message });
    }
};
// UPDATE (PUT)
suppliersController.putSuppliers = async (req, res) => {
    try {
        const { name, contactPerson, phoneNumber, email, address } = req.body;
        // Actualizar proveedor
        const updatedSupplier = await Suppliers.findByIdAndUpdate( req.params.id, { name, contactPerson, phoneNumber, email, address }, { new: true });
        // Validar que la subcategoría si exista
        if (!updatedSupplier) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Proveedor actualizado con éxito", data: updatedSupplier });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar proveedor", error: error.message });
    }
};
// DELETE (DELETE)
suppliersController.deleteSuppliers = async (req, res) => {
    try {
        // Eliminar proveedor
        const deletedSupplier = await Suppliers.findByIdAndDelete(req.params.id);
        // Validar que la subcategoría si exista
        if (!deletedSupplier) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Proveedor eliminado con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar proveedor", error: error.message })
    }
}
export default suppliersController