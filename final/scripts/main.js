// ===============================
// Main Site Script
// ===============================

// ---------- Responsive Navigation ----------
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#primary-nav");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", !isOpen);
    navMenu.classList.toggle("open");
  });
}

// ---------- Close menu on link click  ----------
const navLinks = document.querySelectorAll("#primary-nav a");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// ---------- Footer Year ----------
const yearSpan = document.querySelector("#year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ---------- Accessibility: Close nav with Esc ----------
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu.classList.contains("open")) {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.focus();
  }
});
