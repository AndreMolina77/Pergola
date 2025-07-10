import express from "express"
import reviewsController from "../controllers/reviewsController.js"

const router = express.Router()
router.route("/")
//Rutas que no requieren ningun parametro en especifico
router.route()
 .get(reviewsController.getReviews)
 //Rutas que requieren d eun parametro de id 
 router.route("/:id")
 .post(reviewsController.postReviews)
 .get(reviewsController.getReview)
 .put(reviewsController.putReviews)
 .delete(reviewsController.deleteReviews)

 export default router