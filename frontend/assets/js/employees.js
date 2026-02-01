const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const employeesTable = document.getElementById("employeesTable");
const modal = document.getElementById("employeeForm");
let editingId = null;

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function openForm(employee = null) {
  modal.style.display = "block";
  document.getElementById("formTitle").innerText = employee ? "Edit Employee" : "Add Employee";

  if (employee) {
    editingId = employee._id;
    document.getElementById("empName").value = employee.fullName;
    document.getElementById("empEmail").value = employee.email;
    document.getElementById("empPin").value = employee.pin;
  } else {
    editingId = null;
    document.getElementById("empName").value = "";
    document.getElementById("empEmail").value = "";
    document.getElementById("empPin").value = "";
  }
}

function closeForm() {
  modal.style.display = "none";
}

async function loadEmployees() {
  const res = await fetch("http://localhost:3000/api/admin/employees", {
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();
  employeesTable.innerHTML = "";

  data.forEach(emp => {
    employeesTable.innerHTML += `
      <tr>
        <td>${emp.fullName}</td>
        <td>${emp.email}</td>
        <td>${emp.pin}</td>
        <td>
          <button class="action-btn edit-btn" onclick='openForm(${JSON.stringify(emp)})'>Edit</button>
          <button class="action-btn delete-btn" onclick='deleteEmployee("${emp._id}")'>Delete</button>
        </td>
      </tr>
    `;
  });
}

async function saveEmployee() {
  const name = document.getElementById("empName").value;
  const email = document.getElementById("empEmail").value;
  const pin = document.getElementById("empPin").value;

  const body = { fullName: name, email, pin };

  const url = editingId
    ? `http://localhost:3000/api/admin/employees/${editingId}`
    : "http://localhost:3000/api/admin/employees";

  const method = editingId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    closeForm();
    loadEmployees();
  } else {
    alert("Error saving employee");
  }
}

async function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  const res = await fetch(`http://localhost:3000/api/admin/employees/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  if (res.ok) loadEmployees();
  else alert("Error deleting employee");
}

loadEmployees();
