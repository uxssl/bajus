/* BAJUS — Page-level scripts: hero slider, reveal animations. */

(function () {
  // Hero slider
  function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length < 2) return;
    let idx = 0;
    function show(i) {
      slides.forEach((s, n) => s.classList.toggle("is-hidden", n !== i));
      document.querySelectorAll(".hero-dot").forEach((d, n) => {
        d.classList.toggle("bg-gold", n === i);
        d.classList.toggle("w-16", n === i);
        d.classList.toggle("bg-white/30", n !== i);
        d.classList.toggle("w-8", n !== i);
      });
    }
    show(0);
    setInterval(() => { idx = (idx + 1) % slides.length; show(idx); }, 6500);

    document.querySelectorAll(".hero-dot").forEach((dot, n) =>
      dot.addEventListener("click", () => { idx = n; show(idx); })
    );
  }

  // Reveal-on-scroll
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
  }

  function initCommitteesAccordion() {
    const headers = document.querySelectorAll('.committee-card__header');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.committee-card');
        if (card) {
          card.classList.toggle('is-collapsed');
        }
      });
    });
  }

  function initCommitteeSearch() {
    const searchInputs = document.querySelectorAll('.committee-search');
    searchInputs.forEach(input => {
      // Hide search if there are no members
      const list = input.closest('.committee-card__body').querySelector('.committee-members-list');
      if (!list || list.children.length === 0) {
        input.parentElement.style.display = 'none';
        return;
      }

      const clearBtn = input.parentElement.querySelector('.clear-search');

      function filterMembers(query) {
        const members = list.querySelectorAll('.committee-member');
        members.forEach(member => {
          const name = member.querySelector('.committee-member__name').textContent.toLowerCase();
          const role = member.querySelector('.committee-member__role').textContent.toLowerCase();
          if (name.includes(query) || role.includes(query)) {
            member.style.display = '';
          } else {
            member.style.display = 'none';
          }
        });

        // Show/hide clear button
        if (clearBtn) {
          if (query.length > 0) {
            clearBtn.classList.remove('hidden');
          } else {
            clearBtn.classList.add('hidden');
          }
        }
      }

      input.addEventListener('input', (e) => {
        filterMembers(e.target.value.toLowerCase());
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          filterMembers('');
          input.focus();
        });
      }
    });
  }

  function init() { initHeroSlider(); initReveal(); initCommitteesAccordion(); initCommitteeSearch(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
