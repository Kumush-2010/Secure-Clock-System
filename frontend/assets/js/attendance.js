const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const table = document.getElementById("attendanceTable");
const filterInput = document.getElementById("filterDate");

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

async function loadAttendance(date = null) {
  let url = "http://localhost:3000/api/admin/attendance";
  if (date) url += `?date=${date}`;

  const res = await fetch(url, {
    headers: { Authorization: "Bearer " + token }
  });

  if (!res.ok) return logout();

  const data = await res.json();
  table.innerHTML = "";

  data.forEach(log => {
    table.innerHTML += `
      <tr>
        <td>${log.employeeId?.fullName || "Unknown"}</td>
        <td class="${log.type === 'IN' ? 'in' : 'out'}">${log.type}</td>
        <td>${new Date(log.time).toLocaleString()}</td>
      </tr>
    `;
  });
}

// Filter by date
function filterAttendance() {
  const selectedDate = filterInput.value;
  loadAttendance(selectedDate);
}

loadAttendance();
