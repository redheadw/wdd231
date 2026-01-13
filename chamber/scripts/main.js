"use strict";

/**
 * Requires these elements in the HTML:
 *   <span id="year"></span>
 *   <span id="modified"></span>
 */
function setFooterMeta() {
  const yearEl = document.querySelector("#year");
  const modifiedEl = document.querySelector("#modified");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  if (modifiedEl) modifiedEl.textContent = document.lastModified;
}

/**
 * Toggles the mobile navigation menu open/closed.
 * Requires:
 *   button#menuButton
 *   nav#primaryNav
 */
function setupHamburgerMenu() {
  const button = document.querySelector("#menuButton");
  const nav = document.querySelector("#primaryNav");

  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

/**
 * Requires: #eventBtn, #eventsModal, #closeModal, #eventsList
 */
function setupEventsModal() {
  const eventBtn = document.querySelector("#eventBtn");
  const modal = document.querySelector("#eventsModal");
  const closeBtn = document.querySelector("#closeModal");
  const list = document.querySelector("#eventsList");

  // If the modal isn't present on this page, exit 
  if (!eventBtn || !modal || !closeBtn || !list) return;

  const events = [
    { date: "Jan 20", title: "Small Business Workshop" },
    { date: "Feb 8", title: "Community Volunteer Day" },
    { date: "Feb 28", title: "Winter Business Expo" }
  ];

  function openModal() {
    list.innerHTML = events
      .map((e) => `<li><strong>${e.date}:</strong> ${e.title}</li>`)
      .join("");
    modal.hidden = false;
  }

  function closeModal() {
    modal.hidden = true;
  }

  eventBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  // Close the modal when clicking the overlay 
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close the modal with the Escape key.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
}

/**
 * Initialize shared site behaviors.
  */
setFooterMeta();
setupHamburgerMenu();
setupEventsModal();

