// ===============================
// Chatrooms Module
// ===============================

const DATA_URL = "data/chatrooms.json";

// DOM elements
const grid = document.querySelector("#chatroom-grid");
const topicSelect = document.querySelector("#topic-select");
const filterForm = document.querySelector("#filter-form");
const modal = document.querySelector("#room-modal");
const modalBody = document.querySelector("#modal-body");
const modalTitle = document.querySelector("#modal-title");
const modalClose = document.querySelector(".modal-close");

// State
let chatrooms = [];
let currentFilter = {
  location: localStorage.getItem("locationFilter") || "usa",
  topic: localStorage.getItem("topicFilter") || "all"
};

// ===============================
// Fetch Data
// ===============================
async function loadChatrooms() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    chatrooms = await response.json();
    populateTopics(chatrooms);
    applyFilters();
    restoreFormState();

  } catch (error) {
    console.error("Failed to load chatrooms:", error);
    grid.innerHTML = `<p class="error">Unable to load chatrooms at this time.</p>`;
  }
}

// ===============================
// Populate Topic Dropdown
// ===============================
function populateTopics(data) {
  const topics = [...new Set(data.map(room => room.topic))].sort();

  topics.forEach(topic => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicSelect.appendChild(option);
  });
}

// ===============================
// Filter + Render
// ===============================
function applyFilters() {
  let filtered = [...chatrooms];

  if (currentFilter.location !== "all") {
    filtered = filtered.filter(room => room.scope === currentFilter.location);
  }

  if (currentFilter.topic !== "all") {
    filtered = filtered.filter(room => room.topic === currentFilter.topic);
  }

  renderChatrooms(filtered);
}

// ===============================
// Render Cards
// ===============================
function renderChatrooms(data) {
  grid.innerHTML = "";

  if (data.length === 0) {
    grid.innerHTML = `<p>No chatrooms match your filters.</p>`;
    return;
  }

  const cards = data.map(room => `
    <article class="chatroom-card" data-id="${room.id}">
      <h4>${room.name}</h4>
      <p class="topic">${room.topic}</p>
      <p class="location">
        ${room.scope === "usa" ? "USA-wide" : `${room.city}, ${room.state}`}
      </p>
      <p class="members">${room.members} members</p>
      <button class="btn secondary view-details">View Details</button>
    </article>
  `);

  grid.innerHTML = cards.join("");
}

// ===============================
// Event Handlers
// ===============================
filterForm.addEventListener("change", (event) => {
  const formData = new FormData(filterForm);

  currentFilter.location = formData.get("location");
  currentFilter.topic = formData.get("topic");

  localStorage.setItem("locationFilter", currentFilter.location);
  localStorage.setItem("topicFilter", currentFilter.topic);

  applyFilters();
});

// ===============================
// Modal Handling
// ===============================
grid.addEventListener("click", (event) => {
  const button = event.target.closest(".view-details");
  if (!button) return;

  const card = button.closest(".chatroom-card");
  const roomId = Number(card.dataset.id);
  const room = chatrooms.find(r => r.id === roomId);

  openModal(room);
});

function openModal(room) {
  modalTitle.textContent = room.name;

  modalBody.innerHTML = `
    <p><strong>Topic:</strong> ${room.topic}</p>
    <p><strong>Location:</strong>
      ${room.scope === "usa" ? "USA-wide" : `${room.city}, ${room.state}`}
    </p>
    <p><strong>Members:</strong> ${room.members}</p>
    <p>${room.description}</p>
  `;

  modal.showModal();
}

// Close modal
modalClose.addEventListener("click", () => modal.close());

// Click outside modal closes it
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

// ===============================
// Restore Form State
// ===============================
function restoreFormState() {
  filterForm.location.value = currentFilter.location;
  topicSelect.value = currentFilter.topic;
}

// ===============================
// Init
// ===============================
loadChatrooms();
