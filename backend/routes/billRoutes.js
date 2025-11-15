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
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *
 *     Box:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         boxNumber:
 *           type: string
 *
 *     Challan:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         challanNumber:
 *           type: string
 *         supplier:
 *           $ref: '#/components/schemas/User'
 *         company:
 *           $ref: '#/components/schemas/User'
 *         boxes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Box'
 *         totalCost:
 *           type: number
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *
 *     BillItem:
 *       type: object
 *       properties:
 *         box:
 *           $ref: '#/components/schemas/Box'
 *         quantity:
 *           type: number
 *         plasticQuantity:
 *           type: number
 *         materialRate:
 *           type: number
 *         plasticRate:
 *           type: number
 *
 *     Bill:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         billNumber:
 *           type: string
 *         supplier:
 *           $ref: '#/components/schemas/User'
 *         company:
 *           $ref: '#/components/schemas/User'
 *         challan:
 *           $ref: '#/components/schemas/Challan'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BillItem'
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *
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
 *               - supplierId
 *               - challanId
 *               - items
 *             properties:
 *               billNumber:
 *                 type: string
 *               supplierId:
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
 *               status:
 *                 type: string
 *                 example: pending
 *     responses:
 *       201:
 *         description: Bill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *
 * /api/bills/{id}:
 *   get:
 *     summary: Get bill by ID
 *     tags: [Bills]
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
 *         description: Bill details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *
 *   put:
 *     summary: Update bill by ID
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bill'
 *     responses:
 *       200:
 *         description: Bill updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *
 *   delete:
 *     summary: Delete bill by ID
 *     tags: [Bills]
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
 *         description: Bill deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.route("/").get(protect, getBills).post(protect, createBill);
router.route("/:id").get(protect, getBillById).put(protect, updateBill).delete(protect, deleteBill);

export default router;
