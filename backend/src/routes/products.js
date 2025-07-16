import express from "express";
import multer from "multer";
import path from "path";

// Importación del controlador de productos (exportación por defecto)
import productsController from "../controllers/productsController.js";

// Configuración de Multer para manejar múltiples imágenes, guardando en "public/"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/"); // La carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    // Renombrar el archivo con la fecha actual para evitar colisiones
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Ruta para obtener todos los productos y crear nuevos productos (con múltiples imágenes)
router.route("/")
  .get(productsController.getProducts) // Aquí estás llamando a la función correctamente
  .post(upload.array("images", 10), productsController.createProduct);

router.route("/:id")
  .get(productsController.getProductById)
  .put(upload.array("images", 10), productsController.updateProduct)  // Permite subir un array de imágenes para actualizar el producto
  .delete(productsController.deleteProduct); // Eliminar un producto por ID

export default router;
