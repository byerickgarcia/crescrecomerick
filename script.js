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
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll suave e fechar menu no mobile
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

// Carrossel simples
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

// ---------- CONFIGURADOR ----------
// Preços base (ajuste à sua realidade)
const PRICING = {
  baseRetainer: 2500,       // ticket base pelo setup + gestão
  channels: {               // acréscimo por canal ativo
    ig: 0,                  // Instagram incluso na base
    tt: 500,                // TikTok
    yt: 800,                // YouTube (vídeo longo)
    shorts: 600             // YouTube Shorts
  },
  perDay: {                 // custo por publicação diária (x30/mês aprox)
    reel: 120,              // por reel/dia
    post: 60,               // por post/dia
    story: 40               // por story/dia
  },
  perMonth: {
    visit: 400,             // por visita de captação no mês
    photoPackPer10: 250     // por bloco de 10 fotos tratadas/mês
  },
  discountRules: [
    // regras simples de ancoragem (opcional)
    { minTotal: 6500, pct: 0.05 }, // 5% acima de 6.5k
    { minTotal: 9000, pct: 0.08 }  // 8% acima de 9k
  ]
};

const $ = s => document.querySelector(s);
const form = $('#builderForm');
const outReels = $('#outReels');
const outPosts = $('#outPosts');
const outStories = $('#outStories');
const outVisits = $('#outVisits');
const outPhotos = $('#outPhotos');
const pricePreview = $('#pricePreview');
const btnWhats = $('#btnWhats');
const bulletsResumo = $('#bulletsResumo');

function encodeWhatsMsg(text){
  return encodeURIComponent(text);
}

function calc(){
  if (!form) return;

  const ig = form.ig.checked;
  const tt = form.tt.checked;
  const yt = form.yt.checked;
  const shorts = form.shorts.checked;

  const reelsPerDay = +form.reelsPerDay.value;
  const postsPerDay = +form.postsPerDay.value;
  const storiesPerDay = +form.storiesPerDay.value;

  const visitsPerMonth = +form.visitsPerMonth.value;
  const photosPerMonth = +form.photosPerMonth.value;

  // Saídas (labels)
  outReels.textContent = reelsPerDay;
  outPosts.textContent = postsPerDay;
  outStories.textContent = storiesPerDay;
  outVisits.textContent = visitsPerMonth;
  outPhotos.textContent = photosPerMonth;

  // Preço
  let total = PRICING.baseRetainer;

  // canais
  if (tt) total += PRICING.channels.tt;
  if (yt) total += PRICING.channels.yt;
  if (shorts) total += PRICING.channels.shorts;

  // volume por dia (aproximação mensal x30)
  total += reelsPerDay * PRICING.perDay.reel * 30;
  total += postsPerDay * PRICING.perDay.post * 30;
  total += storiesPerDay * PRICING.perDay.story * 30;

  // visitas e fotos
  total += visitsPerMonth * PRICING.perMonth.visit;
  total += Math.ceil(photosPerMonth / 10) * PRICING.perMonth.photoPackPer10;

  // descontos simples
  let appliedDiscount = 0;
  for (const rule of PRICING.discountRules){
    if (total >= rule.minTotal) appliedDiscount = Math.max(appliedDiscount, rule.pct);
  }
  const totalAfter = Math.round(total * (1 - appliedDiscount));

  // UI
  pricePreview.textContent = totalAfter.toLocaleString('pt-BR');

  // resumo bullets
  const canais = [
    ig ? 'Instagram' : null,
    tt ? 'TikTok' : null,
    yt ? 'YouTube (longo)' : null,
    shorts ? 'YouTube Shorts' : null
  ].filter(Boolean).join(' • ') || 'Instagram';

  bulletsResumo.innerHTML = `
    <li><b>Canais:</b> ${canais}</li>
    <li><b>Reels/dia:</b> ${reelsPerDay} • <b>Posts/dia:</b> ${postsPerDay} • <b>Stories/dia:</b> ${storiesPerDay}</li>
    <li><b>Visitas/mês:</b> ${visitsPerMonth} • <b>Fotos tratadas/mês:</b> ${photosPerMonth}</li>
    <li>Captação, edição, fotos e gestão completos</li>
  `;

  // link WhatsApp
  const msg = `Ola Erick, quero um pacote sob medida:
- Canais: ${canais}
- Reels por dia: ${reelsPerDay}
- Posts por dia: ${postsPerDay}
- Stories por dia: ${storiesPerDay}
- Visitas/mês: ${visitsPerMonth}
- Fotos tratadas/mês: ${photosPerMonth}
- Estimativa: R$ ${totalAfter.toLocaleString('pt-BR')}/mês
Me chame para alinharmos o contrato (50/50).`;
  btnWhats.href = `https://wa.me/5543988632851?text=${encodeWhatsMsg(msg)}`;
}

// Bind
['change','input'].forEach(evt => form?.addEventListener(evt, calc));
calc();
