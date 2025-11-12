import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import {
  createMaterialRequest,
  getMaterialRequests,
  getMaterialRequestById,
  respondToMaterialRequest,
} from "../controllers/materialRequestController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Material Requests
 *   description: APIs for creating and managing material requests between Company and Supplier
 */

/**
 * @swagger
 * /api/material-requests:
 *   post:
 *     summary: Create a new material request (Company only)
 *     tags: [Material Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplierId
 *               - materials
 *             properties:
 *               supplierId:
 *                 type: string
 *                 description: ID of the supplier
 *                 example: "64f1b1234abcd56789ef0123"
 *               materials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - materialId
 *                     - quantity
 *                   properties:
 *                     materialId:
 *                       type: string
 *                       description: Material reference ID
 *                     quantity:
 *                       type: number
 *                       description: Quantity required
 *                     unit:
 *                       type: string
 *                       enum: [kg, unit]
 *                       example: "kg"
 *     responses:
 *       201:
 *         description: Material request created successfully
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all material requests (Company & Supplier)
 *     tags: [Material Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of material requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   supplierId:
 *                     type: string
 *                   materials:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         materialId:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         unit:
 *                           type: string
 *                   status:
 *                     type: string
 *                     enum: [pending, confirmed, rejected]
 *                     example: "pending"
 */

/**
 * @swagger
 * /api/material-requests/{id}:
 *   get:
 *     summary: Get a specific material request by ID
 *     tags: [Material Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Material request ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material request details
 *       404:
 *         description: Request not found
 */

/**
 * @swagger
 * /api/material-requests/{id}/respond:
 *   put:
 *     summary: Respond to a material request (Supplier only)
 *     tags: [Material Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Material request ID
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
 *                 enum: [confirmed, rejected]
 *                 example: "confirmed"
 *               dispatchDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-12"
 *               remarks:
 *                 type: string
 *                 example: "Will dispatch tomorrow morning"
 *     responses:
 *       200:
 *         description: Material request updated successfully
 *       400:
 *         description: Invalid data
 */

router
  .route("/")
  .post(protect, authorizeRoles("company"), createMaterialRequest)
  .get(protect, authorizeRoles("company", "supplier"), getMaterialRequests);

router
  .route("/:id")
  .get(protect, authorizeRoles("company", "supplier"), getMaterialRequestById);

router
  .route("/:id/respond")
  .put(protect, authorizeRoles("supplier"), respondToMaterialRequest);

export default router;
