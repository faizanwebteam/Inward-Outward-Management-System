import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createChallan,
  getChallans,
  getChallanById,
  updateChallan,
  deleteChallan,
} from "../controllers/challanController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Challans
 *   description: Manage supplier dispatch challans
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
 *               - supplier
 *               - boxes
 *               - totalCost
 *             properties:
 *               challanNumber:
 *                 type: string
 *               supplier:
 *                 type: string
 *               boxes:
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
 *               totalCost:
 *                 type: number
 *               status:
 *                 type: string
 *                 example: "pending"
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
 *     responses:
 *       200:
 *         description: Challan details
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
 *             type: object
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

router.route("/").get(protect, getChallans).post(protect, createChallan);
router.route("/:id").get(protect, getChallanById).put(protect, updateChallan).delete(protect, deleteChallan);

export default router;
