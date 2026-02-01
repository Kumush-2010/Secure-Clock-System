import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

AdminSchema.methods.comparePassword = async function (password) {
  if (!password || !this.passwordHash) return false;
  return await bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model("Admin", AdminSchema);
