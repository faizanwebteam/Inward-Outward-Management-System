import mongoose from "mongoose";

const challanSchema = mongoose.Schema(
  // No changes needed here, schema is correct.
  {
    challanNumber: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    boxes: [
      {
        box: { type: mongoose.Schema.Types.ObjectId, ref: "Box" },
        quantity: Number,
        plasticQuantity: Number,
      },
    ],
    totalCost: { type: Number, required: true },
    status: { type: String, enum: ["pending", "dispatched", "received"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Challan", challanSchema);
