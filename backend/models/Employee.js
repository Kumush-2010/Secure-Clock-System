// import bcrypt from "bcrypt";
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  pin: String, 
  lastClockIn: Date,
  lastClockOut: Date,
  status: String
});

export default mongoose.model("Employee", employeeSchema);


// employeeSchema.methods.comparePin = async function (enteredPin) {
//   return await bcrypt.compare(enteredPin, this.pin);
// };
// EmployeeSchema.statics.generatePin = async function() {
//   const pin = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(pin, salt);
//   return { pin, hash };
// };
