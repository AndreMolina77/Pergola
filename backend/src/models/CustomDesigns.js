import mongoose from "mongoose";
const { Schema, model } = mongoose;

const customDesignSchema = new Schema({
  codeRequest: { type: String, required: true },
  piece: { type: String },
  base: { type: String },
  baseLength: { type: String },
  decoration: { type: String },
  clasp: { type: String },
  customerComments: { type: String }
}, { timestamps: true });

export default model("CustomDesign", customDesignSchema);
