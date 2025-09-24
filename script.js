// NAV MOBILE
const burger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
    burger.setAttribute('aria-expanded', String(!open));
  });
}

// FOOTER YEAR
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// SMOOTH SCROLL + fechar menu no mobile
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth < 720 && menu) menu.style.display = 'none';
    }
  });
});

// CAROUSEL
function initCarousel(trackId){
  const track = document.querySelector(trackId);
  if (!track) return;
  const btnPrev = document.querySelector(`[data-target="${trackId}"][data-dir="prev"]`);
  const btnNext = document.querySelector(`[data-target="${trackId}"][data-dir="next"]`);
  const step = () => track.clientWidth * 0.70;
  const go = dir => track.scrollBy({ left: dir === 'next' ? step() : -step(), behavior: 'smooth' });
  btnPrev && btnPrev.addEventListener('click', () => go('prev'));
  btnNext && btnNext.addEventListener('click', () => go('next'));
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive:true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 'next' : 'prev');
  });
}
initCarousel('#carousel-ig');
initCarousel('#carousel-tt');

// BUILDER
const $ = s => document.querySelector(s);
const form = $('#builderForm');
const bulletsResumo = $('#bulletsResumo');
const btnWhats = $('#btnWhats');

// impedir submit pelo Enter
form?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') e.preventDefault();
});

// steppers
function setupStepper(name){
  const minus = document.querySelector(`[data-step="${name}"][data-dir="-"]`);
  const plus  = document.querySelector(`[data-step="${name}"][data-dir="+"]`);
  const input = form?.querySelector(`input[name="${name}Week"], input[name="${name}Month"], input[name="${name}"]`);
  if (!input) return;
  minus?.addEventListener('click', () => { input.value = Math.max(0, (+input.value||0) - 1); update(); });
  plus?.addEventListener('click',  () => { input.value = (+input.value||0) + 1; update(); });
}

['reels','posts','stories'].forEach(setupStepper);
setupStepper('visits');
setupStepper('photos');

form?.addEventListener('input', update);
form?.addEventListener('change', update);

function valInt(name){
  const el = form?.querySelector(`[name="${name}"]`);
  return Math.max(0, parseInt(el?.value || '0', 10));
}
function checked(name){
  const el = form?.querySelector(`[name="${name
