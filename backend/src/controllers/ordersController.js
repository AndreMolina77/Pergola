import Orders from "../models/Orders.js";
import mongoose from "mongoose";
import { config } from '../utils/config.js';

const ordersController = {};

// CREATE (POST)
ordersController.postOrders = async (req, res) => {
    try {
        const { orderCode, receiver, timetable, mailingAddress, paymentMethod, status, paymentStatus, deliveryDate, items, subtotal, total } = req.body;

        // Verificar si el código de pedido ya existe
        const existingOrder = await Orders.findOne({ orderCode });
        if (existingOrder) {
            return res.status(400).json({ message: "El código de pedido ya está en uso" });
        }

        const newOrder = new Orders({
            orderCode,
            receiver,
            timetable,
            mailingAddress,
            paymentMethod,
            status,
            paymentStatus,
            deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
            items,
            subtotal,
            total
        });

        // Guardar el pedido
        await newOrder.save();
        res.status(201).json({ message: "Pedido creado con éxito", data: newOrder });
    } catch (error) {
        res.status(400).json({ message: "Error al crear pedido", error: error.message });
    }
}

// READ (GET ALL)
ordersController.getOrders = async (req, res) => {
    try {
        // Buscar pedidos
        const orders = await Orders.find().populate('items', 'name price quantity').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
    }
}

// READ (GET ONE BY ID)
ordersController.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de pedido inválido" });
        }

        const order = await Orders.findById(id).populate('items', 'name price quantity');
        if (!order) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido", error: error.message });
    }
}
    
// UPDATE (PUT)
ordersController.putOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de pedido inválido" });
        }

        // Verificar si se intenta cambiar el código de pedido
        if (updates.orderCode) {
            const existingOrder = await Orders.findOne({
                orderCode: updates.orderCode,
                _id: { $ne: id } // Excluir el documento actual
            });
            if (existingOrder) {
                return res.status(400).json({ message: "El código de pedido ya está en uso" });
            }
        }

        const updatedOrder = await Orders.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('items', 'name price quantity');
        if (!updatedOrder) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({ message: "Pedido actualizado con éxito", data: updatedOrder });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar pedido", error: error.message });
    }
}
// DELETE (DELETE)
ordersController.deleteOrders = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de pedido inválido" });
        }

        const deletedOrder = await Orders.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({ message: "Pedido eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar pedido", error: error.message });
    }
}

export default ordersController;

        