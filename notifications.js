/* ============================================================
   AquaGuide – notifications.js
   ------------------------------------------------------------
   Handles:
   ✔ Loading notifications from Firestore
   ✔ Rendering the notification modal
   ✔ Opening and closing the modal
   ✔ Clickable notifications (optional links)
   ============================================================ */

import {
  db,
  collection,
  getDocs
} from "./firebase.js";


/* ============================================================
   LOAD NOTIFICATIONS
   (Called on app init OR when modal opens)
   ============================================================ */

export async function loadNotifications() {
  try {
    const q = collection(db, "notifications");
    const snap = await getDocs(q);

    const list = document.getElementById("notify-list");
    list.innerHTML = "";

    if (snap.empty) {
      list.innerHTML = `
        <p class="text-center text-gray-500 py-10">
          No notifications available.
        </p>
      `;
      return;
    }

    snap.docs.forEach(doc => {
      const data = doc.data();

      const div = document.createElement("div");
      div.className = "ios-card cursor-pointer";

      // If notification has a link
      if (data.link) {
        div.onclick = () => {
          window.open(data.link, "_blank");
        };
      }

      div.innerHTML = `
        <p class="text-lg font-semibold text-gray-800">${data.title || "Notification"}</p>
        <p class="text-gray-600 mt-1">${data.body || ""}</p>
        ${data.link ? `
        <a class="text-[#00529c] font-semibold mt-2 inline-block">
          Open Link →
        </a>` : ""}
      `;

      list.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading notifications:", err);
  }
}


/* ============================================================
   OPEN NOTIFICATION CENTER
   ============================================================ */

export function openNotificationCenter() {
  loadNotifications();
  openNotifyModal();  // defined in index.html's inline JS
}


/* ============================================================
   EXPORTS
   ============================================================ */

export default {
  loadNotifications,
  openNotificationCenter
};
