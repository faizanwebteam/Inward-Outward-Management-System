import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} from "../controllers/billController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bills
 *   description: Supplier billing management
 */

/**
 * @swagger
 * /api/bills:
 *   get:
 *     summary: Get all bills
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bills
 *   post:
 *     summary: Create a new bill
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billNumber
 *               - supplier
 *               - challan
 *               - items
 *               - totalAmount
 *             properties:
 *               billNumber:
 *                 type: string
 *               supplier:
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
 * /api/bills/{id}:
 *   get:
 *     summary: Get bill by ID
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update bill by ID
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete bill by ID
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 */

router.route("/").get(protect, getBills).post(protect, createBill);
router.route("/:id").get(protect, getBillById).put(protect, updateBill).delete(protect, deleteBill);

export default router;
