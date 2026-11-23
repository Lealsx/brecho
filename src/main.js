// ============================================================
//  MAIN.JS — monta a página e cuida de todas as animações
//  1. Rolagem suave (Lenis)
//  2. Textos do config (nome, slogan, links)
//  3. Cards da vitrine (gerados a partir de pecas.js)
//  4. Animações de entrada e de rolagem (GSAP + ScrollTrigger)
//  5. Janela da peça (abrir, trocar foto, fechar)
// ============================================================

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';
import { config } from './config.js';
import { pecas, VISTAS, CONDICOES } from './pecas.js';

gsap.registerPlugin(ScrollTrigger);

// Respeita quem pediu "reduzir movimento" nas configurações do sistema
const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// WhatsApp: tira espaços, traços e parênteses; se faltar o 55 do Brasil, coloca
const soDigitos = String(config.whatsapp).replace(/\D/g, '');
const whatsapp = soDigitos.length <= 11 ? `55${soDigitos}` : soDigitos;

const formatarPreco =(valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Evita que um texto com < ou " quebre o HTML gerado
const esc = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ------------------------------------------------------------
// 1. ROLAGEM SUAVE
// ------------------------------------------------------------
let lenis = null;
if (!reduzirMovimento) {
  lenis = new Lenis({ lerp: 0.09 }); // menor = mais "macio"
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ------------------------------------------------------------
// 2. TEXTOS DO CONFIG
// ------------------------------------------------------------
document.querySelectorAll('[data-nome]').forEach((el) => (el.textContent = config.nome));
document.getElementById('slogan').textContent = config.slogan;

const disponiveis = pecas.filter((p) => !p.vendida).length;
document.getElementById('contador').textContent =
  disponiveis === 1 ? '1 peça disponível' : `${disponiveis} peças disponíveis`;

// Título gigante: cada letra vira um <span> para animar separadamente
const titulo = document.getElementById('titulo');
titulo.setAttribute('aria-label', config.nome);
titulo.innerHTML = config.nome
  .split(' ')
  .map(
    (palavra) =>
      `<span class="palavra" aria-hidden="true">${[...palavra]
        .map((l) => `<span class="letra"><span>${esc(l)}</span></span>`)
        .join('')}</span>`,
  )
  .join(' ');

// Faixa corrida: o conteúdo é duplicado para dar a volta sem "pulo"
const frases = ['peças únicas', 'moda circular', 'garimpo com carinho', 'segunda história'];
const grupo = Array(3).fill(frases).flat().map((f) => `<span>${f}</span>`).join('');
document.getElementById('faixa').innerHTML = grupo + grupo;

// Links do rodapé
const links = [];
if (config.instagram) links.push(`<a href="https://instagram.com/${esc(config.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
links.push(`<a href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`);
document.getElementById('links').innerHTML = links.join('');

// ------------------------------------------------------------
// 3. CARDS DA VITRINE
// ------------------------------------------------------------
const grade = document.getElementById('grade');
grade.innerHTML = pecas
  .map(
    (p) => `
  <a class="card${p.vendida ? ' card--vendida' : ''}" href="#${esc(p.id)}" data-id="${esc(p.id)}">
    <div class="card__midia">
      <div class="card__camada">
        <img class="card__img" src="${esc(p.fotos[0])}" alt="${esc(p.nome)}" loading="lazy" decoding="async">
        <img class="card__img card__img--hover" src="${esc(p.fotos[1])}" alt="" aria-hidden="true" loading="lazy" decoding="async">
      </div>
      ${p.vendida ? '<span class="card__selo">vendida</span>' : ''}
    </div>
    <div class="card__legenda">
      <span class="card__nome">${esc(p.nome)}</span>
      <span class="card__preco">${formatarPreco(p.preco)}</span>
    </div>
  </a>`,
  )
  .join('');

// ------------------------------------------------------------
// 4. ANIMAÇÕES DA PÁGINA
// ------------------------------------------------------------
if (!reduzirMovimento) {
  // Entrada: letras do título sobem uma a uma
  gsap.from('.letra > span', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.045, delay: 0.15 });
  gsap.from('.hero__sobre, .hero__rodape, .topo', { opacity: 0, y: 24, duration: 1, ease: 'power3.out', delay: 0.6, stagger: 0.1 });

  // Ao rolar, o título desce devagar e some (efeito de profundidade)
  gsap.to('.hero__titulo', {
    yPercent: 35,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  // Faixa corrida: acelera conforme a velocidade da rolagem
  const faixa = gsap.to('#faixa', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
  lenis.on('scroll', ({ velocity }) => {
    gsap.to(faixa, { timeScale: 1 + Math.min(Math.abs(velocity) * 0.4, 8), duration: 0.4, overwrite: true });
  });

  // Cards: a foto "abre" de baixo para cima quando entra na tela
  gsap.set('.card__midia', { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set('.card__img', { scale: 1.3 });
  gsap.set('.card__legenda', { opacity: 0, y: 16 });

  ScrollTrigger.batch('.card', {
    start: 'top 92%',
    once: true,
    onEnter: (cards) => {
      const tl = gsap.timeline();
      cards.forEach((card, i) => {
        const t = i * 0.12;
        tl.to(card.querySelector('.card__midia'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' }, t)
          .to(card.querySelectorAll('.card__img'), { scale: 1, duration: 1.8, ease: 'expo.out' }, t + 0.25)
          .to(card.querySelector('.card__legenda'), { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, t + 0.7);
      });
    },
  });

  // Parallax: a foto se move um pouco mais devagar que o card
  gsap.utils.toArray('.card').forEach((card) => {
    gsap.fromTo(
      card.querySelector('.card__camada'),
      { yPercent: -6 },
      { yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
} else {
  // Sem animação: a faixa fica parada
  gsap.set('#faixa', { xPercent: 0 });
}

// ------------------------------------------------------------
// 5. JANELA DA PEÇA
// ------------------------------------------------------------
const modal = document.getElementById('modal');
const principal = document.getElementById('modal-principal');
const miniaturas = document.getElementById('modal-miniaturas');
const botaoFechar = modal.querySelector('.modal__fechar');
const comprar = document.getElementById('modal-comprar');
const elementosInfo = '.modal__info > *, .modal__miniaturas';

// Partes da página que ficam "congeladas" (sem foco nem clique) com a janela aberta
const fundoDaPagina = document.querySelectorAll('.topo, main, .rodape');
const congelarFundo = (sim) => fundoDaPagina.forEach((el) => (el.inert = sim));

let atual = null; // { peca, card, vista } da peça aberta
let animando = false;

// Coloca os dados da peça dentro da janela
function preencher(peca) {
  principal.innerHTML = peca.fotos
    .map((src, i) => `<img src="${esc(src)}" alt="${esc(peca.nome)}: ${VISTAS[i]}" class="${i === 0 ? 'ativa' : ''}" draggable="false">`)
    .join('');
  miniaturas.innerHTML = peca.fotos
    .map(
      (src, i) =>
        `<button class="miniatura${i === 0 ? ' ativa' : ''}" data-vista="${i}" aria-label="Ver ${VISTAS[i]}"><img src="${esc(src)}" alt=""><span>${VISTAS[i]}</span></button>`,
    )
    .join('');

  document.getElementById('modal-categoria').textContent = peca.categoria;
  document.getElementById('modal-nome').textContent = peca.nome;
  document.getElementById('modal-preco').textContent = formatarPreco(peca.preco);
  document.getElementById('modal-tamanho').textContent = peca.tamanho;
  document.getElementById('modal-condicao').textContent = peca.condicao;
  document.getElementById('modal-obs').textContent = peca.observacao;
  document.getElementById('modal-descricao').textContent = peca.descricao;

  const nivel = CONDICOES[peca.condicao] ?? 0;
  document.getElementById('modal-nivel').innerHTML = [1, 2, 3, 4].map((n) => `<i class="${n <= nivel ? 'cheio' : ''}"></i>`).join('');

  if (peca.vendida) {
    comprar.textContent = 'Peça vendida';
    comprar.setAttribute('aria-disabled', 'true');
    comprar.removeAttribute('href');
  } else {
    const link = `${location.origin}${location.pathname}#${peca.id}`;
    const msg = `Oi! Tenho interesse na peça "${peca.nome}" (${formatarPreco(peca.preco)}). ${link}`;
    comprar.textContent = 'Quero essa peça';
    comprar.removeAttribute('aria-disabled');
    comprar.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
  }
}

// Cria a cópia da foto que vai "voar" entre o card e a janela
function criarVoo(src, ret) {
  const voo = document.createElement('div');
  voo.className = 'voo';
  voo.innerHTML = `<img src="${esc(src)}" alt="">`;
  Object.assign(voo.style, { left: `${ret.left}px`, top: `${ret.top}px`, width: `${ret.width}px`, height: `${ret.height}px` });
  document.body.appendChild(voo);
  return voo;
}

const estaNaTela = (el) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight && r.width > 0;
};

