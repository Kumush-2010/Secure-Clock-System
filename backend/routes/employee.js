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

    // ⬇️⬇️⬇️ MANA SHU YERGA YOZASAN ⬇️⬇️⬇️

    // 1️⃣ Hech qachon clock qilinmagan → IN
    if (!employee.lastClockIn && !employee.lastClockOut) {
      employee.lastClockIn = new Date();
      await employee.save();

      return res.status(200).json({
        status: "IN",
        message: `Clock In: ${employee.lastClockIn.toLocaleTimeString()}`
      });
    }

    // 2️⃣ IN bor, OUT yo‘q → OUT
    if (employee.lastClockIn && !employee.lastClockOut) {
      employee.lastClockOut = new Date();
      await employee.save();

      return res.status(200).json({
        status: "OUT",
        message: `Clock Out: ${employee.lastClockOut.toLocaleTimeString()}`
      });
    }

    // 3️⃣ IN va OUT bor → yangi IN
    employee.lastClockIn = new Date();
    employee.lastClockOut = null;
    await employee.save();

    return res.status(200).json({
      status: "IN",
      message: `Clock In: ${employee.lastClockIn.toLocaleTimeString()}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatolik" });
  }
});


export default router;
