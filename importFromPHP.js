/* ============================================================
   AquaGuide – importFromPHP.js (FINAL)
   ------------------------------------------------------------
   This importer:
   ✔ Loads legacy json.php data (flat array)
   ✔ Groups by aqua_menu (top-level categories)
   ✔ Sorts by aqua_m1
   ✔ Detects item types:
        - images
        - external (www)
        - docs
        - product resources
        - videos
        - notifications
        - calendar
   ✔ Pushes into Firestore in the correct PWA format
   ------------------------------------------------------------
   Run this ONCE in browser console:
       runLegacyImport();
   ============================================================ */

import {
  db,
  collection,
  doc,
  setDoc,
  addDoc
} from "./firebase.js";


/* ============================================================
   1. FETCH LEGACY JSON
   ============================================================ */
async function fetchLegacyJSON() {
  try {
    const res = await fetch("json.php"); // MUST output JSON array
    const data = await res.json();
    console.log("Loaded legacy JSON:", data.length, "records");
    return data;
  } catch (err) {
    console.error("Failed to load json.php:", err);
    alert("Error loading json.php");
    return null;
  }
}


/* ============================================================
   2. TYPE DETECTOR FOR EACH LEGACY ITEM
   ============================================================ */

function detectType(item) {
  const name = item.aqua_name ? item.aqua_name.trim() : "";
  const img = item.aqua_img ? item.aqua_img.trim() : "";
  const m2  = item.aqua_m2 ? item.aqua_m2.trim() : "";

  // Notifications module
  if (name.toUpperCase() === "CORPORATE NOTIFICATIONS")
    return "notifications";

  // Calendar module
  if (name.toUpperCase() === "CALENDAR OF EVENTS")
    return "calendar";

  // Product Related Resources (folder)
  if (name === "Product Related Resources")
    return "product_resources";

  // Videos library folder
  if (name === "Videos")
    return "videos";

  // External website
  if (img === "www")
    return "external";

  // Document / PDF folder
  if (img === "docs")
    return "docs";

  // Image-based content (comma-delimited list)
  if (img.includes(",") || /^[0-9]+(,[0-9]+)*$/.test(img))
    return "images";

  // Fallback = assume image page OR empty-page
  return "images";
}


/* ============================================================
   3. CONVERT A LEGACY ITEM INTO NEW FORMAT
   ============================================================ */

function convertItem(item) {

  const type = detectType(item);
  const order = parseFloat(item.aqua_m1) || 0;

  const output = {
    title: item.aqua_name || "Untitled",
    type,
    order
  };

  switch (type) {

    case "external":
      output.url = item.aqua_m2;
      break;

    case "docs":
      output.folder = item.aqua_m2;
      break;

    case "product_resources":
      output.folder = item.aqua_m2;
      break;

    case "videos":
      output.folder = item.aqua_m2;
      break;

    case "notifications":
      output.isModule = true;
      break;

    case "calendar":
      output.isModule = true;
      break;

    case "images":
      // Convert "23,24,25" → ["23.png","24.png","25.png"]
      const ids = (item.aqua_img || "").split(",").map(v => v.trim()).filter(v => v.length);
      output.images = ids.map(id => `images/${id}.png`);
      break;
  }

  return output;
}


/* ============================================================
   4. GROUP ITEMS BY CATEGORY (aqua_menu)
   ============================================================ */

function groupByMenu(rawArray) {
  const groups = {};

  rawArray.forEach(item => {
    const menu = item.aqua_menu?.trim() || "Uncategorized";

    if (!groups[menu]) groups[menu] = [];

    groups[menu].push(item);
  });

  return groups;
}


/* ============================================================
   5. UPLOAD TO FIRESTORE
   ============================================================ */

async function uploadToFirestore(groups) {

  const menusCol = collection(db, "menus");
  const notificationsCol = collection(db, "notifications");
  const calendarCol = collection(db, "calendar");

  for (const [menuName, items] of Object.entries(groups)) {

    console.log("Uploading category:", menuName, "with", items.length, "items");

    // Build array of converted items
    const converted = items
      .map(convertItem)
      .sort((a, b) => a.order - b.order);

    // Special handling for notifications
    if (menuName.toUpperCase() === "CORPORATE NOTIFICATIONS") {
      for (const n of converted) {
        await addDoc(notificationsCol, {
          title: n.title,
          body: "",
          link: n.url || null,
          createdAt: Date.now()
        });
      }
      continue;
    }

    // Special handling for calendar
    if (menuName.toUpperCase() === "CALENDAR OF EVENTS") {
      await setDoc(doc(calendarCol, "module"), {
        title: "Calendar of Events",
        updatedAt: Date.now()
      });
      continue;
    }

    // Everything else becomes a MENU
    const menuDoc = doc(menusCol, menuName);
    await setDoc(menuDoc, {
      title: menuName,
      subtitle: "",
      items: converted
    });

    console.log("Uploaded menu:", menuName);
  }

  alert("Import complete! Check your Firestore database.");
}


/* ============================================================
   6. RUN IMPORTER
   ============================================================ */

export async function runLegacyImport() {
  console.log("Starting legacy import…");

  const raw = await fetchLegacyJSON();
  if (!raw) return;

  console.log("Grouping by aqua_menu…");
  const groups = groupByMenu(raw);

  console.log("Uploading to Firebase…");
  await uploadToFirestore(groups);
}


/* ============================================================
   7. MAKE FUNCTION PUBLIC
   ============================================================ */

window.runLegacyImport = runLegacyImport;
