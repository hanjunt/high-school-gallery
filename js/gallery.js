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
  // Prevent overscroll / pull-to-refresh gestures on mobile while the
  // lightbox is open. This reduces cases where tapping/dragging the
  // backdrop can trigger a reload or navigation on some devices.
  try {
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';
  } catch (e) {
    // ignore if not supported
  }
}

function unlockScroll() {
  // restore
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  try {
    document.documentElement.style.overscrollBehavior = '';
    document.body.style.overscrollBehavior = '';
  } catch (e) {
    // ignore
  }
  window.scrollTo(0, _lockedScrollY);
}

// Build gallery
images.forEach(name => {
  const img = document.createElement("img");
  // Defer setting `src` until the image is near the viewport to avoid
  // loading and decoding many thumbnails at once.
  img.dataset.src = `images/thumbs/${name}.webp`;
  img.dataset.full = `images/full/${name}.JPG`;
  img.loading = "lazy"; // hint for browsers
  img.decoding = "async"; // reduce main-thread decode blocking
  img.alt = `Artwork ${name} — 山东省实验中学东校 (thumbnail)`;
  img.title = `Artwork ${name}`;

  // When clicked, show the lightbox using the thumbnail immediately,
  // but preload the full image off-DOM to avoid freezing the UI while
  // the browser decodes a large image. Only lock scroll once the full
  // image is ready and swapped in.
  img.addEventListener("click", () => {
    const fullUrl = img.dataset.full;

    // Show lightbox immediately with the thumbnail to give instant
    // feedback; indicate loading state while full image downloads.
    lightbox.classList.add('loading');
    lightboxImg.src = img.dataset.src || img.src; // thumbnail as placeholder
    lightboxImg.alt = `Artwork ${name} — 山东省实验中学东校 (loading)`;
    lightbox.style.display = "flex";

    // Preload the full image off-DOM.
    const pre = new Image();
    pre.decoding = 'async';
    pre.src = fullUrl;
    pre.onload = () => {
      // Swap in the full image after it has finished decoding.
      lightboxImg.src = pre.src;
      lightboxImg.alt = `Artwork ${name} — 山东省实验中学东校 (full size)`;
      lightbox.classList.remove('loading');
      lockScroll();
    };
    pre.onerror = () => {
      // On error, still lock and show what we have (thumbnail).
      lightbox.classList.remove('loading');
      lockScroll();
    };
  });

  gallery.appendChild(img);

    // Observe lazy images and set `src` when they approach the viewport.
    // Use a rootMargin so images just outside the viewport start loading.
    if ('IntersectionObserver' in window) {
      if (!window.__galleryIO) {
        window.__galleryIO = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              if (el.dataset && el.dataset.src) {
                el.src = el.dataset.src;
                el.removeAttribute('data-src');
              }
              obs.unobserve(el);
            }
          });
        }, { rootMargin: '200px 0px', threshold: 0.01 });
      }
      window.__galleryIO.observe(img);
    } else {
      // Fallback: load immediately
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
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