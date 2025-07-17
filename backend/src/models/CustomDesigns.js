// Importar modelo y schema de Mongoose
import { Schema, model } from 'mongoose'
// Definir el schema para customDesigns
const customDesignsSchema = new Schema({
    codeRequest: {
        type: String,
        required: [true, "El código de solicitud es obligatorio"],
        trim: true,
        unique: true,
        minlength: [5, "El código debe tener al menos 5 caracteres"]
    },
    piece: {
        type: String,
        required: [true, "La pieza es obligatoria"],
        enum: {
            values: ["Pulsera", "Cadena", "Tobillera"],
            message: "La pieza debe ser Pulsera, Cadena o Tobillera"
        }
    },
    base: {
        type: String,
        required: [true, "La base es obligatoria"],
        trim: true
    },
    baseLength: {
        type: String,
        required: [true, "La longitud de la base es obligatoria"],
        validate: {
            validator: function(v) {
                return /^\d{1,3}(cm|mm)?$/.test(v)
            },
            message: "La longitud debe ser un número seguido opcionalmente por 'cm' o 'mm' (ej: '18cm')"
        }
    },
    decoration: [{
        type: String,
        required: true,
        trim: true
    }],
    clasp: {
        type: String,
        required: [true, "El cierre es obligatorio"],
        trim: true
    },
    customerComments: {
        type: String,
        maxlength: [300, "El comentario no puede exceder los 300 caracteres"],
        default: "",
        trim: true
    }
}, {
    timestamps: true,
    strict: false
})
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("CustomDesigns", customDesignsSchema, "CustomDesigns")