// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose';
// Definir el schema para Refunds
const refundsSchema = new Schema({
  refundCode: {
    type: String,
    required: [true, "El código de reembolso es obligatorio"],
    trim: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v.trim() !== '' && /^[A-Z0-9-]+$/.test(v);
      },
      message: "El código no puede estar vacío y solo puede contener letras mayúsculas, números y guiones"
    }
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Orders',
    required: [true, "El pedido asociado es obligatorio"]
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customers',
    required: [true, "El cliente es obligatorio"]
  },
  requestDate: {
    type: Date,
    required: [true, "La fecha de solicitud es obligatoria"],
    default: Date.now,
    validate: {
      validator: v => v <= new Date(),
      message: "La fecha de solicitud no puede ser futura"
    }
  },
  reason: {
    type: String,
    required: [true, "La razón es obligatoria"],
    trim: true,
    minlength: [10, "La razón debe tener al menos 10 caracteres"],
    maxlength: [200, "La razón no puede exceder los 200 caracteres"],
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "El motivo/razón no puede estar vacío"
    }
  },
  comments: {
    type: String,
    trim: true,
    maxlength: [500, "Los comentarios no pueden exceder los 500 caracteres"],
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "Los comentarios no puede estar vacíos"
    }
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Products',
    required: [true, "Al menos un producto es obligatorio para el reembolso"]
  }],
  status: {
    type: String,
    required: [true, "El estado es obligatorio"],
    enum: {
      values: ["pendiente", "aprobado", "rechazado", "procesado"],
      message: "Estado de reembolso no válido"
    },
    default: "pendiente",
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "El estado no puede estar vacío"
    }
  },
  amount: {
    type: Number,
    required: [true, "El monto es obligatorio"],
    min: [0.01, "El monto debe ser mayor a 0"]
  },
  refundMethod: {
    type: String,
    required: [true, "El método de reembolso es obligatorio"],
    enum: {
      values: ["efectivo", "tarjeta de crédito", "transferencia", "vale", "mismo método de pago", "otro"],
      message: "Método de reembolso no válido"
    },
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "El método de reembolso no puede estar vacío"
    }
  }
}, {
  timestamps: true,
  strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Refunds", refundsSchema, "Refunds");