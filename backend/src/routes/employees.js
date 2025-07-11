import express from "express"
import employeesController from "../controllers/employeesController.js"

const router = express.Router()
//Rutas que no requieren ningun parametro en especifico
router.route("/")
  .get(employeesController.getEmployees)
  .post(employeesController.postEmployees)
  //Rutas que requieren d eun parametro de id 
router.route("/:id")
  .get(employeesController.getEmployee)
  .put(employeesController.putEmployees)
  .delete(employeesController.deleteEmployees)

 export default router