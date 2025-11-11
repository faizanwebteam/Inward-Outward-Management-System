import asyncHandler from "express-async-handler";
import Box from "../models/boxModel.js";

// @desc Create new box
// @route POST /api/boxes
// @access Private
export const createBox = asyncHandler(async (req, res) => {
  const { boxNumber, lot, quantity, plasticQuantity } = req.body;

  if (!boxNumber || !lot || !quantity) {
    res.status(400);
    throw new Error("Box number, lot, and quantity are required");
  }

  const box = new Box({
    boxNumber,
    lot,
    quantity,
    plasticQuantity: plasticQuantity || 0,
    createdBy: req.user._id,
  });

  const createdBox = await box.save();
  res.status(201).json(createdBox);
});

// @desc Get all boxes
// @route GET /api/boxes
// @access Private
export const getBoxes = asyncHandler(async (req, res) => {
  const boxes = await Box.find().populate("lot", "lotNumber").populate("createdBy", "name email");
  res.json(boxes);
});

// @desc Get box by ID
// @route GET /api/boxes/:id
// @access Private
export const getBoxById = asyncHandler(async (req, res) => {
  const box = await Box.findById(req.params.id).populate("lot", "lotNumber");
  if (box) res.json(box);
  else {
    res.status(404);
    throw new Error("Box not found");
  }
});

// @desc Update box
// @route PUT /api/boxes/:id
// @access Private
export const updateBox = asyncHandler(async (req, res) => {
  const box = await Box.findById(req.params.id);
  if (!box) {
    res.status(404);
    throw new Error("Box not found");
  }

  const { boxNumber, lot, quantity, plasticQuantity } = req.body;
  box.boxNumber = boxNumber || box.boxNumber;
  box.lot = lot || box.lot;
  box.quantity = quantity ?? box.quantity;
  box.plasticQuantity = plasticQuantity ?? box.plasticQuantity;

  const updatedBox = await box.save();
  res.json(updatedBox);
});

// @desc Delete box
// @route DELETE /api/boxes/:id
// @access Private
export const deleteBox = asyncHandler(async (req, res) => {
  const box = await Box.findById(req.params.id);
  if (!box) {
    res.status(404);
    throw new Error("Box not found");
  }
  await box.remove();
  res.json({ message: "Box removed" });
});
