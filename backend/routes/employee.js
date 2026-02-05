import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

router.post("/clock", async (req, res) => {
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({ error: "PIN kerak" });
  }

  try {
    const employees = await Employee.find();
    let employee = null;

    for (let emp of employees) {
      const match = await emp.comparePin(pin);
      if (match) {
        employee = emp;
        break;
      }
    }

    if (!employee) {
      return res.status(404).json({
        error: "Employee topilmadi yoki PIN noto‘g‘ri"
      });
    }

    // 🔥 AUTO LOGIC
    // Agar hali IN qilinmagan bo‘lsa → IN
    if (!employee.lastClockIn || employee.lastClockOut) {
      employee.lastClockIn = new Date();
      employee.lastClockOut = null;
      await employee.save();

      return res.status(200).json({
        status: "IN",
        message: `Clock In: ${employee.lastClockIn.toLocaleTimeString()}`
      });
    }

    // Aks holda → OUT
    employee.lastClockOut = new Date();
    await employee.save();

    return res.status(200).json({
      status: "OUT",
      message: `Clock Out: ${employee.lastClockOut.toLocaleTimeString()}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatolik" });
  }
});

export default router;
