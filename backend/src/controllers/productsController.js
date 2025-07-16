import Product from "../models/Products.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from '../utils/config.js';

cloudinary.config({
    CLOUD_NAME: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.cloudinary_api_key,
  api_secret: config.CLOUDINARY.cloudinary_api_secret
});

// Definir el controlador como un objeto
const productsController = {};

// Obtener todos los productos
productsController.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("collection category subcategory rawMaterialsUsed");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

// Obtener producto por ID
productsController.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("collection category subcategory rawMaterialsUsed");
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error });
  }
};

// Crear nuevo producto
productsController.createProduct = async (req, res) => {
  try {
    const files = req.files || [];
    const imageUrls = files.map(file => file.path); // Cloudinary devuelve file.path

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
productsController.updateProduct = async (req, res) => {
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
productsController.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};

// Exportar el controlador
export default productsController;
