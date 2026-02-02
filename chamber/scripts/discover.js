import { places } from "../data/places.mjs";

function buildCards() {
  const grid = document.querySelector(".discover-grid");
  if (!grid) return;

  grid.innerHTML = "";

  places.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = `card place place-${i + 1}`;

    card.innerHTML = `
      <h2>${p.title}</h2>
      <figure class="place__figure">
        <img src="${p.image}" alt="${p.alt}" loading="lazy" width="300" height="200">
      </figure>
      <address>${p.address}</address>
      <p>${p.description}</p>
      <button type="button" class="btn place__btn">Learn more</button>
    `;

    // Optional: small interaction, no requirement—keeps it friendly
    card.querySelector(".place__btn")?.addEventListener("click", () => {
      alert(`${p.title}\n\n${p.address}`);
    });

    grid.appendChild(card);
  });
}

function setVisitMessage() {
  const el = document.querySelector("#visitMessage");
  const closeBtn = document.querySelector("#closeVisit");
  const wrap = el?.closest(".visit");
  if (!el || !wrap) return;

  const key = "owasso_discover_last_visit";
  const now = Date.now();
  const last = Number(localStorage.getItem(key));

  let message = "";
  if (!last) {
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const diffMs = now - last;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 1000 * 60 * 60 * 24) {
      message = "Back so soon! Awesome!";
    } else {
      message = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
    }
  }

  el.textContent = message;
  localStorage.setItem(key, String(now));

  // Close option (nice UX)
  closeBtn?.addEventListener("click", () => {
    wrap.style.display = "none";
  });
}

buildCards();
setVisitMessage();
