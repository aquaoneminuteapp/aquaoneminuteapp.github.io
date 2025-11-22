/* ============================================================
   AquaGuide – app.js
   ------------------------------------------------------------
   Core application controller:
   ✔ Routing (home <-> detail)
   ✔ Global search engine
   ✔ Integrates menu.js, files.js, video.js
   ✔ Controls UI transitions
   ✔ Loads initial content
   ============================================================ */

import {
  db,
  collection,
  getDocs,
} from "./firebase.js";

import { loadMenuCards, openMenuCategory } from "./menu.js";
import { openVideo } from "./video.js";
import { openFileItem } from "./files.js";
import { openNotificationCenter } from "./notifications.js";


/* ============================================================
   GLOBAL STATE
   ============================================================ */

let SEARCH_INDEX = [];   // All searchable content
let MENU_DATA = [];      // Cached menu structure


/* ============================================================
   INIT APP
   Runs once after load
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

  console.log("AquaGuide App: Initializing…");

  await loadInitialMenu();
  setupSearchEngine();

  lucide.createIcons();
});


/* ============================================================
   LOAD MENU FROM FIREBASE
   ============================================================ */

async function loadInitialMenu() {
  try {
    const q = collection(db, "menus");
    const snap = await getDocs(q);

    MENU_DATA = snap.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    console.log("MENU_DATA", MENU_DATA);

    // Render cards on the home screen
    loadMenuCards(MENU_DATA);

  } catch (err) {
    console.error("Error loading menu:", err);
  }
}


/* ============================================================
   SEARCH ENGINE
   Full fuzzy search across:
   - menu titles
   - submenu items
   - videos
   - pdf/files
   - notifications
   ============================================================ */

function setupSearchEngine() {

  console.log("Setting up search index…");

  // Flatten menu for searching
  SEARCH_INDEX = [];

  MENU_DATA.forEach(menuItem => {

    // Card-level keyword
    SEARCH_INDEX.push({
      type: "menu",
      title: menuItem.title,
      id: menuItem.id
    });

    // Submenus
    if (menuItem.items && Array.isArray(menuItem.items)) {
      menuItem.items.forEach(sub => {
        SEARCH_INDEX.push({
          type: "submenu",
          title: sub.title,
          menuId: menuItem.id,
          data: sub
        });
      });
    }

    // Videos
    if (menuItem.videos) {
      menuItem.videos.forEach(v => {
        SEARCH_INDEX.push({
          type: "video",
          title: v.title,
          youtubeId: v.youtubeId,
          menuId: menuItem.id
        });
      });
    }

    // Files
    if (menuItem.files) {
      menuItem.files.forEach(f => {
        SEARCH_INDEX.push({
          type: "file",
          title: f.title,
          url: f.url,
          menuId: menuItem.id
        });
      });
    }

  });

  console.log("Search index built:", SEARCH_INDEX.length, "items");

  // Expose search globally so index.html can call it
  window.aquaSearch = handleSearch;
}


/* ============================================================
   HANDLE SEARCH INPUT
   Called from index.html → handleSearchInput()
   ============================================================ */

function handleSearch(query) {

  const q = query.trim().toLowerCase();
  const container = document.getElementById("search-results");
  container.innerHTML = "";

  if (!q) return;

  const results = SEARCH_INDEX.filter(item =>
    item.title.toLowerCase().includes(q)
  );

  if (results.length === 0) {
    container.innerHTML = document.getElementById("search-empty-template").innerHTML;
    return;
  }

  // Group by type
  const grouped = {
    menu: [],
    submenu: [],
    video: [],
    file: [],
  };

  results.forEach(r => {
    grouped[r.type].push(r);
  });

  renderSearchResults(grouped, container);

  lucide.createIcons();
}


/* ============================================================
   RENDER SEARCH RESULTS (Grouped Sections)
   ============================================================ */

function renderSearchResults(grouped, container) {

  container.innerHTML = "";

  Object.keys(grouped).forEach(type => {

    if (grouped[type].length === 0) return;

    // Section Header
    const header = document.createElement("div");
    header.className = "list-header";
    header.textContent = type.toUpperCase();
    container.appendChild(header);

    // Items
    grouped[type].forEach(item => {

      const row = document.createElement("div");
      row.className = "search-result-item";

      // Label
      const label = document.createElement("span");
      label.textContent = item.title;
      row.appendChild(label);

      // Icon
      const icon = document.createElement("i");
      icon.setAttribute("data-lucide", "chevron-right");
      icon.className = "w-5 h-5 text-gray-500";
      row.appendChild(icon);

      // Click Action
      row.onclick = () => handleSearchClick(item);

      container.appendChild(row);
    });

  });
}


/* ============================================================
   OPEN ITEM BASED ON TYPE
   ============================================================ */

function handleSearchClick(item) {

  closeSearchModal();

  switch (item.type) {

    case "menu":
      openMenuCategory(item.id);
      break;

    case "submenu":
      openDetailPage(item.title);
      document.getElementById("detail-content").innerHTML = `<p>${item.data.content || ""}</p>`;
      break;

    case "video":
      openVideo(item.title, item.youtubeId);
      break;

    case "file":
      openFileItem(item.title, item.url);
      break;
  }
}


/* ============================================================
   EXPORTS (in case modules need them)
   ============================================================ */

export {
  MENU_DATA,
  SEARCH_INDEX,
  handleSearch,
};
