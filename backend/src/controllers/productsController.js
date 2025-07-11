import Product from "../models/Products.js";

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("collection category subcategory rawMaterialsUsed");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("collection category subcategory rawMaterialsUsed");
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error });
  }
};

// Crear nuevo producto (ahora usando Cloudinary)
const createProduct = async (req, res) => {
  try {
    const files = req.files || [];
    const imageUrls = files.map(file => file.path); // .path viene de Cloudinary

    const newProduct = new Product({
      ...req.body,
      images: imageUrls,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error al crear producto", error });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar producto", error });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