function abrir(peca, card, { animar = true } = {}) {
  if (animando || atual) return;
  animando = true;
  atual = { peca, card, vista: 0 };

  preencher(peca);
  lenis?.stop();
  document.documentElement.classList.add('travado');
  modal.classList.add('aberto');
  modal.setAttribute('aria-hidden', 'false');
  congelarFundo(true);
  modal.querySelector('.modal__painel').scrollTop = 0;
  history.replaceState(null, '', `#${peca.id}`); // deixa o link compartilhável

  const tl = gsap.timeline({
    onComplete: () => {
      animando = false;
      botaoFechar.focus({ preventScroll: true });
    },
  });

  tl.fromTo('.modal__fundo', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
    .fromTo('.modal__painel', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.1)
    .fromTo(elementosInfo, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0.45);

  const origem = card?.querySelector('.card__midia');
  if (animar && !reduzirMovimento && origem && estaNaTela(origem)) {
    // A foto sai do card e cresce até o lugar dela na janela
    const voo = criarVoo(peca.fotos[0], origem.getBoundingClientRect());
    const destino = principal.getBoundingClientRect();
    principal.style.visibility = 'hidden';
    origem.style.visibility = 'hidden';
    tl.to(
      voo,
      {
        left: destino.left,
        top: destino.top,
        width: destino.width,
        height: destino.height,
        duration: 1.05,
        ease: 'expo.inOut',
        onComplete: () => {
          principal.style.visibility = '';
          voo.remove();
        },
      },
      0,
    );
  } else {
    tl.fromTo(principal, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'expo.out' }, 0.15);
  }
}

