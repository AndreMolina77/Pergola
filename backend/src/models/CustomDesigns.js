// Importar modelo y schema de Mongoose
import { Schema, model } from 'mongoose'
// Definir el schema para customDesigns
const customDesignsSchema = new Schema({
    codeRequest: {
        type: String,
        required: [true, "El código de solicitud es obligatorio"],
        trim: true,
        unique: true,
        minlength: [5, "El código debe tener al menos 5 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El código de solicitud no puede estar vacío"
        }
    },
    piece: {
        type: String,
        required: [true, "La pieza es obligatoria"],
        enum: {
            values: ["Pulsera", "Cadena", "Tobillera"],
            message: "La pieza debe ser Pulsera, Cadena o Tobillera"
        },
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El nombre de pieza no puede estar vacío"
        }
    },
    base: {
        type: String,
        required: [true, "La base es obligatoria"],
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El nombre de base no puede estar vacía"
        }
    },
    baseLength: {
        type: String,
        required: [true, "La longitud de la base es obligatoria"],
        validate: {
            validator: function(v) {
                return /^\d{1,3}(cm|mm)?$/.test(v)
            },
            message: "La longitud debe ser un número seguido opcionalmente por 'cm' o 'mm' (ej: '18cm')"
        },
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "La longitud de base no puede estar vacía"
        }
    },
    decoration: [{
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: v => Array.isArray(v) && v.length > 0,  // Asegurarse de que no sea un array vacío
            message: "El array de decoración no puede estar vacío"
        }
    }],
    clasp: {
        type: String,
        required: [true, "El cierre es obligatorio"],
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El cierre no puede estar vacío"
        }
    },
    customerComments: {
        type: String,
        maxlength: [300, "El comentario no puede exceder los 300 caracteres"],
        default: "",
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "Los comentarios no pueden estar vacíos"
        }
    }
}, {
    timestamps: true,
    strict: false
})
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("CustomDesigns", customDesignsSchema, "CustomDesigns")