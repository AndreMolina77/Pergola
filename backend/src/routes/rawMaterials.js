import express from "express"
import rawMaterialsController from "../controllers/rawMaterialController.js"

const router = express.Router()
//Rutas que no requieren ningun parametro en especifico
router.route("/")
 .post(rawMaterialsController.postRawMaterials)
 .get(rawMaterialsController.getRawMaterials)
 //Rutas que requieren d eun parametro de id 
 router.route("/:id")
 .get(rawMaterialsController.getRawMaterials)
 .put(rawMaterialsController.putRawMaterials)
 .delete(rawMaterialsController.deleteRawMaterials)

 export default router