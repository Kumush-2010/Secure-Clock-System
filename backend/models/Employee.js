import mongoose from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new mongoose.Schema({
  name: String,
  pin: String, // oddiy string
  lastClockIn: Date,
  lastClockOut: Date,
  status: String
});

employeeSchema.methods.comparePin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};
// EmployeeSchema.statics.generatePin = async function() {
//   const pin = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(pin, salt);
//   return { pin, hash };
// };

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
