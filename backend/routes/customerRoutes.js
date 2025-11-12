import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer management
 */

/**
 * @swagger
 * /api/customer:
 *   get:
 *     summary: Get all customers
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *   post:
 *     summary: Create a new customer
 *     tags: [Customer]
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
 *                 example: John Doe
 *               companyName:
 *                 type: string
 *                 example: Acme Corp
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               contactNumber:
 *                 type: string
 *                 example: "+91-9876543210"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Mumbai"
 *     responses:
 *       201:
 *         description: Customer created successfully
 */

/**
 * @swagger
 * /api/customer/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f1a1234abcd56789ef0123
 *     responses:
 *       200:
 *         description: Customer details
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customer]
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
 *         description: Customer updated successfully
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customer]
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
 *         description: Customer deleted successfully
 */

router.route("/").get(protect, getCustomers).post(protect, authorizeRoles("company"), createCustomer);

router
  .route("/:id")
  .get(protect, getCustomerById)
  .put(protect, authorizeRoles("company"), updateCustomer)
  .delete(protect, authorizeRoles("company"), deleteCustomer);

export default router;
