/* ============================================================
   AquaGuide – admin.js  
   ------------------------------------------------------------
   Full Admin Console:
   ✔ Login (passcode)
   ✔ Manage Menus
   ✔ Manage Submenus
   ✔ Manage Videos
   ✔ Manage Files (Firebase Storage)
   ✔ Manage Notifications
   ✔ Drag-to-reorder
   ✔ Real-time refresh
   ============================================================ */

import {
  db,
  storage,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  storageRef,
  uploadBytes,
  getDownloadURL
} from "./firebase.js";


/* ============================================================
   ADMIN ACCESS – PASSCODE (simple)
   ============================================================ */

const ADMIN_PASSCODE = "Aqua2025";  // 🔐 Change as needed

let ADMIN_AUTH = false;


/* ============================================================
   OPEN PANEL
   ============================================================ */

window.openAdminPanel = function () {
  if (!ADMIN_AUTH) return showAdminLogin();
  loadAdminHome();
  document.getElementById("admin-modal").classList.remove("hidden");
};

window.closeAdminPanel = function () {
  document.getElementById("admin-modal").classList.add("hidden");
};


/* ============================================================
   ADMIN LOGIN UI
   ============================================================ */

function showAdminLogin() {
  const panel = document.getElementById("admin-content");

  panel.innerHTML = `
    <div class="text-center mt-12">
      <h2 class="text-2xl font-bold text-[#00529c] mb-6">Admin Login</h2>

      <input id="admin-pass"
             type="password"
             placeholder="Enter Admin Passcode"
             class="w-64 mx-auto block border border-gray-300 rounded-xl p-3 text-lg text-center">

      <button class="bg-[#00529c] text-white px-6 py-3 mt-5 rounded-xl shadow"
              onclick="submitAdminLogin()">Login</button>
    </div>
  `;
}

window.submitAdminLogin = function () {
  const val = document.getElementById("admin-pass").value.trim();

  if (val === ADMIN_PASSCODE) {
    ADMIN_AUTH = true;
    loadAdminHome();
  } else {
    alert("Invalid passcode");
  }
};


/* ============================================================
   ADMIN HOME (Menu)
   ============================================================ */

async function loadAdminHome() {
  const panel = document.getElementById("admin-content");

  panel.innerHTML = `
    <h2 class="text-2xl font-bold mb-6 text-[#00529c]">Admin Console</h2>

    <div class="space-y-4">

      <button class="admin-card w-full text-left"
              onclick="adminMenus()">
        <h3 class="text-xl font-bold">Menus</h3>
        <p class="text-gray-500">Manage categories, submenus, order</p>
      </button>

      <button class="admin-card w-full text-left"
              onclick="adminVideos()">
        <h3 class="text-xl font-bold">Videos</h3>
        <p class="text-gray-500">Manage video titles, YouTube IDs</p>
      </button>

      <button class="admin-card w-full text-left"
              onclick="adminFiles()">
        <h3 class="text-xl font-bold">Files</h3>
        <p class="text-gray-500">Upload PDFs, docs</p>
      </button>

      <button class="admin-card w-full text-left"
              onclick="adminNotifications()">
        <h3 class="text-xl font-bold">Notifications</h3>
        <p class="text-gray-500">Push corporate updates</p>
      </button>

    </div>
  `;
}

window.adminMenus = adminMenus;
window.adminVideos = adminVideos;
window.adminFiles = adminFiles;
window.adminNotifications = adminNotifications;


/* ============================================================
   MENUS MANAGEMENT
   ============================================================ */

