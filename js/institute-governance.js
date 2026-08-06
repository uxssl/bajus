/* Render BAJUS Institute Governance Body */
(function () {
  function renderGovernanceBody() {
    const grid = document.getElementById("institute-governance-grid");
    const members = window.INSTITUTE_GOVERNANCE;

    if (!grid || !Array.isArray(members) || !members.length) return;

    grid.innerHTML = members
      .map(function (member, index) {
        const delay = (index % 5) * 50;
        const name = member.name || "";
        const photo = member.photo || "./assets/members/no_photo.jpg";
        const designation = member.designation || "";

        return (
          '<article class="institute-governance-card reveal" data-reveal-delay="' +
          delay +
          '">' +
          '<div class="institute-governance-card__photo">' +
          '<img src="' +
          photo +
          '" alt="' +
          name +
          '" loading="lazy" />' +
          "</div>" +
          '<h3 class="institute-governance-card__name font-serif">' +
          name +
          "</h3>" +
          (designation
            ? '<div class="institute-governance-card__designation">' +
              designation +
              "</div>"
            : "") +
          "</article>"
        );
      })
      .join("");

    if (typeof window.bajusObserveReveal === "function") {
      window.bajusObserveReveal(grid);
    }
  }

  document.addEventListener("DOMContentLoaded", renderGovernanceBody);
})();
