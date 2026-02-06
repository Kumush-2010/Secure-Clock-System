import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Admin from "./models/Admin.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existingAdmin = await Admin.findOne({ email: "admin@test.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return;
    }

    const password = process.env.ADMIN_PASSWORD || "123456";
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name: "Super Admin",
      email: "admin@test.com",
      passwordHash
    });

    console.log("🎉 Admin created:", admin.email);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createAdmin();

