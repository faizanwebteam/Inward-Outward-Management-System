// billController.js
import asyncHandler from "express-async-handler";
import Bill from "../models/billModel.js";
import Challan from "../models/challanModel.js";
import Supplier from "../models/supplierModel.js";

// @desc    Create a new bill for supplier
// @route   POST /api/bills
// @access  Company
export const createBill = asyncHandler(async (req, res) => {
  const { billNumber, supplierId, challanId, items, status } = req.body;

  // Validate challan exists
  const challanExists = await Challan.findById(challanId);
  if (!challanExists) {
    res.status(404);
    throw new Error("Challan not found");
  }

  // Validate supplier exists
  const supplierExists = await Supplier.findById(supplierId);
  if (!supplierExists) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  // Server-side total calculation
  let calculatedTotal = 0;
  const processedItems = items.map((item) => {
    const itemTotal =
      (item.quantity || 0) * (item.materialRate || 0) +
      (item.plasticQuantity || 0) * (item.plasticRate || 0);
    calculatedTotal += itemTotal;
    return {
      box: item.boxId,
      quantity: item.quantity,
      plasticQuantity: item.plasticQuantity,
      materialRate: item.materialRate,
      plasticRate: item.plasticRate,
    };
  });

  const bill = await Bill.create({
    billNumber,
    supplier: supplierId,
    company: req.user._id,
    challan: challanId,
    items: processedItems,
    totalAmount: calculatedTotal,
    status: status || "pending",
  });

  // Populate the supplier, company, challan, and items.box for response
  const populatedBill = await bill.populate([
    { path: "supplier", select: "name companyName email" },
    { path: "company", select: "name email role" },
    { path: "challan", populate: [{ path: "supplier company", select: "name email" }] },
    { path: "items.box", select: "boxNumber" },
  ]);

  res.status(201).json(populatedBill);
});

// @desc    Get all bills
// @route   GET /api/bills
// @access  Company / Supplier
export const getBills = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === "supplier") {
    query.supplier = req.user._id;
  }

  const bills = await Bill.find(query).populate([
    { path: "supplier", select: "name companyName email" },
    { path: "company", select: "name email role" },
    { path: "challan", populate: [{ path: "supplier company", select: "name email" }] },
    { path: "items.box", select: "boxNumber" },
  ]);

  res.json(bills);
});

// @desc    Get bill by ID
// @route   GET /api/bills/:id
// @access  Company / Supplier
export const getBillById = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id).populate([
    { path: "supplier", select: "name companyName email" },
    { path: "company", select: "name email role" },
    { path: "challan", populate: [{ path: "supplier company", select: "name email" }] },
    { path: "items.box", select: "boxNumber" },
  ]);

  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  // Supplier can only see their own bill
  if (req.user.role === "supplier" && bill.supplier._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this bill");
  }

  res.json(bill);
});

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Company
export const updateBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  Object.assign(bill, req.body);
  const updatedBill = await bill.save();
  const populatedBill = await updatedBill.populate([
    { path: "supplier", select: "name companyName email" },
    { path: "company", select: "name email role" },
    { path: "challan", populate: [{ path: "supplier company", select: "name email" }] },
    { path: "items.box", select: "boxNumber" },
  ]);

  res.json(populatedBill);
});

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Company
export const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }
  await bill.deleteOne();
  res.json({ message: "Bill removed successfully" });
});
