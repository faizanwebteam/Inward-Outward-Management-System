import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBox, getBoxes, getBoxById, updateBox, deleteBox } from "../controllers/boxController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Boxes
 *   description: Master data management for boxes
 */

/**
 * @swagger
 * /api/boxes:
 *   get:
 *     summary: Get all boxes
 *     tags: [Boxes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all boxes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   boxNumber:
 *                     type: string
 *                   lot:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   plasticQuantity:
 *                     type: number
 *                   createdBy:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *   post:
 *     summary: Create a new box
 *     tags: [Boxes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boxNumber
 *               - lot
 *               - quantity
 *             properties:
 *               boxNumber:
 *                 type: string
 *                 example: "BOX-001"
 *               lot:
 *                 type: string
 *                 example: "64f1c2abcd12345678901234"
 *               quantity:
 *                 type: number
 *                 example: 50
 *               plasticQuantity:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Box created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 boxNumber:
 *                   type: string
 *                 lot:
 *                   type: string
 *                 quantity:
 *                   type: number
 *                 plasticQuantity:
 *                   type: number
 *                 createdBy:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */

/**
 * @swagger
 * /api/boxes/{id}:
 *   get:
 *     summary: Get a box by ID
 *     tags: [Boxes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Box ID
 *     responses:
 *       200:
 *         description: Box details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 boxNumber:
 *                   type: string
 *                 lot:
 *                   type: string
 *                 quantity:
 *                   type: number
 *                 plasticQuantity:
 *                   type: number
 *                 createdBy:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *   put:
 *     summary: Update a box by ID
 *     tags: [Boxes]
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
 *             type: object
 *             properties:
 *               boxNumber:
 *                 type: string
 *               lot:
 *                 type: string
 *               quantity:
 *                 type: number
 *               plasticQuantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Box updated successfully
 *   delete:
 *     summary: Delete a box by ID
 *     tags: [Boxes]
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
 *         description: Box deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Box removed
 */

router.route("/").get(protect, getBoxes).post(protect, authorizeRoles("company"), createBox);
router
  .route("/:id")
  .get(protect, getBoxById)
  .put(protect, authorizeRoles("company"), updateBox)
  .delete(protect, authorizeRoles("company"), deleteBox);

export default router;
