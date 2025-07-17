import Reviews from "../models/reviews.js";
// Importo el modelo de productos
import Products from "../models/Products.js";
// Importo el modelo de clientes
import Customers from "../models/Customers.js";
import reviews from "../models/reviews.js";
const reviewsController = {}

reviewsController.postReviews = async (req, res) => {
    try {
        const { product,customer,rating,comment,response } = req.body;
        
        // Verificar que el cliente exista
        const existingCustomer = await Customers.findById(customer);
        if (!existingCustomer) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El cliente no existe" });
        }
        // Verificar que los productos existan
        const productsExist = await Products.countDocuments({ _id: { $in: items } });
        if (productsExist !== items.length) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "Uno o más productos no existen" });
        }
        const newReviews = new Reviews({ product,customer,rating,comment,response  });
        // Guardar la devolución
        await newReviews.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Review creada con éxito", data: newReviews });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear Review", error: error.message });
    }
};
// READ (GET ALL)
reviewsController.getReviews = async (req, res) => {
    try {
        // Buscar devoluciones
        const reviews = await Reviews.find().populate('customer', 'username email').populate({path: "items.itemId", select: "name price" });
        // ESTADO DE OK
        res.status(200).json(reviews);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener las reviews", error: error.message });
    };
};
// READ (GET ONE BY ID)
reviewsController.getReview = async (req, res) => {
    try {
        // Buscar una sola devolución
        const review = await Reviews.findById(req.params.id).populate('customer', 'username email').populate({path: "items.itemId", select: "name price" });
        // Validar que la devolución si exista
        if (!reviews) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Review no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(review);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener la review", error: error.message });
    }
};
// UPDATE (PUT)
reviewsController.putReviews = async (req, res) => {
    try {
        const updates = req.body;
        // Verificar si se intenta cambiar el código de pedido
        if (updates.reviewsCode) {
            const existingReviews = await Reviews.findOne({
                reviewsCode: updates.reviewsCode,
                _id: { $ne: req.params.id } // Excluir el documento actual
            });
            // Si ya existe, devolver error
            if (existingReviews) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "Esa review ya fue dada" });
            }
        }
        
        // Verificar cliente si se actualiza
        if (updates.customer) {
            const existingCustomer = await Customers.findById(updates.customer);
            // Si no existe, devolver error
            if (!existingCustomer) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "El cliente no existe" });
            }
        }
        // Verificar productos si se actualizan
        if (updates.items) {
            const productsExist = await Products.countDocuments({ _id: { $in: updates.items } });
            // Si no existen, devolver error
            if (productsExist !== updates.items.length) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "Uno o más productos no existen" });
            }
        }
        // Actualizar la reseña
        const updatedReviews = await Reviews.findByIdAndUpdate( req.params.id, updates, { new: true })
        // Validar que la review si exista
        if (!updatedReviews) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Review no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Review actualizada con éxito", data: updatedReviews });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar la review", error: error.message });
    }
};
// DELETE (DELETE)
reviewsController.deleteReviews = async (req, res) => {
    try {
        // Buscar review por ID
        const reviews = await Reviews.findById(req.params.id);
        // Validar que la devolución si exista
        if (!reviews) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Review no encontrada" });
        }
        // Eliminar review
        await Reviews.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Review eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar la review", error: error.message });
    }
}
export default reviewsController;