// Importar modelo y schema de mongoos
import { Schema, model } from 'mongoose';
// Definir el schema para Categories
const categoriesSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre de la categoría es obligatorio"],
        trim: true,
        minlength: [3, "El nombre debe tener al menos 3 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true,
        minlength: [10, "La descripción debe tener al menos 10 caracteres"],
        maxlength: [500, "La descripción no puede exceder los 500 caracteres"]
    },
    image: {
        type: String,
        validate: {
            validator: v => /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(v),
            message: "La URL de imagen debe ser válida"
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Categories", categoriesSchema, "Categories")