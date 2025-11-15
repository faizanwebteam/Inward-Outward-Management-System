import asyncHandler from "express-async-handler";
import Supplier from "../models/supplierModel.js";

// @desc Create new supplier
// @route POST /api/supplier
// @access Private
export const createSupplier = asyncHandler(async (req, res) => {
  const { name, companyName, email, contactNumber, address } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Supplier name is required");
  }

  const supplier = new Supplier({
    name,
    companyName,
    email,
    contactNumber,
    address,
    createdBy: req.user._id,
  });

  const createdSupplier = await supplier.save();
  res.status(201).json(createdSupplier);
});

// @desc Get all suppliers
// @route GET /api/supplier
// @access Private
export const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().populate("createdBy", "name email");
  res.json(suppliers);
});

// @desc Get supplier by ID
// @route GET /api/supplier/:id
// @access Private
export const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (supplier) res.json(supplier);
  else {
    res.status(404);
    throw new Error("Supplier not found");
  }
});

// @desc Update supplier
// @route PUT /api/supplier/:id
// @access Private
export const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  const { name, companyName, email, contactNumber, address } = req.body;

  supplier.name = name || supplier.name;
  supplier.companyName = companyName || supplier.companyName;
  supplier.email = email || supplier.email;
  supplier.contactNumber = contactNumber || supplier.contactNumber;
  supplier.address = address || supplier.address;

  const updatedSupplier = await supplier.save();
  res.json(updatedSupplier);
});

// @desc Delete supplier
// @route DELETE /api/supplier/:id
// @access Private
export const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }
  await supplier.deleteOne();
  res.json({ message: "Supplier removed successfully" });
});
