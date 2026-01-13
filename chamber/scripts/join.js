"use strict";

function setTimestamp() {
  const ts = document.querySelector("#timestamp");
  if (!ts) return;
  ts.value = new Date().toISOString();
}

function setupMembershipHint() {
  const levelSelect = document.querySelector("#levelSelect");
  const hint = document.querySelector("#formHint");
  if (!levelSelect || !hint) return;

  const perks = {
    nonprofit: "Non-Profit includes basic listing and event invitations.",
    silver: "Silver adds training discounts, shoutouts, and luncheons.",
    gold: "Gold adds premium spotlights, sponsorship priority, and advertising."
  };

  levelSelect.addEventListener("change", () => {
    const value = levelSelect.value;
    hint.textContent = value ? `${perks[value]}` : "";
  });
}

setTimestamp();
setupMembershipHint();