function fechar() {
  if (!atual || animando) return;
  animando = true;
  const { peca, card, vista } = atual;
  const origem = card?.querySelector('.card__midia');

  const tl = gsap.timeline({
    onComplete: () => {
      modal.classList.remove('aberto');
      modal.setAttribute('aria-hidden', 'true');
      congelarFundo(false);
      gsap.set(['.modal__fundo', '.modal__painel', principal, ...document.querySelectorAll(elementosInfo)], { clearProps: 'all' });
      if (origem) origem.style.visibility = '';
      document.documentElement.classList.remove('travado');
      lenis?.start();
      history.replaceState(null, '', location.pathname + location.search);
      card?.focus({ preventScroll: true });
      atual = null;
      animando = false;
    },
  });

  tl.to(elementosInfo, { opacity: 0, x: 24, duration: 0.3, ease: 'power2.in', stagger: 0.02 }, 0);

  if (!reduzirMovimento && origem && estaNaTela(origem)) {
    // Caminho inverso: a foto volta para o card
    const voo = criarVoo(peca.fotos[vista], principal.getBoundingClientRect());
    principal.style.visibility = 'hidden';
    origem.style.visibility = 'hidden';
    tl.to(
      voo,
      {
        ...pick(origem.getBoundingClientRect()),
        duration: 0.95,
        ease: 'expo.inOut',
        onComplete: () => (origem.style.visibility = ''),
      },
      0.05,
    ).to(voo, { opacity: 0, duration: 0.25, onComplete: () => voo.remove() });
  } else {
    tl.to(principal, { opacity: 0, duration: 0.3 }, 0);
  }

  tl.to('.modal__painel', { opacity: 0, duration: 0.45, ease: 'power2.inOut' }, 0.2).to(
    '.modal__fundo',
    { opacity: 0, duration: 0.5, ease: 'power2.inOut' },
    0.3,
  );
}

