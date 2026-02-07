let pinValue = "";

function add(num) {
  if (pinValue.length < 4) {
    pinValue += num;
    updateDots();
  }
}

function del() {
  pinValue = pinValue.slice(0, -1);
  updateDots();
}

function updateDots() {
  const dots = document.getElementById("dots");
  if (!dots) return;

  dots.innerText = pinValue
    .padEnd(4, "•")
    .split("")
    .join(" ");
}

async function sendPin() {
  const API_URL =
    location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://secure-clock-system.onrender.com";

  const pin = pinValue; // ✅ FAqat shu yerdan olinadi
  const type = localStorage.getItem("clockType");
  const errorText = document.getElementById("error");

  if (!type) {
    window.location.href = "index.html";
    return;
  }

  if (pin.length !== 4) {
    errorText.innerText = "Iltimos 4 xonali PIN kiriting";
    return;
  }

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
      errorText.innerText = data.error || "PIN noto‘g‘ri yoki allaqachon clock qilingan";
    }
  } catch (err) {
    console.error(err);
    errorText.innerText = "Server bilan bog‘lanishda xatolik";
  }
}
