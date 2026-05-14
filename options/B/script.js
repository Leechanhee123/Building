/* ===== Option B · shared chrome script ===== */

(function() {
  const header = document.getElementById('header');
  if (!header) return;
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

(function() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

window.addEventListener('load', () => {
  document.querySelector('.hero')?.classList.add('loaded');
});

(function() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  function openModal() { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  window.openModal = openModal;
  window.closeModal = closeModal;
  document.querySelectorAll('[data-open-modal]').forEach(b => b.addEventListener('click', openModal));
  document.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();

window.showToast = function(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
};

// Model toggle (only on model.html)
(function() {
  const buttons = document.querySelectorAll('[data-model]');
  if (!buttons.length) return;
  const IMAGES = { site: '../../assets/model-01.jpg', aerial: '../../assets/birdseye.jpg' };
  const img = document.getElementById('modelImg');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      if (img && IMAGES[btn.dataset.model]) img.src = IMAGES[btn.dataset.model];
    });
  });
})();

// Plan cards (only on plans.html)
(function() {
  const cards = document.querySelectorAll('[data-plan]');
  if (!cards.length) return;
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
})();

// Gallery tabs (only on photos.html)
(function() {
  const tabs = document.querySelectorAll('.gallery-tab');
  if (!tabs.length) return;
  const panels = document.querySelectorAll('.gallery-grid');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
    });
  });
})();

// ===== Tweaks =====
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "forest",
  "header": "blur",
  "heroLayout": "inset"
}/*EDITMODE-END*/;

const PALETTES = {
  forest:    { name: 'Forest',    accent: '#1E3A2C', pale: '#DCE5DF', warm: '#F4D9A8' },
  navy:      { name: 'Navy',      accent: '#1F2F4D', pale: '#DEE4EE', warm: '#E8C99A' },
  oxblood:   { name: 'Oxblood',   accent: '#5A2A2A', pale: '#EAD8D6', warm: '#E8BC8A' },
  charcoal:  { name: 'Charcoal',  accent: '#2A2825', pale: '#E2DDD4', warm: '#D4B988' }
};

let tweaks = { ...TWEAK_DEFAULTS };
let tweaksOpen = false;

function applyTweaks() {
  const p = PALETTES[tweaks.palette] || PALETTES.forest;
  const root = document.documentElement;
  root.style.setProperty('--accent', p.accent);
  root.style.setProperty('--accent-pale', p.pale);
  root.style.setProperty('--warm', p.warm);
  document.body.dataset.header = tweaks.header;

  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    if (tweaks.heroLayout === 'fullbleed') {
      heroBg.style.top = '0';
      heroBg.style.left = '0';
      heroBg.style.right = '0';
      heroBg.style.bottom = '0';
      heroBg.style.borderRadius = '0';
    } else {
      heroBg.style.top = '0';
      heroBg.style.left = 'var(--gutter)';
      heroBg.style.right = 'var(--gutter)';
      heroBg.style.bottom = '0';
      heroBg.style.borderRadius = '6px';
    }
  }
}
applyTweaks();

function renderTweaksPanel() {
  let root = document.getElementById('tweaks-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'tweaks-root';
    document.body.appendChild(root);
  }
  if (!tweaksOpen) { root.innerHTML = ''; return; }
  root.innerHTML = `
    <div style="position:fixed; bottom: 96px; right: 28px; z-index: 90;
                background: var(--surface); border: 1px solid var(--line); border-radius: 4px;
                width: 300px; padding: 24px; box-shadow: 0 24px 60px rgba(26,24,21,.18);
                font-family: var(--sans);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px;">
        <div>
          <div style="font-family: var(--serif-en); font-style: italic; font-size: 13px; color: var(--accent);">Tweaks</div>
          <div style="font-family: var(--serif); font-size: 20px; color: var(--ink); margin-top:2px;">옵션 B · 청연</div>
        </div>
        <button id="tweaks-close" style="color:var(--ink-mute); font-size:18px;">✕</button>
      </div>

      <div style="margin-bottom: 26px;">
        <div style="font-family: var(--serif-en); font-style: italic; font-size: 12px; color: var(--ink-soft); margin-bottom: 10px;">Palette</div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
          ${Object.entries(PALETTES).map(([k, p]) => `
            <button data-tweak="palette" data-val="${k}" title="${p.name}"
              style="height: 44px; border-radius: 4px;
                     border: ${tweaks.palette===k ? '2px solid var(--ink)' : '1px solid var(--line)'};
                     background: ${p.accent}; cursor: pointer; padding:0; position: relative;">
              <span style="position:absolute; bottom:-18px; left:0; right:0; font-size:10px; color: var(--ink-soft); font-family: var(--serif-en); font-style: italic;">${p.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 18px;">
        <div style="font-family: var(--serif-en); font-style: italic; font-size: 12px; color: var(--ink-soft); margin-bottom: 10px;">Header</div>
        <div style="display:flex; gap: 4px; background: var(--bg); border: 1px solid var(--line); border-radius: 999px; padding: 3px;">
          ${['blur','transparent','solid'].map(v => `
            <button data-tweak="header" data-val="${v}"
              style="flex:1; padding: 7px 4px; font-size:11px; letter-spacing:.04em; border-radius: 999px;
                background:${tweaks.header===v?'var(--ink)':'transparent'};
                color:${tweaks.header===v?'var(--bg)':'var(--ink-soft)'};">${v}</button>
          `).join('')}
        </div>
      </div>

      <div>
        <div style="font-family: var(--serif-en); font-style: italic; font-size: 12px; color: var(--ink-soft); margin-bottom: 10px;">Hero Layout</div>
        <div style="display:flex; gap: 4px; background: var(--bg); border: 1px solid var(--line); border-radius: 999px; padding: 3px;">
          ${[['inset','Inset'],['fullbleed','Full-bleed']].map(([v,l]) => `
            <button data-tweak="heroLayout" data-val="${v}"
              style="flex:1; padding: 7px 4px; font-size:11px; border-radius: 999px;
                background:${tweaks.heroLayout===v?'var(--ink)':'transparent'};
                color:${tweaks.heroLayout===v?'var(--bg)':'var(--ink-soft)'};">${l}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  root.querySelector('#tweaks-close').addEventListener('click', () => {
    tweaksOpen = false;
    renderTweaksPanel();
    try { window.parent.postMessage({type:'__edit_mode_dismissed'}, '*'); } catch(e){}
  });
  root.querySelectorAll('[data-tweak]').forEach(btn => {
    btn.addEventListener('click', () => {
      tweaks[btn.dataset.tweak] = btn.dataset.val;
      applyTweaks();
      renderTweaksPanel();
      try { window.parent.postMessage({type:'__edit_mode_set_keys', edits: { [btn.dataset.tweak]: btn.dataset.val }}, '*'); } catch(e){}
    });
  });
}

window.addEventListener('message', (e) => {
  if (e.data?.type === '__activate_edit_mode') { tweaksOpen = true; renderTweaksPanel(); }
  if (e.data?.type === '__deactivate_edit_mode') { tweaksOpen = false; renderTweaksPanel(); }
});
try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
