import Suppliers from "../models/Suppliers.js"

const suppliersController = {}

// ✅ Crear un nuevo proveedor
suppliersController.postSuppliers = async (req, res) => {
  try {
    const { name, contactPerson, phoneNumber, email, address } = req.body

    // 🔍 Verifica si ya existe un proveedor con el mismo nombre
    const existingSupplier = await Suppliers.findOne({ name })
    if (existingSupplier) {
      return res.status(400).json({ message: "El proveedor ya existe" })
    }

    // 🆕 Crea una nueva instancia del proveedor
    const newSupplier = new Suppliers({
      name,
      contactPerson,
      phoneNumber,
      email,
      address
    })

    // 💾 Guarda el nuevo proveedor en la base de datos
    await newSupplier.save()

    // ✅ Devuelve respuesta exitosa
    res.status(201).json({ message: "Proveedor creado con éxito", data: newSupplier })
  } catch (error) {
    // ❌ Error al crear proveedor
    res.status(400).json({ message: "Error al crear proveedor", error: error.message })
  }
}

// 📥 Obtener todos los proveedores
suppliersController.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Suppliers.find()
    res.status(200).json(suppliers)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedores", error: error.message })
  }
}

// 🔍 Obtener un proveedor por su ID
suppliersController.getSupplierById = async (req, res) => {
  try {
    const supplier = await Suppliers.findById(req.params.id)

    // ⚠️ Si no existe, enviar mensaje de no encontrado
    if (!supplier) {
      return res.status(404).json({ message: "Proveedor no encontrado" })
    }

    // ✅ Si se encuentra, devolver proveedor
    res.status(200).json(supplier)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedor", error: error.message })
  }
}

// ✏️ Actualizar proveedor existente
suppliersController.putSuppliers = async (req, res) => {
  try {
    const updates = req.body // Nuevos datos a actualizar

    // 🔁 Buscar y actualizar proveedor por ID
    const updated = await Suppliers.findByIdAndUpdate(req.params.id, updates, { new: true })

    // ⚠️ Si no existe, devolver error
    if (!updated) {
      return res.status(404).json({ message: "Proveedor no encontrado" })
    }

    // ✅ Proveedor actualizado correctamente
    res.status(200).json({ message: "Proveedor actualizado con éxito", data: updated })
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar proveedor", error: error.message })
  }
}

// 🗑️ Eliminar proveedor por ID
suppliersController.deleteSuppliers = async (req, res) => {
  try {
    const supplier = await Suppliers.findById(req.params.id)

    // ⚠️ Verifica si el proveedor existe
    if (!supplier) {
      return res.status(404).json({ message: "Proveedor no encontrado" })
    }

    // 🧹 Elimina el proveedor
    await Suppliers.findByIdAndDelete(req.params.id)

    // ✅ Eliminación exitosa
    res.status(204).json({ message: "Proveedor eliminado con éxito" })
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar proveedor", error: error.message })
  }
}

export default suppliersController
