let users = [];
let filteredUsers = [];
let currentPage = 1;
const perPage = 5;

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const userList = document.getElementById("user-list");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageInfo = document.getElementById("page-info");

async function fetchUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  users = await res.json();
  filteredUsers = [...users];
//   console.log(users);
  render();
}

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex,`<mark>$1<mark>`);
}

function render() {
  const start = (currentPage - 1) * perPage;
  const paginated = filteredUsers.slice(start, start + perPage);

  userList.innerHTML = paginated.map(user => `
    <div class="user">
      <div>${highlight(user.name, searchInput.value)}</div>
      <div>${highlight(user.email, searchInput.value)}</div>
      <div>${user.address.city}</div>
    </div>
  `).join("");

  pageInfo.textContent = `${currentPage} / ${Math.ceil(filteredUsers.length / perPage)}`;
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(value) ||
    u.email.toLowerCase().includes(value)
  );
  currentPage = 1;
  render();
});

sortSelect.addEventListener("change", () => {
  if (sortSelect.value === "asc") {
    filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect.value === "desc") {
    filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
  }
  render();
});

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

fetchUsers();