const menuBtn = document.getElementById('menu-btn');
const offcanvas = document.getElementById('offcanvas');
const overlay = document.getElementById('overlay');

menuBtn.addEventListener('click', () => {
  offcanvas.classList.toggle('open');
  overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
  offcanvas.classList.remove('open');
  overlay.classList.remove('show');
});
/* === CHRISTMAS SNOW + FALLING TEXT EFFECT === */
const snowCanvas = document.getElementById("snow-canvas");
const ctx = snowCanvas.getContext("2d");

function resizeSnowCanvas() {
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
}
resizeSnowCanvas();
window.addEventListener("resize", resizeSnowCanvas);

// Create snowflakes
let snowflakes = [];
let fallingTexts = [];
const TEXT = "Happy New Month 🎉";  // You can edit this

function createSnow() {
  const snowCount = 120;
  const textCount = 8; // Amount of falling texts

  // Snowflakes
  for (let i = 0; i < snowCount; i++) {
    snowflakes.push({
      x: Math.random() * snowCanvas.width,
      y: Math.random() * snowCanvas.height,
      r: Math.random() * 3 + 1,
      d: Math.random() + 1
    });
  }

  // Falling red text
  for (let t = 0; t < textCount; t++) {
    fallingTexts.push({
      x: Math.random() * snowCanvas.width,
      y: Math.random() * snowCanvas.height - 200,
      speed: Math.random() * 1 + 0.5
    });
  }
}
createSnow();

let angle = 0;

function drawSnow() {
  ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  
  /* ==== DRAW SNOW ==== */
  ctx.fillStyle = "white red";
  ctx.beginPath();
  snowflakes.forEach(s => {
    ctx.moveTo(s.x, s.y);
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
  });
  ctx.fill();
  
  /* ==== DRAW FALLING TEXT ==== */
  ctx.fillStyle = "red/white";       // text color
  ctx.font = "bold 20px Arial";
  fallingTexts.forEach(t => {
    ctx.fillText(TEXT, t.x, t.y);
  });

  updateSnow();
  updateTexts();
}

function updateSnow() {
  angle += 0.01;

  snowflakes.forEach(s => {
    s.y += Math.cos(angle + s.d) + 1 + s.r / 2;
    s.x += Math.sin(angle) * 0.5;

    if (s.y > snowCanvas.height) {
      s.y = 0;
      s.x = Math.random() * snowCanvas.width;
    }
  });
}

function updateTexts() {
  fallingTexts.forEach(t => {
    t.y += t.speed;

    if (t.y > snowCanvas.height + 50) {
      t.y = -20;
      t.x = Math.random() * snowCanvas.width;
    }
  });
}

setInterval(drawSnow, 25);



/* CAROUSEL SCRIPT*/
/* Basic carousel logic: autoplay, controls, indicators, keyboard accessibility */
const track = document.getElementById('carousel-track');
const slides = Array.from(track.querySelectorAll('.carousel-slide'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = Array.from(document.querySelectorAll('.indicator'));
const liveRegion = document.getElementById('carousel-live');

let current = 0;
const total = slides.length;
let autoplay = true;
const intervalTime = 3000; // ms
let timer = null;

/* Helper: show slide by index */
function showSlide(index, announce = true) {
  index = (index + total) % total;
  slides.forEach((s, i) => {
    s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
  });
  indicators.forEach((ind, i) => {
    ind.classList.toggle('active', i === index);
    ind.setAttribute('aria-selected', i === index ? 'true' : 'false');
    ind.setAttribute('tabindex', i === index ? '0' : '-1');
  });
  current = index;
  if (announce && liveRegion) {
    const title = slides[index].querySelector('.title')?.textContent?.trim() || `Slide ${index + 1}`;
    liveRegion.textContent = `${title} — Slide ${index + 1} of ${total}`;
  }
}

/* Prev/Next */
prevBtn.addEventListener('click', () => {
  showSlide(current - 1);
  restartAuto();
});
nextBtn.addEventListener('click', () => {
  showSlide(current + 1);
  restartAuto();
});

/* Indicators */
indicators.forEach(ind => {
  ind.addEventListener('click', () => {
    const slideIndex = Number(ind.dataset.slide);
    showSlide(slideIndex);
    restartAuto();
  });
});

/* Keyboard support: left/right arrows move slides; space/enter on indicators handled by click */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { prevBtn.click(); }
  else if (e.key === 'ArrowRight') { nextBtn.click(); }
});

/* Autoplay */
function startAuto() {
  if (!autoplay) return;
  timer = setInterval(() => {
    showSlide(current + 1);
  }, intervalTime);
}
function stopAuto() {
  clearInterval(timer);
  timer = null;
}
function restartAuto() {
  stopAuto();
  startAuto();
}

/* pause on hover/focus for accessibility */
const carouselEl = document.querySelector('.hero-carousel');
carouselEl.addEventListener('mouseenter', () => { stopAuto(); });
carouselEl.addEventListener('mouseleave', () => { startAuto(); });
carouselEl.addEventListener('focusin', () => { stopAuto(); });
carouselEl.addEventListener('focusout', () => { startAuto(); });

/* initialize */
showSlide(0, false);
startAuto();





/* About: read-more toggle */
const aboutToggle = document.getElementById('about-toggle');
const moreText = document.getElementById('more-text');
const aboutMore = document.getElementById('about-more');

