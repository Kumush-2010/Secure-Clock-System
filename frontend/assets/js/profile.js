const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const nameInput = document.getElementById("adminName");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const statusText = document.getElementById("status");

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Load current admin info
async function loadProfile() {
  const res = await fetch("http://localhost:3000/api/admin/profile", {
    headers: { Authorization: "Bearer " + token }
  });

  if (!res.ok) return logout();

  const data = await res.json();
  nameInput.value = data.fullName || "";
  emailInput.value = data.email || "";
}

async function updateProfile() {
  const body = {
    fullName: nameInput.value,
    email: emailInput.value
  };

  if (passwordInput.value) body.password = passwordInput.value;

  const res = await fetch("http://localhost:3000/api/admin/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    statusText.innerText = "Profile updated successfully!";
    passwordInput.value = "";
  } else {
    statusText.innerText = "Error updating profile";
  }
}

loadProfile();
