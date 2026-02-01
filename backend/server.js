import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

import adminRoutes from "./routes/admin.js";
import employeeRoutes from "./routes/employee.js";
import authRoutes from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: './backend/.env' });
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, "../frontend/assets")));
app.use(express.static(path.join(__dirname, '../frontend')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {  
  res.status(404).sendFile(path.join(__dirname, "../frontend/404.html"));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
