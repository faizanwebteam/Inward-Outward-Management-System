import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    unit: { type: String, enum: ["kg", "unit"], default: "kg" },
    plasticRate: { type: Number, default: 0 },
    materialRate: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Material", materialSchema);
