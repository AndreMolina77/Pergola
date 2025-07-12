import express from "express";
import ordersController from "../controllers/ordersController.js";

const router = express.Router();

// Rutas que no requieren ningún parámetro en específico
router.route('/')
    .get(ordersController.getOrders)
    .post(ordersController.postOrders);
// Rutas que requieren un parámetro de id
router.route('/:id')
    .get(ordersController.getOrderById)
    .put(ordersController.putOrders)
    .delete(ordersController.deleteOrders);

export default router;