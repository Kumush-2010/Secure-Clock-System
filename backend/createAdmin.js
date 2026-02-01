import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Admin from "./models/Admin.js";

dotenv.config({ path: './backend/.env' });


async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const password = "123456"; // hozircha test uchun
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name: "Super Admin",
      email: "admin@test.com",
      passwordHash: passwordHash
    });

    console.log("✅ Admin created:", admin.email);
    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
