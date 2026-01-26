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
    np: "NP: basic listing + event invitations.",
    bronze: "Bronze: listing + ribbon cutting + member pricing.",
    silver: "Silver: adds training discounts + spotlight opportunities.",
    gold: "Gold: adds premium spotlights + sponsorship priority + advertising."
  };

  levelSelect.addEventListener("change", () => {
    hint.textContent = levelSelect.value ? perks[levelSelect.value] : "";
  });
}

function setupLevelModals() {
  // Links 
  const openLinks = document.querySelectorAll("[data-open]");

  openLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.getAttribute("data-open");
      const dlg = document.getElementById(id);
      if (dlg) dlg.showModal();
    });
  });

  // Close logic for each dialog
  const dialogs = document.querySelectorAll("dialog.level-dialog");

  dialogs.forEach((dlg) => {
    const closeBtn = dlg.querySelector(".dialog-close");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => dlg.close());
    }

    // Click outside the modal content closes it
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  });
}

setTimestamp();
setupMembershipHint();
setupLevelModals();

