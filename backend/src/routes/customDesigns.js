// Libreria para enrutamiento express
import express from "express"
// Importo el controlador de diseños únicos
import customDesignsController from "../controllers/customDesignsController.js"

const router = express.Router()
// Rutas que no requieren ningún parámetro en específico
router.route("/")
  .get(customDesignsController.getCustomDesigns)
  .post(customDesignsController.postDesigns)
// Ruta para que se cree la solicitud de diseño único desde la app móvil
router.post("/public", customDesignsController.postPublicDesigns)
// Rutas que requieren un parámetro de id 
router.route("/:id")
  .get(customDesignsController.getCustomDesign)
  .put(customDesignsController.putDesigns)
  .delete(customDesignsController.deleteDesigns)

export default router