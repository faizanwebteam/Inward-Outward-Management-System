import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createChallan,
  getChallans,
  getChallanById,
  updateChallan,
  generateChallanFromRequest, // Import the new controller function
  deleteChallan,
} from "../controllers/challanController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Challans
 *   description: Manage supplier dispatch challans.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Challan:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the challan.
 *         challanNumber:
 *           type: string
 *           description: The unique number for the challan.
 *         supplier:
 *           type: string
 *           description: The ID of the supplier user.
 *         company:
 *           type: string
 *           description: The ID of the company user who created the challan.
 *         boxes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               box:
 *                 type: string
 *                 description: The ID of the box.
 *               quantity:
 *                 type: number
 *               plasticQuantity:
 *                 type: number
 *         totalCost:
 *           type: number
 *           description: The server-calculated total cost of the challan.
 *         status:
 *           type: string
 *           enum: [pending, dispatched, received]
 *           default: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/challans:
 *   get:
 *     summary: Get all challans
 *     tags: [Challans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all challans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challan'
 *   post:
 *     summary: Create a new challan
 *     tags: [Challans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challanNumber
 *               - supplierId
 *               - boxes
 *             properties:
 *               challanNumber:
 *                 type: string
 *                 example: "CH-2025-001"
 *               supplierId:
 *                 type: string
 *                 example: "6732d98ea9ded05bc9adfac1"
 *               boxes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     boxId:
 *                       type: string
 *                       example: "6732df0218b2d37546092e13"
 *                     quantity:
 *                       type: number
 *                       example: 10
 *                     plasticQuantity:
 *                       type: number
 *                       example: 2
 *               status:
 *                 type: string
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Challan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Challan created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Challan'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/challans/{id}:
 *   get:
 *     summary: Get challan by ID
 *     tags: [Challans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Challan ID
 *     responses:
 *       200:
 *         description: Challan details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challan'
 *   put:
 *     summary: Update challan by ID
 *     tags: [Challans]
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
 *             $ref: '#/components/schemas/Challan'
 *     responses:
 *       200:
 *         description: Challan updated successfully
 *   delete:
 *     summary: Delete challan by ID
 *     tags: [Challans]
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
 *         description: Challan removed
 */

router
  .route("/")
  .get(protect, getChallans)
  .post(protect, createChallan);

router
  .route("/:id")
  .get(protect, getChallanById)
  .put(protect, updateChallan)
  .delete(protect, deleteChallan);

export default router;
