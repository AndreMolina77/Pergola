import express from "express"
import multer from "multer"
import employeesController from "../controllers/employeesController.js"

const upload = multer({dest: "public/"})
const router = express.Router()
//Rutas que no requieren ningun parametro en especifico
router.route("/")
  .get(employeesController.getEmployees)
  .post(upload.single("image"),employeesController.postEmployees)
  //Rutas que requieren d eun parametro de id 
router.route("/:id")
  .get(employeesController.getEmployee)
  .put(employeesController.putEmployees)
  .delete(employeesController.deleteEmployees)

 export default router