import mongoose from "mongoose";

const materialRequestSchema = mongoose.Schema(
  {
    requestNumber: { type: String, required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, enum: ["kg", "unit"] },
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