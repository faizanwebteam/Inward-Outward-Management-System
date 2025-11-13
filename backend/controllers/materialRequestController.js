import asyncHandler from "express-async-handler";
import MaterialRequest from "../models/materialRequestModel.js";

/**
 * @desc    Create a new material request
 * @route   POST /api/material-requests
 * @access  Company
 */
export const createMaterialRequest = asyncHandler(async (req, res) => {
  const { supplierId, materials } = req.body;
  
  if (!supplierId) {
    res.status(400);
    throw new Error("Supplier is required");
  }

  if (!materials || materials.length === 0) {
    res.status(400);
    throw new Error("Request items cannot be empty");
  }

  // Map incoming materials to schema format
  const items = materials.map(m => {
    if (!m.materialId) throw new Error("materialId is required for each item");
    if (m.quantity === undefined || m.quantity === null) throw new Error("quantity is required for each item");
  
    return {
      materialId: m.materialId,
      quantity: m.quantity,
      unit: m.unit
    }
  });

  const materialRequest = await MaterialRequest.create({
    requestNumber: `REQ-${Date.now()}`,
    supplier: supplierId,
    items,
    company: req.user._id,
    status: "pending",
  });

  res.status(201).json(materialRequest);
});


/**
 * @desc    Get all material requests (for company or supplier)
 * @route   GET /api/material-requests
 * @access  Company, Supplier
 */
export const getMaterialRequests = asyncHandler(async (req, res) => {
  const query = {};

  if (req.user.role === "supplier") {
    query.supplier = req.user._id;
  }

  const requests = await MaterialRequest.find(query)
    .populate("supplier", "name email")
    .populate("company", "name email")
    .populate("items.materialId", "name unit")
    .sort({ createdAt: -1 });

  res.status(200).json(requests);
});

/**
 * @desc    Get a single material request by ID
 * @route   GET /api/material-requests/:id
 * @access  Company, Supplier
 */
export const getMaterialRequestById = asyncHandler(async (req, res) => {
  const request = await MaterialRequest.findById(req.params.id)
    .populate("supplier", "name email")
    .populate("company", "name email")
    .populate("items.materialId", "name unit");

  if (!request) {
    res.status(404);
    throw new Error("Material request not found");
  }

  // Security check
  if (
    req.user.role === "supplier" &&
    request.supplier._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this request");
  }

  res.status(200).json(request);
});

/**
 * @desc    Supplier responds to a material request
 * @route   PUT /api/material-requests/:id/respond
 * @access  Supplier
 */
export const respondToMaterialRequest = asyncHandler(async (req, res) => {
  const { status, supplierNotes, dispatchDate, items: updatedItems } = req.body;

  const request = await MaterialRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Material request not found");
  }

  // Only assigned supplier can respond
  if (request.supplier.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to respond to this request");
  }

  // Only allow valid status updates
  if (status && !["acknowledged", "rejected", "dispatched"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  request.status = status || request.status;
  request.supplierNotes = supplierNotes || request.supplierNotes;
  request.dispatchDate = dispatchDate || request.dispatchDate;

  // If supplier provides updated item quantities, update them in the request
  if (updatedItems && Array.isArray(updatedItems)) {
    updatedItems.forEach(updatedItem => {
      const itemToUpdate = request.items.find(
        i => i.materialId.toString() === updatedItem.materialId
      );
      if (itemToUpdate) {
        // Update the quantity that the supplier has confirmed
        itemToUpdate.quantity = updatedItem.quantity ?? itemToUpdate.quantity;
        // You could add more fields here like 'dispatchedQuantity' if needed
      }
    });
  }


  const updatedRequest = await request.save();

  res.status(200).json(updatedRequest);
});
