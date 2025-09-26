// Libreria para enrutamiento express
import express from "express"
// Importo controlador de registro de empleados
import signupController from "../controllers/signupController.js"

const router = express.Router();
// Única ruta
router.post("/", signupController.registerEmployee)
router.post("/verifyCode", signupController.verifyCodeEmail)

export default router