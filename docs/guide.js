(() => {
  /* where the editor lives: change this once the app has its own domain */
  const APP_URL = 'https://figura.netlify.app';
  const REPO_URL = 'https://github.com/zhoujasper/Figura';

  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { } } };
  const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  $$('[data-app]').forEach(a => a.href = APP_URL);
  $$('[data-repo]').forEach(a => a.href = REPO_URL);
  /* the Chinese home page borrows the drawing */
  $$('[data-art]').forEach(d => d.replaceWith($('.hero-art').cloneNode(true)));

  /* ---------- language ---------- */
  const UI = {
    en: { search: 'Search', find: 'Search the guide', none: 'Nothing found', prev: 'Previous', next: 'Next', toc: 'On this page', open: 'Open Figura',
      copy: 'Copy', copied: 'Copied', title: 'Figura Guide', theme: 'Theme', sw: '中文', swT: '切换到中文' },
    zh: { search: '搜索', find: '搜索指南', none: '没有找到', prev: '上一页', next: '下一页', toc: '本页内容', open: '打开 Figura',
      copy: '复制', copied: '已复制', title: 'Figura 使用指南', theme: '主题', sw: 'EN', swT: 'Switch to English' },
  };
  const qLang = new URLSearchParams(location.search).get('lang');
  if (qLang === 'zh' || qLang === 'en') ls.set('fg-doc-lang', qLang);
  let lang = ls.get('fg-doc-lang') || (/^zh/i.test(navigator.language || '') ? 'zh' : 'en');
  const t = k => UI[lang][k];
  const all = $$('article[data-page]');
  const langOf = a => a.getAttribute('lang') || 'en';

  /* ---------- theme ---------- */
  const THEMES = ['auto', 'light', 'dark'];
  const TH_IC = {
    auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  };
  let theme = ls.get('fg-doc-theme') || 'auto';
  const applyTheme = () => {
    if (theme === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = theme;
    const b = $('#theme'); b.innerHTML = TH_IC[theme]; b.title = `${t('theme')}: ${theme}`;
  };
  $('#theme').onclick = () => { theme = THEMES[(THEMES.indexOf(theme) + 1) % 3]; ls.set('fg-doc-theme', theme); applyTheme(); };

  /* ---------- Mac / Windows keys ---------- */
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  let plat = ls.get('fg-doc-plat') || (isMac ? 'mac' : 'win');
  const KEYN = { mac: { Mod: '⌘', Alt: '⌥', Shift: '⇧' }, win: { Mod: 'Ctrl', Alt: 'Alt', Shift: 'Shift' } };
  $$('kbd').forEach(k => { const v = k.textContent.trim(); if (KEYN.mac[v]) k.dataset.k = v; });
  const placePill = () => {
    const on = $('.plat button.on'), pill = $('.plat i');
    if (on && pill && on.offsetWidth) { pill.style.left = on.offsetLeft + 'px'; pill.style.width = on.offsetWidth + 'px'; }
  };
  const applyPlat = () => {
    $$('kbd[data-k]').forEach(k => k.textContent = KEYN[plat][k.dataset.k]);
    $$('.plat button').forEach(b => b.classList.toggle('on', b.dataset.p === plat));
    placePill();
    drawDemos();
  };
  $$('.plat button').forEach(b => b.onclick = () => { plat = b.dataset.p; ls.set('fg-doc-plat', plat); applyPlat(); });

  /* ---------- looping demos (demos.js, generated from the app's DEMOS) ---------- */
  const DM_ZH = { 'arc': '弧线', 'Bézier': '贝塞尔', 'S-curve': 'S 形', 'elbow': '折线', '15° per press': '每按一次 15°' };
  function drawDemos() {
    const D = window.FG_DEMOS || {}, W = window.FG_DEMOS_WIN || {};
    $$('[data-demo]').forEach((f, i) => {
      let svg = (plat === 'win' && W[f.dataset.demo]) || D[f.dataset.demo]; if (!svg) return;
      /* gradient ids must be unique on the page (the other language's copy is hidden) */
      svg = svg.replace(/id="(\w+)"/g, `id="$1-${i}"`).replace(/url\(#(\w+)\)/g, `url(#$1-${i})`);
      if (f.closest('[lang="zh"]')) svg = svg.replace(/(class="dlabel"[^>]*>)([^<]+)/g, (m, a, b) => a + (DM_ZH[b] || b));
      let dm = f.querySelector('.dm'); if (!dm) { dm = document.createElement('div'); dm.className = 'dm'; f.prepend(dm); }
      dm.innerHTML = svg;
    });
  }

  /* ---------- once per article: heading ids, anchors, crumbs, code ---------- */
  all.forEach(p => {
    const pg = p.dataset.page, pre = langOf(p) === 'zh' ? 'zh-' : '';
    $$('h2, h3', p).forEach((h, i) => {
      if (!h.id) h.id = pg + '--' + pre + (slug(h.textContent) || 's' + (i + 1));
      const an = document.createElement('a'); an.className = 'anchor'; an.href = '#/' + pg + '/' + h.id.split('--')[1]; an.textContent = '#';
      an.setAttribute('aria-label', 'Link'); h.append(an);
    });
    if (pg !== 'home') { const c = document.createElement('div'); c.className = 'crumb'; c.textContent = p.dataset.group; p.prepend(c); }
  });
  $$('pre code').forEach(c => {
    const raw = c.textContent;
    if (c.classList.contains('tex')) c.innerHTML = raw.split('\n').map(l => {
      const i = l.search(/(?<!\\)%/); const body = i < 0 ? l : l.slice(0, i), cm = i < 0 ? '' : l.slice(i);
      return esc(body).replace(/\\[a-zA-Z@]+/g, m => `<span class="tk-k">${m}</span>`) + (cm ? `<span class="tk-c">${esc(cm)}</span>` : '');
    }).join('\n');
    const b = document.createElement('button'); b.className = 'copy'; b.textContent = t('copy');
    b.onclick = () => {
      const done = () => { b.textContent = t('copied'); b.classList.add('done'); setTimeout(() => { b.textContent = t('copy'); b.classList.remove('done'); }, 1400); };
      (navigator.clipboard?.writeText(raw) || Promise.reject()).then(done, () => {
        const ta = document.createElement('textarea'); ta.value = raw; document.body.append(ta); ta.select(); try { document.execCommand('copy'); done(); } catch { } ta.remove();
      });
    };
    c.parentElement.append(b);
  });

  /* ---------- per language: sidebar, prev / next, search index ---------- */
  const side = $('#side'), toc = $('#toc');
  let pages = [], idx = [], cur = null;
  function build() {
    pages = all.filter(a => langOf(a) === lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    side.innerHTML = ''; let group = null;
    pages.forEach(p => {
      if (p.dataset.group !== group) { group = p.dataset.group; const h = document.createElement('h4'); h.textContent = group; side.append(h); }
      const a = document.createElement('a'); a.href = '#/' + p.dataset.page; a.textContent = p.dataset.title; a.dataset.p = p.dataset.page; side.append(a);
    });
    pages.forEach((p, i) => {
      p.querySelector(':scope > .pn')?.remove();
      const pv = pages[i - 1], nx = pages[i + 1], pn = document.createElement('nav'); pn.className = 'pn';
      if (pv) pn.insertAdjacentHTML('beforeend', `<a class="prev" href="#/${pv.dataset.page}"><small>${t('prev')}</small>${pv.dataset.title}</a>`);
      if (nx) pn.insertAdjacentHTML('beforeend', `<a class="next" href="#/${nx.dataset.page}"><small>${t('next')}</small>${nx.dataset.title}</a>`);
      p.append(pn);
    });
    idx = [];
    pages.forEach(p => {
      const ti = p.dataset.title, pg = p.dataset.page;
      let sec = { title: ti, page: ti, href: '#/' + pg, text: '' }; idx.push(sec);
      [...p.children].forEach(el => {
        if (el.matches('.pn, .crumb, .demos')) return;
        if (el.matches('h2, h3')) { sec = { title: el.firstChild.textContent, page: ti, href: '#/' + pg + '/' + el.id.split('--')[1], text: '' }; idx.push(sec); }
        else sec.text += ' ' + el.textContent.replace(/\s+/g, ' ');
      });
    });
    /* chrome */
    $('#search span').textContent = t('search');
    $('#skIn').placeholder = t('find');
    $$('[data-app]').forEach(a => { if (!a.querySelector('*')) a.textContent = t('open'); });
    $$('.copy').forEach(b => b.textContent = t('copy'));
    const lb = $('#lang'); lb.textContent = t('sw'); lb.title = t('swT');
    applyTheme();
    cur = null;
  }

  /* ---------- routing ---------- */
  function show(hash, smooth) {
    const [, pg = 'home', sec] = (hash || '').match(/^#\/([^/]*)\/?(.*)$/) || [];
    const page = pages.find(p => p.dataset.page === pg) || pages[0];
    if (page !== cur) {
      all.forEach(p => p.classList.toggle('on', p === page));
      $$('a', side).forEach(a => a.classList.toggle('on', a.dataset.p === page.dataset.page));
      cur = page;
      document.title = page.dataset.page === 'home' ? t('title') : `${page.dataset.title} · ${t('title')}`;
      buildToc();
      if (!sec) window.scrollTo(0, 0);
    }
    if (sec) { const el = document.getElementById(page.dataset.page + '--' + sec); if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })); }
    document.body.classList.remove('nav');
  }
  function buildToc() {
    const hs = $$('h2, h3', cur);
    toc.innerHTML = hs.length ? `<h5>${t('toc')}</h5>` + hs.map(h => `<a class="${h.tagName.toLowerCase()}" href="#/${cur.dataset.page}/${h.id.split('--')[1]}" data-id="${h.id}">${esc(h.firstChild.textContent)}</a>`).join('') : '';
    spy();
  }
  function spy() {
    if (!cur) return;
    const hs = $$('h2, h3', cur); let on = hs[0];
    for (const h of hs) if (h.getBoundingClientRect().top < 120) on = h;
    if (innerHeight + scrollY >= document.body.scrollHeight - 4 && hs.length) on = hs[hs.length - 1];
    $$('a', toc).forEach(a => a.classList.toggle('on', !!on && a.dataset.id === on.id));
  }
  addEventListener('hashchange', () => show(location.hash, true));
  addEventListener('scroll', () => { spy(); $('.top').classList.toggle('scrolled', scrollY > 4); }, { passive: true });

  $('#lang').onclick = () => {
    lang = lang === 'zh' ? 'en' : 'zh'; ls.set('fg-doc-lang', lang);
    const pg = cur?.dataset.page || 'home';
    build();
    if (location.hash.split('/')[1] === pg && !location.hash.split('/')[2]) show('#/' + pg); else location.hash = '#/' + pg;
  };

  build();
  applyPlat();
  if (document.fonts) document.fonts.ready.then(placePill);
  show(location.hash, false);

  /* ---------- phone menu ---------- */
  $('#menu').onclick = () => document.body.classList.toggle('nav');
  $('.scrim').onclick = () => document.body.classList.remove('nav');

  /* ---------- search ---------- */
  const sk = $('#sk'), skIn = $('#skIn'), skRes = $('#skRes');
  let hits = [], hi = 0;
  const openSk = () => { sk.hidden = false; skIn.value = ''; runSk(); setTimeout(() => skIn.focus(), 0); };
  const closeSk = () => { sk.hidden = true; };
  function runSk() {
    const q = skIn.value.trim().toLowerCase();
    if (!q) { hits = idx.filter(s => s.title === s.page).slice(0, 14); }
    else {
      const ws = q.split(/\s+/);
      hits = idx.map(s => {
        const ti = s.title.toLowerCase(), tx = s.text.toLowerCase(); let sc = 0;
        for (const w of ws) { if (ti.includes(w)) sc += 10; else if (tx.includes(w)) sc += 1; else return null; }
        return { s, sc };
      }).filter(Boolean).sort((a, b) => b.sc - a.sc).slice(0, 14).map(x => x.s);
    }
    hi = 0;
    const mk = str => { let h = esc(str); if (q) for (const w of q.split(/\s+/)) h = h.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); return h; };
    const snip = s => { if (!q) return ''; const w = q.split(/\s+/)[0], i = s.text.toLowerCase().indexOf(w); return i < 0 ? '' : '…' + s.text.slice(Math.max(0, i - 30), i + 90).trim(); };
    skRes.innerHTML = hits.length ? hits.map((s, i) => `<a href="${s.href}" class="${i ? '' : 'on'}"><b>${mk(s.title)}</b><small>${s.title === s.page ? '' : esc(s.page) + ' · '}${mk(snip(s))}</small></a>`).join('')
      : `<div class="sk-empty">${t('none')}</div>`;
  }
  skIn.oninput = runSk;
  skIn.onkeydown = e => {
    if (e.isComposing) return;
    const as = $$('a', skRes);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); hi = (hi + (e.key === 'ArrowDown' ? 1 : -1) + as.length) % as.length; as.forEach((a, i) => a.classList.toggle('on', i === hi)); as[hi]?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter' && as[hi]) { location.hash = as[hi].getAttribute('href'); closeSk(); }
  };
  skRes.onclick = e => { if (e.target.closest('a')) closeSk(); };
  sk.onclick = e => { if (e.target === sk) closeSk(); };
  $('#search').onclick = openSk;
  $('.search-btn kbd').textContent = isMac ? '⌘K' : 'Ctrl K';
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); sk.hidden ? openSk() : closeSk(); }
    else if (e.key === '/' && sk.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSk(); }
    else if (e.key === 'Escape') { closeSk(); document.body.classList.remove('nav'); }
  });
})();
