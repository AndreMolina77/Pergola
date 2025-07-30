const rawMaterialsController = {};
// Importo el modelo de materias primas
import RawMaterials from "../models/RawMaterials.js";
// POST (CREATE)
rawMaterialsController.postRawMaterials = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            type, 
            color, 
            tone, 
            toneType, 
            texture, 
            shape, 
            dimension, 
            provider, 
            brand, 
            presentation, 
            quantity, 
            piecesPerPresentation, 
            totalPieces, 
            piecePrice, 
            purchaseDate, 
            stock } = req.body;

            if
            (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
            return res.status(400).json({
                message: "El nombre es obligatorio, no puede estar vacío y debe tener entre 2 y 100 caracteres."
            });
        }
        if (!description || typeof description !== "string" || description.trim().length === 0) {
            return res.status(400).json({
                message: "La descripción es obligatoria y no puede estar vacía."
            });
        }
        if (!type || typeof type !== "string" || type.trim().length === 0) {
            return res.status(400).json({
                message: "El tipo es obligatorio y no puede estar vacío."
            });
        }
        if (!color || typeof color !== "string" || color.trim().length === 0) {
            return res.status(400).json({
                message: "El color es obligatorio y no puede estar vacío."
            });
        }
        if (!tone || typeof tone !== "string" || tone.trim().length === 0) {
            return res.status(400).json({
                message: "El tono es obligatorio y no puede estar vacío."
            });
        }
        if (!toneType || typeof toneType !== "string" || toneType.trim().length === 0) {
            return res.status(400).json({
                message: "El tipo de tono es obligatorio y no puede estar vacío."
            });
        }
        if (!texture || typeof texture !== "string" || texture.trim().length === 0) {
            return res.status(400).json({
                message: "La textura es obligatoria y no puede estar vacía."
            });
        }
        if (!shape || typeof shape !== "string" || shape.trim().length === 0) {
            return res.status(400).json({
                message: "La forma es obligatoria y no puede estar vacía."
            });
        }
        if (!dimension || typeof dimension !== "string" || dimension.trim().length === 0
        ) {
            return res.status(400).json({
                message: "La dimensión es obligatoria y no puede estar vacía."
            });
        }
        if (!provider || typeof provider !== "string" || provider.trim().length === 0
        ) {
            return res.status(400).json({
                message: "El proveedor es obligatorio y no puede estar vacío."
            });
        }
        if (!brand || typeof brand !== "string" || brand.trim().length === 0) {
            return res.status(400).json({
                message: "La marca es obligatoria y no puede estar vacía."
            });
        }
        if (!presentation || typeof presentation !== "string" || presentation.trim().length === 0) {
            return res.status(400).json({
                message: "La presentación es obligatoria y no puede estar vacía."
            });
        }
        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({
                message: "La cantidad es obligatoria y debe ser un número positivo."
            });
        }
        if (!piecesPerPresentation || typeof piecesPerPresentation !== "number" || piecesPerPresentation <= 0) {
            return res.status(400).json({
                message: "Las piezas por presentación son obligatorias y deben ser un número positivo."
            });
        }
        if (!totalPieces || typeof totalPieces !== "number" || totalPieces <= 0) {
            return res.status(400).json({
                message: "El total de piezas es obligatorio y debe ser un número positivo."
            });
        }
        if (!piecePrice || typeof piecePrice !== "number" || piecePrice <= 0) {
            return res.status(400).json({
                message: "El precio por pieza es obligatorio y debe ser un número positivo."
            });
        }
        if (!purchaseDate || isNaN(new Date(purchaseDate).getTime())) {
            return res.status(400).json({
                message: "La fecha de compra es obligatoria y debe ser una fecha válida."
            });
        }
        if (typeof stock !== "boolean") {
            return res.status(400).json({
                message: "El estado de stock es obligatorio y debe ser un booleano."
            });
        }
        
        // Verificar si el correlativo ya existe
        const existingMaterial = await RawMaterials.findOne({ correlative });
        if (existingMaterial) {
            // Devolver error de input del cliente
            return res.status(400).json({ message: "El correlativo ya está en uso" });
        }
        const newRawMaterial = new RawMaterials({ 
            name, 
            description,
            type, 
            color, 
            tone, 
            toneType, 
            texture, 
            shape, 
            dimension, 
            provider, 
            brand, 
            presentation, 
            quantity, 
            piecesPerPresentation, 
            totalPieces, 
            piecePrice, 
            purchaseDate: new Date(purchaseDate), stock });
        // Guardar materia prima
        await newRawMaterial.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Materia prima creada con éxito", data: newRawMaterial });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear materia prima", error: error.message });
    }
};
// READ (GET ALL)
rawMaterialsController.getRawMaterials = async (req, res) => {
    try {
        // Buscar materias primas
        const rawMaterials = await RawMaterials.find().populate('provider', 'name email');
        // ESTADO DE OK
        res.status(200).json(rawMaterials);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener materias primas", error: error.message });
    }
};
// READ (GET ONE BY ID)
rawMaterialsController.getRawMaterial = async (req, res) => {
    try {
        // Buscar una sola materia prima
        const rawMaterial = await RawMaterials.findById(req.params.id).populate('provider', 'name email');
        // Validar que la materia prima si exista
        if (!rawMaterial) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Materia prima no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(rawMaterial);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener materia prima", error: error.message });
    }
};
// UPDATE (PUT)
rawMaterialsController.putRawMaterials = async (req, res) => {
    try {
        const updates = req.body;
        // Actualizar materia prima
        const updatedRawMaterial = await RawMaterials.findByIdAndUpdate(req.params.id, updates, { new: true });
        // Validar que la materia prima si exista
        if (!updatedRawMaterial) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Materia prima no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Materia prima actualizada con éxito", data: updatedRawMaterial });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar materia prima", error: error.message });
    }
};
// DELETE (DELETE)
rawMaterialsController.deleteRawMaterials = async (req, res) => {
    try {
        // Buscar materia prima por ID
        const rawMaterial = await RawMaterials.findById(req.params.id);
        // Validar que la materia prima si exista
        if (!rawMaterial) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Materia prima no encontrada" });
        }
        // Eliminar materia prima
        await RawMaterials.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Materia prima eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar materia prima", error: error.message });
    }
};
export default rawMaterialsController;