import asyncHandler from "express-async-handler";
import Challan from "../models/challanModel.js";
import MaterialRequest from "../models/materialRequestModel.js";
import mongoose from "mongoose";

// @desc    Create a new challan
// @route   POST /api/challans
// @access  Company
export const createChallan = asyncHandler(async (req, res) => {
  const { challanNumber, supplierId, boxes, status } = req.body;

  if (!supplierId || !mongoose.Types.ObjectId.isValid(supplierId)) {
    res.status(400);
    throw new Error("Valid supplierId is required");
  }

  if (!boxes || !Array.isArray(boxes) || boxes.length === 0) {
    res.status(400);
    throw new Error("Boxes are required");
  }

  const formattedBoxes = boxes.map(b => {
    if (!b.boxId || !mongoose.Types.ObjectId.isValid(b.boxId)) {
      throw new Error("Valid boxId is required for each box");
    }
    return {
      box: b.boxId,
      quantity: b.quantity || 0,
      plasticQuantity: b.plasticQuantity || 0,
    };
  });

  // Example: simple total cost calculation
  const totalCost = formattedBoxes.reduce((acc, item) => acc + (item.quantity * 10), 0);

  const challan = await Challan.create({
    challanNumber,
    supplier: supplierId,
    company: req.user._id,
    boxes: formattedBoxes,
    totalCost,
    status: status || "pending",
  });

  res.status(201).json({ message: "Challan created successfully", data: challan });
});

// @desc    Get all challans
// @route   GET /api/challans
// @access  Company/Supplier
export const getChallans = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === "supplier") query.supplier = req.user._id;

  const challans = await Challan.find(query).populate("supplier company boxes.box");
  res.json({ count: challans.length, data: challans });
});

// @desc    Get challan by ID
// @route   GET /api/challans/:id
// @access  Company/Supplier
export const getChallanById = asyncHandler(async (req, res) => {
  const challan = await Challan.findById(req.params.id).populate("supplier company boxes.box");
  if (!challan) {
    res.status(404);
    throw new Error("Challan not found");
  }

  if (req.user.role === "supplier" && challan.supplier.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this challan");
  }

  res.json(challan);
});

// @desc    Update challan
// @route   PUT /api/challans/:id
// @access  Company
export const updateChallan = asyncHandler(async (req, res) => {
  const challan = await Challan.findById(req.params.id);
  if (!challan) {
    res.status(404);
    throw new Error("Challan not found");
  }

  // Only allow updating safe fields
  const { challanNumber, boxes, status } = req.body;
  if (challanNumber) challan.challanNumber = challanNumber;
  if (boxes && Array.isArray(boxes)) {
    challan.boxes = boxes.map(b => ({
      box: b.boxId,
      quantity: b.quantity || 0,
      plasticQuantity: b.plasticQuantity || 0,
    }));
  }
  if (status) challan.status = status;

  const updatedChallan = await challan.save();
  res.json({ message: "Challan updated successfully", data: updatedChallan });
});

// @desc    Delete challan
// @route   DELETE /api/challans/:id
// @access  Company
export const deleteChallan = asyncHandler(async (req, res) => {
  const challan = await Challan.findById(req.params.id);
  if (!challan) {
    res.status(404);
    throw new Error("Challan not found");
  }

  // Use deleteOne() instead of deprecated remove()
  await challan.deleteOne();
  res.json({ message: "Challan removed successfully" });
});

// @desc    Generate a challan from a confirmed material request
// @route   POST /api/challans/generate-from-request
// @access  Company
export const generateChallanFromRequest = asyncHandler(async (req, res) => {
  const { materialRequestId } = req.body;

  if (!materialRequestId || !mongoose.Types.ObjectId.isValid(materialRequestId)) {
    res.status(400);
    throw new Error("Valid materialRequestId is required");
  }

  const request = await MaterialRequest.findById(materialRequestId);
  if (!request) {
    res.status(404);
    throw new Error("Material Request not found");
  }

  if (!["acknowledged", "dispatched"].includes(request.status)) {
    res.status(400);
    throw new Error(`Cannot create challan from a request with status '${request.status}'`);
  }

  // Example: Transform request items to challan boxes (needs real mapping)
  const boxes = request.items.map(item => ({
    quantity: item.requestedQuantity || 0,
    plasticQuantity: 0, // placeholder
  }));

  res.status(201).json({
    message: "Challan generation from request not fully implemented",
    request,
    boxes,
  });
});
