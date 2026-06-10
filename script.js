/* ═══════════════════════════════════════════════
   LetterForge AI — script.js
   ═══════════════════════════════════════════════ */
'use strict';

/* ── tiny helper ── */
const $ = id => document.getElementById(id);

/* ══════════════════════════════════════
   ELEMENT REFS
══════════════════════════════════════ */
const themeBtn     = $('themeBtn');
const themeIco     = $('themeIco');
const menuBtn      = $('menuBtn');
const navMenu      = $('navMenu');
const navbar       = $('navbar');
const clForm       = $('clForm');
const genBtn       = $('genBtn');
const clearBtn     = $('clearBtn');
const letterOut    = $('letterOut');
const emptyState   = $('emptyState');
const copyBtn      = $('copyBtn');
const printBtn     = $('printBtn');
const pdfBtn       = $('pdfBtn');
const atsFill      = $('atsFill');
const atsPct       = $('atsPct');
const toast        = $('toast');

/* ── state ── */
let activeTemplate      = 'corporate';
let lastGenData         = null;
let toastTimer          = null;
let scrollTicking       = false;
let printCount          = 0;   // how many times current data has been printed

/* ══════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════ */
(function () {
  const canvas = $('particleCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const COLORS = ['#0ea5e9','#6366f1','#8b5cf6','#ec4899'];
  let W, H, pts = [];

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }

  function mkPt() {
    return { x: Math.random()*W, y: Math.random()*H,
             r: Math.random()*3+1,
             dx:(Math.random()-.5)*.45, dy:(Math.random()-.5)*.45,
             color:COLORS[Math.floor(Math.random()*COLORS.length)],
             a: Math.random()*.35+.08 };
  }

  resize();
  for (let i=0;i<65;i++) pts.push(mkPt());
  window.addEventListener('resize', resize, {passive:true});

  (function draw() {
    ctx.clearRect(0,0,W,H);
    for (const p of pts) {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color; ctx.globalAlpha=p.a; ctx.fill();
      p.x+=p.dx; p.y+=p.dy;
      if(p.x<0||p.x>W) p.dx*=-1;
      if(p.y<0||p.y>H) p.dy*=-1;
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(draw);
  })();
})();

/* ══════════════════════════════════════
   TYPING ANIMATION
══════════════════════════════════════ */
(function () {
  const el = $('typeEl'); if (!el) return;
  const phrases = ['Cover Letters Instantly','ATS-Optimized Letters',
                   'Job-Winning Applications','Your Career Story','Internship Applications'];
  let pi=0, ci=0, del=false;
  function tick() {
    const cur = phrases[pi];
    el.textContent = del ? cur.slice(0,--ci) : cur.slice(0,++ci);
    if (!del && ci===cur.length) { del=true; setTimeout(tick,2200); return; }
    if (del  && ci===0)          { del=false; pi=(pi+1)%phrases.length; }
    setTimeout(tick, del?45:75);
  }
  tick();
})();

/* ══════════════════════════════════════
   THEME
══════════════════════════════════════ */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  themeIco.className = t==='dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('lf-theme', t);
}
applyTheme(localStorage.getItem('lf-theme') || 'light');
themeBtn.addEventListener('click', () =>
  applyTheme(document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark'));

/* ══════════════════════════════════════
   NAVBAR  (throttled scroll)
══════════════════════════════════════ */
menuBtn.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});
navMenu.querySelectorAll('.nav-item').forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded','false');
}));

/* cache once — never query on every scroll */
const _sections = Array.from(document.querySelectorAll('section[id]'));
const _navLinks  = Array.from(document.querySelectorAll('.nav-item'));

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    navbar.classList.toggle('scrolled', scrollY > 20);
    let cur = '';
    for (const s of _sections) { if (scrollY >= s.offsetTop-130) cur = s.id; }
    for (const a of _navLinks)  { a.classList.toggle('active', a.getAttribute('href')==='#'+cur); }
    scrollTicking = false;
  });
}, {passive:true});

