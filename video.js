/* ============================================================
   AquaGuide – video.js
   ------------------------------------------------------------
   Handles:
   ✔ Opening the YouTube modal
   ✔ Closing modal + stopping playback
   ✔ Clean public function openVideo(title, youtubeId)
   ============================================================ */


/* ============================================================
   OPEN VIDEO MODAL
   ============================================================ */

export function openVideo(title, youtubeId) {
  const modal = document.getElementById("video-modal");
  const iframe = document.getElementById("video-iframe");
  const titleEl = document.getElementById("video-modal-title");

  if (!youtubeId) {
    console.error("openVideo() called without valid YouTube ID");
    return;
  }

  titleEl.textContent = title || "Video";

  // Use YouTube no-cookie embed
  iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&showinfo=0&modestbranding=1&playsinline=1&autoplay=1`;

  modal.classList.remove("hidden");
}


/* ============================================================
   CLOSE VIDEO MODAL
   ============================================================ */

export function closeVideo() {
  const modal = document.getElementById("video-modal");
  const iframe = document.getElementById("video-iframe");

  // Stop video playback
  iframe.src = "";

  modal.classList.add("hidden");
}


/* ============================================================
   Expose close function globally for X button
   ============================================================ */

window.closeVideoModal = closeVideo;
