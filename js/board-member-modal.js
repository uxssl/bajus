(function () {
  const data = window.BOARD_MEMBERS_DATA || {};
  const institutionData = window.BOARD_MEMBERS_INSTITUTION || {};

  const modal = document.getElementById("board-member-modal");
  if (!modal) return;

  const backdrop = modal.querySelector(".board-member-modal__backdrop");
  const closeBtn = modal.querySelector(".board-member-modal__close");
  const photoEl = document.getElementById("board-member-modal-photo");
  const nameEl = document.getElementById("board-member-modal-name");
  const currentRoleEl = document.getElementById("board-member-modal-current-role");
  const pastRolesEl = document.getElementById("board-member-modal-past-roles");
  const descriptionWrapEl = document.getElementById("board-member-modal-description-wrap");
  const descriptionEl = document.getElementById("board-member-modal-description");
  const shopNameEl = document.getElementById("board-member-modal-shop-name");
  const memberIdEl = document.getElementById("board-member-modal-member-id");
  const locationEl = document.getElementById("board-member-modal-location");
  const categoryEl = document.getElementById("board-member-modal-category");
  const statusEl = document.getElementById("board-member-modal-status");
  const expiryEl = document.getElementById("board-member-modal-expiry");
  const bodyEl = modal.querySelector(".board-member-modal__body");

  function photoFilenameToId(src) {
    const match = src.match(/\/([^/]+)\.(jpg|jpeg|png|webp)$/i);
    if (!match) return null;
    return match[1].replace(/_/g, "-");
  }

  function setInstitutionFields(memberId, record) {
    const institution =
      record.institution ||
      institutionData[memberId] || {
        shopName: "—",
        memberId: "—",
        location: "—",
        category: "—",
        status: "—",
        expiry: "—",
      };

    shopNameEl.textContent = institution.shopName || "—";
    memberIdEl.textContent = institution.memberId || "—";
    locationEl.textContent = institution.location || "—";
    categoryEl.textContent = institution.category || "—";
    statusEl.textContent = institution.status || "—";
    expiryEl.textContent = institution.expiry || "—";
  }

  function openModal(memberId, fallback) {
    const record = data[memberId] || {};
    const name = record.name || fallback.name || "Board Member";
    const photo = record.photo || fallback.photo || "";
    const currentRole =
      record.currentRole ||
      (fallback.role ? `${fallback.role} (2025–2027)` : "—");
    const pastRoles = record.pastRoles || [];
    const description = record.description || fallback.description || "";

    nameEl.textContent = name;
    currentRoleEl.textContent = currentRole;

    if (description) {
      descriptionEl.textContent = description;
      descriptionWrapEl.classList.remove("hidden");
    } else {
      descriptionEl.textContent = "";
      descriptionWrapEl.classList.add("hidden");
    }

    if (photo) {
      photoEl.src = photo;
      photoEl.alt = name;
      photoEl.hidden = false;
    } else {
      photoEl.hidden = true;
    }

    pastRolesEl.innerHTML = "";
    if (pastRoles.length === 0) {
      const empty = document.createElement("li");
      empty.className = "board-member-modal__past-empty";
      empty.textContent = "No prior organizational roles recorded.";
      pastRolesEl.appendChild(empty);
    } else {
      pastRoles.forEach(function (role) {
        const item = document.createElement("li");
        item.className = "board-member-modal__past-item";

        const title = document.createElement("span");
        title.className = "board-member-modal__past-title";
        title.textContent = role.title;

        const duration = document.createElement("span");
        duration.className = "board-member-modal__past-duration";
        duration.textContent = role.duration;

        item.appendChild(title);
        item.appendChild(duration);
        pastRolesEl.appendChild(item);
      });
    }

    setInstitutionFields(memberId, record);

    if (bodyEl) {
      bodyEl.scrollTop = 0;
    }

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function bindCardTrigger(card, memberId, fallback) {
    const label = "View profile: " + (fallback.name || "Board Member");

    card.classList.add("board-member-card--interactive");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", label);

    function openProfile() {
      openModal(memberId, fallback);
    }

    card.addEventListener("click", openProfile);
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProfile();
      }
    });
  }

  function enhanceCard(card) {
    const img = card.querySelector("img");
    const nameHeading = card.querySelector(".board-member-card__name");
    const roleEl = card.querySelector(".board-member-card__role");
    if (!img || !nameHeading) return;

    const memberId = photoFilenameToId(img.getAttribute("src") || "");
    if (!memberId) return;

    const fallback = {
      name: nameHeading.textContent.trim(),
      photo: img.getAttribute("src"),
      role: roleEl ? roleEl.textContent.trim() : "",
    };

    if (nameHeading.tagName === "BUTTON") {
      const heading = document.createElement("h3");
      heading.className = nameHeading.className.replace(/\s*board-member-card__name-btn\s*/g, " ").trim();
      heading.textContent = fallback.name;
      nameHeading.replaceWith(heading);
    }

    bindCardTrigger(card, memberId, fallback);
  }

  function enhancePresidentHero() {
    const hero = document.querySelector(".board-hero-card");
    if (!hero) return;

    const img = hero.querySelector("img");
    const nameEl = hero.querySelector(".board-hero-card__name");
    const bioEl = hero.querySelector(".board-hero-card__bio");
    if (!img || !nameEl) return;

    const memberId = photoFilenameToId(img.getAttribute("src") || "");
    if (!memberId) return;

    const fallback = {
      name: nameEl.textContent.trim(),
      photo: img.getAttribute("src"),
      role: "President",
      description: bioEl ? bioEl.textContent.trim() : "",
    };

    nameEl.classList.add("board-hero-card__name-btn");
    nameEl.setAttribute("role", "button");
    nameEl.setAttribute("tabindex", "0");
    nameEl.setAttribute("aria-haspopup", "dialog");

    function openPresident() {
      openModal(memberId, fallback);
    }

    nameEl.addEventListener("click", openPresident);
    nameEl.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPresident();
      }
    });
  }

  window.bajusInitBoardMemberCards = function () {
    document
      .querySelectorAll(".board-members-grid .board-member-card")
      .forEach(function (card) {
        if (!card.dataset.enhanced) {
          card.dataset.enhanced = "1";
          enhanceCard(card);
        }
      });
  };

  document.addEventListener("DOMContentLoaded", function () {
    enhancePresidentHero();
  });

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
})();
