// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose'
// Definir el schema para los empleados
const employeesSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "El nombre no puede estar vacío"
    }
  },
  lastName: {
    type: String,
    required: [true, "El apellido es obligatorio"],
    trim: true,
    minlength: [2, "El apellido debe tener al menos 2 caracteres"],
    maxlength: [100, "El apellido no puede exceder los 100 caracteres"],
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "El apellido no puede estar vacío"
    }
  },
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
    trim: true,
    minlength: [5, "El nombre de usuario debe tener al menos 5 caracteres"],
    maxlength: [50, "El nombre de usuario no puede exceder los 50 caracteres"],
    unique: true,
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "El nombre de usuario no puede estar vacío"
    }
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v.trim() !== '' && /^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(v);
      },
      message: "El correo no puede estar vacío y debe ser válido"
    }
  },
  phoneNumber: {
    type: String,
    required: [true, "El número de teléfono es obligatorio"],
    trim: true,
    validate: {
      validator: function(v) {
        return v.trim() !== '' && /^\+503[-\d]{8,12}$/.test(v);
      },
      message: "El teléfono no puede estar vacío y debe ser válido en El Salvador"
    }
  },
  birthDate: {
    type: Date,
    required: [true, "La fecha de nacimiento es obligatoria"],
    validate: {
      validator: function (value) {
        // Obtener la fecha actual
        const today = new Date();
        // Calcular la fecha máxima permitida (por ejemplo, 120 años atrás)
        const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
        // Calcular la fecha mínima permitida (18 años de edad)
        const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        // Validar que la fecha no sea futura, que no sea anterior a 120 años y que sea menor a 18 años de edad
        return value <= today && value >= maxBirthDate && value <= minBirthDate;
      },
      message: "La fecha de nacimiento no es válida. Debe ser una fecha en el pasado, no anterior a 120 años y el usuario debe tener al menos 18 años."
    }
  },
  DUI: {
    type: String,
    required: [true, "El DUI es obligatorio"],
    trim: true,
    validate: {
      validator: function(v) {
        return v.trim() !== '' && /^\d{8}-\d$/.test(v);
      },
      message: "El DUI no puede estar vacío y debe tener formato 12345678-9"
    }
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    trim: true,
    minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
    maxlength: [100, "La contraseña no puede exceder los 100 caracteres"],
    validate: {
      validator: function(v) {
        return v.trim() !== '' && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v);
      },
      message: "La contraseña no puede estar vacía y debe incluir mayúsculas, minúsculas, números y caracteres especiales"
    }
  },
  profilePic: {
    type: String,
    validate: {
    validator: function(v) {
        if (v == null || v === '') return true; // Permite valores null o cadenas vacías
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(v);
      },
      message: "La URL debe ser válida (jpg/jpeg/png/webp/svg)"
    }
  },
  hireDate: {
    type: Date, 
    required: [true, "La fecha de contratación es obligatoria"],
    validate: {
      validator: v => v <= new Date(),
      message: "La fecha de contratación no puede estar en el futuro"
    }
  },
  isVerified: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  timeOut: { type: Date, default: null }
}, {
  timestamps: true,
  strict: false
})
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Employees", employeesSchema, "Employees")