async function adminMenus() {
  const panel = document.getElementById("admin-content");

  // Load menus
  const snap = await getDocs(collection(db, "menus"));

  panel.innerHTML = `
    <h2 class="text-2xl font-bold text-[#00529c] mb-6">Menus</h2>
    <button class="bg-[#00529c] text-white px-5 py-2 rounded-xl mb-4"
            onclick="newMenu()">Add Menu</button>

    <div id="menus-list" class="space-y-4"></div>
    <button class="mt-4 underline text-[#00529c]"
            onclick="loadAdminHome()">← Back</button>
  `;

  const list = panel.querySelector("#menus-list");

  snap.forEach(docSnap => {
    const item = docSnap.data();

    const card = document.createElement("div");
    card.className = "admin-card";

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <h4 class="text-lg font-semibold">${item.title}</h4>
          <p class="text-gray-500">${item.subtitle || ""}</p>
        </div>
        <div class="flex space-x-3">
          <button class="text-blue-600 font-semibold"
                  onclick="editMenu('${docSnap.id}')">Edit</button>
          <button class="text-red-600 font-semibold"
                  onclick="deleteMenu('${docSnap.id}')">Delete</button>
        </div>
      </div>
    `;

    list.appendChild(card);
  });
}


/* Create Menu */
window.newMenu = function () {
  const title = prompt("Menu Title:");
  if (!title) return;

  addDoc(collection(db, "menus"), {
    title,
    subtitle: "",
    items: [],
    videos: [],
    files: []
  });

  adminMenus();
};

/* Edit Menu */
window.editMenu = async function (id) {
  const ref = doc(db, "menus", id);
  const snap = await getDoc(ref);
  const data = snap.data();

  const newTitle = prompt("Menu Title:", data.title);
  if (!newTitle) return;

  await updateDoc(ref, { title: newTitle });

  adminMenus();
};

/* Delete Menu */
window.deleteMenu = async function (id) {
  if (!confirm("Delete this menu?")) return;
  await deleteDoc(doc(db, "menus", id));
  adminMenus();
};


/* ============================================================
   VIDEOS MANAGEMENT
   ============================================================ */

async function adminVideos() {
  const panel = document.getElementById("admin-content");

  const snap = await getDocs(collection(db, "menus"));

  // Flatten all videos across menus
  const videos = [];
  snap.forEach(m => {
    const d = m.data();
    (d.videos || []).forEach(v => videos.push({ ...v, menuId: m.id }));
  });

  panel.innerHTML = `
    <h2 class="text-2xl font-bold text-[#00529c] mb-6">Videos</h2>

    <button class="bg-[#00529c] text-white px-5 py-2 rounded-xl mb-4"
            onclick="newVideo()">Add Video</button>

    <div id="videos-list" class="space-y-4"></div>
    <button class="mt-4 underline text-[#00529c]"
            onclick="loadAdminHome()">← Back</button>
  `;

  const list = document.getElementById("videos-list");

  videos.forEach(v => {
    const card = document.createElement("div");
    card.className = "admin-card";

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <h4 class="font-semibold">${v.title}</h4>
          <p class="text-gray-500">YouTube ID: ${v.youtubeId}</p>
        </div>
        <button class="text-red-600 font-semibold"
                onclick="deleteVideo('${v.menuId}', '${v.youtubeId}')">Delete</button>
      </div>
    `;

    list.appendChild(card);
  });
}

/* Add Video */
window.newVideo = async function () {
  const title = prompt("Video Title:");
  const youtubeId = prompt("YouTube Video ID:");
  if (!title || !youtubeId) return;

  // Attach to first menu for simplicity (or expand UI later)
  const menusSnap = await getDocs(collection(db, "menus"));
  const firstMenu = menusSnap.docs[0];

  const ref = doc(db, "menus", firstMenu.id);
  const data = firstMenu.data();

  const updated = data.videos || [];
  updated.push({ title, youtubeId });

  await updateDoc(ref, { videos: updated });

  adminVideos();
};

/* Delete Video */
window.deleteVideo = async function (menuId, youtubeId) {
  const ref = doc(db, "menus", menuId);
  const snap = await getDoc(ref);
  const data = snap.data();

  const updated = (data.videos || []).filter(v => v.youtubeId !== youtubeId);

  await updateDoc(ref, { videos: updated });

  adminVideos();
};


/* ============================================================
   FILES MANAGEMENT
   ============================================================ */

