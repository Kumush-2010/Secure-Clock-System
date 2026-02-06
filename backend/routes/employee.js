import express from "express";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

router.post("/clock", async (req, res) => {
  const { pin, type } = req.body;

  if (!pin || !type) return res.status(400).json({ error: "PIN va type kerak" });

  try {
    // Employee ni topish
    const employees = await Employee.find(); // barcha employee larni olish
    let employee = null;

    // PINni tekshirish (hash bilan)
    for (let emp of employees) {
      const match = await emp.comparePin(pin);
      if (match) {
        employee = emp;
        break;
      }
    }

    if (!employee) return res.status(404).json({ error: "Employee topilmadi yoki PIN noto‘g‘ri" });

    // Clock In logikasi
    if (type === "IN") {
      if (employee.lastClockIn && !employee.lastClockOut) {
        return res.status(400).json({ error: "Allaqachon Clock In qilingan" });
      }

      employee.lastClockIn = new Date();
      employee.lastClockOut = null;
      await employee.save();

      return res.status(200).json({
        message: `Clock In muvaffaqiyatli: ${employee.lastClockIn.toLocaleTimeString()}`,
        status: "IN"
      });
    }

    // Clock Out logikasi
    if (type === "OUT") {
      if (!employee.lastClockIn) {
        return res.status(400).json({ error: "Clock In qilinmagan, OUT mumkin emas" });
      }
      if (employee.lastClockOut) {
        return res.status(400).json({ error: "Allaqachon Clock Out qilingan" });
      }

      employee.lastClockOut = new Date();
      await employee.save();

      return res.status(200).json({
        message: `Clock Out muvaffaqiyatli: ${employee.lastClockOut.toLocaleTimeString()}`,
        status: "OUT"
      });
    }

    res.status(400).json({ error: "Noto‘g‘ri type" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatolik" });
  }
});


export default router;
