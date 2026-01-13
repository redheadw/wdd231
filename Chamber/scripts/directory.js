"use strict";

/* =========================
   CONFIG
========================= */
const DATA_URL = "data/members.json";

/* =========================
   ELEMENTS
========================= */
const directoryEl = document.querySelector("#directory");
const statusEl = document.querySelector("#dirStatus");
const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");
const categorySelect = document.querySelector("#category");
const searchInput = document.querySelector("#search");

let members = [];
let currentView = "grid";

/* =========================
   FETCH DATA
========================= */
async function loadMembers() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("Failed to load members");
    members = await res.json();
    buildCategoryOptions(members);
    renderMembers(members);
    statusEl.textContent = `${members.length} members loaded.`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Unable to load directory at this time.";
  }
}

/* =========================
   RENDER
========================= */
function renderMembers(list) {
  directoryEl.innerHTML = "";

  if (!list.length) {
    directoryEl.innerHTML = "<p class='muted'>No members found.</p>";
    return;
  }

  list.forEach((m) => {
    const card = document.createElement("article");
    card.className =
      currentView === "grid" ? "member-card" : "member-row";

    card.innerHTML = `
      <img src="images/${m.image}" alt="${m.name}" loading="lazy">
      <h2>${m.name}</h2>
      <p class="meta">${m.address}</p>
      <p class="meta">${m.phone}</p>
      <p class="meta"><a href="${m.website}" target="_blank" rel="noopener">${m.website}</a></p>
      <span class="badge">${m.category}</span>
    `;

    directoryEl.appendChild(card);
  });
}

/* =========================
   CONTROLS
========================= */
function setView(view) {
  currentView = view;
  directoryEl.className = `directory ${view}`;
  renderMembers(getFilteredMembers());
}

function buildCategoryOptions(list) {
  const cats = [...new Set(list.map((m) => m.category))].sort();
  cats.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function getFilteredMembers() {
  const term = searchInput.value.toLowerCase();
  const cat = categorySelect.value;

  return members.filter((m) => {
    const matchesText =
      m.name.toLowerCase().includes(term) ||
      m.category.toLowerCase().includes(term);

    const matchesCat = cat === "all" || m.category === cat;

    return matchesText && matchesCat;
  });
}

/* =========================
   EVENTS
========================= */
gridBtn.addEventListener("click", () => setView("grid"));
listBtn.addEventListener("click", () => setView("list"));

categorySelect.addEventListener("change", () => {
  renderMembers(getFilteredMembers());
});

searchInput.addEventListener("input", () => {
  renderMembers(getFilteredMembers());
});

/* =========================
   INIT
========================= */
loadMembers();
