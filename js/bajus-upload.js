/**
 * Shared document/photo upload tiles with optional selection crop (Cropper.js).
 *
 * Enable crop on a tile: data-crop
 * Optional fixed aspect on tile: data-crop-aspect="1" (square owner photo only).
 */
(function (global) {
  let wired = false;
  let cropperInstance = null;
  let cropObjectUrl = null;
  let cropPending = null;

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

  function ensureCropModal() {
    let modal = document.getElementById("bajus-crop-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "bajus-crop-modal";
    modal.className = "bajus-crop-modal hidden";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "bajus-crop-modal-title");
    modal.innerHTML =
      '<div class="bajus-crop-modal__backdrop" aria-hidden="true"></div>' +
      '<div class="bajus-crop-modal__panel modal-panel">' +
      '<button type="button" class="bajus-crop-modal__close" aria-label="Close crop">&times;</button>' +
      '<div class="bajus-crop-modal__header">' +
      '<p id="bajus-crop-modal-title" class="bajus-crop-modal__title font-serif">Crop Document</p>' +
      '<p class="bajus-crop-modal__hint">Drag to reposition. Resize the selection to keep the area you need.</p>' +
      "</div>" +
      '<div class="bajus-crop-modal__stage">' +
      '<img id="bajus-crop-image" class="bajus-crop-modal__image" alt="Crop preview" />' +
      "</div>" +
      '<div class="bajus-crop-modal__actions">' +
      '<button type="button" class="bajus-crop-modal__cancel btn-outline">Cancel</button>' +
      '<button type="button" class="bajus-crop-modal__apply btn-gold">Apply Crop</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(modal);

    modal.querySelector(".bajus-crop-modal__backdrop").addEventListener("click", () => {
      closeCropModal(true);
    });
    modal.querySelector(".bajus-crop-modal__close").addEventListener("click", () => {
      closeCropModal(true);
    });
    modal.querySelector(".bajus-crop-modal__cancel").addEventListener("click", () => {
      closeCropModal(true);
    });
    modal.querySelector(".bajus-crop-modal__apply").addEventListener("click", () => {
      applyCropSelection();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeCropModal(true);
      }
    });

    return modal;
  }

  function destroyCropper() {
    if (cropperInstance) {
      cropperInstance.destroy();
      cropperInstance = null;
    }
    if (cropObjectUrl) {
      URL.revokeObjectURL(cropObjectUrl);
      cropObjectUrl = null;
    }
  }

  function closeCropModal(cancelled) {
    const modal = document.getElementById("bajus-crop-modal");
    const pending = cropPending;

    destroyCropper();

    if (modal) {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("modal-open");

    cropPending = null;

    if (!pending) return;

    if (cancelled) {
      if (pending.input) pending.input.value = "";
      if (pending.reject) pending.reject(new Error("crop-cancelled"));
    }
  }

  function startCropper(img, tile) {
    const aspectRaw = tile.getAttribute("data-crop-aspect");
    const aspectRatio = aspectRaw ? parseFloat(aspectRaw) : null;

    const cropperOptions = {
      viewMode: 1,
      dragMode: "move",
      autoCropArea: 0.92,
      responsive: true,
      restore: false,
      guides: true,
      center: true,
      highlight: true,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
      background: false,
      modal: true,
    };

    if (Number.isFinite(aspectRatio)) {
      cropperOptions.aspectRatio = aspectRatio;
    }

    cropperInstance = new global.Cropper(img, cropperOptions);
  }

  function applyCropSelection() {
    if (!cropperInstance || !cropPending) return;

    const canvas = cropperInstance.getCroppedCanvas({
      maxWidth: 2400,
      maxHeight: 2400,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (!canvas) {
      closeCropModal(true);
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob || !cropPending) {
          closeCropModal(true);
          return;
        }

        const { input, tile, file, resolve } = cropPending;
        const croppedFile = new File([blob], file.name, {
          type: blob.type || file.type || "image/jpeg",
          lastModified: Date.now(),
        });

        const dt = new DataTransfer();
        dt.items.add(croppedFile);
        input.files = dt.files;

        const previewUrl = URL.createObjectURL(croppedFile);
        const photoTile = tile.closest(".bajus-photo-tile");
        if (photoTile) {
          setPhotoTile(photoTile, previewUrl);
        } else {
          setDocTile(tile, previewUrl);
        }

        resolve(croppedFile);

        cropPending = null;
        destroyCropper();

        const modal = document.getElementById("bajus-crop-modal");
        if (modal) {
          modal.classList.add("hidden");
          modal.setAttribute("aria-hidden", "true");
          document.body.classList.remove("modal-open");
        }
      },
      cropPending.file.type || "image/jpeg",
      0.92,
    );
  }

  function openCropModal(file, tile) {
    if (typeof global.Cropper === "undefined") {
      return Promise.reject(new Error("cropper-unavailable"));
    }

    return new Promise((resolve, reject) => {
      const modal = ensureCropModal();
      const img = modal.querySelector("#bajus-crop-image");
      const title = modal.querySelector("#bajus-crop-modal-title");
      const label = tile.dataset.label || "Document";
      const isSquare = tile.hasAttribute("data-crop-aspect");
      const hint = modal.querySelector(".bajus-crop-modal__hint");

      title.textContent = "Crop " + label;
      if (hint) {
        hint.textContent = isSquare
          ? "Drag to reposition. Selection is locked to a square for your passport photo."
          : "Drag to reposition and resize the selection freely to include the area you need.";
      }
      cropPending = { input: tile.querySelector(".bajus-file-input"), tile, file, resolve, reject };

      destroyCropper();
      cropObjectUrl = URL.createObjectURL(file);
      img.src = cropObjectUrl;

      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      img.onload = function onCropImageLoad() {
        img.onload = null;
        startCropper(img, tile);
      };

      if (img.complete) {
        img.onload = null;
        startCropper(img, tile);
      }
    });
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

  function applyFileToTile(input, file) {
    const objectUrl = URL.createObjectURL(file);
    const photoTile = input.closest(".bajus-photo-tile");
    if (photoTile) {
      setPhotoTile(photoTile, objectUrl);
      return;
    }

    const docTile = input.closest(".bajus-upload-tile");
    if (docTile) setDocTile(docTile, objectUrl);
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
    });
  }

  function tileUsesCrop(tile) {
    return tile && tile.hasAttribute("data-crop");
  }

  function initUploads() {
    ensureLightbox();
    ensureCropModal();
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

      const tile =
        input.closest(".bajus-upload-tile") || input.closest(".bajus-photo-tile");

      if (tileUsesCrop(tile)) {
        if (typeof global.Cropper === "undefined") {
          applyFileToTile(input, file);
          return;
        }

        openCropModal(file, tile).catch(() => {
          input.value = "";
        });
        return;
      }

      applyFileToTile(input, file);
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
