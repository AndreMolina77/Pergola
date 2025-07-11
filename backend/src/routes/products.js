import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productsController.js";

import { upload } from "../utils/cloudinary.js"; // este es el que sube a Cloudinary

const router = express.Router();

// Solo esta ruta necesita subir imágenes
router.post("/", upload.array("images"), createProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
