import asyncHandler from "express-async-handler";
import Bill from "../models/billModel.js";
import Challan from "../models/challanModel.js";

// @desc    Create a new bill for supplier
// @route   POST /api/bills
// @access  Company
export const createBill = asyncHandler(async (req, res) => {
  const { billNumber, supplier, challan, items, status } = req.body;

  // Validate challan exists
  const challanExists = await Challan.findById(challan);
  if (!challanExists) {
    res.status(404);
    throw new Error("Challan not found");
  }

  // --- Server-side calculation ---
  let calculatedTotal = 0;
  for (const item of items) {
    const itemTotal =
      (item.quantity || 0) * (item.materialRate || 0) +
      (item.plasticQuantity || 0) * (item.plasticRate || 0);
    calculatedTotal += itemTotal;
  }
  // --- End calculation ---

  const bill = await Bill.create({
    billNumber,
    supplier,
    company: req.user._id,
    challan,
    items,
    totalAmount: calculatedTotal, // Use the server-calculated total
    status,
  });

  res.status(201).json(bill);
});

// @desc    Get all bills
// @route   GET /api/bills
// @access  Company / Supplier
export const getBills = asyncHandler(async (req, res) => {
  const query = {};
  // If the user is a supplier, only show bills related to them.
  if (req.user.role === "supplier") {
    query.supplier = req.user._id;
  }
  // If the user is a company, they can see all bills.

  const bills = await Bill.find(query).populate(
    "supplier company challan items.box"
  );
  res.json(bills);
});

// @desc    Get bill by ID
// @route   GET /api/bills/:id
// @access  Company / Supplier
export const getBillById = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id).populate("supplier company challan items.box");
  if (bill) {
    // Security check: Ensure supplier can only access their own bill
    if (req.user.role === "supplier" && bill.supplier.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to view this bill");
    }
    res.json(bill);
  } else {
    res.status(404).json({ message: "Bill not found" });
  }
});

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Company
export const updateBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (bill) {
    Object.assign(bill, req.body);
    const updatedBill = await bill.save();
    res.json(updatedBill);
  } else {
    res.status(404).json({ message: "Bill not found" });
  }
});

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Company
export const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (bill) {
    await bill.remove();
    res.json({ message: "Bill removed" });
  } else {
    res.status(404).json({ message: "Bill not found" });
  }
});
