import RawMaterials from "../models/RawMaterials.js";
// Importo el modelo de productos
import Suppliers from "../models/Suppliers.js";

rawMaterialsController.postRawMaterials = async (req, res) => {
    try {
        const { name, contactPerson,   phoneNumber, email, address } = req.body;
        
        // Verificar que el cliente proveedor exista
        const existingSuppliers = await Suppliers.findById(Suppliers);
        if (!existingSuppliers) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El Proveedor no existe" });
        }
        
        const newRawMaterials = new RawMaterials({correlative, name, description, type, color, tone, toneType, texture, shape, dimension, provider, brand, presentation, quantity, piecesPerPresentation, totalPieces, piecePrice, purchaseDate, stock
});
        // Guardar la devolución
        await newRawMaterials.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Materias Primas creadas con éxito", data: newRawMaterials });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear Materias Primas", error: error.message });
    }
};
// READ (GET ALL)
rawMaterialsController.getRawMaterials = async (req, res) => {
    try {
        // Buscar devoluciones
        const rawMaterials = await RawMaterials.find().populate('provider', 'name email');
        // ESTADO DE OK
        res.status(200).json(rawMaterials);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener las Materias Primas", error: error.message });
    };
};
// READ (GET ONE BY ID)
rawMaterialsController.getRawMaterials = async (req, res) => {
    try {
        // Buscar una sola materia prima
        const rawMaterials = await RawMaterials.findById(req.params.id).populate('provider', 'name email');
        // Validar que la materia prima si exista
        if (!rawMaterials) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Materia Prima no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(rawMaterials);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener la review", error: error.message });
    }
};
// UPDATE (PUT)
rawMaterialsController.putRawMaterials = async (req, res) => {
    try {
        const updates = req.body;
        // Verificar si se intenta cambiar el código de Materia Prima
        if (updates.rawMaterialsCode) {
            const existingRawMaterials = await RawMaterials.findOne({
                rawMaterialsCode: updates.rawMaterialsCode,
                _id: { $ne: req.params.id } // Excluir el documento actual
            });
            // Si ya existe, devolver error
            if (existingRawMaterials) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "Esa materia prima ya fue creada" });
            }
        }
        
        // Verificar el proveedor si se actualiza
        if (updates.Suppliers) {
            const existingSuppliers = await Suppliers.findById(updates.Suppliers);
            // Si no existe, devolver error
            if (!existingSuppliers) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "El proveedor no existe" });
            }
        }
        
        // Actualizar la materia prima
        const updatedRawMaterials = await RawMaterials.findByIdAndUpdate( req.params.id, updates, { new: true })
        // Validar que la review si exista
        if (!updatedRawMaterials) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Materia Prima no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Materia Prima actualizada con éxito", data: updatedRawMaterials });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL Materia Prima
        res.status(400).json({ message: "Error al actualizar la materia prima", error: error.message });
    }
};
// DELETE (DELETE)
rawMaterialsController.deleteRawMaterials = async (req, res) => {
    try {
        // Buscar rawMaterials por ID
        const rawMaterials = await RawMaterials.findById(req.params.id);
        // Validar que la materia prima si exista
        if (!rawMaterials) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Materia Prima no encontrada" });
        }
        // Eliminar materia prima
        await RawMaterials.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Materia Prima eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar la Materia Prima", error: error.message });
    }
}
export default rawMaterialsController;