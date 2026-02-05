async function sendPin() {
  const API_URL =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://secure-clock-system.onrender.com";
  const pin = document.getElementById("pin").value;
  const type = localStorage.getItem("clockType");
  const errorText = document.getElementById("error");
  const title = document.getElementById("title");

  if (!type) {
    // Agar to‘g‘ri tanlanmagan bo‘lsa
    window.location.href = "index.html";
    return;
  }

  if (!pin || pin.length !== 4) {
    errorText.innerText = "Iltimos 4 xonali PIN kiriting";
    return;
  }

  title.innerText = `Processing ${type}...`;

  try {
    const res = await fetch(`${APU_URL}/api/employee/clock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, type })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("message", data.message);
      localStorage.setItem("status", data.status);
      window.location.href = "success.html"; // Muvaffaqiyat sahifaga
    } else {
      errorText.innerText = data.error || "PIN noto‘g‘ri yoki Clock qilingan";
    }
  } catch (err) {
    console.error(err);
    errorText.innerText = "Server bilan bog‘lanishda xatolik yuz berdi";
  }
}
