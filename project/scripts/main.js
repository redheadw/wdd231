"use strict";

function setFooterMeta() {
  const year = document.querySelector("#year");
  const modified = document.querySelector("#modified");
  if (year) year.textContent = `${new Date().getFullYear()}`;
  if (modified) modified.textContent = `${document.lastModified}`;
}

function setupHamburgerMenu() {
  const btn = document.querySelector("#menuButton");
  const nav = document.querySelector("#primaryNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", `${isOpen}`);
  });
}

function setupEventsModal() {
  const eventBtn = document.querySelector("#eventBtn");
  const modal = document.querySelector("#eventsModal");
  const closeBtn = document.querySelector("#closeModal");
  const list = document.querySelector("#eventsList");

  if (!eventBtn || !modal || !closeBtn || !list) return;

  const events = [
    { date: "Jan 20", title: "Small Business Workshop" },
    { date: "Feb 8", title: "Community Volunteer Day" },
    { date: "Feb 28", title: "Winter Business Expo" }
  ];

  function openModal() {
    list.innerHTML = events
      .map(e => `<li><strong>${e.date}:</strong> ${e.title}</li>`)
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

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
}

setFooterMeta();
setupHamburgerMenu();
setupEventsModal();

