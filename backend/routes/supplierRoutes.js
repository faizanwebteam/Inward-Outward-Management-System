import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Supplier
 *   description: Supplier management
 */

/**
 * @swagger
 * /api/supplier:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all suppliers
 *   post:
 *     summary: Create a new supplier
 *     tags: [Supplier]
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
 *                 example: "ABC Supplies"
 *               companyName:
 *                 type: string
 *                 example: "ABC Industries"
 *               email:
 *                 type: string
 *                 example: "abc@supplies.com"
 *               contactNumber:
 *                 type: string
 *                 example: "+91-9876543210"
 *               address:
 *                 type: string
 *                 example: "456 Industrial Road, Pune"
 *     responses:
 *       201:
 *         description: Supplier created successfully
 */

/**
 * @swagger
 * /api/supplier/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1b234abcd56789ef12345
 *     responses:
 *       200:
 *         description: Supplier details
 *   put:
 *     summary: Update supplier by ID
 *     tags: [Supplier]
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
 *             properties:
 *               name:
 *                 type: string
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *   delete:
 *     summary: Delete supplier by ID
 *     tags: [Supplier]
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
 *         description: Supplier deleted successfully
 */

router.route("/").get(protect, getSuppliers).post(protect, authorizeRoles("company"), createSupplier);

router
  .route("/:id")
  .get(protect, getSupplierById)
  .put(protect, authorizeRoles("company"), updateSupplier)
  .delete(protect, authorizeRoles("company"), deleteSupplier);

export default router;
