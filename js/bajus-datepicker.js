/**
 * Shared Flatpickr init with BAJUS year dropdown (matches dashboard-contacts Add Contact).
 * Requires flatpickr to be loaded on the page.
 *
 * Markup: <input class="bajus-datepicker" data-fp-year-start="…" data-fp-year-end="…" data-fp-change="fnName" data-fp-default="YYYY-MM-DD" />
 */
(function (global) {
  function syncYearDropdown(fp) {
    const select =
      fp.calendarContainer &&
      fp.calendarContainer.querySelector("select.bajus-year-select");
    if (select) select.value = String(fp.currentYear);
  }

  function attachYearDropdown(fp, yearStart, yearEnd) {
    const yearInput = fp.currentYearElement;
    if (!yearInput || !yearInput.parentNode) return;
    const wrapper = yearInput.parentNode;
    if (wrapper.dataset.yearDropdown === "1") {
      syncYearDropdown(fp);
      return;
    }
    wrapper.dataset.yearDropdown = "1";
    wrapper.classList.add("bajus-year-dropdown-wrap");
    yearInput.style.display = "none";
    wrapper.querySelectorAll(".arrowUp, .arrowDown").forEach((el) => {
      el.style.display = "none";
    });

    const select = document.createElement("select");
    select.className = "bajus-year-select";
    select.setAttribute("aria-label", "Select year");
    for (let year = yearStart; year <= yearEnd; year++) {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      select.appendChild(option);
    }
    select.value = String(fp.currentYear);
    select.addEventListener("change", () => {
      fp.changeYear(Number(select.value));
    });
    wrapper.appendChild(select);
  }

  function withYearDropdown(baseOpts, yearStart, yearEnd) {
    const prevReady = [].concat(baseOpts.onReady || []);
    const prevYear = [].concat(baseOpts.onYearChange || []);
    const prevOpen = [].concat(baseOpts.onOpen || []);
    return Object.assign({}, baseOpts, {
      monthSelectorType: "dropdown",
      onReady: [
        ...prevReady,
        function (_d, _s, fp) {
          attachYearDropdown(fp, yearStart, yearEnd);
        },
      ],
      onYearChange: [
        ...prevYear,
        function (_d, _s, fp) {
          syncYearDropdown(fp);
        },
      ],
      onOpen: [
        ...prevOpen,
        function (_d, _s, fp) {
          syncYearDropdown(fp);
        },
      ],
    });
  }

  function getIsoDate(el) {
    if (!el) return "";
    if (el._flatpickr) {
      const fp = el._flatpickr;
      if (!fp.selectedDates.length) return "";
      return flatpickr.formatDate(fp.selectedDates[0], "Y-m-d");
    }
    return el.value || "";
  }

  function setIsoDate(el, iso) {
    if (!el) return;
    if (el._flatpickr) {
      if (iso) el._flatpickr.setDate(iso, false);
      else el._flatpickr.clear();
      return;
    }
    el.value = iso || "";
  }

  function prepareClonedDateInputs(root) {
    if (!root) return;
    root.querySelectorAll(".bajus-datepicker").forEach((input) => {
      if (input._flatpickr) {
        try {
          input._flatpickr.destroy();
        } catch (_e) {
          /* ignore */
        }
      }
      input.classList.remove("flatpickr-input", "active");
      input.removeAttribute("readonly");
      input.value = "";
    });
  }

  function initDatepickers(root, extraOpts) {
    if (typeof flatpickr === "undefined") {
      console.warn("bajus-datepicker: flatpickr is not loaded");
      return [];
    }
    const scope = root || document;
    const nowYear = new Date().getFullYear();
    const instances = [];
    const hasPh = !!document.querySelector(
      'link[href*="phosphor"], link[href*="@phosphor"]',
    );

    scope.querySelectorAll(".bajus-datepicker").forEach((input) => {
      if (input._flatpickr) {
        instances.push(input._flatpickr);
        return;
      }

      const yearStart = Number(input.dataset.fpYearStart || nowYear - 5);
      const yearEnd = Number(input.dataset.fpYearEnd || nowYear + 40);
      const changeName = input.dataset.fpChange;
      const defaultDate =
        input.dataset.fpDefault || (input.value ? input.value : null);

      const onChange = [].concat((extraOpts && extraOpts.onChange) || []);
      onChange.push(function () {
        if (changeName && typeof global[changeName] === "function") {
          global[changeName]();
        }
      });

      const base = Object.assign(
        {
          dateFormat: "j M Y",
          disableMobile: true,
          allowInput: false,
          animate: true,
          nextArrow: hasPh
            ? '<i class="ph ph-caret-right"></i>'
            : "&rsaquo;",
          prevArrow: hasPh
            ? '<i class="ph ph-caret-left"></i>'
            : "&lsaquo;",
        },
        extraOpts || {},
        {
          onChange: onChange,
        },
      );

      if (defaultDate) base.defaultDate = defaultDate;

      const fp = flatpickr(input, withYearDropdown(base, yearStart, yearEnd));
      instances.push(fp);
    });

    return instances;
  }

  global.bajusWithYearDropdown = withYearDropdown;
  global.bajusInitDatepickers = initDatepickers;
  global.bajusGetIsoDate = getIsoDate;
  global.bajusSetIsoDate = setIsoDate;
  global.bajusPrepareClonedDateInputs = prepareClonedDateInputs;
})(window);
