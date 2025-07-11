import express from "express"
import multer from "multer"
import customersController from "../controllers/customersController.js"

const upload = multer({dest: "public/"})
const router = express.Router()
router.route("/")
//Rutas que no requieren ningun parametro en especifico
router.route()
 .get(customersController.getCustomers)
 //Rutas que requieren d eun parametro de id 
 router.route("/:id")
 .post(upload.single("image"),customersController.postCustomers)
 .get(customersController.getCustomer)
 .put(customersController.putCustomers)
 .delete(customersController.deleteCustomers)

 export default router