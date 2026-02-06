const API_URL =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://secure-clock-system.onrender.com";

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

async function loadAttendance() {
  try {
    const res = await fetch(`${API_URL}/api/admin/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // FAQAT aniq auth muammo bo‘lsa
    if (res.status === 401) {
      return logout();
    }

    if (!res.ok) {
      console.warn("Server error:", res.status);
      return; // tokenni O‘CHIRMAYMIZ
    }

    const data = await res.json();
    const tbody = document.getElementById("logs");
    tbody.innerHTML = "";

    data.forEach(log => {
      tbody.innerHTML += `
        <tr>
          <td>${log.employeeId?.fullName || "Unknown"}</td>
          <td class="${log.type === "IN" ? "in" : "out"}">${log.type}</td>
          <td>${new Date(log.time).toLocaleString()}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Fetch error:", err);
    // BU YERDA LOGOUT YO‘Q
  }
}

// Render uchun biroz kutamiz
setTimeout(loadAttendance, 800);
