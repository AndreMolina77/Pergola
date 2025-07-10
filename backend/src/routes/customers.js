import express from "express"
import customersController from "../controllers/customersController.js"

const router = express.Router()
router.route("/")
//Rutas que no requieren ningun parametro en especifico
router.route()
 .get(customersController.getCustomers)
 //Rutas que requieren d eun parametro de id 
 router.route("/:id")
 .post(customersController.postCustomers)
 .get(customersController.postCustomers)
 .put(customersController.putCustomers)
 .delete(customersController.deleteCustomers)

 export default router