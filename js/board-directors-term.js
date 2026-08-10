/* Render Board of Directors 2025–2027 grid (adviser-card layout). */
(function () {
  function renderBoardDirectorsTerm() {
    const grid = document.getElementById("board-directors-term-grid");
    const directors = window.BAJUS_BOARD_DIRECTORS_TERM;

    if (!grid || !Array.isArray(directors) || !directors.length) return;

    grid.innerHTML = directors
      .map(function (director, index) {
        const delay = (index % 4) * 100;
        const name = director.name || "";
        const photo = director.photo || "./assets/members/no_photo.jpg";
        const role = director.role || "";

        return (
          '<article class="adviser-card board-member-card reveal" data-reveal-delay="' +
          delay +
          '">' +
          '<div class="adviser-card__photo">' +
          '<img src="' +
          photo +
          '" alt="' +
          name +
          '" loading="lazy" />' +
          "</div>" +
          '<div class="adviser-card__body">' +
          '<h3 class="adviser-card__name board-member-card__name font-serif">' +
          name +
          "</h3>" +
          '<div class="adviser-card__role board-member-card__role">' +
          role +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    if (typeof window.bajusInitBoardMemberCards === "function") {
      window.bajusInitBoardMemberCards();
    }

    if (typeof window.bajusObserveReveal === "function") {
      window.bajusObserveReveal(grid);
    }
  }

  document.addEventListener("DOMContentLoaded", renderBoardDirectorsTerm);
})();
