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

// Build gallery
images.forEach(name => {
  const img = document.createElement("img");
  img.src = `images/thumbs/${name}.webp`;
  img.dataset.full = `images/full/${name}.JPG`;
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