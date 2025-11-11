import Material from "../models/materialModel.js";

// @desc    Create new material
// @route   POST /api/materials
export const createMaterial = async (req, res) => {
  try {
    const { name, description, unit, plasticRate, materialRate } = req.body;

    const materialExists = await Material.findOne({ name });
    if (materialExists)
      return res.status(400).json({ message: "Material already exists" });

    const material = await Material.create({
      name,
      description,
      unit,
      plasticRate,
      materialRate,
      createdBy: req.user?._id,
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all materials
// @route   GET /api/materials
export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single material
// @route   GET /api/materials/:id
export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
