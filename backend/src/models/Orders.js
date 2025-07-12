/* 
CRUD DE PEDIDOS (ALDO)
Orders
orderCode: string,
receiver: string,
timetable: string,
mailingAddress: string,
paymentMethod: string,
status: string,
paymentStatus: string,
deliveryDate: date,
items: Array[ObjectId]
subtotal: number,
total: number,
*/
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ordersSchema = new Schema({
    orderCode: {
        type: String,
        required: [true, "El código de pedido es obligatorio"],
        unique: true,
        trim: true,
        minlength: [5, "El código de pedido debe tener al menos 5 caracteres"],
        maxlength: [20, "El código de pedido no puede exceder los 20 caracteres"]
    },
    receiver: {
        type: String,
        required: [true, "El nombre del receptor es obligatorio"],
        trim: true,
        minlength: [2, "El nombre del receptor debe tener al menos 2 caracteres"],
        maxlength: [100, "El nombre del receptor no puede exceder los 100 caracteres"]
    },
    timetable: {
        type: String,
        required: [true, "El horario es obligatorio"],
        trim: true
    },
    mailingAddress: {
        type: String,
        required: [true, "La dirección de envío es obligatoria"],
        trim: true
    },
    paymentMethod: {
        type: String,
        required: [true, "El método de pago es obligatorio"],
        enum: ["Tarjeta de crédito", "PayPal", "Transferencia bancaria", "Efectivo"]
    },
    status: {
        type: String,
        required: [true, "El estado del pedido es obligatorio"],
        enum: ["Pendiente", "Enviado", "Entregado", "Cancelado"]
    },
    paymentStatus: {
        type: String,
        required: [true, "El estado del pago es obligatorio"],
        enum: ["Pendiente", "Pagado", "Reembolsado"]
    },
    deliveryDate: {
        type: Date,
        required: [true, "La fecha de entrega es obligatoria"]
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    }],
    subtotal: {
        type: Number,
        required: [true, "El subtotal es obligatorio"],
        min: [0, "El subtotal no puede ser negativo"]
    },
    total: {
        type: Number,
        required: [true, "El total es obligatorio"],
        min: [0, "El total no puede ser negativo"]
    }
    }, { timestamps: true });