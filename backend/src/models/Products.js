import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  codeProduct: { type: String, unique: true, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
  productionCost: { type: Number },
  discount: { type: Number, default: 0 },
  images: [{ type: String }],
  collection: { type: Schema.Types.ObjectId, ref: "Collections" },
  category: { type: Schema.Types.ObjectId, ref: "Categories" },
  subcategory: { type: Schema.Types.ObjectId, ref: "Subcategories" },
  rawMaterialsUsed: { type: Schema.Types.ObjectId, ref: "RawMaterials" },
  highlighted: { type: Boolean, default: false },
  correlative: { type: String },
  movementType: { type: String },
  status: { type: String, enum: ["disponible", "agotado"], default: "disponible" },
  applicableCosts: { type: String },
  hasDiscount: { type: Boolean, default: false },
}, { timestamps: true });

export default model("Product", productSchema);