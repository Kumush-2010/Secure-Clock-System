import express from "express";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// Clock In / Clock Out
router.post("/clock", async (req, res) => {
  const { pin, type } = req.body; // type = "IN" yoki "OUT"

  // PIN bo‘yicha aktiv xodimni topish
  const employee = await Employee.findOne({ isActive: true });
  if (!employee) return res.status(404).json({ error: "Employee not found" });

  // PIN tekshirish
  const valid = await employee.comparePin(pin);
  if (!valid) return res.status(404).json({ error: "Invalid PIN" });

  // Bugungi sana
  const today = new Date().toISOString().split("T")[0];

  // Attendance yozuvi yaratish
  const attendance = new Attendance({
    employeeId: employee._id,
    type, // IN yoki OUT
    date: today
  });

  await attendance.save();

  res.json({ message: `Salom ${employee.fullName}, ${type} muvaffaqiyatli!` });
});

export default router;
