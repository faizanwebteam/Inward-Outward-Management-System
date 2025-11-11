import mongoose from "mongoose";

const lotSchema = mongoose.Schema(
  {
    lotNumber: { type: String, required: true, unique: true },
    material: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
    quantity: { type: Number, required: true },
    plasticQuantity: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Lot = mongoose.model("Lot", lotSchema);
export default Lot;
