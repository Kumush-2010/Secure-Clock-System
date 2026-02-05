import mongoose from "mongoose";
import bcrypt from "bcrypt";

const EmployeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  pinHash: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastClockIn: { type: Date },
  lastClockOut: { type: Date }
});

// 🔐 PIN taqqoslash
employeeSchema.methods.comparePin = function (enteredPin) {
  return bcrypt.compare(enteredPin, this.pin);
};

// Generate PIN
EmployeeSchema.statics.generatePin = async function() {
  const pin = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pin, salt);
  return { pin, hash };
};

export default mongoose.model("Employee", EmployeeSchema);
