/* BAJUS — Page-level scripts: hero slider, reveal animations. */

window.showToast = function(message, type = 'success') {
  let container = document.getElementById('bajus-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'bajus-toast-container';
    container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'bg-zinc-900 text-cream px-5 py-4 shadow-2xl border-l-4 transform transition-all duration-300 translate-y-8 opacity-0 flex items-center gap-3 w-[320px] pointer-events-auto';
  
  if (type === 'success') {
    toast.classList.add('border-gold');
    toast.innerHTML = `<i class="ph ph-check-circle text-gold text-xl flex-shrink-0"></i> <span class="text-sm font-medium tracking-wide">${message}</span>`;
  } else if (type === 'error') {
    toast.classList.add('border-rose-500');
    toast.innerHTML = `<i class="ph ph-x-circle text-rose-500 text-xl flex-shrink-0"></i> <span class="text-sm font-medium tracking-wide">${message}</span>`;
  } else {
    toast.classList.add('border-zinc-500');
    toast.innerHTML = `<i class="ph ph-info text-zinc-500 text-xl flex-shrink-0"></i> <span class="text-sm font-medium tracking-wide">${message}</span>`;
  }

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-8', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-8', 'opacity-0');
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }, 4000);
};

(function () {
  // Hero slider — Olight: media slide + staggered text fade-up
  function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length < 2) return;

    const DURATION = 1000;
    const AUTO_MS = 6500;
    let idx = 0;
    let busy = false;
    let timer = null;
    const dots = document.querySelectorAll(".hero-dot");

    function updateDots(i) {
      dots.forEach((d, n) => {
        d.classList.remove("is-active", "is-progress");
        d.removeAttribute("aria-current");
        if (n === i) {
          d.classList.add("is-active");
          d.setAttribute("aria-current", "true");
        }
      });
      // Restart progress fill on the active dot (scaleX 0 → 1 over AUTO_MS)
      const active = dots[i];
      if (!active) return;
      void active.offsetWidth;
      requestAnimationFrame(() => {
        active.classList.add("is-progress");
      });
    }

    function startKenBurns(slide) {
      slide.classList.remove("is-kenburns");
      void slide.offsetWidth;
      slide.classList.add("is-kenburns");
    }

    function goTo(nextIdx) {
      if (busy || nextIdx === idx || nextIdx < 0 || nextIdx >= slides.length) return;
      busy = true;

      const current = slides[idx];
      const next = slides[nextIdx];

      next.classList.remove("is-leaving", "is-animating", "is-active", "is-kenburns");
      void next.offsetWidth;

      current.classList.add("is-animating");
      next.classList.add("is-animating", "is-active");
      current.classList.remove("is-active", "is-kenburns");
      current.classList.add("is-leaving");

      startKenBurns(next);
      updateDots(nextIdx);

      window.setTimeout(() => {
        current.classList.remove("is-animating");
        void current.offsetWidth;
        current.classList.remove("is-leaving");
        next.classList.remove("is-animating");
        idx = nextIdx;
        busy = false;
      }, DURATION);
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(() => {
        goTo((idx + 1) % slides.length);
      }, AUTO_MS);
    }

    // Reset then activate so first-slide text fade-up plays on load
    slides.forEach((s) => {
      s.classList.remove("is-active", "is-hidden", "is-leaving", "is-animating", "is-kenburns");
    });
    void slides[0].offsetWidth;
    slides[0].classList.add("is-animating", "is-active");
    startKenBurns(slides[0]);
    updateDots(0);
    window.setTimeout(() => slides[0].classList.remove("is-animating"), DURATION);
    schedule();

    dots.forEach((dot, n) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goTo(n);
        schedule();
      });
    });
  }

  // Reveal-on-scroll — Olight-style entrance (opal-move)
  let revealObserver = null;

  function observeRevealElements(root) {
    const scope = root && root.querySelectorAll ? root : document;
    const els = scope.querySelectorAll
      ? scope.querySelectorAll(".reveal:not(.is-visible)")
      : document.querySelectorAll(".reveal:not(.is-visible)");

    if (!els.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              revealObserver.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }

    els.forEach((el) => revealObserver.observe(el));
  }

  function initReveal() {
    observeRevealElements(document);
  }

  window.bajusObserveReveal = observeRevealElements;

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

  // Global Form Validation
  function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      if (form.dataset.skipValidation !== undefined) return;
      // Disable default HTML5 browser bubble tooltips
      form.setAttribute('novalidate', true);
      
      const inputs = form.querySelectorAll('input, select, textarea');
      
      // Find the element right before which to insert the error message.
      // For inputs inside a `relative` wrapper (e.g. with eye-toggle button), 
      // attach after the wrapper div. Otherwise attach after the input itself.
      const getAnchor = (input) => {
        const parent = input.parentElement;
        if (
          parent && (
            parent.classList.contains('relative') ||
            parent.classList.contains('flex') && parent.id && parent.id.includes('otp')
          )
        ) {
          return parent;
        }
        return input;
      };

      const getCustomMessage = (input) => {
        if (input.validity.valueMissing)  return 'This field is required.';
        if (input.validity.typeMismatch) {
          if (input.type === 'email') return 'Please enter a valid email address.';
          if (input.type === 'url')   return 'Please enter a valid URL.';
          return 'Please enter a valid value.';
        }
        if (input.validity.tooShort) return `Minimum ${input.minLength} characters required.`;
        if (input.validity.tooLong)  return `Maximum ${input.maxLength} characters allowed.`;
        if (input.validity.rangeUnderflow) return `Value must be at least ${input.min}.`;
        if (input.validity.rangeOverflow)  return `Value must be at most ${input.max}.`;
        if (input.validity.patternMismatch) return input.title || 'Please match the required format.';
        if (input.validity.badInput)  return 'Invalid input.';
        return input.validationMessage || 'Please fill in this field correctly.';
      };
      
      const showError = (input) => {
        const anchor = getAnchor(input);
        let errorEl = anchor.nextElementSibling;
        
        if (!errorEl || !errorEl.classList.contains('validation-msg')) {
          errorEl = document.createElement('p');
          errorEl.className = 'validation-msg flex items-center gap-1 text-[11px] text-red-500 mt-1.5 font-medium';
          anchor.insertAdjacentElement('afterend', errorEl);
        }
        
        errorEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="shrink-0" width="12" height="12" viewBox="0 0 256 256" fill="currentColor"><path d="M228.9,211.59l-96-176a16,16,0,0,0-27.9,0l-96,176A16,16,0,0,0,22,233.41H234a16,16,0,0,0,13.9-21.82ZM120,104a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"/></svg><span>${getCustomMessage(input)}</span>`;
        
        input.classList.add('!border-red-400');
        input.classList.remove('border-zinc-200');
      };
      
      const clearError = (input) => {
        const anchor = getAnchor(input);
        const errorEl = anchor.nextElementSibling;

        if (errorEl && errorEl.classList.contains('validation-msg')) {
          errorEl.remove();
        }
        
        input.classList.remove('!border-red-400');
        input.classList.add('border-zinc-200');
      };

      const validateInput = (input) => {
        // Skip non-validatable, disabled, readonly, checkbox/radio
        if (
          !input.willValidate ||
          input.disabled ||
          input.readOnly ||
          input.type === 'checkbox' ||
          input.type === 'radio' ||
          input.type === 'file' ||
          input.type === 'hidden'
        ) return true;
        
        if (!input.checkValidity()) {
          showError(input);
          return false;
        } else {
          clearError(input);
          return true;
        }
      };

      // Validate on blur if field has been touched
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          if (input.classList.contains('!border-red-400')) {
            validateInput(input);
          }
        });
        input.addEventListener('blur', () => {
          if (input.value.length > 0 || input.classList.contains('!border-red-400')) {
            validateInput(input);
          }
        });
      });

      // Full form validation on submit (capture phase so it fires before inline onsubmit)
      form.addEventListener('submit', (e) => {
        let isValid = true;
        inputs.forEach(input => {
          if (!validateInput(input)) isValid = false;
        });
        
        if (!isValid) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          // Scroll to and focus first invalid field
          const firstInvalid = form.querySelector('.\\!border-red-400');
          if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => firstInvalid.focus(), 200);
          }
        }
      }, true);
    });
  }

  function init() { 
    initHeroSlider(); 
    initReveal(); 
    initCommitteesAccordion(); 
    initCommitteeSearch(); 
    initFormValidation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
