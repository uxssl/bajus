/* BAJUS — Dashboard header user menu (same as public site index header). */

(function () {
  function findLegacyUserMenu(header) {
    return Array.from(header.querySelectorAll(".relative.group.cursor-pointer")).find(
      (group) => !group.querySelector(".ph-bell"),
    );
  }

  function mountDashboardUserMenu(header) {
    if (typeof window.bajusRenderMemberHeaderUser !== "function") return;

    const auth = window.bajusRenderMemberHeaderUser(false, { inPortal: true });
    const wrap = document.createElement("div");
    wrap.innerHTML = auth.desktop.trim();
    const menu = wrap.firstElementChild;
    if (!menu) return;

    const existing = header.querySelector(".bajus-header-user");
    const legacy = findLegacyUserMenu(header);

    if (existing) {
      existing.replaceWith(menu);
      return;
    }

    if (legacy) {
      legacy.replaceWith(menu);
      return;
    }

    const actions = header.querySelector(
      ":scope > div > div.flex.items-center.gap-5, :scope > div > div.flex.items-center.gap-7",
    );
    if (actions) actions.appendChild(menu);
  }

  function initDashboardUserMenu() {
    if (!document.body.classList.contains("dashboard-page")) return;

    document.querySelectorAll("header").forEach(mountDashboardUserMenu);

    if (typeof window.bajusBindHeaderAuth === "function") {
      window.bajusBindHeaderAuth();
    }
  }

  function updateDashboardUserHeader(updates) {
    if (!updates || typeof updates !== "object") return;

    const defaults = {
      name: "Md. Alamgir",
      memberId: "BAJUS-DH-001247",
      photo: "assets/members/mohammed_morshed_alam.jpg",
    };

    let current = { ...defaults };
    try {
      const raw = sessionStorage.getItem("bajus_dashboard_member");
      if (raw) current = { ...current, ...JSON.parse(raw) };
    } catch (_) {}

    const next = { ...current, ...updates };

    try {
      sessionStorage.setItem("bajus_dashboard_member", JSON.stringify(next));
      sessionStorage.setItem("bajus_member_logged_in", "1");
    } catch (_) {}

    initDashboardUserMenu();
  }

  window.initDashboardUserMenu = initDashboardUserMenu;
  window.updateDashboardUserHeader = updateDashboardUserHeader;
})();
