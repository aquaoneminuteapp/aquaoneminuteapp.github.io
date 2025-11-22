/* ============================================================
   AquaGuide – files.js
   ------------------------------------------------------------
   Handles:
   ✔ Opening PDF / document viewer modal
   ✔ Closing modal
   ✔ Abstraction: openFileItem(title, url)
   ✔ Supports Firebase Storage OR external URLs
   ============================================================ */


/* ============================================================
   OPEN FILE / PDF VIEWER
   ============================================================ */

export function openFileItem(title, url) {
  const modal = document.getElementById("pdf-modal");
  const iframe = document.getElementById("pdf-iframe");
  const titleEl = document.getElementById("pdf-title");

  if (!url) {
    console.error("openFileItem() called without valid file URL");
    return;
  }

  titleEl.textContent = title || "Document";

  // Load URL into iframe
  iframe.src = url;

  modal.classList.remove("hidden");
}


/* ============================================================
   CLOSE PDF MODAL
   ============================================================ */

export function closePdf() {
  const modal = document.getElementById("pdf-modal");
  const iframe = document.getElementById("pdf-iframe");

  iframe.src = "";  // Stop rendering and release resources
  modal.classList.add("hidden");
}


/* ============================================================
   Expose functions globally for UI buttons
   ============================================================ */

window.openFileItem = openFileItem;
window.closePdfModal = closePdf;