/* ══════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); revObs.unobserve(e.target); } });
}, {threshold:0.1});
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ══════════════════════════════════════
   TEMPLATE BUTTONS
══════════════════════════════════════ */
document.querySelectorAll('.tpl-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tpl-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTemplate = btn.dataset.tpl;
    if (lastGenData) renderLetter(lastGenData);   // re-render with new template
  });
});

/* ══════════════════════════════════════
   FIELD CONFIG
   Each entry maps: field id → counter id → error element id
══════════════════════════════════════ */
const FIELD_MAP = [
  { fid:'f-name',    cid:'c-name',    eid:'e-name'    },
  { fid:'f-role',    cid:'c-role',    eid:'e-role'    },
  { fid:'f-company', cid:'c-company', eid:'e-company' },
  { fid:'f-skills',  cid:'c-skills',  eid:'e-skills'  },
  { fid:'f-exp',     cid:'c-exp',     eid:null         },
  { fid:'f-edu',     cid:'c-edu',     eid:null         },
  { fid:'f-why',     cid:'c-why',     eid:'e-why'     },
  { fid:'f-extra',   cid:'c-extra',   eid:null         },
];

/* attach counter + live error-clear to every field */
FIELD_MAP.forEach(({ fid, cid, eid }) => {
  const el  = $(fid);
  const cnt = $(cid);
  if (!el) return;
  el.addEventListener('input', () => {
    if (cnt) cnt.textContent = el.value.length;
    clearFieldError(el, eid);   // remove red border as user types
    autoSave();
    updateATS();
  });
});

/* email — separate because it has no counter */
const emailEl = $('f-email');
if (emailEl) emailEl.addEventListener('input', () => {
  clearFieldError(emailEl, 'e-email');
  autoSave();
});

/* phone / linkedin — just save */
['f-phone','f-linkedin'].forEach(id => {
  const el = $(id); if (el) el.addEventListener('input', autoSave);
});

/* helper: remove red border + error text */
function clearFieldError(inputEl, errId) {
  inputEl.classList.remove('invalid');
  if (errId) { const e = $(errId); if (e) e.textContent = ''; }
}

/* ══════════════════════════════════════
   LOCAL STORAGE
══════════════════════════════════════ */
function autoSave() {
  const d = {};
  FIELD_MAP.forEach(({ fid }) => { const el=$(fid); if(el) d[fid]=el.value; });
  ['f-email','f-phone','f-linkedin'].forEach(id => { const el=$(id); if(el) d[id]=el.value; });
  d.tpl = activeTemplate;
  try { localStorage.setItem('lf-form', JSON.stringify(d)); } catch(_) {}
}

function loadSaved() {
  let d;
  try { d = JSON.parse(localStorage.getItem('lf-form')||'null'); } catch(_){ return; }
  if (!d) return;
  FIELD_MAP.forEach(({ fid, cid }) => {
    const el=$(fid), cnt=$(cid);
    if (el && d[fid]!=null) { el.value=d[fid]; if(cnt) cnt.textContent=d[fid].length; }
  });
  ['f-email','f-phone','f-linkedin'].forEach(id => {
    const el=$(id); if(el && d[id]!=null) el.value=d[id];
  });
  if (d.tpl) {
    activeTemplate = d.tpl;
    document.querySelectorAll('.tpl-opt').forEach(b =>
      b.classList.toggle('active', b.dataset.tpl===d.tpl));
  }
  updateATS();
}
loadSaved();

/* ══════════════════════════════════════
   ATS SCORE
══════════════════════════════════════ */
function updateATS() {
  const v = id => ($(id)||{value:''}).value.trim();
  const checks = {
    'ai-name':   v('f-name').length > 0,
    'ai-role':   v('f-role').length > 0,
    'ai-skills': v('f-skills').split(',').filter(s=>s.trim()).length >= 2,
    'ai-exp':    v('f-exp').length > 20,
    'ai-edu':    v('f-edu').length > 4,
    'ai-why':    v('f-why').length > 30,
  };
  const pct = Math.round(Object.values(checks).filter(Boolean).length / 6 * 100);
  atsFill.style.width = pct+'%';
  atsPct.textContent  = pct+'%';
  atsFill.style.background =
    pct < 40 ? 'linear-gradient(90deg,#ef4444,#f97316)' :
    pct < 70 ? 'linear-gradient(90deg,#f59e0b,#eab308)' :
               'linear-gradient(90deg,#10b981,#059669)';
  Object.entries(checks).forEach(([id,ok]) => {
    const el=$(id); if(el) el.classList.toggle('ok',ok);
  });
}

