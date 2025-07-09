import CustomDesign from "../models/CustomDesigns.js";

// Obtener todos los diseños únicos
export const getCustomDesigns = async (req, res) => {
  try {
    const designs = await CustomDesign.find();
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener diseños únicos", error });
  }
};

// Obtener diseño único por ID
export const getCustomDesignById = async (req, res) => {
  try {
    const design = await CustomDesign.findById(req.params.id);
    if (!design) return res.status(404).json({ message: "Diseño no encontrado" });
    res.json(design);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener diseño", error });
  }
};

// Crear diseño único
export const createCustomDesign = async (req, res) => {
  try {
    const newDesign = new CustomDesign(req.body);
    const saved = await newDesign.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error al crear diseño", error });
  }
};

// Actualizar diseño único
export const updateCustomDesign = async (req, res) => {
  try {
    const updated = await CustomDesign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Diseño no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar diseño", error });
  }
};

// Eliminar diseño único
export const deleteCustomDesign = async (req, res) => {
  try {
    const deleted = await CustomDesign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Diseño no encontrado" });
    res.json({ message: "Diseño eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar diseño", error });
  }
};
