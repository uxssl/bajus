/* BAJUS — Constitution & Bylaws member download access. */

(function () {
  const LOGIN_KEY = "bajus_member_logged_in";
  const PAID_KEY = "bajus_constitution_paid";
  const PDF_PATH = "./assets/documents/bajus-constitution.pdf";

  function isLoggedIn() {
    return sessionStorage.getItem(LOGIN_KEY) === "1";
  }

  function hasPaid() {
    return localStorage.getItem(PAID_KEY) === "1";
  }

  function setPaid() {
    localStorage.setItem(PAID_KEY, "1");
  }

  function triggerDownload() {
    alert(
      "Your BAJUS Constitution & Bylaws (PDF) download is starting. Save the file for your records.",
    );
    window.open(PDF_PATH, "_blank", "noopener,noreferrer");
  }

  function openPaymentModal() {
    const modal = document.getElementById("constitution-payment-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closePaymentModal() {
    const modal = document.getElementById("constitution-payment-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function initPaymentModal() {
    const modal = document.getElementById("constitution-payment-modal");
    if (!modal) return;

    modal.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closePaymentModal);
    });

    modal.querySelectorAll(".constitution-payment-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        modal
          .querySelectorAll(".constitution-payment-option")
          .forEach((option) => option.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });

    document
      .getElementById("constitution-confirm-pay-btn")
      ?.addEventListener("click", () => {
        setPaid();
        closePaymentModal();
        window.setTimeout(triggerDownload, 400);
      });
  }

  function initConstitutionAccess() {
    if (!document.getElementById("constitution")) return;

    document
      .getElementById("constitution-download-btn")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
        if (!isLoggedIn()) {
          window.location.href =
            "./login.html?return=about.html%23constitution";
          return;
        }
        if (!hasPaid()) {
          openPaymentModal();
          return;
        }
        triggerDownload();
      });

    initPaymentModal();

    if (window.location.hash === "#constitution") {
      document
        .getElementById("constitution")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  window.bajusIsMemberLoggedIn = isLoggedIn;
  window.bajusCompleteMemberLogin = function (returnUrl) {
    sessionStorage.setItem(LOGIN_KEY, "1");
    if (!sessionStorage.getItem("bajus_dashboard_member")) {
      sessionStorage.setItem(
        "bajus_dashboard_member",
        JSON.stringify({
          name: "Md. Alamgir",
          memberId: "BAJUS-DH-001247",
          photo: "./assets/members/mohammed_morshed_alam.jpg",
        }),
      );
    }
    window.location.href = returnUrl || "dashboard.html";
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConstitutionAccess);
  } else {
    initConstitutionAccess();
  }
})();
