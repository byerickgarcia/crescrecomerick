// ===== Utils =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Menu mobile =====
const burger = $('#hamburger');
const menu = $('#menu');
const header = $('header.nav');

function setMenu(open) {
  if (!menu || !burger) return;
  menu.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('no-scroll', open);
}

if (burger && menu) {
  burger.addEventListener('click', () => {
    setMenu(!menu.classList.contains('is-open'));
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    const open = menu.classList.contains('is-open');
    if (!open) return;
    const clickInside = menu.contains(e.target) || burger.contains(e.target);
    if (!clickInside) setMenu(false);
  });

  // Fecha com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  // Reset em resize
  let rid;
  window.addEventListener('resize', () => {
    clearTimeout(rid);
    rid = setTimeout(() => setMenu(false), 120);
  });
}

// ===== Ano no footer =====
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Rolagem suave com offset do header fixo =====
const headerHeight = () => (header ? header.offsetHeight : 0);
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = $(id);
    if (!el) return;

    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight() - 8;
    if (prefersReduced) {
      window.scrollTo(0, top);
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }
    // fecha menu no mobile
    if (window.innerWidth < 720) setMenu(false);
  });
});

// ===== Carrossel: swipe, teclado, mouse-drag, wheel =====
function initCarousel(trackId){
  const track = $(trackId);
  if (!track) return;

  const wrap = track.closest('.carousel');
  const btnPrev = wrap ? $('[data-target="'+trackId+'"][data-dir="prev"]', wrap) : null;
  const btnNext = wrap ? $('[data-target="'+trackId+'"][data-dir="next"]', wrap) : null;

  const step = () => Math.max(track.clientWidth * 0.7, 280);

  const go = (dir = 'next') => {
    const delta = dir === 'next' ? step() : -step();
    track.scrollBy({ left: delta, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  btnPrev && btnPrev.addEventListener('click', () => go('prev'));
  btnNext && btnNext.addEventListener('click', () => go('next'));

  // Teclado (quando foco estiver no carrossel)
  wrap && wrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go('next');
    if (e.key === 'ArrowLeft') go('prev');
  });

  // Wheel horizontal
  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // Touch / Mouse drag
  let startX = 0, isDown = false, lastX = 0;

  const onStart = (x) => { startX = x; lastX = x; isDown = true; };
  const onMove  = (x) => {
    if (!isDown) return;
    const dx = x - lastX;
    track.scrollLeft -= dx;
    lastX = x;
  };
  const onEnd = (x) => {
    if (!isDown) return;
    const dx = x - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 'next' : 'prev');
    isDown = false;
  };

  // Touch
  track.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove',  (e) => onMove(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend',   (e) => onEnd(e.changedTouches[0].clientX));

  // Mouse
  track.addEventListener('mousedown', (e) => { track.classList.add('is-dragging'); onStart(e.clientX); });
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup',   (e) => { track.classList.remove('is-dragging'); onEnd(e.clientX); });

  // Acessibilidade
  wrap && wrap.setAttribute('tabindex', '0'); // permite setas do teclado
}

initCarousel('#carousel-ig');
initCarousel('#carousel-tt');
