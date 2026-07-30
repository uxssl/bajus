/**
 * Shared document/photo upload tiles (matches dashboard-contacts Add Contact UX).
 *
 * Photo: .bajus-photo-tile + .bajus-file-input + .bajus-photo-preview / placeholder / replace
 * Docs:  .bajus-upload-tile + .bajus-file-input + .bajus-upload-empty / filled / preview
 */
(function (global) {
  let wired = false;

  function ensureLightbox() {
    let lb = document.getElementById("bajus-upload-lightbox");
    if (lb) return lb;

    lb = document.createElement("div");
    lb.id = "bajus-upload-lightbox";
    lb.className =
      "fixed inset-0 z-[100] hidden items-center justify-center bg-zinc-950/80 p-4";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button type="button" class="bajus-lightbox-close absolute top-4 right-4 text-cream/80 hover:text-cream text-2xl leading-none" aria-label="Close preview">&times;</button>' +
      '<img class="bajus-lightbox-img max-h-[90vh] max-w-[90vw] object-contain shadow-lg" alt="Document preview" />';
    document.body.appendChild(lb);

    function close() {
      lb.classList.add("hidden");
      lb.classList.remove("flex");
      lb.querySelector(".bajus-lightbox-img").src = "";
    }

    lb.addEventListener("click", (e) => {
      if (e.target === lb) close();
    });
    lb.querySelector(".bajus-lightbox-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lb.classList.contains("hidden")) close();
    });

    return lb;
  }

  function openLightbox(src, alt) {
    if (!src) return;
    const lb = ensureLightbox();
    const img = lb.querySelector(".bajus-lightbox-img");
    img.src = src;
    img.alt = alt || "Document preview";
    lb.classList.remove("hidden");
    lb.classList.add("flex");
  }

  function setPhotoTile(tile, url) {
    if (!tile) return;
    const preview = tile.querySelector(".bajus-photo-preview");
    const placeholder = tile.querySelector(".bajus-photo-placeholder");
    const replace = tile.querySelector(".bajus-photo-replace");
    if (url) {
      if (preview) {
        preview.src = url;
        preview.classList.remove("hidden");
      }
      if (placeholder) placeholder.classList.add("hidden");
      if (replace) replace.classList.remove("hidden");
      tile.classList.add("border-gold");
      tile.classList.remove("border-zinc-200");
    } else {
      if (preview) {
        preview.src = "";
        preview.classList.add("hidden");
      }
      if (placeholder) placeholder.classList.remove("hidden");
      if (replace) replace.classList.add("hidden");
      tile.classList.remove("border-gold", "border-gold/50");
      tile.classList.add("border-zinc-200");
    }
  }

  function setDocTile(tile, url) {
    if (!tile) return;
    const empty = tile.querySelector(".bajus-upload-empty");
    const filled = tile.querySelector(".bajus-upload-filled");
    const preview = tile.querySelector(".bajus-upload-preview");
    if (url) {
      if (empty) empty.classList.add("hidden");
      if (filled) filled.classList.remove("hidden");
      if (preview) {
        preview.src = url;
        preview.classList.remove("hidden");
      }
      tile.classList.add("border-gold");
      tile.classList.remove("border-zinc-200");
      tile.dataset.src = url;
    } else {
      if (empty) empty.classList.remove("hidden");
      if (filled) filled.classList.add("hidden");
      if (preview) {
        preview.src = "";
        preview.classList.add("hidden");
      }
      tile.classList.remove("border-gold", "border-gold/50");
      tile.classList.add("border-zinc-200");
      delete tile.dataset.src;
    }
  }

  function resetUploadTiles(root) {
    const scope = root || document;
    scope.querySelectorAll(".bajus-photo-tile").forEach((tile) => {
      const input = tile.querySelector(".bajus-file-input");
      if (input) input.value = "";
      setPhotoTile(tile, null);
    });
    scope.querySelectorAll(".bajus-upload-tile").forEach((tile) => {
      const input = tile.querySelector(".bajus-file-input");
      if (input) input.value = "";
      setDocTile(tile, null);
    });
  }

  function assignUniqueUploadIds(root, prefix) {
    if (!root) return;
    const stamp = prefix || "upload-" + Date.now();
    let n = 0;
    root.querySelectorAll(".bajus-upload-tile, .bajus-photo-tile").forEach((tile) => {
      const input = tile.querySelector(".bajus-file-input");
      if (!input) return;
      n += 1;
      const id = stamp + "-" + n;
      input.id = id;
      tile.querySelectorAll("[for]").forEach((el) => {
        el.setAttribute("for", id);
      });
      if (tile.tagName === "LABEL" && !tile.querySelector(".bajus-upload-empty")) {
        /* photo tile is itself a label wrapping the input — no for needed */
      }
    });
  }

  function initUploads() {
    ensureLightbox();
    if (wired) return;
    wired = true;

    document.addEventListener("change", (e) => {
      const input = e.target.closest(".bajus-file-input");
      if (!input) return;
      const file = input.files && input.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        input.value = "";
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const photoTile = input.closest(".bajus-photo-tile");
      if (photoTile) {
        setPhotoTile(photoTile, objectUrl);
        return;
      }

      const docTile = input.closest(".bajus-upload-tile");
      if (docTile) setDocTile(docTile, objectUrl);
    });

    document.addEventListener("click", (e) => {
      const previewBtn = e.target.closest(".bajus-doc-preview");
      if (!previewBtn) return;
      e.preventDefault();
      const tile = previewBtn.closest(".bajus-upload-tile");
      if (!tile || !tile.dataset.src) return;
      openLightbox(tile.dataset.src, tile.dataset.label || "Document preview");
    });
  }

  global.bajusInitUploads = initUploads;
  global.bajusResetUploadTiles = resetUploadTiles;
  global.bajusAssignUniqueUploadIds = assignUniqueUploadIds;
  global.bajusOpenUploadLightbox = openLightbox;
})(window);
