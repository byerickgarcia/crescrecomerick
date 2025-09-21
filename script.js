// Mobile menu
const burger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
    burger.setAttribute('aria-expanded', String(!open));
  });
}

// Atualiza ano no footer
document.getElementById('year').textContent = new Date().getFullYear();

// Suaviza clique em âncoras internas (opcional)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // fecha menu mobile após clique
      if (window.innerWidth < 720 && menu) menu.style.display = 'none';
    }
  });
});
