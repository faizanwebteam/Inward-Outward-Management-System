import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createLot, getLots, getLotById, updateLot, deleteLot } from "../controllers/lotController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lots
 *   description: Master data management for lots
 */

/**
 * @swagger
 * /api/lots:
 *   get:
 *     summary: Get all lots
 *     tags: [Lots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all lots
 *   post:
 *     summary: Create a new lot
 *     tags: [Lots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lotNumber
 *               - material
 *               - quantity
 *             properties:
 *               lotNumber:
 *                 type: string
 *                 example: "LOT-001"
 *               material:
 *                 type: string
 *                 example: "64f1c1b2abcd123456789012"
 *               quantity:
 *                 type: number
 *                 example: 500
 *               plasticQuantity:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Lot created successfully
 */

/**
 * @swagger
 * /api/lots/{id}:
 *   get:
 *     summary: Get a lot by ID
 *     tags: [Lots]
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
 *         description: Lot details
 *   put:
 *     summary: Update a lot by ID
 *     tags: [Lots]
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
 *         description: Lot updated successfully
 *   delete:
 *     summary: Delete a lot by ID
 *     tags: [Lots]
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
 *         description: Lot deleted successfully
 */

router.route("/").get(protect, getLots).post(protect, authorizeRoles("company"), createLot);
router
  .route("/:id")
  .get(protect, getLotById)
  .put(protect, authorizeRoles("company"), updateLot)
  .delete(protect, authorizeRoles("company"), deleteLot);

export default router;