if (aboutToggle && moreText) {
  aboutToggle.addEventListener('click', () => {
    const isOpen = moreText.style.display === 'inline';
    if (isOpen) {
      moreText.style.display = 'none';
      aboutToggle.textContent = 'Read more';
      aboutToggle.setAttribute('aria-expanded', 'false');
    } else {
      moreText.style.display = 'inline';
      aboutToggle.textContent = 'Show less';
      aboutToggle.setAttribute('aria-expanded', 'true');
      // move focus back to the button for accessibility
      aboutToggle.focus();
    }
  });
}
// prevent body scroll when offcanvas open (paste after your openMenu/closeMenu or menu toggle code)
function setBodyScrollLocked(locked) {
  if (locked) document.body.classList.add('no-scroll');
  else document.body.classList.remove('no-scroll');
}

/* if you already toggle classes with menuBtn, hook into that */
const observerMenu = new MutationObserver(() => {
  const isOpen = offcanvas.classList.contains('open') || menuBtn.classList.contains('open');
  setBodyScrollLocked(isOpen);
});
observerMenu.observe(offcanvas, { attributes: true, attributeFilter: ['class'] });


/* === Contact form handling (Formspree-friendly) === */
(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');

    // simple client-side checks
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      statusEl.textContent = 'Please fill in required fields.';
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
      return;
    }

    // assemble data for Formspree (or your endpoint)
    const data = new FormData(form);

    try {
      const resp = await fetch(form.action, {
        method: form.method || 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (resp.ok) {
        // success
        statusEl.textContent = 'Thanks — your message was sent. We will get back to you shortly.';
        form.reset();
      } else {
        // try to decode json error
        const err = await resp.json().catch(() => null);
        statusEl.textContent = (err && err.error) ? err.error : 'Oops — something went wrong. Please try again later.';
      }
    } catch (err) {
      statusEl.textContent = 'Network error — check your connection and try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
  });
})();

/* === AUTO SWITCH LAYOUT FOR PREACHING VIDEOS === */

document.addEventListener("DOMContentLoaded", () => {
  const preachingSections = document.querySelectorAll(".preaching-content");
  preachingSections.forEach((section, index) => {
    // Apply .reverse to even-numbered sections (2nd, 4th, etc.)
    if ((index + 1) % 2 === 0) {
      section.classList.add("reverse");
    }
  });
});

/* === AUTO YEAR FOR FOOTER COPYRIGHT === */
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
/* === DAILY BIBLE VERSE WIDGET === */
(function () {
  const API_URL = 'https://beta.ourmanna.com/api/v1/get/?format=json&order=daily';
  const textEl = document.getElementById('dv-text');
  const refEl = document.getElementById('dv-ref');
  const sourceEl = document.getElementById('dv-source');
  const refreshBtn = document.getElementById('dv-refresh');

  // Local fallback verses (used if API fails). Add or edit as desired.
  const FALLBACK_VERSES = [
    { text: "For God so loved the world that he gave his one and only Son...", ref: "John 3:16" },
    { text: "I can do all this through him who gives me strength.", ref: "Philippians 4:13" },
    { text: "The LORD is my shepherd; I shall not want.", ref: "Psalm 23:1" },
    { text: "Trust in the LORD with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
    { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you...", ref: "Joshua 1:9" },
    { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
    { text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", ref: "Matthew 6:33" }
  ];

  // Utility: pick a fallback verse deterministically based on today's date
  function fallbackForToday() {
    const now = new Date();
    const dayIndex = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000*60*60*24));
    return FALLBACK_VERSES[dayIndex % FALLBACK_VERSES.length];
  }

  // Render function
  function renderVerse(text, reference, sourceLabel='OurManna') {
    if (textEl) textEl.textContent = text || 'Verse unavailable.';
    if (refEl) refEl.textContent = reference || '';
    if (sourceEl) sourceEl.textContent = `Source: ${sourceLabel}`;
  }

  // Try fetching from OurManna API
  async function fetchFromApi() {
    try {
      const resp = await fetch(API_URL, {cache: "no-store"});
      if (!resp.ok) throw new Error('Network response not OK');
      const json = await resp.json();
      // OurManna returns verse.details.text and verse.details.reference (best-effort detection)
      let verseText = null;
      let verseRef = null;
      if (json?.verse?.details) {
        verseText = json.verse.details.text || json.verse.details.verse || null;
        verseRef = json.verse.details.reference || json.verse.details.verse || null;
      } else if (json?.text) {
        verseText = json.text;
        verseRef = json.reference || '';
      }

      if (verseText) {
        renderVerse(verseText, verseRef, 'Voice of God Everyday - Pastor Dare');
        return true;
      } else {
        throw new Error('API returned no verse');
      }
    } catch (err) {
      console.warn('Daily verse API failed:', err);
      return false;
    }
  }

  // Main loader: try API then fallback
  async function loadDailyVerse() {
    if (!textEl) return;
    // show loading
    renderVerse('Loading today\'s verse…', '');
    const ok = await fetchFromApi();
    if (!ok) {
      const fb = fallbackForToday();
      renderVerse(fb.text, fb.ref, 'local fallback');
    }
  }

  // Refresh button
  

  // Auto-refresh at next local midnight (so verse updates daily)
  function scheduleNextMidnight() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow - now + 2000; // slight pad
    setTimeout(async () => {
      await loadDailyVerse();
      scheduleNextMidnight(); // schedule again for the next day
    }, msUntilMidnight);
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    loadDailyVerse();
    scheduleNextMidnight();
  });
})();










