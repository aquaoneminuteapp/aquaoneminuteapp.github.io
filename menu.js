/* ============================================================
   AquaGuide – menu.js
   ------------------------------------------------------------
   Responsible for:
   ✔ Rendering home screen cards
   ✔ Loading category detail view
   ✔ Rendering submenus, videos, and files
   ✔ Triggering video and PDF modals
   ============================================================ */

import {
  db,
  collection,
  doc,
  getDoc
} from "./firebase.js";

import { openVideo } from "./video.js";
import { openFileItem } from "./files.js";


/* ============================================================
   RENDER HOME MENU CARDS
   ============================================================ */

export function loadMenuCards(menuData) {

  const container = document.getElementById("menu-cards");
  container.innerHTML = "";

  menuData.forEach(item => {

    const card = document.createElement("div");
    card.className = "ios-card cursor-pointer fade-in";

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-lg font-semibold text-gray-800">${item.title}</span>
          <span class="text-sm text-gray-500 mt-1">${item.subtitle || ""}</span>
        </div>
        <i data-lucide="chevron-right" class="w-6 h-6 text-gray-500"></i>
      </div>
    `;

    card.onclick = () => {
      openMenuCategory(item.id);
      lucide.createIcons();
    };

    container.appendChild(card);
  });

  lucide.createIcons();
}



/* ============================================================
   OPEN A CATEGORY
   ------------------------------------------------------------
   Fetches menu item from Firestore and shows the detail page.
   ============================================================ */

export async function openMenuCategory(menuId) {

  const ref = doc(db, "menus", menuId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Category not found.");
    return;
  }

  const item = snap.data();
  console.log("OPEN CATEGORY:", item);

  // Open detail screen
  openDetailPage(item.title);

  const content = document.getElementById("detail-content");
  content.innerHTML = "";

  /* ------------------------------------------
     Render Submenu Text Blocks (if any)
     ------------------------------------------ */
  if (item.items && item.items.length > 0) {

    item.items.forEach(sub => {
      const block = document.createElement("div");
      block.className = "ios-card mb-4";

      block.innerHTML = `
        <p class="text-lg font-semibold text-gray-800 mb-1">${sub.title}</p>
        <p class="text-gray-700 leading-relaxed">${sub.content || ""}</p>
      `;

      content.appendChild(block);
    });
  }


  /* ------------------------------------------
     Render Videos (if any)
     ------------------------------------------ */
  if (item.videos && item.videos.length > 0) {

    const header = document.createElement("h3");
    header.className = "text-xl font-bold text-gray-800 mt-6 mb-3 px-1";
    header.textContent = "Videos";
    content.appendChild(header);

    item.videos.forEach(v => {

      const vCard = document.createElement("div");
      vCard.className = "video-card cursor-pointer";

      vCard.innerHTML = `
        <div class="video-thumbnail">
          <img src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg">
          <div class="video-play-icon">
            <i data-lucide="play" class="w-6 h-6 text-gray-800"></i>
          </div>
        </div>
        <p class="mt-2 text-gray-800 font-semibold">${v.title}</p>
      `;

      vCard.onclick = () => openVideo(v.title, v.youtubeId);

      content.appendChild(vCard);
    });
  }


  /* ------------------------------------------
     Render Files (PDFs, Docs)
     ------------------------------------------ */
  if (item.files && item.files.length > 0) {

    const header = document.createElement("h3");
    header.className = "text-xl font-bold text-gray-800 mt-8 mb-3 px-1";
    header.textContent = "Downloads & Documents";
    content.appendChild(header);

    item.files.forEach(f => {

      const fCard = document.createElement("div");
      fCard.className = "ios-card mb-3 cursor-pointer";

      fCard.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-gray-800 font-semibold">${f.title}</span>
          <i data-lucide="file-text" class="w-6 h-6 text-gray-700"></i>
        </div>
      `;

      fCard.onclick = () => openFileItem(f.title, f.url);

      content.appendChild(fCard);
    });
  }

  lucide.createIcons();
}


/* ============================================================
   EXPORTS
   ============================================================ */

export default {
  loadMenuCards,
  openMenuCategory
};
