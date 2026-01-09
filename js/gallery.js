const images = [
  "001",
  "002",
  "003",
  "004",
  "005",
  "006",
  "007",
  "008",
  "009",
  "010",
  "011",
  "012",
  "013",
  "014",
  "015",
  "016",
  "017",
  "018",
  "019",
  "020",
  "021",
  "022",
  "023",
  "024",
  "025",
  "026",
  "027",
  "028",
  "029",
  "030",
  "031",
  "032",
  "033",
  "034",
  "035",
  "036",
  "037",
  "038",
  "039",
  "040",
  "041",
  "042",
  "043",
  "044",
  "045",
  "046",
  "047",
  "048",
  "049",
  "050",
  "051",
  "052",
  "053",
  "054",
  "055",
  "056",
  "057",
  "058",
  "059",
  "060",
  "061",
  "062",
  "063",
  "064",
  "065",
  "066",
  "067",
  "068",
  "069",
  "070",
  "071",
  "072",
  "073",
  "074",
  "075",
  "076",
  "077",
  "078",
  "079",
  "080",
  "081",
  "082",
  "083",
  "084",
  "085",
  "086",
  "087"
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".close");
let _lockedScrollY = 0;

function lockScroll() {
  _lockedScrollY = window.scrollY || window.pageYOffset;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${_lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
}

function unlockScroll() {
  // restore
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, _lockedScrollY);
}

// Build gallery
images.forEach(name => {
  const img = document.createElement("img");
  img.src = `images/thumbs/${name}.webp`;
  img.dataset.full = `images/full/${name}.JPG`;
  img.loading = "lazy";
  img.alt = `Artwork ${name} — 山东省实验中学东校 (thumbnail)`;
  img.title = `Artwork ${name}`;

  img.addEventListener("click", () => {
    lightboxImg.src = img.dataset.full;
    lightboxImg.alt = `Artwork ${name} — 山东省实验中学东校 (full size)`;
    lockScroll();
    lightbox.style.display = "flex";
  });

  gallery.appendChild(img);
});

// Close lightbox
closeBtn.onclick = () => {
  unlockScroll();
  lightbox.style.display = "none";
  lightboxImg.src = "";
};

lightbox.onclick = e => {
  if (e.target === lightbox) closeBtn.onclick();
};

const toggle = document.getElementById("theme-toggle");

// Apply saved or system theme, but suppress transitions on load so the
// initial application doesn't animate all thumbnails (which can be slow).
const savedTheme = localStorage.getItem("theme");
document.body.classList.add("no-transitions");
if (savedTheme) {
  document.body.classList.toggle("light", savedTheme === "light");
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  document.body.classList.add("light");
}
// Remove the no-transition class on the next animation frame so normal
// transitions work afterward.
requestAnimationFrame(() => {
  requestAnimationFrame(() => document.body.classList.remove("no-transitions"));
});

// Update icon
function updateIcon() {
  toggle.textContent = document.body.classList.contains("light")
    ? "🌙"
    : "☀️";
}

updateIcon();

// Toggle on click, but temporarily disable transitions to make the switch
// instantaneous (avoids repainting dozens of thumbnails with paint-heavy
// properties).
function toggleThemeInstant() {
  // Suppress transitions first
  document.body.classList.add("no-transitions");

  // Apply the theme change on the next frame so the no-transitions rule
  // is active when the change happens.
  requestAnimationFrame(() => {
    document.body.classList.toggle("light");
    const theme = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", theme);
    updateIcon();

    // Remove the suppression on the following frame so transitions return
    // to normal for user interactions.
    requestAnimationFrame(() => document.body.classList.remove("no-transitions"));
  });
}

toggle.addEventListener("click", toggleThemeInstant);