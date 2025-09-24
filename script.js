// ===== NAV MOBILE =====
const burger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
    burger.setAttribute('aria-expanded', String(!open));
  });
}

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== SMOOTH SCROLL =====
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

// ===== CAROUSEL =====
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

// ===== BUILDER =====
const $ = s => document.querySelector(s);
const form = $('#builderForm');
const bulletsResumo = $('#bulletsResumo');
const btnSend = $('#sendScope');

// impedir submit pelo Enter
form?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') e.preventDefault();
});

// steppers
function setupStepper(name, inputId){
  const minus = document.querySelector(`[data-step="${name}"][data-dir="-"]`);
  const plus  = document.querySelector(`[data-step="${name}"][data-dir="+"]`);
  const input = document.getElementById(inputId);
  if (!input) return;
  const updateVal = (d) => { input.value = Math.max(0, (+input.value||0) + d); update(); };
  minus?.addEventListener('click', () => updateVal(-1));
  plus?.addEventListener('click',  () => updateVal(+1));
}

setupStepper('reels','reels');
setupStepper('posts','posts');
setupStepper('stories','stories');
setupStepper('visits','captacoes');
setupStepper('photos','photos');

form?.addEventListener('input', update);
form?.addEventListener('change', update);

function valInt(id){ return Math.max(0, parseInt(document.getElementById(id)?.value || '0', 10)); }
function checked(id){ return document.getElementById(id)?.checked || false; }
function escapeHtml(s){ return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function update(){
  if (!form) return;

  // Canais
  const canais = [];
  if (checked('ig')) canais.push('Instagram');
  if (checked('tt')) canais.push('TikTok');
  if (checked('yt')) canais.push('YouTube vídeo longo');
  if (checked('shorts')) canais.push('YouTube Shorts');
  if (!checked('ig')) { document.getElementById('ig').checked = true; canais.unshift('Instagram'); }

  // Volumes
  const reels   = valInt('reels');
  const posts   = valInt('posts');
  const stories = valInt('stories');
  const captacoes = valInt('captacoes');
  const photos  = valInt('photos');

  const linha   = document.getElementById('linha')?.value || 'Autoridade e conteúdo';
  const quality = document.getElementById('quality')?.value || 'Intermediária';
  const extras  = (document.getElementById('extras')?.value || '').trim();

  // mensal (4.3 semanas)
  const reelsM   = Math.round(reels * 4.3);
  const postsM   = Math.round(posts * 4.3);
  const storiesM = Math.round(stories * 4.3);

  // resumo
  bulletsResumo.innerHTML = `
    <li><b>Canais</b> ${canais.join('  ')}</li>
    <li><b>Reels/semana</b> ${reels}  <b>Posts/semana</b> ${posts}  <b>Stories/semana</b> ${stories}</li>
    <li><b>Estimativa mensal</b> ${reelsM} reels  ${postsM} posts  ${storiesM} stories</li>
    <li><b>Captação</b> ${captacoes} visita(s)/mês  <b>Fotos tratadas</b> ${photos}/mês</li>
    <li><b>Linha editorial</b> ${linha}  <b>Edição</b> ${quality}</li>
    ${extras ? `<li><b>Observações</b> ${escapeHtml(extras)}</li>` : ``}
  `;

  // guarda a mensagem pronta no botão
  const lines = [
    'Ola Erick, segue meu escopo sob medida:',
    `- Canais: ${canais.join(', ')}`,
    `- Volume por semana: ${reels} reels, ${posts} posts, ${stories} stories`,
    `- Estimativa mensal: ${reelsM} reels, ${postsM} posts, ${storiesM} stories`,
    `- Captação: ${captacoes} visita(s)/mês`,
    `- Fotos tratadas: ${photos}/mês`,
    `- Linha editorial: ${linha}`,
    `- Qualidade de edição: ${quality}`,
    extras ? `- Observações: ${extras}` : null,
    'Aguardo a proposta com contrato mensal  50 por cento na assinatura e 50 por cento no vencimento.'
  ].filter(Boolean).join('\n');

  btnSend.dataset.msg = encodeURIComponent(lines);
}
update();

// abrir WhatsApp sem refresh
btnSend?.addEventListener('click', (e) => {
  e.preventDefault();
  const msg = btnSend.dataset.msg || '';
  const phone = '5543988632851';
  const url = `https://wa.me/${phone}?text=${msg}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});

// ===== Chips fallback (classe is-checked se o :has não aplicar) =====
document.querySelectorAll('.chip input[type="checkbox"]').forEach(inp => {
  const label = inp.closest('.chip');
  const sync = () => label.classList.toggle('is-checked', inp.checked);
  inp.addEventListener('change', () => { sync(); update(); });
  label.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault(); inp.checked = !inp.checked; inp.dispatchEvent(new Event('change'));
    }
  });
  sync();
});
