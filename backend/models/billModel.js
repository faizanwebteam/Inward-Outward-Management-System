import mongoose from "mongoose";

const billSchema = mongoose.Schema(
  {
    billNumber: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challan: { type: mongoose.Schema.Types.ObjectId, ref: "Challan", required: true },
    items: [
      {
        box: { type: mongoose.Schema.Types.ObjectId, ref: "Box" },
        quantity: Number,
        plasticQuantity: Number,
        materialRate: Number,
        plasticRate: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);
