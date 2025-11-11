import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Customer invoices and billing
 */

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invoices
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoiceNumber
 *               - customer
 *               - challan
 *               - items
 *               - totalAmount
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *               customer:
 *                 type: string
 *               challan:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     box:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     plasticQuantity:
 *                       type: number
 *                     materialRate:
 *                       type: number
 *                     plasticRate:
 *                       type: number
 *               totalAmount:
 *                 type: number
 *               status:
 *                 type: string
 *                 example: "pending"
 */

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 */

router.route("/").get(protect, getInvoices).post(protect, createInvoice);
router.route("/:id").get(protect, getInvoiceById).put(protect, updateInvoice).delete(protect, deleteInvoice);

export default router;
