/* Font Book — browse the typefaces you love.
   Runs inside the normal desktop window system: data.js declares the "fontbook"
   item (icon + window), and this file fills the window when it opens. */
const FontBook = (() => {
  'use strict';

  /* ===== EDIT YOUR FONTS HERE =====
     name  : display name
     css   : CSS font-family value
     gf    : Google Fonts family string ('' if already loaded or a system font)
     cat   : serif | sans | display | script | mono                          */
  const FONTS = [
    { name: 'Fraunces',            css: "'Fraunces', serif",                 gf: 'Fraunces:wght@400;700',            cat: 'serif' },
    { name: 'Playfair Display',    css: "'Playfair Display', serif",         gf: 'Playfair+Display:wght@400;700',    cat: 'serif' },
    { name: 'DM Serif Display',    css: "'DM Serif Display', serif",         gf: 'DM+Serif+Display',                 cat: 'display' },
    { name: 'Space Grotesk',       css: "'Space Grotesk', sans-serif",       gf: 'Space+Grotesk:wght@400;700',       cat: 'sans' },
    { name: 'Bricolage Grotesque', css: "'Bricolage Grotesque', sans-serif", gf: 'Bricolage+Grotesque:wght@400;700', cat: 'sans' },
    { name: 'Inter',               css: "Inter, sans-serif",                 gf: '',                                 cat: 'sans' },
    { name: 'Syne',                css: "'Syne', sans-serif",                gf: 'Syne:wght@400;700',                cat: 'display' },
    { name: 'Archivo Black',       css: "'Archivo Black', sans-serif",       gf: 'Archivo+Black',                    cat: 'display' },
    { name: 'Caveat',              css: "'Caveat', cursive",                 gf: 'Caveat:wght@400;700',              cat: 'script' },
    { name: 'DM Mono',             css: "'DM Mono', monospace",              gf: 'DM+Mono:wght@400;500',             cat: 'mono' }
  ];

  const T = {
    en: {
      all: 'All', regular: 'Regular', bold: 'Bold', size: 'Size', list: 'Typefaces',
      sample: 'Sphinx of black quartz, judge my vow.',
      cat: { serif: 'Serif', sans: 'Sans', display: 'Display', script: 'Script', mono: 'Mono' }
    },
    fr: {
      all: 'Toutes', regular: 'Normal', bold: 'Gras', size: 'Taille', list: 'Polices',
      sample: 'Portez ce vieux whisky au juge blond qui fume.',
      cat: { serif: 'Serif', sans: 'Sans', display: 'Display', script: 'Manuscrite', mono: 'Mono' }
    }
  };

  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 &?!@#%€';
  const state = { cat: 'all', index: 0, bold: false, size: 40, text: null };
  let fontsLoaded = false;

  const lang = () => {
    try { if (typeof I18n !== 'undefined') return I18n.getLanguage() === 'fr' ? 'fr' : 'en'; } catch (_) {}
    return document.documentElement.lang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  };
  const t = () => T[lang()];
  const visible = () => FONTS.filter(f => state.cat === 'all' || f.cat === state.cat);
  const current = () => visible()[state.index] || visible()[0];

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function loadFonts() {
    if (fontsLoaded) return;
    fontsLoaded = true;
    const fams = FONTS.map(f => f.gf).filter(Boolean).map(g => 'family=' + g).join('&');
    if (!fams) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?' + fams + '&display=swap';
    document.head.appendChild(link);
  }

  function create(host) {
    if (!host || host.dataset.fbReady) return;
    host.dataset.fbReady = '1';
    loadFonts();

    /* ---------- structure ---------- */
    const side = el('div', 'fb-side');
    const chips = el('div', 'fb-chips');
    const list = el('ul', 'fb-list');
    list.setAttribute('role', 'listbox');
    side.append(chips, list);

    const preview = el('div', 'fb-preview');
    const eyebrow = el('p', 'fb-eyebrow');
    const name = el('h2', 'fb-name');
    const seg = el('div', 'fb-seg');
    const segBtns = {};
    ['regular', 'bold'].forEach(w => {
      const b = el('button');
      b.type = 'button';
      b.addEventListener('click', () => { state.bold = w === 'bold'; renderPreview(); });
      segBtns[w] = b;
      seg.appendChild(b);
    });
    const sizeLabel = el('span');
    const range = el('input');
    range.type = 'range'; range.min = 16; range.max = 96; range.value = state.size;
    range.addEventListener('input', () => { state.size = +range.value; renderPreview(); });
    const sizeWrap = el('label', 'fb-size');
    sizeWrap.append(sizeLabel, range);
    const controls = el('div', 'fb-controls');
    controls.append(seg, sizeWrap);
    const sample = el('div', 'fb-sample');
    sample.setAttribute('contenteditable', 'true');
    sample.setAttribute('spellcheck', 'false');
    sample.addEventListener('input', () => { state.text = sample.textContent; });
    sample.addEventListener('blur', () => { if (!sample.textContent.trim()) { state.text = null; renderPreview(); } });
    const glyphs = el('p', 'fb-glyphs');
    preview.append(eyebrow, name, controls, sample, glyphs);

    host.textContent = '';
    host.append(side, preview);

    /* ---------- rendering ---------- */
    function renderChips() {
      chips.textContent = '';
      ['all', 'serif', 'sans', 'display', 'script', 'mono']
        .filter(c => c === 'all' || FONTS.some(f => f.cat === c))
        .forEach(c => {
          const b = el('button', 'fb-chip', c === 'all' ? t().all : t().cat[c]);
          b.type = 'button';
          b.setAttribute('aria-pressed', String(state.cat === c));
          b.addEventListener('click', () => { state.cat = c; state.index = 0; renderChips(); renderList(); renderPreview(); });
          chips.appendChild(b);
        });
    }

    function renderList() {
      list.textContent = '';
      list.setAttribute('aria-label', t().list);
      visible().forEach((f, i) => {
        const li = el('li');
        const b = el('button', 'fb-item');
        b.type = 'button';
        b.setAttribute('role', 'option');
        b.setAttribute('aria-selected', String(i === state.index));
        const n = el('span', 'fb-item__name', f.name);
        n.style.fontFamily = f.css;
        b.append(n, el('span', 'fb-item__cat', t().cat[f.cat]));
        b.addEventListener('click', () => { state.index = i; renderList(); renderPreview(); });
        li.appendChild(b);
        list.appendChild(li);
      });
    }

    function renderPreview() {
      const f = current();
      if (!f) return;
      const weight = state.bold ? 700 : 400;
      eyebrow.textContent = t().cat[f.cat];
      [name, sample, glyphs].forEach(n => { n.style.fontFamily = f.css; n.style.fontWeight = weight; });
      name.textContent = f.name;
      sample.style.setProperty('--fb-size', state.size + 'px');
      if (document.activeElement !== sample) sample.textContent = state.text == null ? t().sample : state.text;
      glyphs.textContent = ALPHA;
      segBtns.regular.textContent = t().regular;
      segBtns.bold.textContent = t().bold;
      segBtns.regular.setAttribute('aria-pressed', String(!state.bold));
      segBtns.bold.setAttribute('aria-pressed', String(state.bold));
      sizeLabel.textContent = t().size;
    }

    function renderAll() { renderChips(); renderList(); renderPreview(); }

    /* arrow keys move through the list */
    host.addEventListener('keydown', e => {
      if ((e.key !== 'ArrowDown' && e.key !== 'ArrowUp') || e.target.closest('.fb-sample, input')) return;
      e.preventDefault();
      const n = visible().length;
      state.index = (state.index + (e.key === 'ArrowDown' ? 1 : -1) + n) % n;
      renderList(); renderPreview();
      const sel = list.querySelector('.fb-item[aria-selected="true"]');
      if (sel) { sel.focus(); sel.scrollIntoView({ block: 'nearest' }); }
    });

    /* follow the FR / EN switch; stop once the window is gone */
    const onLanguage = () => {
      if (!host.isConnected) { document.removeEventListener('portfolio:language-changed', onLanguage); return; }
      renderAll();
    };
    document.addEventListener('portfolio:language-changed', onLanguage);

    renderAll();
  }

  document.addEventListener('portfolio:window-opened', event => {
    if (event.detail?.id !== 'font-book') return;
    create(event.detail.element.querySelector('[data-fontbook-app]'));
  });

  return { create };
})();
