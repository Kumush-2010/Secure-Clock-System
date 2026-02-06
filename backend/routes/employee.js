import express from "express";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

router.post("/clock", async (req, res) => {
  const { pin, type } = req.body;

  if (!pin || !type) {
    return res.status(400).json({ error: "PIN va type kerak" });
  }

  if (type !== "IN" && type !== "OUT") {
    return res.status(400).json({ error: "Noto‘g‘ri type" });
  }

  try {
    // 🔹 Employee topish (PIN orqali)
    const employees = await Employee.find();

    let employee = null;
    for (const emp of employees) {
      if (await emp.comparePin(pin)) {
        employee = emp;
        break;
      }
    }

    if (!employee) {
      return res.status(404).json({ error: "PIN noto‘g‘ri yoki Employee topilmadi" });
    }

    // ================= CLOCK IN =================
    if (type === "IN") {
      const activeAttendance = await Attendance.findOne({
        employee: employee._id,
        clockOut: null
      });

      if (activeAttendance) {
        return res.status(400).json({ error: "Allaqachon Clock In qilingan" });
      }

      await Attendance.create({
        employee: employee._id,
        clockIn: new Date()
      });

      return res.status(200).json({
        message: "Clock In muvaffaqiyatli",
        status: "IN"
      });
    }

    // ================= CLOCK OUT =================
    if (type === "OUT") {
      const attendance = await Attendance.findOne({
        employee: employee._id,
        clockOut: null
      });

      if (!attendance) {
        return res.status(400).json({ error: "Clock In qilinmagan, OUT mumkin emas" });
      }

      attendance.clockOut = new Date();
      await attendance.save();

      return res.status(200).json({
        message: "Clock Out muvaffaqiyatli",
        status: "OUT"
      });
    }

  } catch (err) {
    console.error("CLOCK ERROR:", err);
    return res.status(500).json({ error: "Server xatolik" });
  }
});

export default router;
