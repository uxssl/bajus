/* BAJUS — Official Gold & Silver Price PDF (single A4 portrait page). */
(function () {
  const GOLD = [184, 134, 11];
  const CHARCOAL = [26, 26, 26];
  const TEXT = [39, 39, 42];
  const MUTED = [113, 113, 122];
  const BORDER = [228, 228, 231];
  const CREAM = [252, 250, 242];

  function parsePriceTable(tableEl) {
    if (!tableEl) return [];
    return Array.from(tableEl.querySelectorAll("tbody tr")).map(function (row) {
      const cells = row.querySelectorAll("td");
      const gramCell = row.querySelector(".gp-cell-gram") || cells[2];
      const bhoriCell = row.querySelector(".gp-cell-bhori") || cells[3];
      return {
        product: cells[0] ? cells[0].textContent.trim() : "",
        description: cells[1] ? cells[1].textContent.trim() : "",
        gram: gramCell ? extractAmount(gramCell.textContent) : "",
        bhori: bhoriCell ? extractAmount(bhoriCell.textContent) : "",
      };
    });
  }

  function extractAmount(priceText) {
    const match = priceText.match(/[\d,]+/);
    return match ? match[0] : priceText;
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          w: img.naturalWidth,
          h: img.naturalHeight,
        });
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  function setButtonLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.dataset.gpPdfOriginal = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="ph ph-hourglass"></i> Generating PDF...';
    } else {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.gpPdfOriginal || btn.innerHTML;
    }
  }

  function drawSectionTitle(doc, title, y, margin) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
    doc.text(title, margin, y + 5);
    return y + 10;
  }

  function drawRatesTable(doc, rates, startY, margin, contentW, options) {
    const colProduct = margin + 3;
    const colDesc = margin + 46;
    const colGram = margin + contentW - 52;
    const colBhori = margin + contentW - 3;
    const rowH = options.rowH || 11;
    const headerH = 9;
    const priceSize = options.priceSize || 13;
    let y = startY;

    doc.setFillColor(options.headerBg[0], options.headerBg[1], options.headerBg[2]);
    doc.rect(margin, y, contentW, headerH, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(options.headerText[0], options.headerText[1], options.headerText[2]);
    doc.text("PRODUCT", colProduct, y + 6);
    doc.text("DESCRIPTION", colDesc, y + 6);
    doc.text("PER GRAM", colGram, y + 6, { align: "right" });
    doc.text("PER BHORI", colBhori, y + 6, { align: "right" });
    y += headerH;

    rates.forEach(function (item, i) {
      const bg = i % 2 === 0 ? [255, 255, 255] : [252, 250, 245];
      doc.setFillColor(bg[0], bg[1], bg[2]);
      doc.rect(margin, y, contentW, rowH, "F");
      doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
      doc.setLineWidth(0.2);
      doc.line(margin, y + rowH, margin + contentW, y + rowH);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
      doc.text(item.product, colProduct, y + 7.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      const desc =
        item.description.length > 22
          ? item.description.slice(0, 21) + "…"
          : item.description;
      doc.text(desc, colDesc, y + 7.5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(priceSize);
      doc.setTextColor(options.priceColor[0], options.priceColor[1], options.priceColor[2]);
      doc.text("Tk. " + item.gram, colGram, y + 8, { align: "right" });

      doc.setFontSize(priceSize + 0.5);
      doc.text("Tk. " + item.bhori, colBhori, y + 8, { align: "right" });

      y += rowH;
    });

    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.setLineWidth(0.4);
    doc.rect(margin, startY, contentW, y - startY, "S");

    return y + 4;
  }

  function drawFooter(doc, margin, contentW, pageH) {
    const footerY = pageH - 14;
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, margin + contentW, footerY - 3);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(
      "Published by BAJUS Standing Committee on Pricing & Price Monitoring",
      margin + contentW / 2,
      footerY,
      { align: "center" }
    );
    doc.text(
      "www.bajus.org.bd  |  Print on A4 and display at shop counter",
      margin + contentW / 2,
      footerY + 4,
      { align: "center" }
    );
  }

  async function downloadGoldPricePdf(triggerBtn) {
    const jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) {
      if (typeof showToast === "function") {
        showToast("PDF download is unavailable right now.", "error");
      }
      return;
    }

    const dateEl = document.getElementById("gp-effective-date-text");
    const goldTable = document.getElementById("gp-gold-table");
    const silverTable = document.getElementById("gp-silver-table");
    const effectiveDate = dateEl
      ? dateEl.textContent.trim()
      : new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

    const goldRates = parsePriceTable(goldTable);
    const silverRates = parsePriceTable(silverTable);

    if (!goldRates.length && !silverRates.length) {
      if (typeof showToast === "function") {
        showToast("No price data available to export.", "error");
      }
      return;
    }

    setButtonLoading(triggerBtn, true);

    try {
      let logo = null;
      try {
        logo = await loadImage("./assets/logo.png");
      } catch (_) {
        /* logo optional */
      }

      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 12;
      const contentW = pageW - margin * 2;

      doc.setFillColor(CREAM[0], CREAM[1], CREAM[2]);
      doc.rect(0, 0, pageW, pageH, "F");

      /* Compact header — logo + title only */
      const headerH = 32;
      doc.setFillColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
      doc.rect(0, 0, pageW, headerH, "F");
      doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.rect(0, headerH, pageW, 1.8, "F");

      const title = "Official Daily Gold & Silver Rate Notice";
      let headerX = margin;
      if (logo) {
        const logoH = 18;
        const logoW = (logo.w / logo.h) * logoH;
        doc.addImage(logo.dataUrl, "PNG", headerX, (headerH - logoH) / 2, logoW, logoH);
        headerX += logoW + 8;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(title, headerX, headerH / 2 + 1.5);

      let y = headerH + 6;

      /* Effective date — compact strip */
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.setLineWidth(0.6);
      doc.roundedRect(margin, y, contentW, 14, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.text("EFFECTIVE DATE:", margin + 6, y + 9);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(TEXT[0], TEXT[1], TEXT[2]);
      doc.text(effectiveDate, margin + contentW - 6, y + 9.5, { align: "right" });

      y += 20;

      /* Gold rates table */
      if (goldRates.length) {
        y = drawSectionTitle(doc, "GOLD PRICE", y, margin);
        y = drawRatesTable(doc, goldRates, y, margin, contentW, {
          rowH: 12,
          priceSize: 14,
          headerBg: GOLD,
          headerText: [255, 255, 255],
          priceColor: GOLD,
        });
        y += 3;
      }

      /* Silver rates table */
      if (silverRates.length) {
        y = drawSectionTitle(doc, "SILVER PRICE", y, margin);
        y = drawRatesTable(doc, silverRates, y, margin, contentW, {
          rowH: 11,
          priceSize: 12.5,
          headerBg: [82, 82, 91],
          headerText: [255, 255, 255],
          priceColor: TEXT,
        });
      }

      drawFooter(doc, margin, contentW, pageH);

      const safeDate = effectiveDate
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
      doc.save("bajus-gold-price-" + (safeDate || "rate") + ".pdf");

      if (typeof showToast === "function") {
        showToast("PDF downloaded successfully.");
      }
    } catch (err) {
      console.error(err);
      if (typeof showToast === "function") {
        showToast("Could not generate PDF. Please try again.", "error");
      }
    } finally {
      setButtonLoading(triggerBtn, false);
    }
  }

  window.bajusDownloadGoldPricePdf = downloadGoldPricePdf;

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-gp-download-pdf]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        downloadGoldPricePdf(btn);
      });
    });
  });
})();
