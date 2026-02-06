const API_URL =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://secure-clock-system.onrender.com";

const token = localStorage.getItem("token");

// Token bo‘lmasa → login
if (!token) {
  window.location.href = "login.html";
}

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Attendance yuklash
async function loadAttendance() {
  try {
    const res = await fetch(`${API_URL}/admin/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Token eskirgan yoki noto‘g‘ri bo‘lsa
    if (res.status === 401 || res.status === 403) {
      return logout();
    }

    const data = await res.json();
    const tbody = document.getElementById("logs");

    tbody.innerHTML = ""; // tozalash

    data.forEach(log => {
      tbody.innerHTML += `
        <tr>
          <td>${log.employeeId?.fullName || "Unknown"}</td>
          <td class="${log.type === "IN" ? "in" : "out"}">
            ${log.type}
          </td>
          <td>${new Date(log.time).toLocaleString()}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Server error", err);
    logout();
  }
}

loadAttendance();
