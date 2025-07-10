import express from "express"
import employeesController from "../controllers/employessController.js"

const router = express.Router()
router.route("/")
//Rutas que no requieren ningun parametro en especifico
router.route()
 .get(employeesController.getEmployees)
 //Rutas que requieren d eun parametro de id 
 router.route("/:id")
 .post(employeesController.postEmployees)
 .get(employeesController.postEmployees)
 .put(employeesController.putEmployees)
 .delete(employeesController.deleteEmployees)

 export default router