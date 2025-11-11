import asyncHandler from "express-async-handler";
import Customer from "../models/customerModel.js";

// @desc Create new customer
// @route POST /api/customer
// @access Private
export const createCustomer = asyncHandler(async (req, res) => {
  const { name, companyName, email, contactNumber, address } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Customer name is required");
  }

  const customer = new Customer({
    name,
    companyName,
    email,
    contactNumber,
    address,
    createdBy: req.user._id,
  });

  const createdCustomer = await customer.save();
  res.status(201).json(createdCustomer);
});

// @desc Get all customers
// @route GET /api/customer
// @access Private
export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().populate("createdBy", "name email");
  res.json(customers);
});

// @desc Get customer by ID
// @route GET /api/customer/:id
// @access Private
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (customer) res.json(customer);
  else {
    res.status(404);
    throw new Error("Customer not found");
  }
});

// @desc Update customer
// @route PUT /api/customer/:id
// @access Private
export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const { name, companyName, email, contactNumber, address } = req.body;

  customer.name = name || customer.name;
  customer.companyName = companyName || customer.companyName;
  customer.email = email || customer.email;
  customer.contactNumber = contactNumber || customer.contactNumber;
  customer.address = address || customer.address;

  const updatedCustomer = await customer.save();
  res.json(updatedCustomer);
});

// @desc Delete customer
// @route DELETE /api/customer/:id
// @access Private
export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  await customer.remove();
  res.json({ message: "Customer removed" });
});