/* ══════════════════════════════════════
   FORM VALIDATION
══════════════════════════════════════ */
function validate() {
  let ok = true;
  function chk(fid, eid, msg, testFn) {
    const el=$(fid), err=$(eid);
    const val = el ? el.value.trim() : '';
    const fail = !val || (testFn && !testFn(val));
    if (el)  el.classList.toggle('invalid', fail);
    if (err) err.textContent = fail ? msg : '';
    if (fail) ok = false;
  }
  chk('f-name',    'e-name',    'Full name is required.');
  chk('f-email',   'e-email',   'Valid email is required.',
      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  chk('f-role',    'e-role',    'Job role is required.');
  chk('f-company', 'e-company', 'Company name is required.');
  chk('f-skills',  'e-skills',  'Add at least one skill.');
  chk('f-why',     'e-why',     'Please explain your motivation.');
  return ok;
}

/* ══════════════════════════════════════
   BUILD DATA
══════════════════════════════════════ */
function buildData() {
  const v = id => ($(id)||{value:''}).value.trim();
  return {
    name:     v('f-name'),
    email:    v('f-email'),
    phone:    v('f-phone'),
    linkedin: v('f-linkedin'),
    role:     v('f-role'),
    company:  v('f-company'),
    skills:   v('f-skills'),
    exp:      v('f-exp'),
    edu:      v('f-edu'),
    why:      v('f-why'),
    extra:    v('f-extra'),
  };
}

/* ══════════════════════════════════════
   LETTER CONTENT
══════════════════════════════════════ */
function buildContent(d) {
  const today = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const arr   = d.skills.split(',').map(s=>s.trim()).filter(Boolean);
  const s3    = arr.slice(0,3).join(', ') || 'relevant technologies';
  const s2    = arr.slice(0,2).join(' and ') || 'my core skills';

  // Hard-cap user inputs so the letter always fits one page
  function cap(str, max) {
    if (!str) return '';
    str = str.trim();
    if (str.length <= max) return str;
    // Cut at last space before limit so no word is chopped
    const cut = str.lastIndexOf(' ', max);
    return str.slice(0, cut > 0 ? cut : max) + '…';
  }

  const opening = 'I am writing to express my enthusiastic interest in the '+d.role+' position at '+d.company
    +'. With a strong foundation in '+s3+', and a genuine drive to deliver meaningful results, I am confident I would be a valuable addition to your team.';

  // Experience capped at 300 chars to keep it to 2–3 lines
  const expRaw  = cap(d.exp, 300);
  const expPara = expRaw
    ? 'Throughout my career, '+expRaw+' This experience has sharpened my ability to tackle complex challenges and collaborate effectively — skills I am eager to bring to '+d.company+'.'
    : 'I have built a solid skill set through hands-on projects and continuous self-development, with particular expertise in '+(arr.join(', ')||'my field')+'. I am ready to contribute from day one.';

  // Motivation capped at 280 chars
  const whyCap  = cap(d.why, 280);
  const motPara = whyCap+' I am particularly drawn to '+d.company+'\'s culture of innovation, and I believe my expertise in '+s2+' aligns closely with the goals of this role.';

  // Education — single line, no cap needed
  const eduPara = d.edu ? 'My academic background — '+d.edu+' — has provided me with a rigorous theoretical foundation that complements my practical experience.' : '';

  // Extra capped at 150 chars
  const extPara = d.extra ? 'Additionally, '+cap(d.extra, 150) : '';

  const closing = 'I would welcome the opportunity to discuss how my background and enthusiasm align with '+d.company+'\'s vision. Thank you sincerely for your time and consideration. I look forward to hearing from you.';

  return { today, opening, expPara, motPara, eduPara, extPara, closing };
}

/* ══════════════════════════════════════
   TEMPLATE RENDERERS
══════════════════════════════════════ */
function renderCorporate(d, c) {
  const li = d.linkedin
    ? ' &nbsp;&middot;&nbsp; <a href="https://'+d.linkedin.replace(/^https?:\/\//,'')+'" style="color:#6366f1">'+d.linkedin+'</a>'
    : '';
  const rows = [
    '<p>'+c.today+'</p>',
    '<p>Hiring Manager<br>'+d.company+'</p>',
    '<p><strong>Re: Application for '+d.role+'</strong></p>',
    '<p>Dear Hiring Manager,</p>',
    '<p>'+c.opening+'</p>',
    '<p>'+c.expPara+'</p>',
    '<p>'+c.motPara+'</p>',
    c.eduPara ? '<p>'+c.eduPara+'</p>' : '',
    c.extPara ? '<p>'+c.extPara+'</p>' : '',
    '<p>'+c.closing+'</p>',
  ].join('');

  return '<div class="lt-corp">'
    +'<div class="lt-head">'
      +'<div class="lt-head-text">'
        +'<div class="lt-name">'+d.name+'</div>'
        +'<div class="lt-contact">'+d.email+(d.phone?' &nbsp;&middot;&nbsp; '+d.phone:'')+li+'</div>'
      +'</div>'
    +'</div>'
    +'<div class="lt-body">'+rows+'</div>'
    +'<div class="lt-sig">'
      +'<p>Sincerely,</p>'
      +'<p><strong>'+d.name+'</strong></p>'
      +'<p style="font-size:.78rem;color:#64748b">'+d.email+(d.phone?' &middot; '+d.phone:'')+'</p>'
    +'</div>'
  +'</div>';
}

function renderModern(d, c) {
  const li = d.linkedin ? ' &middot; '+d.linkedin : '';
  const rows = [
    '<p>Dear '+d.company+' Team,</p>',
    '<p>'+c.opening+'</p>',
    '<p>'+c.expPara+'</p>',
    '<p>'+c.motPara+'</p>',
    c.eduPara ? '<p>'+c.eduPara+'</p>' : '',
    c.extPara ? '<p>'+c.extPara+'</p>' : '',
    '<p>'+c.closing+'</p>',
  ].join('');

  return '<div class="lt-mod">'
    +'<div class="lt-stripe"></div>'
    +'<div class="lt-main">'
      +'<div class="lt-name">'+d.name+'</div>'
      +'<div class="lt-contact">'+d.email+(d.phone?' &middot; '+d.phone:'')+li+' &nbsp;&middot;&nbsp; '+c.today+'</div>'
      +'<div class="lt-body">'+rows+'</div>'
      +'<div class="lt-sig"><p>Warm regards,<br><strong>'+d.name+'</strong></p></div>'
    +'</div>'
  +'</div>';
}

function renderMinimal(d, c) {
  const li = d.linkedin ? ' &middot; '+d.linkedin : '';
  const rows = [
    '<p>To the Hiring Team at '+d.company+',</p>',
    '<p>'+c.opening+'</p>',
    '<p>'+c.expPara+'</p>',
    '<p>'+c.motPara+'</p>',
    c.eduPara ? '<p>'+c.eduPara+'</p>' : '',
    c.extPara ? '<p>'+c.extPara+'</p>' : '',
    '<p>'+c.closing+'</p>',
  ].join('');

  return '<div class="lt-min">'
    +'<div class="lt-name">'+d.name+'</div>'
    +'<div class="lt-contact">'+d.email+(d.phone?' &middot; '+d.phone:'')+li+'<br>'+c.today+'</div>'
    +'<div class="lt-body">'+rows+'</div>'
    +'<div class="lt-sig"><p>Best regards,<br><strong>'+d.name+'</strong></p></div>'
  +'</div>';
}

/* dispatch */
function renderLetter(d) {
  const c = buildContent(d);
  const fn = { corporate:renderCorporate, modern:renderModern, minimal:renderMinimal }[activeTemplate]
             || renderCorporate;
  letterOut.innerHTML     = fn(d, c);
  letterOut.style.display = 'block';
  emptyState.style.display = 'none';
}

/* ══════════════════════════════════════
   FORM SUBMIT
══════════════════════════════════════ */
clForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) { showToast('Please fill in all required fields.','err'); return; }

  // Clear ALL red borders immediately on successful validation
  document.querySelectorAll('input.invalid, textarea.invalid')
    .forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll('[id^="e-"]')
    .forEach(el => { el.textContent = ''; });

  genBtn.classList.add('loading');
  genBtn.disabled = true;

  setTimeout(() => {
    lastGenData = buildData();
    printCount  = 0;             // reset print count for new data
    renderLetter(lastGenData);
    genBtn.classList.remove('loading');
    genBtn.disabled = false;
    showToast('Letter generated! ATS Score: '+atsPct.textContent,'ok');
    if (innerWidth < 1024)
      document.querySelector('.preview-side').scrollIntoView({behavior:'smooth',block:'start'});
  }, 800);
});

