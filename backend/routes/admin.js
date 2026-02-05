import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import { verifyAdmin } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin)
      return res.status(404).json({ error: "Admin not found" });

    const ok = await admin.comparePassword(password);
    console.log("PASSWORD:", password);
console.log("HASH:", admin.passwordHash);

    if (!ok)
      return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, name: admin.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ error: "Not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await Reset.create({
    adminId: admin._id,
    code,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  await sendEmail(email, code);

  res.json({ message: "Code sent" });
});


router.post("/reset-password", async (req, res) => {
  const { code, newPassword } = req.body;

  const reset = await Reset.findOne({ code });
  if (!reset || reset.expiresAt < Date.now())
    return res.status(404).json({ error: "Invalid code" });

  const hash = await bcrypt.hash(newPassword, 10);
  await Admin.findByIdAndUpdate(reset.adminId, {
    passwordHash: hash
  });

  await reset.deleteOne();
  res.json({ message: "Password updated" });
});





// Get profile
router.get("/profile", verifyAdmin, (req, res) => {
  res.json({
    name: req.admin.name,
    email: req.admin.email,
    createdAt: req.admin.createdAt
  });
});

// Update profile
router.put("/profile", verifyAdmin, async (req, res) => {
  const { name, email } = req.body;
  req.admin.name = name || req.admin.name;
  req.admin.email = email || req.admin.email;
  await req.admin.save();
  res.json({ message: "Profile updated" });
});



router.post("/employees", verifyAdmin, async (req, res) => {
  const { fullName, pin } = req.body;

  const hashedPin = await bcrypt.hash(pin, 10);

  const emp = await Employee.create({
    fullName,
    pin: hashedPin,
  });

  res.json(emp);
});


router.get("/employees", verifyAdmin, async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});


router.put("/employees/:id", verifyAdmin, async (req, res) => {
  const { fullName, pin } = req.body;

  let data = { fullName };
  if (pin) data.pinHash = await bcrypt.hash(pin, 10);

  const emp = await Employee.findByIdAndUpdate(
    req.params.id,
    data,
    { new: true }
  );

  res.json(emp);
});

router.delete("/employees/:id", verifyAdmin, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
});


router.get("/attendance", verifyAdmin, async (req, res) => {
  
  const logs = await Attendance.find()
    .populate("employeeId", "fullName")
    .sort({ time: -1 });

  res.json(logs);
});


export default router;
