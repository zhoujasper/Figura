(() => {
  /* where the editor lives: change this once the app has its own domain */
  const APP_URL = 'https://figura.netlify.app';
  const REPO_URL = 'https://github.com/zhoujasper/Figura';

  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { } } };
  const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  $$('[data-app]').forEach(a => a.href = APP_URL);
  $$('[data-repo]').forEach(a => a.href = REPO_URL);

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
    const b = $('#theme'); b.innerHTML = TH_IC[theme]; b.title = `Theme: ${theme}`;
  };
  $('#theme').onclick = () => { theme = THEMES[(THEMES.indexOf(theme) + 1) % 3]; ls.set('fg-doc-theme', theme); applyTheme(); };
  applyTheme();

  /* ---------- Mac / Windows keys ---------- */
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  let plat = ls.get('fg-doc-plat') || (isMac ? 'mac' : 'win');
  const KEYN = { mac: { Mod: '⌘', Alt: '⌥', Shift: '⇧' }, win: { Mod: 'Ctrl', Alt: 'Alt', Shift: 'Shift' } };
  $$('kbd').forEach(k => { const t = k.textContent.trim(); if (KEYN.mac[t]) k.dataset.k = t; });
  const applyPlat = () => {
    $$('kbd[data-k]').forEach(k => k.textContent = KEYN[plat][k.dataset.k]);
    $$('.plat button').forEach(b => b.classList.toggle('on', b.dataset.p === plat));
    const on = $('.plat button.on'), pill = $('.plat i');
    if (on && pill && on.offsetWidth) { pill.style.left = on.offsetLeft + 'px'; pill.style.width = on.offsetWidth + 'px'; }
  };
  $$('.plat button').forEach(b => b.onclick = () => { plat = b.dataset.p; ls.set('fg-doc-plat', plat); applyPlat(); });
  applyPlat();
  if (document.fonts) document.fonts.ready.then(applyPlat);

  /* ---------- pages ---------- */
  const pages = $$('article[data-page]');
  const side = $('#side');
  let group = null;
  pages.forEach(p => {
    if (p.dataset.group !== group) { group = p.dataset.group; const h = document.createElement('h4'); h.textContent = group; side.append(h); }
    const a = document.createElement('a'); a.href = '#/' + p.dataset.page; a.textContent = p.dataset.title; a.dataset.p = p.dataset.page; side.append(a);
    /* heading ids + anchors */
    $$('h2, h3', p).forEach(h => {
      if (!h.id) h.id = p.dataset.page + '--' + slug(h.textContent);
      const an = document.createElement('a'); an.className = 'anchor'; an.href = '#/' + p.dataset.page + '/' + h.id.split('--')[1]; an.textContent = '#';
      an.setAttribute('aria-label', 'Link to this section'); h.append(an);
    });
    /* crumb + prev / next */
    if (p.dataset.page !== 'home') { const c = document.createElement('div'); c.className = 'crumb'; c.textContent = p.dataset.group; p.prepend(c); }
  });
  pages.forEach((p, i) => {
    const pv = pages[i - 1], nx = pages[i + 1], pn = document.createElement('nav'); pn.className = 'pn';
    if (pv) pn.insertAdjacentHTML('beforeend', `<a class="prev" href="#/${pv.dataset.page}"><small>Previous</small>${pv.dataset.title}</a>`);
    if (nx) pn.insertAdjacentHTML('beforeend', `<a class="next" href="#/${nx.dataset.page}"><small>Next</small>${nx.dataset.title}</a>`);
    p.append(pn);
  });

  /* ---------- code: copy + light TeX colouring ---------- */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  $$('pre code').forEach(c => {
    const raw = c.textContent;
    if (c.classList.contains('tex')) c.innerHTML = raw.split('\n').map(l => {
      const i = l.search(/(?<!\\)%/); const body = i < 0 ? l : l.slice(0, i), cm = i < 0 ? '' : l.slice(i);
      return esc(body).replace(/\\[a-zA-Z@]+/g, m => `<span class="tk-k">${m}</span>`) + (cm ? `<span class="tk-c">${esc(cm)}</span>` : '');
    }).join('\n');
    const b = document.createElement('button'); b.className = 'copy'; b.textContent = 'Copy';
    b.onclick = () => {
      const done = () => { b.textContent = 'Copied'; b.classList.add('done'); setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('done'); }, 1400); };
      (navigator.clipboard?.writeText(raw) || Promise.reject()).then(done, () => {
        const t = document.createElement('textarea'); t.value = raw; document.body.append(t); t.select(); try { document.execCommand('copy'); done(); } catch { } t.remove();
      });
    };
    c.parentElement.append(b);
  });

  /* ---------- routing ---------- */
  let cur = null;
  const toc = $('#toc');
  function show(hash, smooth) {
    const [, pg = 'home', sec] = (hash || '').match(/^#\/([^/]*)\/?(.*)$/) || [];
    const page = pages.find(p => p.dataset.page === pg) || pages[0];
    if (page !== cur) {
      pages.forEach(p => p.classList.toggle('on', p === page));
      $$('a', side).forEach(a => a.classList.toggle('on', a.dataset.p === page.dataset.page));
      cur = page;
      document.title = page.dataset.page === 'home' ? 'Figura Guide' : `${page.dataset.title} · Figura Guide`;
      buildToc();
      if (!sec) window.scrollTo(0, 0);
    }
    if (sec) { const t = document.getElementById(page.dataset.page + '--' + sec); if (t) requestAnimationFrame(() => t.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })); }
    document.body.classList.remove('nav');
  }
  function buildToc() {
    const hs = $$('h2, h3', cur);
    toc.innerHTML = hs.length ? '<h5>On this page</h5>' + hs.map(h => `<a class="${h.tagName.toLowerCase()}" href="#/${cur.dataset.page}/${h.id.split('--')[1]}" data-id="${h.id}">${esc(h.firstChild.textContent)}</a>`).join('') : '';
    spy();
  }
  function spy() {
    const hs = $$('h2, h3', cur); let on = hs[0];
    for (const h of hs) if (h.getBoundingClientRect().top < 120) on = h;
    if (innerHeight + scrollY >= document.body.scrollHeight - 4 && hs.length) on = hs[hs.length - 1];
    $$('a', toc).forEach(a => a.classList.toggle('on', !!on && a.dataset.id === on.id));
  }
  addEventListener('hashchange', () => show(location.hash, true));
  addEventListener('scroll', () => { spy(); $('.top').classList.toggle('scrolled', scrollY > 4); }, { passive: true });
  show(location.hash, false);

  /* ---------- phone menu ---------- */
  $('#menu').onclick = () => document.body.classList.toggle('nav');
  $('.scrim').onclick = () => document.body.classList.remove('nav');

  /* ---------- search ---------- */
  const idx = [];
  pages.forEach(p => {
    const t = p.dataset.title, pg = p.dataset.page;
    let sec = { title: t, page: t, href: '#/' + pg, text: '' };
    idx.push(sec);
    [...p.children].forEach(el => {
      if (el.matches('.pn, .crumb')) return;
      if (el.matches('h2, h3')) { sec = { title: el.firstChild.textContent, page: t, href: '#/' + pg + '/' + el.id.split('--')[1], text: '' }; idx.push(sec); }
      else sec.text += ' ' + el.textContent.replace(/\s+/g, ' ');
    });
  });
  const sk = $('#sk'), skIn = $('#skIn'), skRes = $('#skRes');
  let hits = [], hi = 0;
  const openSk = () => { sk.hidden = false; skIn.value = ''; runSk(); setTimeout(() => skIn.focus(), 0); };
  const closeSk = () => { sk.hidden = true; };
  function runSk() {
    const q = skIn.value.trim().toLowerCase();
    if (!q) { hits = idx.filter(s => s.title === s.page).slice(0, 12); }
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
      : '<div class="sk-empty">Nothing found</div>';
  }
  skIn.oninput = runSk;
  skIn.onkeydown = e => {
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