/* ══════════════════════════════════════
   CLEAR FORM
══════════════════════════════════════ */
clearBtn.addEventListener('click', () => {
  if (!confirm('Reset all form data?')) return;
  clForm.reset();
  /* reset counters */
  FIELD_MAP.forEach(({ cid }) => { const el=$(cid); if(el) el.textContent='0'; });
  /* clear all red borders and error messages */
  document.querySelectorAll('input.invalid, textarea.invalid').forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll('[id^="e-"]').forEach(el => { el.textContent=''; });
  localStorage.removeItem('lf-form');
  lastGenData = null;
  letterOut.innerHTML = '';
  letterOut.style.display  = 'none';
  emptyState.style.display = 'flex';
  updateATS();
  showToast('Form reset.','ok');
});

/* ══════════════════════════════════════
   COPY
══════════════════════════════════════ */
copyBtn.addEventListener('click', () => {
  if (!lastGenData) { showToast('Generate a letter first.','err'); return; }
  navigator.clipboard.writeText(letterOut.innerText)
    .then(() => showToast('Copied to clipboard!','ok'))
    .catch(() => {
      const r = document.createRange();
      r.selectNode(letterOut);
      getSelection().removeAllRanges();
      getSelection().addRange(r);
      document.execCommand('copy');
      getSelection().removeAllRanges();
      showToast('Copied!','ok');
    });
});

