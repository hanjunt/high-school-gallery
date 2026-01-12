// Image list
const images = [
  "001","002","003","004","005","006","007","008","009","010",
  "011","012","013","014","015","016","017","018","019","020",
  "021","022","023","024","025","026","027","028","029","030",
  "031","032","033","034","035","036","037","038","039","040",
  "041","042","043","044","045","046","047","048","049","050",
  "051","052","053","054","055","056","057","058","059","060",
  "061","062","063","064","065","066","067","068","069","070",
  "071","072","073","074","075","076","077","078","079","080",
  "081","082","083","084","085","086","087"
];

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');
const toggle = document.getElementById('theme-toggle');

let _lockedScrollY = 0;
let scrollLocked = false;

/* ---------------- Scroll Lock (mobile-safe) ---------------- */

function lockScroll() {
  if (scrollLocked) return;
  scrollLocked = true;

  _lockedScrollY = window.scrollY || window.pageYOffset;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${_lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';

  try {
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';
  } catch (e) {}
}

function unlockScroll() {
  if (!scrollLocked) return;
  scrollLocked = false;

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';

  try {
    document.documentElement.style.overscrollBehavior = '';
    document.body.style.overscrollBehavior = '';
  } catch (e) {}

  window.scrollTo(0, _lockedScrollY);
}

/* ---------------- Utilities ---------------- */

function preloadImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve({ ok: true, src: img.src });
    img.onerror = () => resolve({ ok: false, src: url });
    img.src = url;
  });
}

function isMobileLike() {
  return (
    window.matchMedia('(max-width: 600px)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

/* ---------------- Lightbox ---------------- */

function openLightbox({ thumbSrc, fullSrc, name }) {
  lightbox.classList.add('loading');
  lightboxImg.src = thumbSrc || '';
  lightboxImg.alt = `Artwork ${name} — 山东省实验中学东校 (loading)`;
  lightbox.style.display = 'flex';

  if (isMobileLike()) {
    lightbox.classList.add('block-outside');
  } else {
    lightbox.classList.remove('block-outside');
  }

  // 🔑 FIX: lock scroll immediately (before async preload)
  lockScroll();

  preloadImage(fullSrc).then(result => {
    // Guard: lightbox might have been closed already
    if (lightbox.style.display === 'none') return;

    lightboxImg.src = result.src;
    lightboxImg.alt = `Artwork ${name} — 山东省实验中学东校 (full size)`;
    lightbox.classList.remove('loading');
  });
}

function closeLightbox() {
  unlockScroll();
  lightbox.classList.remove('block-outside');
  lightbox.style.display = 'none';
  lightboxImg.src = '';
}

/* ---------------- Gallery ---------------- */

function createThumbnail(name) {
  const img = document.createElement('img');
  img.dataset.src = `images/thumbs/${name}.webp`;
  img.dataset.full = `images/full/${name}.JPG`;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.alt = `Artwork ${name} — 山东省实验中学东校 (thumbnail)`;
  img.title = `Artwork ${name}`;

  img.addEventListener('click', () => {
    openLightbox({
      thumbSrc: img.dataset.src || img.src,
      fullSrc: img.dataset.full,
      name
    });
  });

  gallery.appendChild(img);

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
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  }
}

images.forEach(createThumbnail);

/* ---------------- Events ---------------- */

closeBtn.onclick = closeLightbox;

lightbox.onclick = e => {
  if (e.target === lightbox) {
    if (!lightbox.classList.contains('block-outside')) {
      closeLightbox();
    }
  }
};

/* ---------------- Theme Toggle ---------------- */

const savedTheme = localStorage.getItem('theme');
document.body.classList.add('no-transitions');

if (savedTheme) {
  document.body.classList.toggle('light', savedTheme === 'light');
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.body.classList.add('light');
}

requestAnimationFrame(() =>
  requestAnimationFrame(() => document.body.classList.remove('no-transitions'))
);

function updateIcon() {
  toggle.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
}
updateIcon();

function toggleThemeInstant() {
  document.body.classList.add('no-transitions');
  requestAnimationFrame(() => {
    document.body.classList.toggle('light');
    const theme = document.body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    updateIcon();
    requestAnimationFrame(() =>
      document.body.classList.remove('no-transitions')
    );
  });
}

toggle.addEventListener('click', toggleThemeInstant);
