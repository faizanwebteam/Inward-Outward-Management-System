import mongoose from "mongoose";

const boxSchema = mongoose.Schema(
  {
    boxNumber: { type: String, required: true, unique: true },
    lot: { type: mongoose.Schema.Types.ObjectId, ref: "Lot", required: true },
    quantity: { type: Number, required: true },
    plasticQuantity: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Box = mongoose.model("Box", boxSchema);
export default Box;
