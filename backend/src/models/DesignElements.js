/* Esta colección va a almacenar toda la información relacionada con los elementos que los clientes pueden escoger
en la parte pública del sistema. Relacionada con `CustomDesigns`.
"designElements": [
    {
        "type": "Cierre",
        "nombre": "Clasp",
        "imageUrl": "http://example.com/clasp.png"
    }
] */
// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose'
// Tipos de valores admitidos
const validTypes = ["base", "decoration", "clasp"]
// Definir el schema para los elementos del diseño
const designElementSchema = new Schema({
    type: {
        type: String,
        required: [true, "El tipo es obligatorio"],
        trim: true,
        enum: {
            values: validTypes,
            message: "El tipo debe ser 'base', 'decoration' o 'clasp'"
        }
    },
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"]
    },
    image: {
        type: String,
        required: [true, "La URL de la imagen es obligatoria"],
        validate: {
            validator: function(v) {
                // Solo valida si el campo tiene un valor y no está vacío
                if (!v || v.trim() === '') return true;
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(v);
            },
            message: "La URL de imagen debe ser válida"
        }
    }
}, {
    timestamps: true
})
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("DesignElements", designElementSchema, "DesignElements")