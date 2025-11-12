import express from "express";
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company management
 */

/**
 * @swagger
 * /api/company:
 *   get:
 *     summary: Get all companies
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company created
 */
router.route("/").get(protect, getCompanies).post(protect, authorizeRoles("company"), createCompany);

/**
 * @swagger
 * /api/company/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company details
 *   put:
 *     summary: Update company by ID
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Company updated
 *   delete:
 *     summary: Delete company by ID
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted
 */
router
  .route("/:id")
  .get(protect, getCompanyById)
  .put(protect, authorizeRoles("company"), updateCompany)
  .delete(protect, authorizeRoles("company"), deleteCompany);

export default router;
