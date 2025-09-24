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
  const el = form?.querySelector(`[name="${name}"]`);
  return !!el?.checked;
}
function labelEditorial(v){
  return ({institucional:'Institucional',ofertas:'Ofertas e comercial',autoridade:'Autoridade e conteúdo',eventos:'Eventos e agenda'})[v] || v;
}
function labelQualidade(v){
  return ({basica:'Básica',intermediaria:'Intermediária',premium:'Premium'})[v] || v;
}
function escapeHtml(s){
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

const WHATS_NUMBER = '5543988632851';

function buildMsg(p){
  return [
    'Ola Erick, segue meu escopo sob medida:',
    `- Canais: ${p.canais.join(', ')}`,
    `- Volume por semana: ${p.reelsWeek} reels, ${p.postsWeek} posts, ${p.storiesWeek} stories`,
    `- Estimativa mensal: ${p.reelsMonth} reels, ${p.postsMonth} posts, ${p.storiesMonth} stories`,
    `- Captação: ${p.visitsMonth} visita(s) no mês`,
    `- Fotos tratadas: ${p.photosMonth} no mês`,
    `- Linha editorial: ${labelEditorial(p.editorial)}`,
    `- Qualidade de edição: ${labelQualidade(p.quality)}`,
    p.notes ? `- Observações: ${p.notes}` : null,
    'Aguardo a proposta com contrato mensal  50 por cento na assinatura e 50 por cento no vencimento.'
  ].filter(Boolean).join('\n');
}

function update(){
  if (!form) return;

  const canais = [
    checked('ig') ? 'Instagram' : null,
    checked('tt') ? 'TikTok' : null,
    checked('yt') ? 'YouTube vídeo longo' : null,
    checked('shorts') ? 'YouTube Shorts' : null
  ].filter(Boolean);

  // garante Instagram sempre ativo
  if (!checked('ig')) {
    const igEl = form.querySelector('[name="ig"]');
    if (igEl) igEl.checked = true;
    canais.unshift('Instagram');
  }

  const reelsWeek   = valInt('reelsWeek');
  const postsWeek   = valInt('postsWeek');
  const storiesWeek = valInt('storiesWeek');
  const visitsMonth = valInt('visitsMonth');
  const photosMonth = valInt('photosMonth');

  const editorial = form.querySelector('[name="editorial"]')?.value || 'autoridade';
  const quality   = form.querySelector('[name="quality"]')?.value || 'intermediaria';
  const notes     = (form.querySelector('[name="notes"]')?.value || '').trim();

  // aproximação mensal de 4.3 semanas
  const reelsMonth   = Math.round(reelsWeek * 4.3);
  const postsMonth   = Math.round(postsWeek * 4.3);
  const storiesMonth = Math.round(storiesWeek * 4.3);

  // resumo visual
  bulletsResumo.innerHTML = `
    <li><b>Canais</b> ${canais.join('  ')}</li>
    <li><b>Reels por semana</b> ${reelsWeek}  <b>Posts por semana</b> ${postsWeek}  <b>Stories por semana</b> ${storiesWeek}</li>
    <li><b>Estimativa mensal</b> ${reelsMonth} reels  ${postsMonth} posts  ${storiesMonth} stories</li>
    <li><b>Captação</b> ${visitsMonth} visita(s) no mês  <b>Fotos tratadas</b> ${photosMonth} no mês</li>
    <li><b>Linha editorial</b> ${labelEditorial(editorial)}  <b>Edição</b> ${labelQualidade(quality)}</li>
    ${notes ? `<li><b>Observações</b> ${escapeHtml(notes)}</li>` : ``}
  `;

  // link do WhatsApp via dataset no botão
  const payload = { canais, reelsWeek, postsWeek, storiesWeek, reelsMonth, postsMonth, storiesMonth, visitsMonth, photosMonth, editorial, quality, notes };
  const msg = encodeURIComponent(buildMsg(payload));
  btnWhats.dataset.href = `https://wa.me/${WHATS_NUMBER}?text=${msg}`;
}

btnWhats?.addEventListener('click', (e) => {
  e.preventDefault();
  const link = btnWhats.dataset.href;
  if (link) window.open(link, '_blank', 'noopener,noreferrer');
});

// iniciar
update();