/* ══════════════════════════════════════
   PRINT / PDF  — clean isolated window
══════════════════════════════════════ */
/* ══════════════════════════════════════
   PRINT / PDF  — iframe method (no popup = no freeze)
══════════════════════════════════════ */
function openPrintWindow(saveAsPdf) {
  if (!lastGenData) { showToast('Generate a letter first.','err'); return; }

  if (saveAsPdf) showToast('In the dialog set destination \u2192 "Save as PDF"','ok');

  const css = [
    '*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }',
    /* Smaller font + tighter spacing = fits one page */
    'body { font-family:Georgia,"Times New Roman",serif; font-size:9.5pt; line-height:1.55; color:#1a1a2e; background:#fff; padding:1.1cm 1.4cm; }',

    /* Corporate */
    '.lt-corp .lt-head { display:flex; align-items:center; gap:8pt; border-bottom:2pt solid #6366f1; padding-bottom:6pt; margin-bottom:8pt; print-color-adjust:exact; -webkit-print-color-adjust:exact; }',
    '.lt-corp .lt-head-text { flex:1; }',
    '.lt-corp .lt-name { font-size:15pt; font-weight:700; color:#6366f1; print-color-adjust:exact; -webkit-print-color-adjust:exact; }',
    '.lt-corp .lt-contact { font-size:7.5pt; color:#64748b; margin-top:2pt; }',
    '.lt-corp .lt-body p { margin-bottom:5pt; }',
    '.lt-corp .lt-sig { margin-top:8pt; padding-top:6pt; border-top:1pt solid #e2e8f0; }',

    /* Modern */
    '.lt-mod { display:flex; }',
    '.lt-mod .lt-stripe { width:5pt; background:linear-gradient(180deg,#0ea5e9,#6366f1,#8b5cf6); flex-shrink:0; border-radius:3pt 0 0 3pt; print-color-adjust:exact; -webkit-print-color-adjust:exact; }',
    '.lt-mod .lt-main { padding-left:12pt; flex:1; }',
    '.lt-mod .lt-name { font-size:14pt; font-weight:700; color:#6366f1; print-color-adjust:exact; -webkit-print-color-adjust:exact; }',
    '.lt-mod .lt-contact { font-size:7.5pt; color:#64748b; margin-bottom:7pt; }',
    '.lt-mod .lt-body p { margin-bottom:5pt; }',
    '.lt-mod .lt-sig { margin-top:8pt; font-style:italic; }',

    /* Minimal */
    '.lt-min .lt-name { font-size:14pt; font-weight:700; }',
    '.lt-min .lt-contact { font-size:7.5pt; color:#64748b; margin-bottom:7pt; padding-bottom:5pt; border-bottom:1pt solid #e2e8f0; }',
    '.lt-min .lt-body p { margin-bottom:5pt; }',
    '.lt-min .lt-sig { margin-top:8pt; }',

    /* One page: zero margin so browser chrome headers/footers are gone */
    '@page { size:A4; margin:0; }',
    '@media print { body { padding:1.1cm 1.4cm; } }',
  ].join('\n');

  // Remove any previous print iframe
  const old = document.getElementById('__printFrame');
  if (old) old.remove();

  // Create hidden iframe — stays in the same page, no popup, no focus loss
  const iframe = document.createElement('iframe');
  iframe.id = '__printFrame';
  iframe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:none;opacity:0;pointer-events:none;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(
    '<!DOCTYPE html><html><head>'
    + '<meta charset="UTF-8">'
    + '<style>' + css + '</style>'
    + '</head><body>' + letterOut.innerHTML + '</body></html>'
  );
  doc.close();

  // Wait for iframe content to render, then print — parent page stays fully interactive
  setTimeout(function () {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) { /* ignore */ }

    // After print: increment count
    // If printed only once → clear form (one-time use)
    // If printed 2+ times → keep data (repeated use = save it)
    printCount++;
    setTimeout(function () {
      iframe.remove();
      if (printCount < 2) {
        // First print — clear everything for next user
        clForm.reset();
        FIELD_MAP.forEach(({ cid }) => { const el=$(cid); if(el) el.textContent='0'; });
        document.querySelectorAll('input.invalid, textarea.invalid').forEach(el => el.classList.remove('invalid'));
        document.querySelectorAll('[id^="e-"]').forEach(el => { el.textContent=''; });
        localStorage.removeItem('lf-form');
        lastGenData = null;
        printCount  = 0;
        letterOut.innerHTML = '';
        letterOut.style.display  = 'none';
        emptyState.style.display = 'flex';
        updateATS();
        showToast('Form cleared for next use.','ok');
      }
      // If printCount >= 2, keep everything as-is
    }, 2000);
  }, 600);
}

printBtn.addEventListener('click', () => openPrintWindow(false));
pdfBtn.addEventListener('click',   () => openPrintWindow(true));

/* ══════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.faq-card');
    const was  = card.classList.contains('open');
    document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('open'));
    if (!was) card.classList.add('open');
  });
});

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg, type) {
  clearTimeout(toastTimer);
  toast.innerHTML = '<i class="fas fa-'+(type==='err'?'exclamation-circle':'check-circle')+'"></i> '+msg;
  toast.className = 'toast '+(type||'ok')+' show';
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}

/* ══════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});

/* ── boot ── */
updateATS();
