import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

router.post("/clock", async (req, res) => {
  const { pin, type } = req.body;

  // 1️⃣ Tekshiruv
  if (!pin || !type) {
    return res.status(400).json({ error: "PIN va type kerak" });
  }

  if (type !== "IN" && type !== "OUT") {
    return res.status(400).json({ error: "Type faqat IN yoki OUT bo‘lishi kerak" });
  }

  try {
    // 2️⃣ EMPLOYEE TOPISH (PIN orqali)
    const employees = await Employee.find();
    let employee = null;

    for (const emp of employees) {
      const isMatch = await emp.comparePin(pin); // 👈 HASH bilan tekshiradi
      if (isMatch) {
        employee = emp;
        break;
      }
    }

    if (!employee) {
      return res.status(404).json({
        error: "Employee topilmadi yoki PIN noto‘g‘ri"
      });
    }

    // 3️⃣ CLOCK IN
    if (type === "IN") {
      if (employee.lastClockIn && !employee.lastClockOut) {
        return res.status(400).json({
          error: "Siz allaqachon Clock In qilgansiz"
        });
      }

      employee.lastClockIn = new Date();
      employee.lastClockOut = null;
      await employee.save();

      return res.status(200).json({
        status: "IN",
        message: `Clock In muvaffaqiyatli (${employee.lastClockIn.toLocaleTimeString()})`
      });
    }

    // 4️⃣ CLOCK OUT
    if (type === "OUT") {
      if (!employee.lastClockIn) {
        return res.status(400).json({
          error: "Avval Clock In qilishingiz kerak"
        });
      }

      if (employee.lastClockOut) {
        return res.status(400).json({
          error: "Siz allaqachon Clock Out qilgansiz"
        });
      }

      employee.lastClockOut = new Date();
      await employee.save();

      return res.status(200).json({
        status: "OUT",
        message: `Clock Out muvaffaqiyatli (${employee.lastClockOut.toLocaleTimeString()})`
      });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server xatolik" });
  }
});

export default router;
