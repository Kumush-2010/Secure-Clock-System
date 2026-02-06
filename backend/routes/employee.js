import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();


router.post("/clock", async (req, res) => {
  try {
    const { pin, type } = req.body;

    const employee = await Employee.findOne({ pin });
    if (!employee) {
      return res.status(404).json({ error: "PIN noto‘g‘ri" });
    }

    if (type === "IN") {
      employee.lastClockIn = new Date();
      employee.status = "IN";
    }

    if (type === "OUT") {
      employee.lastClockOut = new Date();
      employee.status = "OUT";
    }

    await employee.save();

    res.json({
      message: `Muvaffaqiyatli ${type}`,
      status: type
    });
  } catch (err) {
    console.error("CLOCK ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
