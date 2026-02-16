// ===============================
// Chatrooms Module
// ===============================
const DATA_URL = "./data/chatrooms.json";


// DOM elements
const grid = document.querySelector("#chatroom-grid");
const topicSelect = document.querySelector("#topic-select");
const filterForm = document.querySelector("#filter-form");
const modal = document.querySelector("#room-modal");
const modalBody = document.querySelector("#modal-body");
const modalTitle = document.querySelector("#modal-title");
const modalClose = document.querySelector(".modal-close");
const joinButton = document.querySelector("#join-room");

// State
let chatrooms = [];
let selectedRoom = null;

let currentFilter = {
  location: localStorage.getItem("locationFilter") || "usa",
  topic: localStorage.getItem("topicFilter") || "all"
};

// ===============================
// Fetch Data (async + try/catch)
// ===============================
async function loadChatrooms() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    chatrooms = await response.json();
    populateTopics(chatrooms);
    restoreFormState();
    applyFilters();

  } catch (error) {
    console.error("Failed to load chatrooms:", error);
    if (grid) {
      grid.innerHTML = `<p class="error">Unable to load chatrooms at this time.</p>`;
    }
  }
}

// ===============================
// Populate Topic Dropdown
// ===============================
function populateTopics(data) {
  if (!topicSelect) return;

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
  if (!grid) return;

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
// Render Cards (template literals)
// ===============================
function renderChatrooms(data) {
  if (!grid) return;

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
// Event Handlers (filters)
// ===============================
if (filterForm) {
  filterForm.addEventListener("change", () => {
    const formData = new FormData(filterForm);

    currentFilter.location = formData.get("location");
    currentFilter.topic = formData.get("topic");

    localStorage.setItem("locationFilter", currentFilter.location);
    localStorage.setItem("topicFilter", currentFilter.topic);

    applyFilters();
  });
}

// ===============================
// Modal Handling
// ===============================
if (grid) {
  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".view-details");
    if (!button) return;

    const card = button.closest(".chatroom-card");
    const roomId = Number(card.dataset.id);
    const room = chatrooms.find(r => r.id === roomId);

    openModal(room);
  });
}

function openModal(room) {
  if (!modal) return;

  selectedRoom = room;

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

// Close modal button
if (modalClose) {
  modalClose.addEventListener("click", () => modal.close());
}

// Click outside closes modal
if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
}

// ===============================
// Join Chatroom (localStorage + DOM update)
// ===============================
if (joinButton) {
  joinButton.addEventListener("click", () => {
    if (!selectedRoom) return;

    localStorage.setItem("joinedRoom", selectedRoom.name);

    modalBody.innerHTML = `
      <h4>You joined:</h4>
      <p><strong>${selectedRoom.name}</strong></p>
      <p>You can now participate in this conversation.</p>
    `;

    setTimeout(() => modal.close(), 1500);
  });
}

// ===============================
// Restore Form State
// ===============================
function restoreFormState() {
  if (!filterForm) return;

  const locationInput = filterForm.querySelector(
    `input[name="location"][value="${currentFilter.location}"]`
  );
  if (locationInput) locationInput.checked = true;

  if (topicSelect) topicSelect.value = currentFilter.topic;
}

// ===============================
// Init
// ===============================
loadChatrooms();

