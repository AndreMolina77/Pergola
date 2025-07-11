import express from "express"
import multer from "multer"
// Importo el controlador de categorías
import collectionsController from "../controllers/collectionsController.js"
 
const router = express.Router()
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
 
router.route()
    .get(collectionsController.getCollections)
    .post(upload.single("image"), collectionsController.postCollections)
router.route("/:id")
    .get(collectionsController.getCollection)
    .put(upload.single("image"), collectionsController.putCollections)
    .delete(collectionsController.deleteCollections)
 
export default router