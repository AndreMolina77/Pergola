// Libreria para enrutamiento express
import express from "express"
// Importo el controlador de pedidos
import ordersController from "../controllers/ordersController.js"

const router = express.Router()
// Ruta para obtener los pedidos sin iniciar sesión
router.get("/public", ordersController.getPublicOrders)
// Rutas que no requieren ningún parámetro en específico
router.route("/")
  .get(ordersController.getOrders)
  .post(ordersController.postOrders)
// Rutas que requieren un parámetro de id 
router.route("/:id")
  .get(ordersController.getOrder)
  .put(ordersController.putOrders)
  .delete(ordersController.deleteOrders)

export default router