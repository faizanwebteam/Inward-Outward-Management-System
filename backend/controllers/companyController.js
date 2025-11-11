import asyncHandler from "express-async-handler";
import Company from "../models/companyModel.js";

// @desc    Create a new company
// @route   POST /api/company
// @access  Private (Company user)
export const createCompany = asyncHandler(async (req, res) => {
  const { name, address, contactNumber, email, gstNumber } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Company name is required");
  }

  const company = new Company({
    name,
    address,
    contactNumber,
    email,
    gstNumber,
    createdBy: req.user._id,
  });

  const createdCompany = await company.save();
  res.status(201).json(createdCompany);
});

// @desc    Get all companies
// @route   GET /api/company
// @access  Private
export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().populate("createdBy", "name email");
  res.json(companies);
});

// @desc    Get company by ID
// @route   GET /api/company/:id
// @access  Private
export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );
  if (company) {
    res.json(company);
  } else {
    res.status(404);
    throw new Error("Company not found");
  }
});

// @desc    Update company
// @route   PUT /api/company/:id
// @access  Private
export const updateCompany = asyncHandler(async (req, res) => {
  const { name, address, contactNumber, email, gstNumber } = req.body;

  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  company.name = name || company.name;
  company.address = address || company.address;
  company.contactNumber = contactNumber || company.contactNumber;
  company.email = email || company.email;
  company.gstNumber = gstNumber || company.gstNumber;

  const updatedCompany = await company.save();
  res.json(updatedCompany);
});

// @desc    Delete company
// @route   DELETE /api/company/:id
// @access  Private
export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  await company.remove();
  res.json({ message: "Company removed" });
});
