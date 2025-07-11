// Importar Schema y model de mongoose
import { Schema, model } from 'mongoose';

// Definir el schema para Suppliers
const supplierSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre del proveedor es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [255, 'El nombre no puede exceder los 255 caracteres']
  },
  contactPerson: {
    type: String,
    required: [true, 'El nombre de la persona de contacto es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [255, 'El nombre no puede exceder los 255 caracteres']
  },
  phoneNumber: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio'],
    trim: true,
    maxlength: [50, 'El teléfono no puede exceder los 50 caracteres'],
    validate: {
      validator: v => /^[\d\s()+-]{5,50}$/.test(v),
      message: props => `${props.value} no es un número de teléfono válido`
    }
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Formato de email inválido'],
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: props => `${props.value} no es un email válido`
    }
  },
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true,
    minlength: [5, 'La dirección debe tener al menos 5 caracteres'],
    maxlength: [500, 'La dirección no puede exceder los 500 caracteres']
  }
}, {
  timestamps: true,
  strict: false
});

export default model('Supplier', supplierSchema, 'Suppliers');
