/* BAJUS — Dashboard header user menu (photo + name). */

(function () {
  const DEFAULT_MEMBER = {
    name: "Md. Alamgir",
    role: "Owner Account",
    photo: "./assets/members/mohammed_morshed_alam.jpg",
  };

  const PHOTO_BY_NAME = {
    "Md. Alamgir": DEFAULT_MEMBER.photo,
    "Md. Alamgir Hossain": DEFAULT_MEMBER.photo,
  };

  function getStoredMember() {
    try {
      const raw = sessionStorage.getItem("bajus_dashboard_member");
      if (raw) return { ...DEFAULT_MEMBER, ...JSON.parse(raw) };
    } catch (_) {}
    return { ...DEFAULT_MEMBER };
  }

  function photoForName(name) {
    if (!name) return null;
    if (PHOTO_BY_NAME[name]) return PHOTO_BY_NAME[name];
    const member = getStoredMember();
    if (member.name === name && member.photo) return member.photo;
    return null;
  }

  function createPhotoEl(src, alt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className =
      "dashboard-user-photo size-7 rounded-full object-cover border border-zinc-200 bg-zinc-100 flex-shrink-0";
    return img;
  }

  function initDashboardUserMenu() {
    if (!document.body.classList.contains("dashboard-page")) return;

    const stored = getStoredMember();

    document
      .querySelectorAll("header .relative.group.cursor-pointer")
      .forEach((group) => {
        const trigger = group.querySelector(":scope > div.flex.items-center.gap-3");
        if (!trigger) return;

        const avatar = trigger.querySelector(".size-7.bg-gold");
        const nameBlock = trigger.querySelector(".text-left");
        const nameEl = nameBlock?.querySelector("div:first-child");
        const roleEl = nameBlock?.querySelector("div:last-child");

        const name = nameEl?.textContent?.trim() || stored.name;
        const photo =
          stored.photo ||
          photoForName(name) ||
          (avatar?.textContent?.trim() === "MA" ? DEFAULT_MEMBER.photo : null);

        if (nameEl && stored.name) {
          nameEl.textContent = stored.name;
        }

        if (roleEl && stored.role) {
          roleEl.textContent = stored.role;
        }

        if (!photo) return;

        const existing = trigger.querySelector(".dashboard-user-photo");
        if (existing) {
          existing.src = photo;
          existing.alt = name;
          return;
        }

        if (avatar) {
          avatar.replaceWith(createPhotoEl(photo, name));
        } else if (!trigger.querySelector(".dashboard-user-photo")) {
          trigger.insertBefore(createPhotoEl(photo, name), trigger.firstChild);
        }
      });
  }

  function updateDashboardUserHeader(updates) {
    if (!updates || typeof updates !== "object") return;
    const current = getStoredMember();
    const next = { ...current, ...updates };
    try {
      sessionStorage.setItem("bajus_dashboard_member", JSON.stringify(next));
    } catch (_) {}
    initDashboardUserMenu();
  }

  window.initDashboardUserMenu = initDashboardUserMenu;
  window.updateDashboardUserHeader = updateDashboardUserHeader;
})();
