import asyncHandler from "express-async-handler";
import Challan from "../models/challanModel.js";

// @desc    Create a new challan
// @route   POST /api/challans
// @access  Company
export const createChallan = asyncHandler(async (req, res) => {
  const { challanNumber, supplier, boxes, totalCost, status } = req.body;

  const challan = await Challan.create({
    challanNumber,
    supplier,
    company: req.user._id,
    boxes,
    totalCost,
    status,
  });

  res.status(201).json(challan);
});

// @desc    Get all challans
// @route   GET /api/challans
// @access  Company/Supplier
export const getChallans = asyncHandler(async (req, res) => {
  const query = {};
  // If the user is a supplier, only show challans related to them.
  if (req.user.role === "supplier") {
    query.supplier = req.user._id;
  }
  // If the user is a company, they can see all challans.
  // Add other roles like 'customer' if they need access.

  const challans = await Challan.find(query).populate("supplier company boxes.box");
  res.json(challans);
});

// @desc    Get challan by ID
// @route   GET /api/challans/:id
// @access  Company/Supplier
export const getChallanById = asyncHandler(async (req, res) => {
  const challan = await Challan.findById(req.params.id).populate("supplier company boxes.box");
  if (challan) {
    // Security check: Ensure supplier can only access their own challan
    if (req.user.role === "supplier" && challan.supplier.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to view this challan");
    }
    res.json(challan);
  } else res.status(404).json({ message: "Challan not found" });
});

// @desc    Update challan
// @route   PUT /api/challans/:id
// @access  Company
export const updateChallan = asyncHandler(async (req, res) => {
  const challan = await Challan.findById(req.params.id);
  if (challan) {
    Object.assign(challan, req.body);
    const updatedChallan = await challan.save();
    res.json(updatedChallan);
  } else {
    res.status(404).json({ message: "Challan not found" });
  }
});

// @desc    Delete challan
// @route   DELETE /api/challans/:id
// @access  Company
export const deleteChallan = asyncHandler(async (req, res) => {
  const challan = await Challan.findById(req.params.id);
  if (challan) {
    await challan.remove();
    res.json({ message: "Challan removed" });
  } else {
    res.status(404).json({ message: "Challan not found" });
  }
});
