const reviewsController = {};
// Importo el modelo de reseñas
import Reviews from "../models/Reviews.js";
// Importo el modelo de productos
import Products from "../models/Products.js";
// Importo el modelo de clientes
import Customers from "../models/Customers.js";
// Función helper para validar
import { validateReview } from "../validators/validator.js";
// POST (CREATE)
reviewsController.postReviews = async (req, res) => {
  try {
    const { product, customer, rating, comment, response } = req.body;
    // Verificar que el cliente exista
    const existingCustomer = await Customers.findById(customer);
    if (!existingCustomer) {
      return res.status(400).json({ message: "El cliente no existe" });
    }
    // Verificar que el producto exista
    const existingProduct = await Products.findById(product);
    if (!existingProduct) {
      return res.status(400).json({ message: "El producto no existe" });
    }
    /* // Validar lo que venga en el req.body
    const validationError = validateReview({product, customer, rating, comment, response})
    if (validationError) {
      return res.status(400).json({ message: validationError}) // si hay error, corto aquí
    } */
    // Preparar datos para crear la reseña
    const reviewData = { product, customer, rating: Number(rating), comment: comment.trim() };
    // Solo agregar response si se proporciona y no está vacío
    if (response && response.trim() !== '') {
      reviewData.response = response.trim();
    }
    const newReviews = new Reviews(reviewData);
    // Guardar la reseña
    await newReviews.save();
    // ESTADO DE CREACIÓN
    res.status(201).json({ message: "Reseña creada con éxito", data: newReviews });
  } catch (error) {
    // ESTADO DE ERROR DE INPUT DEL CLIENTE
    res.status(400).json({ message: "Error al crear Review", error: error.message, type: error.name });
  }
};
// READ (GET ALL)
reviewsController.getReviews = async (req, res) => {
  try {
    // Buscar reseñas
    const reviews = await Reviews.find().populate('product', 'name description').populate('customer', 'username email');
    // ESTADO DE OK
    res.status(200).json(reviews);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener reseñas", error: error.message });
  }
};
// READ (GET ALL PUBLIC REVIEWS)
reviewsController.getPublicReviews = async (req, res) => {
  try {
    // Buscar reseñas publicas
    const publicReviews = await Reviews.find().populate('product', 'name description').populate('customer', 'username email');
    // ESTADO DE OK
    res.status(200).json(publicReviews);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener reseñas publicas", error: error.message });
  }
};
// READ (GET ONE BY ID)
reviewsController.getReview = async (req, res) => {
  try {
    // Buscar una sola reseña
    const review = await Reviews.findById(req.params.id).populate('product', 'name description').populate('customer', 'username email');
    // Validar que la reseña si exista
    if (!review) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Reseña no encontrada" });
    }
    // ESTADO DE OK
    res.status(200).json(review);
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al obtener reseña", error: error.message });
  }
};
// UPDATE (PUT)
reviewsController.putReviews = async (req, res) => {
  try {
    const updates = req.body;
    // Verificar que el producto exista
    const productExists = await Products.findById(updates.product);
    if (!productExists) {
      // ESTADO DE ERROR DE INPUT DEL CLIENTE
      return res.status(400).json({ message: "El producto no existe" });
    }
    // Verificar que el cliente exista
    const customerExists = await Customers.findById(updates.customer);
    if (!customerExists) {
      // ESTADO DE ERROR DE INPUT DEL CLIENTE
      return res.status(400).json({ message: "El cliente no existe" });
    }
    /* // Validar lo que venga en el req.body
    const validationError = validateReview(updates)
    if (validationError) {
      return res.status(400).json({ message: validationError}) // si hay error, corto aquí
    } */
    const updatedReview = await Reviews.findByIdAndUpdate(req.params.id, { updates }, { new: true });
    // Validar que la reseña si exista
    if (!updatedReview) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Reseña no encontrada" });
    }
    // ESTADO DE OK
    res.status(200).json({ message: "Reseña actualizada con éxito", data: updatedReview });
  } catch (error) {
    console.error("❌ Error actualizando reseña:", error);
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Error de validación", errors: errorMessages });
    }
    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ message: "Error al actualizar reseña", error: error.message });
  }
};
// DELETE (DELETE)
reviewsController.deleteReviews = async (req, res) => {
  try {
    // Buscar reseña por ID
    const review = await Reviews.findById(req.params.id);
    // Validar que la reseña si exista
    if (!review) {
      // ESTADO DE NO ENCONTRADO
      return res.status(404).json({ message: "Reseña no encontrada" });
    }
    // Eliminar reseña
    await Reviews.findByIdAndDelete(req.params.id);
    // ESTADO DE BORRADO
    res.status(204).json({ message: "Reseña eliminada con éxito" });
  } catch (error) {
    // ESTADO DE ERROR DEL SERVIDOR
    res.status(500).json({ message: "Error al eliminar reseña", error: error.message });
  }
};
export default reviewsController;