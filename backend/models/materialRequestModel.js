import mongoose from "mongoose";

const materialRequestSchema = mongoose.Schema(
  {
    requestNumber: { type: String, required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        material: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
        requestedQuantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "acknowledged", "rejected", "fulfilled"],
      default: "pending",
    },
    supplierNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

const MaterialRequest = mongoose.model("MaterialRequest", materialRequestSchema);

export default MaterialRequest;