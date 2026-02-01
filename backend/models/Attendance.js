import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  type: { type: String, enum: ["IN", "OUT"], required: true },
  time: { type: Date, default: Date.now },
  date: { type: String, required: true }
});

export default mongoose.model("Attendance", AttendanceSchema);
