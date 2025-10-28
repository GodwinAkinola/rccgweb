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


