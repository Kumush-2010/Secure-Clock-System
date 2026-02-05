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
  const res = await fetch(`${API_URL}/admin/attendance`, {
    headers: { Authorization: "Bearer " + token }
  });

  if (!res.ok) return logout();

  const data = await res.json();
  const tbody = document.getElementById("logs");

  data.forEach(log => {
    tbody.innerHTML += `
      <tr>
        <td>${log.employeeId?.fullName || "Unknown"}</td>
        <td class="${log.type === 'IN' ? 'in' : 'out'}">${log.type}</td>
        <td>${new Date(log.time).toLocaleString()}</td>
      </tr>
    `;
  });
}

loadAttendance();
