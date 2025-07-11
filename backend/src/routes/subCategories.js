import express from "express"
import multer from "multer"
// Importo el controlador de categorías
import subcategoriesController from "../controllers/subCategoriesController.js"
 
const router = express.Router()
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
 
router.route()
    .get(subcategoriesController.getSubCategories)
    .post(upload.single("image"), subcategoriesController.postSubCategories)
router.route("/:id")
    .get(subcategoriesController.getSubCategory)
    .put(upload.single("image"), subcategoriesController.putSubCategories)
    .delete(subcategoriesController.deleteSubCategories)
 
export default router