/* BAJUS — Home page "Today's rate" tabs (Gold / Silver / Platinum) and quick price calculator.
   Rates are per gram in BDT. `change` is today's move per gram (negative = down).
   Update RATES when BAJUS publishes a new rate notice. */
(function () {
  "use strict";

  var RATES = {
    gold: {
      label: "Gold",
      image: "./assets/gold.png",
      items: [
        { id: "22k", name: "22 Karat", tag: "Hallmarked", rate: 12008, change: 350, image: "./assets/gold.png" },
        { id: "21k", name: "21 Karat", tag: "Hallmarked", rate: 11463, change: 333, image: "./assets/gold-2.png" },
        { id: "18k", name: "18 Karat", tag: "Hallmarked", rate: 9825, change: -120, image: "./assets/gold-3.png" },
        { id: "trad", name: "Traditional", tag: "Sanaton method", rate: 8105, change: 95, image: "./assets/gold.png" },
      ],
    },
    silver: {
      label: "Silver",
      items: [
        { id: "22k", name: "22 Karat", tag: "Hallmarked", rate: 180, change: 2, image: "./assets/gold.png" },
        { id: "21k", name: "21 Karat", tag: "Hallmarked", rate: 172, change: 2, image: "./assets/gold-2.png" },
        { id: "18k", name: "18 Karat", tag: "Hallmarked", rate: 147, change: 1, image: "./assets/gold-3.png" },
        { id: "trad", name: "Traditional", tag: "Sanaton method", rate: 110, change: 0, image: "./assets/gold.png" },
      ],
    },
    platinum: {
      label: "Platinum",
      items: [
        { id: "950", name: "Pt 950", tag: "Hallmarked", rate: 4150, change: -18, image: "./assets/gold.png" },
        { id: "900", name: "Pt 900", tag: "Hallmarked", rate: 3930, change: -17, image: "./assets/gold-2.png" },
        { id: "850", name: "Pt 850", tag: "Hallmarked", rate: 3710, change: -16, image: "./assets/gold-3.png" },
        { id: "600", name: "Pt 600", tag: "Jewellery alloy", rate: 2620, change: -11, image: "./assets/gold.png" },
      ],
    },
  };

  // Bangladesh weight units, in grams. 1 bhori = 16 ana = 96 rati = 11.664 g.
  var UNITS = {
    gram: { label: "gram", plural: "gram", grams: 1 },
    bhori: { label: "bhori", plural: "bhori", grams: 11.664 },
    ana: { label: "ana", plural: "ana", grams: 11.664 / 16 },
    rati: { label: "rati", plural: "rati", grams: 11.664 / 96 },
  };

  var root = document.getElementById("metal-rates");
  if (!root) return;

  var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-metal]"));
  var panel = document.getElementById("metal-rates-panel");
  var cardsEl = root.querySelector("[data-metal-cards]");
  var categoryEl = root.querySelector("[data-calc-category]");
  var weightEl = root.querySelector("[data-calc-weight]");
  var unitEl = root.querySelector("[data-calc-unit]");
  var helperEl = root.querySelector("[data-calc-helper]");
  var totalEl = root.querySelector("[data-calc-total]");
  var breakdownEl = root.querySelector("[data-calc-breakdown]");

  var TAKA = '<span class="font-bangla">৳</span>';
  var money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  var qty = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 });

  var current = "gold";

  function arrowSvg(dir) {
    var d =
      dir === "up"
        ? "M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
        : dir === "down"
          ? "M12 4.5v15m0 0l-6.75-6.75M12 19.5l6.75-6.75"
          : "M4.5 12h15";
    return (
      '<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="' + d + '"/></svg>'
    );
  }

  function changeBadge(item) {
    var dir = item.change > 0 ? "up" : item.change < 0 ? "down" : "flat";
    var prev = item.rate - item.change;
    var pct = prev ? Math.abs((item.change / prev) * 100).toFixed(1) : "0.0";
    var srText = dir === "up" ? "Up" : dir === "down" ? "Down" : "No change";
    var amount = dir === "flat" ? "No change" : TAKA + money.format(Math.abs(item.change)) + " · " + pct + "%";
    return (
      '<span class="metal-card__change metal-card__change--' + dir + '">' +
      arrowSvg(dir) + '<span class="sr-only">' + srText + " </span>" + amount +
      "</span>"
    );
  }

  function renderCards(metalKey) {
    var metal = RATES[metalKey];
    cardsEl.innerHTML = metal.items
      .map(function (item) {
        var perBhori = Math.round(item.rate * UNITS.bhori.grams);
        return (
          '<article class="metal-card metal-card--' + metalKey + '">' +
          '<span class="metal-card__shine" aria-hidden="true"></span>' +
          '<div class="metal-card__top">' +
          '<div class="metal-card__media" aria-hidden="true">' +
          '<span class="metal-card__glow"></span>' +
          '<img class="metal-card__img" src="' + item.image + '" alt="" loading="lazy" />' +
          '<span class="metal-card__sparkle metal-card__sparkle--1"></span>' +
          '<span class="metal-card__sparkle metal-card__sparkle--2"></span>' +
          '<span class="metal-card__sparkle metal-card__sparkle--3"></span>' +
          "</div>" +
          changeBadge(item) +
          "</div>" +
          '<div class="metal-card__eyebrow"><span class="metal-card__dot" aria-hidden="true"></span>' + metal.label + "</div>" +
          '<h3 class="metal-card__name">' + item.name + ' <span class="metal-card__tag">' + item.tag + "</span></h3>" +
          '<div class="metal-card__price"><span class="metal-card__amount"><span class="font-bangla">৳</span>' + money.format(item.rate) + '</span><span class="metal-card__per">/ gram</span></div>' +
          '<div class="metal-card__foot">' +
          '<span>Per bhori</span><strong>' + TAKA + money.format(perBhori) + "</strong>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderCategories(metalKey) {
    var metal = RATES[metalKey];
    categoryEl.innerHTML = metal.items
      .map(function (item) {
        return '<option value="' + item.id + '">' + metal.label + " · " + item.name + "</option>";
      })
      .join("");
  }

  function calculate() {
    var metal = RATES[current];
    var item = metal.items.filter(function (i) { return i.id === categoryEl.value; })[0] || metal.items[0];
    var unit = UNITS[unitEl.value] || UNITS.gram;
    var weight = parseFloat(weightEl.value);
    var valid = isFinite(weight) && weight > 0;

    weightEl.setAttribute("aria-invalid", String(!valid && weightEl.value !== ""));

    if (!valid) {
      helperEl.textContent = "Enter a weight above 0";
      totalEl.innerHTML = TAKA + "0";
      breakdownEl.innerHTML = TAKA + money.format(item.rate) + " per gram";
      return;
    }

    var grams = weight * unit.grams;
    var total = Math.round(grams * item.rate);

    helperEl.textContent =
      unitEl.value === "gram"
        ? "≈ " + (grams / UNITS.bhori.grams).toFixed(2) + " bhori"
        : "≈ " + qty.format(grams) + " gram";

    totalEl.innerHTML = TAKA + money.format(total);
    breakdownEl.innerHTML =
      qty.format(grams) + " gram × " + TAKA + money.format(item.rate) + " per gram";
  }

  function selectTab(tab, focus) {
    current = tab.getAttribute("data-metal");
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (panel) panel.setAttribute("aria-labelledby", tab.id);
    if (focus) tab.focus();
    if (cardsEl) renderCards(current); // calculator-only pages (price page modal) have no cards
    renderCategories(current);
    calculate();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        selectTab(next, true);
      }
    });
  });

  [categoryEl, unitEl].forEach(function (el) { el.addEventListener("change", calculate); });
  weightEl.addEventListener("input", calculate);

  selectTab(tabs[0]);

  // Calculator in a native <dialog> (price page): open buttons, close button, backdrop click.
  var modal = document.getElementById("calc-modal");
  if (modal && typeof modal.showModal === "function") {
    var opener = null;

    Array.prototype.forEach.call(document.querySelectorAll("[data-calc-open]"), function (btn) {
      btn.addEventListener("click", function () {
        opener = btn;
        modal.showModal();
        document.documentElement.classList.add("calc-modal-open");
        weightEl.focus();
        weightEl.select();
      });
    });

    Array.prototype.forEach.call(modal.querySelectorAll("[data-calc-close]"), function (btn) {
      btn.addEventListener("click", function () { modal.close(); });
    });

    // A click on the dialog box itself (not its content) is a click on the backdrop.
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close();
    });

    modal.addEventListener("close", function () {
      document.documentElement.classList.remove("calc-modal-open");
      if (opener) opener.focus({ preventScroll: true });
    });
  }
})();
