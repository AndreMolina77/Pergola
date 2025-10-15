const customDesignsController = {};
// Importar modelo de diseños personalizados
import CustomDesigns from "../models/CustomDesigns.js";
// Función helper para validar
import { validateCustomDesign } from "../validators/validator.js";
// POST (CREATE)
customDesignsController.postDesigns = async (req, res) => {
  try {
    const { codeRequest, piece, base, baseLength, decoration, clasp, customerComments } = req.body;
    /* // Validar lo que venga en req.body
    const validationError = validateCustomDesign({ codeRequest, piece, base, baseLength, decoration, clasp, customerComments });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    const newDesign = new CustomDesigns({ codeRequest, piece, base, baseLength, decoration, clasp, customerComments });
    // Guardar diseño
    await newDesign.save();
    // ESTADO DE CREACIÓN
    res.status(201).json({ message: "Diseño creado con éxito", data: newDesign });
  } catch (error) {
    console.error("🔥 ERROR en postDesigns:", error); // log completo

    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ message: "Error al crear diseño", error: error.message, stack: error.stack, body: req.body });
  }
};
// POST (CREATE REQUEST FROM PUBLIC FRONTEND)
customDesignsController.postPublicDesigns = async (req, res) => {
  try {
    const { codeRequest, piece, base, baseLength, decoration, clasp, customerComments } = req.body;

    const newRequest = new CustomDesigns({ codeRequest, piece, base, baseLength, decoration, clasp, customerComments });
    // Guardar solicitud
    await newRequest.save();
    // ESTADO DE CREACIÓN
    res.status(201).json({ message: "Solicitud creada con éxito", data: newRequest });
  } catch (error) {
    console.error("🔥 ERROR en postDesigns:", error); // log completo
    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ message: "Error al crear solicitud", error: error.message, stack: error.stack, body: req.body });
  }
};
// READ (GET ALL)
customDesignsController.getCustomDesigns = async (req, res) => {
  try {
    const customDesigns = await CustomDesigns.find()
      .populate('base', 'name type image') // Popular base con sus campos
      .populate('decoration', 'name type image') // Popular decoration
      .populate('clasp', 'name type image') // Popular clasp
      .sort({ createdAt: -1 });
    
    res.status(200).json(customDesigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// READ (GET ONE BY ID)
customDesignsController.getCustomDesign = async (req, res) => {
  try {
    const customDesign = await CustomDesigns.findById(req.params.id)
      .populate('base', 'name type image')
      .populate('decoration', 'name type image')
      .populate('clasp', 'name type image');
    
    if (!customDesign) {
      return res.status(404).json({ message: "Diseño no encontrado" });
    }
    
    res.status(200).json(customDesign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE (PUT)
customDesignsController.putDesigns = async (req, res) => {
  try {
    const updates = req.body;
    // Verificar si se intenta cambiar el código de diseño
    if (updates.codeRequest) {
      const existingDesign = await CustomDesigns.findOne({codeRequest: updates.codeRequest, _id: { $ne: req.params.id } /* Excluir el documento actual */});
      // Si ya existe, devolver error
      if (existingDesign) {
        // ESTADO DE ERROR DE INPUT DEL CLIENTE
        return res.status(400).json({ message: "El código de diseño ya está en uso" });
      }
    }
    /* // Validar lo que venga en req.body
    const validationError = validateCustomDesign(updates);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    } */
    // Actualizar diseño
    const updatedDesign = await CustomDesigns.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedDesign) {
      return res.status(404).json({ message: "Diseño no encontrado" });
    }
    // ESTADO DE OK
    res.status(200).json({ message: "Diseño actualizado con éxito", data: updatedDesign });
  } catch (error) {
    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ message: "Error al actualizar diseño", error: error.message });
  }
};
// DELETE
customDesignsController.deleteDesigns = async (req, res) => {
  try {
      // Buscar diseño por su ID
      const design = await CustomDesigns.findById(req.params.id);
      if (!design) {
        // ESTADO DE NO ENCONTRADO
        return res.status(404).json({ message: "Diseño no encontrado" });
      }
      // Borrar diseño
      await CustomDesigns.findByIdAndDelete(req.params.id);
      // ESTADO DE BORRADO
      res.status(204).json({ message: "Diseño eliminado con éxito" });
  } catch (error) {
      // ESTADO DE ERROR DEL SERVIDOR
      res.status(500).json({ message: "Error al eliminar diseño", error: error.message });
  }
};
export default customDesignsController;