async function loadFiles() {
  try {
    const res = await fetch("files.json");
    const files = await res.json();

    const grid = document.getElementById("grid");

    files.forEach((item, i) => {
      const div = document.createElement("div");
      div.className = "item";

      const ext = item.file.split(".").pop().toLowerCase();

      let media;

      // IMAGE
      if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp") {
        media = document.createElement("img");
        media.src = item.file;
        media.loading = "lazy";

        // PDF PREVIEW IN GRID
      } else if (ext === "pdf") {
        media = document.createElement("div");
        media.className = "pdf-preview";
        media.textContent = "📄 PDF";

        // FALLBACK
      } else {
        media = document.createElement("div");
        media.textContent = "Unsupported file";
      }

      // TITLE (auto numbering fallback if missing)
      const title = document.createElement("div");
      title.className = "item-title";
      title.textContent = item.title || `Image ${i + 1}`;

      div.appendChild(media);
      div.appendChild(title);

      // CLICK → LIGHTBOX
      div.onclick = () => openLightbox(item.file, ext);

      grid.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading files:", err);
  }
}

/* =========================
   LIGHTBOX
========================= */

function openLightbox(file, ext) {
  const box = document.getElementById("lightbox");
  const content = document.getElementById("lightboxContent");

  content.innerHTML = "";

  // IMAGE
  if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
    const img = document.createElement("img");
    img.src = file;
    content.appendChild(img);

    // PDF
  } else if (ext === "pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = file + "#toolbar=0&navpanes=0";
    iframe.style.width = "100%";
    iframe.style.height = "80vh";
    iframe.style.border = "none";
    content.appendChild(iframe);
  }

  box.style.display = "flex";
}

/* CLOSE LIGHTBOX */
function closeBox() {
  const box = document.getElementById("lightbox");
  const content = document.getElementById("lightboxContent");

  box.style.display = "none";
  content.innerHTML = "";
}

/* CLOSE ON OUTSIDE CLICK */
document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("lightbox");

  box.addEventListener("click", (e) => {
    if (e.target === box) closeBox();
  });

  loadFiles();
});
