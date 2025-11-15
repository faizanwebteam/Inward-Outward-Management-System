import asyncHandler from "express-async-handler";
import Lot from "../models/lotModel.js";

// @desc Create new lot
// @route POST /api/lots
// @access Private
export const createLot = asyncHandler(async (req, res) => {
  const { lotNumber, material, quantity, plasticQuantity } = req.body;

  if (!lotNumber || !material || !quantity) {
    res.status(400);
    throw new Error("Lot number, material, and quantity are required");
  }

  const lot = new Lot({
    lotNumber,
    material,
    quantity,
    plasticQuantity: plasticQuantity || 0,
    createdBy: req.user._id,
  });

  const createdLot = await lot.save();
  res.status(201).json(createdLot);
});

// @desc Get all lots
// @route GET /api/lots
// @access Private
export const getLots = asyncHandler(async (req, res) => {
  const lots = await Lot.find().populate("material", "name unit").populate("createdBy", "name email");
  res.json(lots);
});

// @desc Get lot by ID
// @route GET /api/lots/:id
// @access Private
export const getLotById = asyncHandler(async (req, res) => {
  const lot = await Lot.findById(req.params.id).populate("material", "name unit");
  if (lot) res.json(lot);
  else {
    res.status(404);
    throw new Error("Lot not found");
  }
});

// @desc Update lot
// @route PUT /api/lots/:id
// @access Private
export const updateLot = asyncHandler(async (req, res) => {
  const lot = await Lot.findById(req.params.id);
  if (!lot) {
    res.status(404);
    throw new Error("Lot not found");
  }

  const { lotNumber, material, quantity, plasticQuantity } = req.body;
  lot.lotNumber = lotNumber || lot.lotNumber;
  lot.material = material || lot.material;
  lot.quantity = quantity ?? lot.quantity;
  lot.plasticQuantity = plasticQuantity ?? lot.plasticQuantity;

  const updatedLot = await lot.save();
  res.json(updatedLot);
});

// @desc Delete lot
// @route DELETE /api/lots/:id
// @access Private
export const deleteLot = asyncHandler(async (req, res) => {
  const lot = await Lot.findById(req.params.id);
  if (!lot) {
    res.status(404);
    throw new Error("Lot not found");
  }
  await lot.deleteOne();
  res.json({ message: "Lot removed successfully" });
});
