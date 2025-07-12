import express from "express"
import suppliersController from "../controllers/suppliersController.js"

const router = express.Router()
//Rutas que no requieren ningun parametro en especifico
router.route("/")
.post(suppliersController.postSuppliers)
.get(suppliersController.getSuppliers)
 //Rutas que requieren d eun parametro de id 
 router.route("/:id")
 .get(suppliersController.getSuppliers)
 .put(suppliersController.putSuppliers)
 .delete(suppliersController.deleteSuppliers)

 export default router