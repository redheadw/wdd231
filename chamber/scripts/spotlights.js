"use strict";

const spotlightsEl = document.querySelector("#spotlights");
const dataUrl = "data/members.json";

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toTitleCase(s) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

function renderSpotlight(member) {
  const card = document.createElement("section");
  card.className = "spotlight";

  const img = document.createElement("img");
  img.src = member.image;
  img.alt = `${member.name} logo`;
  img.loading = "lazy";
  img.width = 320;
  img.height = 180;

  const body = document.createElement("div");

  const h3 = document.createElement("h3");
  h3.textContent = member.name;

  const level = document.createElement("p");
  level.className = "badge";
  level.textContent = `${toTitleCase(member.level)} Member`;

  const phone = document.createElement("p");
  phone.innerHTML = `<strong>Phone:</strong> ${member.phone}`;

  const address = document.createElement("p");
  address.innerHTML = `<strong>Address:</strong> ${member.address}`;

  const site = document.createElement("p");
  site.innerHTML = `<strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener">Visit</a>`;

  body.append(h3, level, phone, address, site);
  card.append(img, body);

  return card;
}

async function loadSpotlights() {
  try {
    spotlightsEl.textContent = "Loading spotlights…";

    const res = await fetch(dataUrl);
    if (!res.ok) throw new Error("Could not load members JSON.");

    const data = await res.json();
    const members = data.members ?? [];

    const eligible = members.filter(m => {
      const lvl = String(m.level).toLowerCase();
      return lvl === "gold" || lvl === "silver";
    });

    const count = Math.random() < 0.5 ? 2 : 3;
    const picks = shuffle(eligible).slice(0, Math.min(count, eligible.length));

    spotlightsEl.innerHTML = "";
    picks.forEach(m => spotlightsEl.appendChild(renderSpotlight(m)));
  } catch (err) {
    spotlightsEl.textContent = "Spotlights unavailable right now.";
    console.error(err);
  }
}

loadSpotlights();
