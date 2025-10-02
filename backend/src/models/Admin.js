// Solo para manejar cambios y ajustes en el perfil en el frontend privado
import { Schema, model } from "mongoose"
// Definir el schema para el admin
const adminSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  }, 
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  profilePic: { 
    type: String, 
    default: '' 
  },
  userType: { 
    type: String, 
    default: 'admin' 
  },
  emailNotifications: { 
    type: Boolean, 
    default: false 
  },
  loginAttempts: { type: Number, default: 0 },
  timeOut: { type: Date, default: null }
}, {
  timestamps: true,
  strict: false
})
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Admin", adminSchema, "Admin")