/* Render BAJUS Founder Panel on about.html */
(function () {
  function renderFounderPanel() {
    const grid = document.getElementById("founder-panel-grid");
    const founders = window.BAJUS_FOUNDERS;

    if (!grid || !Array.isArray(founders) || !founders.length) return;

    grid.innerHTML = founders
      .map(function (founder, index) {
        const delay = (index % 7) * 50;
        const name = founder.name || "";
        const photo = founder.photo || "./assets/members/no_photo.jpg";

        return (
          '<article class="founder-card reveal" data-reveal-delay="' +
          delay +
          '">' +
          '<div class="founder-card__photo">' +
          '<img src="' +
          photo +
          '" alt="' +
          name +
          '" loading="lazy" />' +
          "</div>" +
          '<h3 class="founder-card__name font-serif">' +
          name +
          "</h3>" +
          "</article>"
        );
      })
      .join("");

    if (typeof window.bajusObserveReveal === "function") {
      window.bajusObserveReveal(grid);
    }
  }

  document.addEventListener("DOMContentLoaded", renderFounderPanel);
})();
