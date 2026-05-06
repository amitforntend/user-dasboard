let users = [];
let filteredUsers = [];
let currentPage = 1;
const perPage = 5;

// DOM
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const userList = document.getElementById("user-list");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageInfo = document.getElementById("page-info");

const form = document.getElementById("user-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const cityInput = document.getElementById("city");

// GET USERS
async function fetchUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  users = await res.json();
  filteredUsers = [...users];
  render();
}

// CREATE
async function addUser(user) {
  await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" }
  });

  user.id = Date.now();
  users.unshift(user);
  filteredUsers = [...users];
  render();
}

// DELETE
async function deleteUser(id) {
  await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "DELETE"
  });

  users = users.filter(u => u.id !== id);
  filteredUsers = [...users];
  render();
}

// HIGHLIGHT
function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, `<mark>$1</mark>`);
}

// RENDER
function render() {
  const start = (currentPage - 1) * perPage;
  const paginated = filteredUsers.slice(start, start + perPage);

  userList.innerHTML = paginated.map(user => `
    <div class="user">
      <div>${highlight(user.name, searchInput.value)}</div>
      <div>${highlight(user.email, searchInput.value)}</div>
      <div>${user.address?.city || "N/A"}</div>
      <button onclick="deleteUser(${user.id})">Delete</button>
    </div>
  `).join("");

  pageInfo.textContent =
    `${currentPage} / ${Math.ceil(filteredUsers.length / perPage)}`;
}

// FORM
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newUser = {
    name: nameInput.value,
    email: emailInput.value,
    address: { city: cityInput.value }
  };

  addUser(newUser);
  form.reset();
});

// SEARCH
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(value) ||
    u.email.toLowerCase().includes(value)
  );

  currentPage = 1;
  render();
});

// SORT
sortSelect.addEventListener("change", () => {
  if (sortSelect.value === "asc") {
    filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect.value === "desc") {
    filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
  }
  render();
});

// PAGINATION
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < Math.ceil(filteredUsers.length / perPage)) {
    currentPage++;
    render();
  }
});

// INIT
fetchUsers();