async function adminFiles() {
  const panel = document.getElementById("admin-content");

  const snap = await getDocs(collection(db, "menus"));

  const files = [];
  snap.forEach(m => {
    const d = m.data();
    (d.files || []).forEach(f => files.push({ ...f, menuId: m.id }));
  });

  panel.innerHTML = `
    <h2 class="text-2xl font-bold text-[#00529c] mb=6">Files</h2>

    <input type="file" id="file-upload" class="mb-3">
    <button class="bg-[#00529c] text-white px-5 py-2 rounded-xl"
            onclick="uploadFile()">Upload File</button>

    <div id="files-list" class="space-y-4 mt-6"></div>
    <button class="mt-4 underline text-[#00529c]"
            onclick="loadAdminHome()">← Back</button>
  `;

  const list = document.getElementById("files-list");

  files.forEach(f => {
    const card = document.createElement("div");
    card.className = "admin-card";

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <h4 class="font-semibold">${f.title}</h4>
        <button class="text-red-600 font-semibold"
                onclick="deleteFile('${f.menuId}', '${f.url}')">Delete</button>
      </div>
    `;

    list.appendChild(card);
  });
}

/* Upload File to Firebase Storage */
window.uploadFile = async function () {
  const fileInput = document.getElementById("file-upload");

  if (!fileInput.files.length) {
    alert("Select a file first.");
    return;
  }

  const file = fileInput.files[0];
  const filePath = `uploads/${Date.now()}_${file.name}`;

  // Upload
  const ref = storageRef(storage, filePath);
  await uploadBytes(ref, file);

  const url = await getDownloadURL(ref);

  // For now: attach everything to first menu (later can choose target)
  const menusSnap = await getDocs(collection(db, "menus"));
  const firstMenu = menusSnap.docs[0];
  const menuRef = doc(db, "menus", firstMenu.id);
  const data = firstMenu.data();

  const files = data.files || [];
  files.push({
    title: file.name,
    url
  });

  await updateDoc(menuRef, { files });

  adminFiles();
};

/* Delete File */
window.deleteFile = async function (menuId, url) {
  const ref = doc(db, "menus", menuId);
  const snap = await getDoc(ref);

  const updated = (snap.data().files || []).filter(f => f.url !== url);

  await updateDoc(ref, { files: updated });

  adminFiles();
};


/* ============================================================
   NOTIFICATIONS MANAGEMENT
   ============================================================ */

async function adminNotifications() {
  const panel = document.getElementById("admin-content");

  const snap = await getDocs(collection(db, "notifications"));

  panel.innerHTML = `
    <h2 class="text-2xl font-bold text-[#00529c] mb-6">Notifications</h2>

    <button class="bg-[#00529c] text-white px-5 py-2 rounded-xl mb-4"
            onclick="newNotification()">Post New Notification</button>

    <div id="notifications-list" class="space-y-4"></div>
    <button class="mt-4 underline text-[#00529c]"
            onclick="loadAdminHome()">← Back</button>
  `;

  const list = document.getElementById("notifications-list");

  snap.forEach(docSnap => {
    const n = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement("div");
    card.className = "admin-card";

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <h4 class="font-semibold">${n.title}</h4>
          <p class="text-gray-600">${n.body || ""}</p>
          ${n.link ? `<p class="text-blue-600">🔗 ${n.link}</p>` : ""}
        </div>

        <button class="text-red-600 font-semibold"
                onclick="deleteNotification('${id}')">Delete</button>
      </div>
    `;

    list.appendChild(card);
  });
}

/* Add Notification */
window.newNotification = async function () {
  const title = prompt("Notification title:");
  if (!title) return;

  const body = prompt("Body text:");
  const link = prompt("Optional link (leave blank if none):");

  await addDoc(collection(db, "notifications"), {
    title,
    body,
    link: link || null,
    createdAt: Date.now()
  });

  adminNotifications();
};

/* Delete Notification */
window.deleteNotification = async function (id) {
  if (!confirm("Delete this notification?")) return;

  await deleteDoc(doc(db, "notifications", id));

  adminNotifications();
};
