// Solo para manejar cambios y ajustes en el perfil en el frontend privado
import { Schema, model } from "mongoose"
import bcryptjs from "bcryptjs"
// Definir el schema para el admin
const adminSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔑 aquí
  profilePic: { type: String, default: '' },
  userType: { type: String, default: 'admin' },
  emailNotifications: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  timeOut: { type: Date, default: null }
}, {
  timestamps: true,
  strict: false
})
// Hook para hashear la contraseña antes de guardar
adminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next()
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
  next()
})

// Método para comparar contraseñas
adminSchema.methods.comparePassword = async function(password) {
  if (!this.password) {
    // Fallback: devolver false si no hay password guardada
    return false
  }
  return await bcrypt.compare(password, this.password)
}
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Admin", adminSchema, "Admin")