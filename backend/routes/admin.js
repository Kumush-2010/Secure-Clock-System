import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

/* =======================
   ADMIN LOGIN
======================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, name: admin.name });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =======================
   RESET PASSWORD
======================= */
router.post("/reset", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    admin.password = password; // bcrypt middleware ichida hash qilishi kerak
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/profile", verifyAdmin, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (name) req.admin.name = name;
    if (email) req.admin.email = email;

    await req.admin.save();

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/* =======================
   EMPLOYEES CRUD
======================= */
router.post("/employees", verifyAdmin, async (req, res) => {
  try {
    const { fullName, pin } = req.body;

    const pinHash = await bcrypt.hash(pin, 10);

    const employee = await Employee.create({
      fullName,
      pinHash,
    });

    res.json(employee);
  } catch (err) {
    console.error("CREATE EMPLOYEE ERROR:", err);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

router.get("/employees", verifyAdmin, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err);
    res.status(500).json({ error: "Failed to load employees" });
  }
});

router.put("/employees/:id", verifyAdmin, async (req, res) => {
  try {
    const { fullName, pin } = req.body;

    const data = {};
    if (fullName) data.fullName = fullName;
    if (pin) data.pinHash = await bcrypt.hash(pin, 10);

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json(employee);
  } catch (err) {
    console.error("UPDATE EMPLOYEE ERROR:", err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

router.delete("/employees/:id", verifyAdmin, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error("DELETE EMPLOYEE ERROR:", err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

/* =======================
   ATTENDANCE
======================= */
router.get("/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employee", "name email")
      .sort({ createdAt: -1 });

    res.json(attendance);
  } catch (err) {
    console.error("ATTENDANCE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
