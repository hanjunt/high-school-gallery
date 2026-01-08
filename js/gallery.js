const images = [
  "DSC00590",
  "DSC00866",
  "DSC01172",
  "DSC01311"
  // ...
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".close");

// Build gallery
images.forEach(name => {
  const img = document.createElement("img");
  img.src = `images/thumbs/${name}.webp`;
  img.dataset.full = `images/full/${name}.jpg`;
  img.loading = "lazy";
  img.alt = name;

  img.addEventListener("click", () => {
    lightboxImg.src = img.dataset.full;
    lightbox.style.display = "flex";
  });

  gallery.appendChild(img);
});

// Close lightbox
closeBtn.onclick = () => {
  lightbox.style.display = "none";
  lightboxImg.src = "";
};

lightbox.onclick = e => {
  if (e.target === lightbox) closeBtn.onclick();
};

const toggle = document.getElementById("theme-toggle");

// Apply saved or system theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.classList.toggle("light", savedTheme === "light");
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  document.body.classList.add("light");
}

// Update icon
function updateIcon() {
  toggle.textContent = document.body.classList.contains("light")
    ? "🌙"
    : "☀️";
}

updateIcon();

// Toggle on click
toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const theme = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("theme", theme);
  updateIcon();
});