// Menu mobile
const burger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
    burger.setAttribute('aria-expanded', String(!open));
  });
}

// Ano no footer
document.getElementById('year').textContent = new Date().getFullYear();

// Rolagem suave e fechar menu no mobile
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

// Carrossel simples com swipe
function initCarousel(trackId){
  const track = document.querySelector(trackId);
  if (!track) return;

  const btnPrev = document.querySelector(`[data-target="${trackId}"][data-dir="prev"]`);
  const btnNext = document.querySelector(`[data-target="${trackId}"][data-dir="next"]`);

  const step = () => track.clientWidth * 0.70;

  const go = dir => {
    track.scrollBy({ left: dir === 'next' ? step() : -step(), behavior: 'smooth' });
  };

  btnPrev && btnPrev.addEventListener('click', () => go('prev'));
  btnNext && btnNext.addEventListener('click', () => go('next'));

  // Swipe touch
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive:true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 'next' : 'prev');
  });
}

initCarousel('#carousel-ig');
initCarousel('#carousel-tt');
