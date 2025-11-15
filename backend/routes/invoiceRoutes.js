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
 *         content:
 *           application/json:
 *             example:
 *               count: 1
 *               data:
 *                 - _id: "67123abc89de90123456"
 *                   invoiceNumber: "1"
 *                   customerId: "6912d99fa9ded05bc9adfac7"
 *                   challanId: "6915d34fe5bacb09abbc262c"
 *                   totalAmount: 2000
 *                   status: "pending"
 *
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
 *               - customerId
 *               - challanId
 *               - items
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *               customerId:
 *                 type: string
 *               challanId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     boxId:
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
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Invoice created successfully"
 *               data:
 *                 _id: "67123abc89de90123456"
 *                 invoiceNumber: "1"
 *                 customerId: "6912d99fa9ded05bc9adfac7"
 *                 challanId: "6915d34fe5bacb09abbc262c"
 *                 totalAmount: 2000
 *                 status: "pending"
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
 *         description: Invoice ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice details
 *         content:
 *           application/json:
 *             example:
 *               _id: "67123abc89de90123456"
 *               invoiceNumber: "1"
 *               customerId: "6912d99fa9ded05bc9adfac7"
 *               challanId: "6915d34fe5bacb09abbc262c"
 *               totalAmount: 2000
 *               status: "pending"
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Invoice not found"
 *
 *   put:
 *     summary: Update invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Invoice ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "paid"
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Invoice updated successfully"
 *               data:
 *                 _id: "67123abc89de90123456"
 *                 status: "paid"
 *
 *   delete:
 *     summary: Delete invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Invoice ID to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice removed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Invoice removed"
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Invoice not found"
 */

router
  .route("/")
  .get(protect, getInvoices)
  .post(protect, createInvoice);

router
  .route("/:id")
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

export default router;
