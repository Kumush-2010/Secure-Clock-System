import express from "express";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

async function sendPin() {
  const API_URL =
    location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://secure-clock-system.onrender.com";

  const pin = document.getElementById("pin").value;
  const type = localStorage.getItem("clockType");

  const errorText = document.getElementById("error");
  const title = document.getElementById("title");

  if (type !== "IN" && type !== "OUT") {
    errorText.innerText = "Iltimos IN yoki OUT ni tanlang";
    return;
  }

  if (!pin  pin.length !== 4) {
    errorText.innerText = "Iltimos 4 xonali PIN kiriting";
    return;
  }

  title.innerText = `Processing ${type}...`;

  try {
    const res = await fetch(`${API_URL}/api/employee/clock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, type })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("message", data.message);
      localStorage.setItem("status", data.status);
      window.location.href = "success.html";
    } else {
      errorText.innerText = data.error  "PIN noto‘g‘ri yoki Clock qilingan";
    }
  } catch (err) {
    console.error(err);
    errorText.innerText = "Server bilan bog‘lanishda xatolik yuz berdi";
  }
}

export default router;
