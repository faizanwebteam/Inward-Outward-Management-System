import asyncHandler from "express-async-handler";
import Material from "../models/materialModel.js";

// @desc    Create new material
// @route   POST /api/materials
export const createMaterial = asyncHandler(async (req, res) => {
  const { name, description, unit, plasticRate, materialRate } = req.body;

  const materialExists = await Material.findOne({ name });
  if (materialExists) {
    res.status(400);
    throw new Error("Material already exists");
  }

  const material = await Material.create({
    name,
    description,
    unit,
    plasticRate,
    materialRate,
    createdBy: req.user?._id,
  });

  res.status(201).json(material);
});

// @desc    Get all materials
// @route   GET /api/materials
export const getMaterials = asyncHandler(async (req, res) => {
  const materials = await Material.find().sort({ createdAt: -1 });
  res.json(materials);
});

// @desc    Get single material
// @route   GET /api/materials/:id
export const getMaterialById = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (material) {
    res.json(material);
  } else {
    res.status(404);
    throw new Error("Material not found");
  }
});

// @desc    Update material
// @route   PUT /api/materials/:id
export const updateMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!material) {
    res.status(404);
    throw new Error("Material not found");
  }
  res.json(material);
});

// @desc    Delete material
// @route   DELETE /api/materials/:id
export const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findByIdAndDelete(req.params.id);
  if (!material) {
    res.status(404);
    throw new Error("Material not found");
  }
  res.json({ message: "Material deleted successfully" });
});
