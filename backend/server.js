import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { setupSwagger } from "./config/swagger.js"; // 👈 Import Swagger setup

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import lotRoutes from "./routes/lotRoutes.js";
import boxRoutes from "./routes/boxRoutes.js";


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// DB Connection
connectDB();

// Swagger Docs
setupSwagger(app); // 👈 Swagger mounted on /api-docs

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/lots", lotRoutes);
app.use("/api/boxes", boxRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
