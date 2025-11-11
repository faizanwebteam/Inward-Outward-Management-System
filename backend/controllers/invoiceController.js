import asyncHandler from "express-async-handler";
import Invoice from "../models/invoiceModel.js";
import Challan from "../models/challanModel.js";
import Box from "../models/boxModel.js";

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Company
export const createInvoice = asyncHandler(async (req, res) => {
  const { invoiceNumber, customer, challan, items, status } = req.body;

  // Optionally, validate challan exists
  const challanExists = await Challan.findById(challan);
  if (!challanExists) {
    res.status(404);
    throw new Error("Challan not found");
  }

  // --- Server-side calculation ---
  let calculatedTotal = 0;
  for (const item of items) {
    // In a real app, you'd fetch rates from the Material model via the Box/Lot
    // For now, we assume rates are passed in the item, but we still calculate total here.
    const itemTotal =
      (item.quantity || 0) * (item.materialRate || 0) +
      (item.plasticQuantity || 0) * (item.plasticRate || 0);
    calculatedTotal += itemTotal;
  }
  // --- End calculation ---

  const invoice = await Invoice.create({
    invoiceNumber,
    customer,
    company: req.user._id,
    challan,
    items,
    totalAmount: calculatedTotal, // Use the server-calculated total
    status,
  });

  res.status(201).json(invoice);
});

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Company / Customer
export const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find().populate("customer company challan items.box");
  res.json(invoices);
});

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Company / Customer
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate("customer company challan items.box");
  if (invoice) res.json(invoice);
  else res.status(404).json({ message: "Invoice not found" });
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Company
export const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (invoice) {
    Object.assign(invoice, req.body);
    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } else {
    res.status(404).json({ message: "Invoice not found" });
  }
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Company
export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (invoice) {
    await invoice.remove();
    res.json({ message: "Invoice removed" });
  } else {
    res.status(404).json({ message: "Invoice not found" });
  }
});
