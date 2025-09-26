import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import swaggerUi from "swagger-ui-express"
import fs from "fs"
import path from "path"
// Aqui importo todas las rutas que tiene el sistema de Pérgola
import productsRoutes from "./src/routes/products.js"
import customDesignsRoutes from "./src/routes/customDesigns.js"
import rawMaterialsRoutes from "./src/routes/rawMaterials.js"
import employeesRoutes from "./src/routes/employees.js"
import categoriesRoutes from "./src/routes/categories.js"
import subcategoriesRoutes from "./src/routes/subCategories.js"
import collectionsRoutes from "./src/routes/collections.js"
import customersRoutes from "./src/routes/customers.js"
import ordersRoutes from "./src/routes/orders.js"
import reviewsRoutes from "./src/routes/reviews.js"
import transactionsRoutes from "./src/routes/transactions.js"
import refundsRoutes from "./src/routes/refunds.js"
import suppliersRoutes from "./src/routes/suppliers.js"
import designElementsRoutes from "./src/routes/designElement.js"
import loginRoutes from "./src/routes/login.js"
import logoutRoutes from "./src/routes/logout.js"
import signupRoutes from "./src/routes/signup.js"
import signupCustomerRoutes from "./src/routes/signupCustomer.js"
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js"
import validateAuthTokenRoutes from "./src/routes/validateAuthToken.js"
import validatePasswordRoutes from "./src/routes/validatePassword.js"
import adminProfileRoutes from "./src/routes/adminProfile.js"
// Importo middlewares para validar el token de autenticación
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js"
 
dotenv.config()
const app = express()
app.use(cors({
  origin: ["http://localhost:5173", "https://pergola-rose.vercel.app"], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json(({ limit: '10mb' })))
app.use(cookieParser())
// Archivo JSON que contiene la documentación de Swagger UI
const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve("./institutotcnicorical-1ec-Pergola-1.0.0-swagger.json"), "utf8"))
// Rutas que NO requieren login
app.use("/api/login", loginRoutes)
app.use("/api/logout", logoutRoutes)
app.use("/api/signup", signupRoutes)
app.use("/api/signupCustomer", signupCustomerRoutes)
app.use("/api/recoveryPassword", recoveryPasswordRoutes)
app.use("/api/validatePassword", validatePasswordRoutes)
app.use("/api/admin/profile", adminProfileRoutes) // Esta será pública para /data-public
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// Para la app móvil
app.use("/api/public/products", productsRoutes)
app.use("/api/public/customdesigns", customDesignsRoutes)
app.use("/api/public/categories", categoriesRoutes);
app.use("/api/public/subcategories", subcategoriesRoutes);
app.use("/api/public/collections", collectionsRoutes);
app.use("/api/public/reviews", reviewsRoutes);
app.use("/api/public/customers", customersRoutes);
app.use("/api/public/orders", ordersRoutes);

// Ruta especial para validar token (acepta cualquier tipo de usuario válido)
app.use("/api/validateAuthToken", validateAuthTokenRoutes)
// Rutas que SÍ requieren login (protegidas) 
app.use("/api/products", validateAuthToken(["admin", "employee"]), productsRoutes)
app.use("/api/rawmaterials", validateAuthToken(["admin", "employee"]), rawMaterialsRoutes)
app.use("/api/customdesigns", validateAuthToken(["admin", "employee", "customer"]), customDesignsRoutes)
app.use("/api/employees", validateAuthToken(["admin", "employee"]), employeesRoutes)
app.use("/api/admin/profile", validateAuthToken(["admin"]), adminProfileRoutes) // Solo admin
app.use("/api/collections", validateAuthToken(["admin", "employee"]), collectionsRoutes) 
app.use("/api/categories", validateAuthToken(["admin", "employee"]), categoriesRoutes)
app.use("/api/subcategories", validateAuthToken(["admin", "employee"]), subcategoriesRoutes) 
app.use("/api/customers", validateAuthToken(["admin", "employee", "customer"]), customersRoutes)
app.use("/api/orders", validateAuthToken(["admin", "employee", "customer"]), ordersRoutes)
app.use("/api/reviews", validateAuthToken(["admin", "employee", "customer"]), reviewsRoutes) 
app.use("/api/refunds", validateAuthToken(["admin", "employee", "customer"]), refundsRoutes)
app.use("/api/transactions", validateAuthToken(["admin", "employee", "customer"]), transactionsRoutes)
app.use("/api/suppliers", validateAuthToken(["admin", "employee"]), suppliersRoutes) 
app.use("/api/designelements", validateAuthToken(["admin", "employee"]), designElementsRoutes)
export default app