const pick = (r) => ({ left: r.left, top: r.top, width: r.width, height: r.height });

// Troca entre Frente / Costas / Detalhe com uma "cortina" lateral
function trocarVista(nova) {
  if (!atual) return;
  const total = atual.peca.fotos.length;
  nova = (nova + total) % total;
  if (nova === atual.vista) return;

  const imgs = principal.querySelectorAll('img');
  const antiga = imgs[atual.vista];
  const entrando = imgs[nova];
  const direcao = nova > atual.vista ? 1 : -1;

  gsap.killTweensOf(imgs);
  imgs.forEach((img) => {
    img.classList.remove('ativa', 'saindo');
    gsap.set(img, { clearProps: 'all' });
  });
  antiga.classList.add('saindo');
  entrando.classList.add('ativa');

  if (reduzirMovimento) {
    antiga.classList.remove('saindo');
  } else {
    gsap.fromTo(
      entrando,
      { clipPath: direcao > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)', scale: 1.15 },
      { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.9, ease: 'expo.inOut' },
    );
    gsap.to(antiga, {
      xPercent: -20 * direcao,
      duration: 0.9,
      ease: 'expo.inOut',
      onComplete: () => {
        antiga.classList.remove('saindo');
        gsap.set(antiga, { clearProps: 'all' });
      },
    });
  }

  miniaturas.querySelectorAll('.miniatura').forEach((m, i) => m.classList.toggle('ativa', i === nova));
  atual.vista = nova;
}

// ---------- Eventos ----------

// Clique no card abre a janela (Ctrl+clique ainda abre em nova aba)
grade.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  abrir(pecas.find((p) => p.id === card.dataset.id), card);
});

// Clique no fundo escuro ou no X fecha
modal.addEventListener('click', (e) => {
  if (e.target.closest('[data-fechar]')) fechar();
  const mini = e.target.closest('.miniatura');
  if (mini) trocarVista(Number(mini.dataset.vista));
});

// Teclado: Esc fecha, setas trocam a foto
document.addEventListener('keydown', (e) => {
  if (!atual) return;
  if (e.key === 'Escape') fechar();
  if (e.key === 'ArrowRight') trocarVista(atual.vista + 1);
  if (e.key === 'ArrowLeft') trocarVista(atual.vista - 1);
});

// Celular: arrastar a foto para o lado troca a vista
let inicioX = null;
principal.addEventListener('pointerdown', (e) => (inicioX = e.clientX));
principal.addEventListener('pointerup', (e) => {
  if (inicioX === null || !atual) return;
  const distancia = e.clientX - inicioX;
  inicioX = null;
  if (Math.abs(distancia) > 40) trocarVista(atual.vista + (distancia < 0 ? 1 : -1));
});
principal.addEventListener('pointercancel', () => (inicioX = null));

// Se alguém abrir um link tipo seusite.com/#vestido-preto-slip, já abre a peça.
// Também funciona se o link mudar com o site já aberto (evento "hashchange").
function abrirPeloLink() {
  let id = '';
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return; // link malformado tipo "#%E0": só ignora, não pode quebrar a página
  }
  const peca = pecas.find((p) => p.id === id);
  if (!peca || atual?.peca === peca || animando) return;
  if (atual) {
    // outra peça já está aberta: troca direto, sem animação de voo
    const midiaAnterior = atual.card?.querySelector('.card__midia');
    if (midiaAnterior) midiaAnterior.style.visibility = '';
    atual = null;
    animando = false;
    congelarFundo(false);
  }
  abrir(peca, grade.querySelector(`[data-id="${CSS.escape(id)}"]`), { animar: false });
}
abrirPeloLink();
window.addEventListener('hashchange', abrirPeloLink);
