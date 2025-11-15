import asyncHandler from "express-async-handler";
import Invoice from "../models/invoiceModel.js";
import Challan from "../models/challanModel.js";
import mongoose from "mongoose";

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Company
export const createInvoice = asyncHandler(async (req, res) => {
  const { invoiceNumber, customerId, challanId, items, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    res.status(400);
    throw new Error("Invalid customerId");
  }
  if (!mongoose.Types.ObjectId.isValid(challanId)) {
    res.status(400);
    throw new Error("Invalid challanId");
  }

  const challanExists = await Challan.findById(challanId);
  if (!challanExists) {
    res.status(404);
    throw new Error("Challan not found");
  }

  // Calculate total amount
  let totalAmount = 0;
  const processedItems = items.map((item) => {
    const itemTotal =
      (item.quantity || 0) * (item.materialRate || 0) +
      (item.plasticQuantity || 0) * (item.plasticRate || 0);
    totalAmount += itemTotal;

    return {
      box: item.boxId,
      quantity: item.quantity,
      plasticQuantity: item.plasticQuantity,
      materialRate: item.materialRate,
      plasticRate: item.plasticRate,
    };
  });

  const invoice = await Invoice.create({
    invoiceNumber,
    customer: customerId,
    challan: challanId,
    items: processedItems,
    totalAmount,
    status: status || "pending",
    company: req.user._id,
  });

  const populatedInvoice = await invoice.populate(
    "customer company challan items.box"
  );

  res.status(201).json(populatedInvoice);
});

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Company / Customer
export const getInvoices = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === "customer") {
    query.customer = req.user._id;
  }

  const invoices = await Invoice.find(query)
    .populate({
      path: "customer",
      select: "name email",
    })
    .populate({
      path: "challan",
      populate: [
        { path: "supplier", select: "name companyName" },
        { path: "company", select: "name email" },
        { path: "boxes.box", select: "boxNumber" },
      ],
    })
    .populate({ path: "company", select: "name email" })
    .populate({ path: "items.box", select: "boxNumber" })
    .sort({ createdAt: -1 });

  res.json(invoices);
});

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Company / Customer
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("customer", "name email")
    .populate({
      path: "challan",
      populate: { path: "supplier company boxes.box" },
    })
    .populate("company", "name email")
    .populate("items.box", "name type");

  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  if (req.user.role === "customer" && invoice.customer._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this invoice");
  }

  res.json(invoice);
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Company
export const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  Object.assign(invoice, req.body);
  const updatedInvoice = await invoice.save();
  const populatedInvoice = await updatedInvoice.populate(
    "customer company challan items.box"
  );

  res.json(populatedInvoice);
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Company
export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }
  await invoice.deleteOne();
  res.json({ message: "Invoice removed successfully" });
});
