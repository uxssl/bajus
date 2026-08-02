/* BAJUS — Shared header & footer injection.
   Each page renders <div id="bajus-header"></div> and <div id="bajus-footer"></div>;
   this script fills them in. Easy to port to WordPress (replace with PHP includes). */

(function () {
  const BASE = ".";

  const NAV = [
    {
      label: "About",
      submenu: [
        { href: "about.html", label: "About BAJUS" },
        {
          href: "about-presidents-message.html",
          label: "President's Message",
        },
        { href: "about-board.html", label: "Board of Directors" },
        { href: "about-past-leaders.html", label: "Past Leaders" },
        { href: "about-committees.html", label: "Committees" },
        {
          href: "about-divisional-committee.html",
          label: "Divisional Committee",
        },
        { href: "about-district-committee.html", label: "District Committee" },
        { href: "about-election.html", label: "BAJUS Election" },
      ],
    },
    {
      label: "Member",
      submenu: [
        { href: "member-directory.html", label: "Member Directory" },
        { href: "member-become.html", label: "Become a Member" },
      ],
    },
    { href: "gold-price.html", label: "Gold Price" },
    {
      label: "Notice",
      submenu: [
        { href: "notice.html", label: "All Notices" },
        { href: "notice.html#forms", label: "Forms & Downloads" },
      ],
    },
    {
      label: "Media",
      submenu: [
        { href: "gallery.html", label: "Gallery" },
        { href: "events.html", label: "Events" },
        { href: "news.html", label: "News" },
        { href: "press-release.html", label: "Press Release" },
      ],
    },
    {
      label: "Resource",
      wide: true,
      submenu: [
        { href: "resource-policy.html", label: "Policy" },
        { href: "resource-publication.html", label: "Publication" },
        { href: "resource-articles.html", label: "Article / Views of Experts" },
        { href: "resource-research.html", label: "Research of Specialists" },
        {
          href: "resource-international.html",
          label: "International News / Article",
        },
        { href: "resource-links.html", label: "Useful Link" },
      ],
    },
    { href: "bajus-institute.html", label: "Institute" },
    { href: "contact.html", label: "Contact" },
  ];

  function activePage() {
    const p = window.location.pathname.split("/").pop() || "index.html";
    return p;
  }

  function currentNavHref() {
    const page = activePage();
    const hash = window.location.hash || "";
    return hash ? page + hash : page;
  }

  function hrefPage(href) {
    return (href || "").split("#")[0];
  }

  const LOGIN_KEY = "bajus_member_logged_in";
  const MEMBER_KEY = "bajus_dashboard_member";

  function isMemberLoggedIn() {
    return sessionStorage.getItem(LOGIN_KEY) === "1";
  }

  function getHeaderMember() {
    const defaults = {
      name: "Md. Alamgir",
      memberId: "BAJUS-DH-001247",
      photo: "assets/members/mohammed_morshed_alam.jpg",
    };
    try {
      const raw = sessionStorage.getItem(MEMBER_KEY);
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch (_) {}
    return defaults;
  }

  function getHeaderMemberId(member) {
    return member.memberId || member.id || "BAJUS-DH-001247";
  }

  function renderHeaderAvatar(member) {
    const photoSrc = memberPhotoSrc(member.photo);
    const inner = photoSrc
      ? `<img src="${photoSrc}" alt="" class="bajus-header-user__photo" loading="lazy" />`
      : `<span class="bajus-header-user__initials" aria-hidden="true">${memberInitials(member.name)}</span>`;
    return `<span class="bajus-header-user__avatar">${inner}</span>`;
  }

  function memberPhotoSrc(photo) {
    if (!photo) return "";
    const path = photo.replace(/^\.\//, "");
    return `${BASE}/${path}`;
  }

  function memberInitials(name) {
    return (name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function renderMemberHeaderUser(isDark, options) {
    const opts = options || {};
    const inPortal = Boolean(opts.inPortal);
    const member = getHeaderMember();
    const memberId = getHeaderMemberId(member);
    const avatar = renderHeaderAvatar(member);

    const menuPanel = isDark
      ? "bg-black border border-zinc-800 text-zinc-200"
      : "bg-cream border border-zinc-200";
    const menuLink = isDark
      ? "text-zinc-300 hover:text-gold hover:bg-zinc-900"
      : "text-charcoal hover:text-gold hover:bg-zinc-50";

    const memberPortalDesktop = inPortal
      ? ""
      : `<a href="${BASE}/dashboard.html" class="block px-4 py-2.5 text-sm font-semibold ${menuLink} transition-colors">Member Portal</a>`;

    const memberPortalMobile = inPortal
      ? ""
      : `<a href="${BASE}/dashboard.html" class="btn-gold text-center">Member Portal</a>`;

    return {
      desktop: `
        <div class="bajus-header-user group relative">
          <button type="button" class="bajus-header-user__trigger ${isDark ? "bajus-header-user__trigger--dark" : ""}" aria-haspopup="true" aria-expanded="false">
            ${avatar}
            <span class="bajus-header-user__text hidden xl:block">
              <span class="bajus-header-user__name">${member.name}</span>
              <span class="bajus-header-user__member-id">${memberId}</span>
            </span>
            <svg class="bajus-header-user__chevron hidden xl:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
          </button>
          <div class="bajus-header-user__menu">
            <div class="${menuPanel} bajus-header-user__menu-panel shadow-xl py-2 rounded-sm min-w-[11rem]">
              ${memberPortalDesktop}
              <a href="${BASE}/dashboard-profile.html" class="block px-4 py-2.5 text-sm font-semibold ${menuLink} transition-colors">My Profile</a>
              <button type="button" data-bajus-logout class="block w-full text-left px-4 py-2.5 text-sm font-semibold ${menuLink} transition-colors">Log Out</button>
            </div>
          </div>
        </div>
      `,
      mobile: `
        <div class="bajus-header-user-mobile">
          <div class="bajus-header-user-mobile__profile">
            ${avatar}
            <div>
              <div class="bajus-header-user-mobile__name">${member.name}</div>
              <div class="bajus-header-user-mobile__member-id">${memberId}</div>
            </div>
          </div>
          ${memberPortalMobile}
          <button type="button" data-bajus-logout class="btn-outline text-center">Log Out</button>
        </div>
      `,
    };
  }

  function renderHeaderAuth(isDark) {
    if (!isMemberLoggedIn()) {
      return {
        desktop: `
          <a href="${BASE}/login.html" class="text-sm font-semibold px-4 py-2 hover:text-gold transition-colors ${isDark ? "text-zinc-300" : "text-black"}">Login</a>
          <a href="${BASE}/signup.html" class="btn-gold text-sm font-medium tracking-wide px-5 py-2">Apply Now</a>
        `,
        mobile: `
          <a href="${BASE}/login.html" class="btn-outline text-center">Login</a>
          <a href="${BASE}/signup.html" class="btn-gold text-center">Apply for Membership</a>
        `,
      };
    }

    return renderMemberHeaderUser(isDark);
  }

  let headerAuthDocumentBound = false;

  function bindHeaderAuth() {
    document.querySelectorAll("[data-bajus-logout]").forEach((btn) => {
      if (btn.dataset.bajusAuthBound) return;
      btn.dataset.bajusAuthBound = "1";
      btn.addEventListener("click", () => {
        sessionStorage.removeItem(LOGIN_KEY);
        sessionStorage.removeItem(MEMBER_KEY);
        window.location.href = `${BASE}/index.html`;
      });
    });

    document.querySelectorAll(".bajus-header-user").forEach((user) => {
      if (user.dataset.bajusAuthBound) return;
      user.dataset.bajusAuthBound = "1";

      const trigger = user.querySelector(".bajus-header-user__trigger");
      if (!trigger) return;

      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = user.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      user.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          user.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
        }
      });
    });

    if (headerAuthDocumentBound) return;
    headerAuthDocumentBound = true;

    document.addEventListener("click", (event) => {
      document.querySelectorAll(".bajus-header-user.is-open").forEach((user) => {
        if (!user.contains(event.target)) {
          user.classList.remove("is-open");
          const trigger = user.querySelector(".bajus-header-user__trigger");
          trigger?.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  function isSubItemActive(subHref, current) {
    if (subHref === current) return true;
    // Exact page match only when no hash is active and submenu item has no hash
    if (
      !window.location.hash &&
      !subHref.includes("#") &&
      subHref === activePage()
    )
      return true;
    return false;
  }

  function navLinks(active, mobile, isDark = false) {
    const current = currentNavHref();
    return NAV.map((n) => {
      if (n.submenu) {
        const isSubActive = n.submenu.some(
          (sub) => hrefPage(sub.href) === active,
        );
        const menuWidth = n.wide ? "w-72" : "w-56";
        if (mobile) {
          return `
            <details class="group border-b border-zinc-100">
              <summary class="flex justify-between items-center py-4 px-2 text-base font-semibold tracking-wide text-black list-none cursor-pointer">
                <span class="${isSubActive ? "text-gold" : ""}">${n.label}</span>
                <svg class="size-4 transition-transform duration-200 group-open:rotate-180 text-zinc-400 group-hover:text-gold" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
              </summary>
              <div class="pl-4 pb-2 flex flex-col bg-zinc-50/50">
                ${n.submenu
                  .map((sub) => {
                    const isActive = isSubItemActive(sub.href, current);
                    return `<a href="${BASE}/${sub.href}" class="py-2.5 px-2 text-sm font-semibold ${isActive ? "text-gold" : "text-black hover:text-gold"}">${sub.label}</a>`;
                  })
                  .join("")}
              </div>
            </details>
          `;
        } else {
          return `
            <div class="relative group py-6">
              <button class="flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors ${isSubActive ? "text-gold" : isDark ? "text-zinc-200 hover:text-gold" : "text-black hover:text-gold"} focus:outline-none">
                <span>${n.label}</span>
                <svg class="size-3.5 transition-transform duration-300 group-hover:rotate-180 text-zinc-400 group-hover:text-gold" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
              </button>
              <div class="absolute left-0 top-full pt-1 ${menuWidth} opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div class="${isDark ? "bg-black border border-zinc-850 text-zinc-250" : "bg-cream border border-zinc-200"} shadow-xl py-2 rounded-sm backdrop-blur-md">
                  ${n.submenu
                    .map((sub) => {
                      const isActive = isSubItemActive(sub.href, current);
                      return `<a href="${BASE}/${sub.href}" class="block px-5 py-2.5 text-[11px] uppercase tracking-wider font-semibold ${isActive ? "text-gold" : isDark ? "text-zinc-300 hover:text-gold hover:bg-zinc-900" : "text-black hover:text-gold hover:bg-zinc-50"} transition-colors">${sub.label}</a>`;
                    })
                    .join("")}
                </div>
              </div>
            </div>
          `;
        }
      } else {
        const isActive = n.href === active;
        const base = mobile
          ? "block py-4 px-2 text-base border-b border-zinc-100 font-semibold tracking-wide"
          : "text-sm font-semibold tracking-wide transition-colors py-6";
        const color = isActive
          ? "text-gold"
          : isDark
            ? "text-zinc-200 hover:text-gold"
            : "text-black hover:text-gold";
        return `<a href="${BASE}/${n.href}" class="${base} ${color}">${n.label}</a>`;
      }
    }).join("");
  }

  function renderHeader(isDark = false) {
    const active = activePage();
    const auth = renderHeaderAuth(isDark);
    return `
    <!-- Utility Bar -->
    <div class="bajus-utility-bar ${isDark ? "bajus-utility-bar--dark bg-black border-b border-zinc-900" : "bg-zinc-100/60 border-b border-zinc-200"} hidden md:block">
      <div class="bajus-utility-bar__inner max-w-7xl mx-auto px-6 h-8 flex items-center justify-between uppercase tracking-widest font-medium">
        <div class="flex gap-6">
          <span><i class="bi bi-telephone text-gold mr-1"></i>+880 2 8159193</span>
          <span><i class="bi bi-envelope text-gold mr-1"></i>info@bajus.org.bd</span>
        </div>
        <div class="flex gap-4 items-center">
          <a href="${BASE}/dashboard.html" class="bajus-utility-bar__link hover:text-gold">Member Portal</a>
          <span class="bajus-utility-bar__sep" aria-hidden="true">|</span>
          <button type="button" class="bajus-utility-bar__link bajus-utility-bar__lang bajus-utility-bar__lang--active" aria-current="true">EN</button>
          <button type="button" class="bajus-utility-bar__link bajus-utility-bar__lang">বাংলা</button>
        </div>
      </div>
    </div>

    <!-- Main Nav & Marquee Ticker -->
    <header id="bajus-main-header" class="sticky top-0 z-40 ${isDark ? "dark-header bg-black/95 border-b border-zinc-900 text-zinc-200" : "bg-white/95 border-b border-zinc-200"} backdrop-blur-md">
      <!-- Market Ticker directly on top of menu -->
      <div class="bajus-header-ticker bg-charcoal text-cream border-b border-gold/30 ticker">
        <div class="ticker__track py-2 font-medium uppercase tracking-wider">
          ${tickerRow()}${tickerRow()}
        </div>
      </div>

      <div class="bajus-header-row max-w-7xl mx-auto px-6 h-[5rem] flex items-center justify-between">
        <a href="${BASE}/index.html" class="flex items-center gap-3">
          <img src="${BASE}/assets/logo.png" alt="BAJUS — Bangladesh Jewellers Association" class="bajus-header-logo h-9 md:h-10 w-auto" />
        </a>
        <nav class="hidden lg:flex items-center gap-5">
          ${navLinks(active, false, isDark)}
        </nav>
        <div class="bajus-header-auth hidden md:flex items-center gap-3">
          ${auth.desktop}
        </div>
        <button id="bajus-burger" class="lg:hidden p-2 shrink-0 ${isDark ? "text-zinc-200" : "text-black"}" aria-label="Open menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>
        </button>
      </div>
    </header>

    <!-- Mobile Nav -->
    <div id="bajus-mobile-nav" class="mobile-nav fixed top-0 right-0 h-full w-[80%] max-w-sm bg-cream z-50 shadow-2xl p-6 overflow-y-auto lg:hidden">
      <div class="flex justify-between items-center mb-8">
        <img src="${BASE}/assets/logo.png" alt="BAJUS" class="h-8 w-auto" />
        <button id="bajus-close" class="p-2" aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M6 18L18 6" stroke-linecap="round"/></svg>
        </button>
      </div>
      <nav>${navLinks(active, true)}</nav>
      <div class="mt-8 flex flex-col gap-3">
        ${auth.mobile}
      </div>
    </div>
    <div id="bajus-backdrop" class="fixed inset-0 bg-black/40 z-40 hidden lg:hidden"></div>
    `;
  }

  function tickerRow() {
    const items = [
      ["22K Gold", '<span class="font-bangla">৳</span>1,72,883 / Gram'],
      ["21K Gold", '<span class="font-bangla">৳</span>1,65,016 / Gram'],
      ["18K Gold", '<span class="font-bangla">৳</span>1,41,449 / Gram'],
      ["Traditional Gold", '<span class="font-bangla">৳</span>1,17,036 / Gram'],
      ["Silver 22K", '<span class="font-bangla">৳</span>2,567 / Gram'],
      ["Silver 21K", '<span class="font-bangla">৳</span>2,449 / Gram'],
      ["Silver Traditional", '<span class="font-bangla">৳</span>1,633 / Gram'],
    ];
    return (
      `<div class="flex gap-12 px-6 items-center">` +
      items
        .map(
          ([k, v]) =>
            `<span class="flex items-center gap-2"><span class="ticker-price-accent">●</span><span class="ticker-price-accent">${k}:</span> ${v}</span>`,
        )
        .join("") +
      `<span class="ticker-price-muted"><span class="ticker-price-separator" aria-hidden="true">|</span><span>Updated: Jun 03, 2026</span></span>` +
      `</div>`
    );
  }

  function renderFooter() {
    return `
    <footer class="bg-white text-zinc-500 pt-20 pb-10 border-t border-zinc-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid lg:grid-cols-12 gap-12 mb-16">
          <div class="lg:col-span-4 space-y-6">
            <img src="${BASE}/assets/logo.png" alt="BAJUS" class="h-14 w-auto"/>
            <p class="text-sm leading-relaxed text-zinc-600">
              The single unified voice of the jewellery trade in Bangladesh. Dedicated to transparency, hallmark standards, and the growth of our heritage gold craft since 1972.
            </p>
            <div class="flex gap-3">
              <a href="https://www.facebook.com/BangladeshJewellersAssociation" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="size-9 bg-zinc-100 text-charcoal rounded-full grid place-items-center hover:bg-gold hover:text-cream transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.408 24 22.676V1.325C24 .593 23.407 0 22.675 0z"/></svg>
              </a>
              <a href="https://www.youtube.com/channel/UC94j5U7VVwEeCeDgKQAj6KQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="size-9 bg-zinc-100 text-charcoal rounded-full grid place-items-center hover:bg-gold hover:text-cream transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://twitter.com/Bajus_org" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="size-9 bg-zinc-100 text-charcoal rounded-full grid place-items-center hover:bg-gold hover:text-cream transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.instagram.com/bajusorg/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="size-9 bg-zinc-100 text-charcoal rounded-full grid place-items-center hover:bg-gold hover:text-cream transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>

          <div class="lg:col-span-2">
            <h4 class="text-charcoal text-xs uppercase tracking-widest font-semibold mb-6">About BAJUS</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="${BASE}/about.html" class="footer-nav-link">About BAJUS</a></li>
              <li><a href="${BASE}/about-presidents-message.html" class="footer-nav-link">President's Message</a></li>
              <li><a href="${BASE}/about-board.html" class="footer-nav-link">Board of Directors</a></li>
              <li><a href="${BASE}/member-directory.html" class="footer-nav-link">Member Directory</a></li>
            </ul>
          </div>

          <div class="lg:col-span-2">
            <h4 class="text-charcoal text-xs uppercase tracking-widest font-semibold mb-6">Media & Resource</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="${BASE}/gallery.html" class="footer-nav-link">Gallery</a></li>
              <li><a href="${BASE}/events.html" class="footer-nav-link">Events</a></li>
              <li><a href="${BASE}/news.html" class="footer-nav-link">News</a></li>
              <li><a href="${BASE}/press-release.html" class="footer-nav-link">Press Release</a></li>
              <li><a href="${BASE}/resource-policy.html" class="footer-nav-link">Policy</a></li>
              <li><a href="${BASE}/bajus-institute.html" class="footer-nav-link">Institute</a></li>
            </ul>
          </div>

          <div class="lg:col-span-4">
            <h4 class="text-charcoal text-xs uppercase tracking-widest font-semibold mb-4">Headquarters</h4>
            <div class="text-sm space-y-3">
              <p class="text-zinc-600">Baitul Mukarram (South side), 4th floor, Dhaka-1000, Bangladesh</p>
              <p class="text-charcoal font-medium">+880 2 8159193</p>
              <p class="text-gold">info@bajus.org.bd</p>
            </div>
          </div>
        </div>

        <div class="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          <p>© <span id="bajus-year"></span> Bangladesh Jewellers' Association. All rights reserved.</p>
          <div class="flex gap-8">
            <a href="#" class="footer-nav-link">Privacy Policy</a>
            <a href="#" class="footer-nav-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
    `;
  }

  function inject() {
    // Inject Bootstrap Icons stylesheet if not already present
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
      document.head.appendChild(link);
    }

    const h = document.getElementById("bajus-header");
    const f = document.getElementById("bajus-footer");
    if (h) {
      const isDark = h.classList.contains("dark-header");
      h.innerHTML = renderHeader(isDark);
    }
    if (f) f.innerHTML = renderFooter();

    // year
    const y = document.getElementById("bajus-year");
    if (y) y.textContent = new Date().getFullYear();

    // mobile nav handlers
    const burger = document.getElementById("bajus-burger");
    const close = document.getElementById("bajus-close");
    const nav = document.getElementById("bajus-mobile-nav");
    const back = document.getElementById("bajus-backdrop");
    function open() {
      nav.classList.add("is-open");
      back.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
    function shut() {
      nav.classList.remove("is-open");
      back.classList.add("hidden");
      document.body.style.overflow = "";
    }
    if (burger) burger.addEventListener("click", open);
    if (close) close.addEventListener("click", shut);
    if (back) back.addEventListener("click", shut);
    bindHeaderAuth();

    // Shrink header on scroll (ticker marquee stays visible/sticky always)
    const mainHeader = document.getElementById("bajus-main-header");
    if (mainHeader) {
      const headerRow = mainHeader.querySelector(".bajus-header-row");
      const headerLogo = mainHeader.querySelector(".bajus-header-logo");
      const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

      const applyHeaderScrollState = () => {
        const scrolled = window.scrollY > 40;
        mainHeader.classList.toggle("is-scrolled", scrolled);
        mainHeader.style.boxShadow = scrolled
          ? "0 8px 24px -12px rgba(0,0,0,0.18)"
          : "";
        if (headerRow) {
          headerRow.style.height = scrolled ? "3.75rem" : "5rem";
        }
        if (headerLogo) {
          headerLogo.style.height = scrolled
            ? "2rem"
            : isDesktop()
              ? "2.5rem"
              : "2.25rem";
        }
      };
      applyHeaderScrollState();
      window.addEventListener("scroll", applyHeaderScrollState, {
        passive: true,
      });
      window.addEventListener("resize", applyHeaderScrollState);
    }

    // Scroll to Top Button (circular scroll-progress ring)
    const topBtn = document.createElement("button");
    topBtn.id = "bajus-scroll-top";
    topBtn.ariaLabel = "Scroll to top";
    topBtn.className = "bajus-scroll-top";
    const R = 20;
    const CIRC = 2 * Math.PI * R;
    topBtn.innerHTML = `
      <svg class="bajus-scroll-top__ring" width="46" height="46" viewBox="0 0 46 46">
        <circle class="bajus-scroll-top__track" cx="23" cy="23" r="${R}" />
        <circle class="bajus-scroll-top__progress" cx="23" cy="23" r="${R}"
          style="stroke-dasharray:${CIRC};stroke-dashoffset:${CIRC};" />
      </svg>
      <svg class="bajus-scroll-top__arrow" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    `;
    document.body.appendChild(topBtn);

    const progressCircle = topBtn.querySelector(".bajus-scroll-top__progress");

    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      progressCircle.style.strokeDashoffset = String(CIRC - pct * CIRC);

      if (scrollTop > 450) {
        topBtn.classList.add("is-visible");
      } else {
        topBtn.classList.remove("is-visible");
      }
    });

    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Initialize sidebar meeting calendar if on dashboard
    initSidebarCalendar();
  }

  function initSidebarCalendar() {
    const aside = document.querySelector("aside");
    if (!aside) return;

    let calContainer = document.getElementById("bajus-sidebar-calendar");
    const spaceY6 = aside.querySelector(".space-y-6");

    if (!calContainer) {
      calContainer = document.createElement("div");
      calContainer.id = "bajus-sidebar-calendar";
      calContainer.className = "pt-4 border-t border-zinc-100";
      if (spaceY6) {
        spaceY6.appendChild(calContainer);
      } else {
        aside.appendChild(calContainer);
      }
    } else {
      calContainer.className = "pt-4 border-t border-zinc-100";
      if (spaceY6 && calContainer.parentElement !== spaceY6) {
        spaceY6.appendChild(calContainer);
      }
    }

    function renderCalWidget() {
      const meetings = window.BAJUS_MEETINGS || [];
      const now = new Date();
      let currentDate = new Date(2026, 6, 5); // Default to July 2026 for demo consistency
      if (now.getFullYear() === 2026) {
        currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      function render() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const monthName = monthNames[month];

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let cellsHtml = "";
        for (let i = 0; i < firstDay; i++) {
          cellsHtml += `<div class="h-8"></div>`;
        }

        const today = new Date();
        const isCurrentYearMonth =
          today.getFullYear() === year && today.getMonth() === month;

        for (let d = 1; d <= daysInMonth; d++) {
          const dateStr = `${monthName} ${d}, ${year}`;
          const dayMeetings = meetings.filter((m) => m.date === dateStr);

          let bgClass = "text-zinc-600 hover:bg-zinc-100";
          let borderClass = "border border-transparent";
          let dotHtml = "";
          let badgeTitle = "";

          if (dayMeetings.length > 0) {
            const hasLive = dayMeetings.some((m) => m.status === "live");
            const hasUpcoming = dayMeetings.some(
              (m) => m.status === "upcoming",
            );

            if (hasLive) {
              bgClass =
                "bg-red-50 text-red-700 font-bold hover:bg-red-100 shadow-sm";
              borderClass = "border border-red-300 animate-pulse";
              dotHtml = `<span class="size-1.5 rounded-full bg-red-500 absolute bottom-1"></span>`;
              badgeTitle = "Live Meeting Today";
            } else if (hasUpcoming) {
              bgClass =
                "bg-gold-soft text-gold font-bold hover:bg-gold hover:text-cream shadow-sm";
              borderClass = "border border-gold/40";
              dotHtml = `<span class="size-1.5 rounded-full bg-gold absolute bottom-1"></span>`;
              badgeTitle = "Upcoming Meeting";
            } else {
              bgClass = "bg-zinc-100 text-zinc-700 font-bold hover:bg-zinc-200";
              borderClass = "border border-zinc-300";
              dotHtml = `<span class="size-1.5 rounded-full bg-zinc-400 absolute bottom-1"></span>`;
              badgeTitle = "Concluded Meeting";
            }
          }

          const isToday = isCurrentYearMonth && d === today.getDate();
          if (isToday) {
            borderClass += " ring-1 ring-gold ring-offset-1 font-extrabold";
          }

          if (dayMeetings.length > 0) {
            const targetHref = `dashboard-meeting-detail.html?id=${encodeURIComponent(dayMeetings[0].id)}`;
            cellsHtml += `
              <a href="${targetHref}" class="h-8 rounded-sm text-xs flex flex-col items-center justify-center relative transition-all duration-150 ${bgClass} ${borderClass}" title="${badgeTitle}: ${dayMeetings[0].title}">
                <span>${d}</span>
                ${dotHtml}
              </a>
            `;
          } else {
            cellsHtml += `
              <div class="h-8 rounded-sm text-xs flex flex-col items-center justify-center relative ${bgClass} ${borderClass} cursor-default">
                <span>${d}</span>
              </div>
            `;
          }
        }

        calContainer.innerHTML = `
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="font-serif text-sm font-bold text-charcoal tracking-wide flex items-center gap-1.5">
                <i class="ph ph-calendar-blank text-gold text-base"></i>
                <span>${monthName} ${year}</span>
              </div>
              <div class="flex items-center gap-1">
                <button type="button" id="cal-prev-btn" class="size-6 rounded-sm bg-zinc-100 hover:bg-gold hover:text-cream text-zinc-600 transition-colors flex items-center justify-center text-xs" title="Previous Month">
                  <i class="ph ph-caret-left font-bold"></i>
                </button>
                <button type="button" id="cal-today-btn" class="px-1.5 h-6 rounded-sm bg-zinc-100 hover:bg-gold hover:text-cream text-[10px] font-bold uppercase tracking-wider text-zinc-600 transition-colors flex items-center justify-center" title="Go to Current Month">
                  Today
                </button>
                <button type="button" id="cal-next-btn" class="size-6 rounded-sm bg-zinc-100 hover:bg-gold hover:text-cream text-zinc-600 transition-colors flex items-center justify-center text-xs" title="Next Month">
                  <i class="ph ph-caret-right font-bold"></i>
                </button>
              </div>
            </div>

            <!-- Day of Week Header -->
            <div class="grid grid-cols-7 gap-1 text-center">
              <span class="text-[10px] font-bold text-zinc-400">Su</span>
              <span class="text-[10px] font-bold text-zinc-400">Mo</span>
              <span class="text-[10px] font-bold text-zinc-400">Tu</span>
              <span class="text-[10px] font-bold text-zinc-400">We</span>
              <span class="text-[10px] font-bold text-zinc-400">Th</span>
              <span class="text-[10px] font-bold text-zinc-400">Fr</span>
              <span class="text-[10px] font-bold text-zinc-400">Sa</span>
            </div>

            <!-- Days Grid -->
            <div class="grid grid-cols-7 gap-1">
              ${cellsHtml}
            </div>

            <!-- Legend -->
            <div class="flex items-center justify-between pt-2 text-[9px] font-medium text-zinc-500 border-t border-zinc-100">
              <span class="flex items-center gap-1"><span class="size-2 rounded-full bg-red-500 animate-pulse"></span> Live</span>
              <span class="flex items-center gap-1"><span class="size-2 rounded-full bg-gold"></span> Upcoming</span>
              <span class="flex items-center gap-1"><span class="size-2 rounded-full bg-zinc-400"></span> Past</span>
            </div>
          </div>
        `;

        const prevBtn = calContainer.querySelector("#cal-prev-btn");
        const nextBtn = calContainer.querySelector("#cal-next-btn");
        const todayBtn = calContainer.querySelector("#cal-today-btn");

        if (prevBtn)
          prevBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            render();
          });
        if (nextBtn)
          nextBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            render();
          });
        if (todayBtn)
          todayBtn.addEventListener("click", () => {
            const t = new Date();
            currentDate = new Date(t.getFullYear(), t.getMonth(), 1);
            render();
          });
      }

      render();
    }

    if (typeof window.BAJUS_MEETINGS === "undefined") {
      const script = document.createElement("script");
      script.src = "./js/meetings-data.js";
      script.onload = () => {
        renderCalWidget();
      };
      document.head.appendChild(script);
    } else {
      renderCalWidget();
    }
  }

  window.bajusRenderMemberHeaderUser = renderMemberHeaderUser;
  window.bajusBindHeaderAuth = bindHeaderAuth;
  window.bajusGetHeaderMember = getHeaderMember;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
