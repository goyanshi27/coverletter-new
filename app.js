/**
 * LetterForge AI - Application UI Controller
 * Connects UI with all feature modules
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // DOM READY
  // ═══════════════════════════════════════════════════════════════

  document.addEventListener('DOMContentLoaded', function() {
    initParticleCanvas();
    initTypingAnimation();
    initThemeToggle();
    initCoverLetterGenerator();
    initRecruiterReview();
    initJobMatchAnalyzer();
    initInterviewGenerator();
    initCareerCoach();
    initMessageGenerators();
    initProfileAnalyzers();
    initSuccessPredictor();
    initBentoAccordion();
    initDashboard();
    initRevealAnimations();
  });

  // ═══════════════════════════════════════════════════════════════
  // PARTICLE CANVAS
  // ═══════════════════════════════════════════════════════════════

  function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];
    let W, H, pts = [];

    function resize() {
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
    }

    function mkPt() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.45,
        dy: (Math.random() - 0.5) * 0.45,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: Math.random() * 0.35 + 0.08
      };
    }

    resize();
    for (let i = 0; i < 65; i++) pts.push(mkPt());
    window.addEventListener('resize', resize, { passive: true });

    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.a;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    })();
  }

  // ═══════════════════════════════════════════════════════════════
  // TYPING ANIMATION
  // ═══════════════════════════════════════════════════════════════

  function initTypingAnimation() {
    const el = document.getElementById('typeEl');
    if (!el) return;

    const phrases = [
      'Cover Letters Instantly',
      'ATS-Optimized Applications',
      'Interview Questions',
      'Career Roadmaps',
      'Job Match Analysis'
    ];

    let pi = 0, ci = 0, del = false;

    function tick() {
      const cur = phrases[pi];
      el.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
      if (!del && ci === cur.length) { del = true; setTimeout(tick, 2200); return; }
      if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      setTimeout(tick, del ? 45 : 75);
    }
    tick();
  }

  // ═══════════════════════════════════════════════════════════════
  // THEME TOGGLE
  // ═══════════════════════════════════════════════════════════════

  function initThemeToggle() {
    const themeBtn = document.getElementById('themeBtn');
    const themeIco = document.getElementById('themeIco');

    const saved = localStorage.getItem('lf-theme') || 'light';
    applyTheme(saved);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const curr = document.documentElement.getAttribute('data-theme');
        applyTheme(curr === 'dark' ? 'light' : 'dark');
      });
    }

    function applyTheme(t) {
      document.documentElement.setAttribute('data-theme', t);
      if (themeIco) themeIco.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      localStorage.setItem('lf-theme', t);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // COVER LETTER GENERATOR
  // ═══════════════════════════════════════════════════════════════

  let activeTemplate = 'corporate';
  let lastGenData = null;

  function initCoverLetterGenerator() {
    const clForm = document.getElementById('clForm');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const printBtn = document.getElementById('printBtn');
    const pdfBtn = document.getElementById('pdfBtn');

    // Setup counter fields
    const fields = ['f-name', 'f-role', 'f-company', 'f-skills', 'f-exp', 'f-edu', 'f-why', 'f-extra'];
    fields.forEach(f => setupCounter(f));

    // Template buttons
    document.querySelectorAll('.tpl-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tpl-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTemplate = btn.dataset.tpl;
        if (lastGenData) renderLetter(lastGenData);
      });
    });

    // Form submit
    if (clForm) {
      clForm.addEventListener('submit', handleGenerateLetter);
    }

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (!confirm('Reset all form data?')) return;
        clForm.reset();
        fields.forEach(f => {
          const cnt = document.getElementById('c-' + f.replace('f-', ''));
          if (cnt) cnt.textContent = '0';
        });
        document.querySelectorAll('.err').forEach(e => e.textContent = '');
        document.querySelectorAll('input.invalid, textarea.invalid').forEach(e => e.classList.remove('invalid'));
        localStorage.removeItem('lf-form');
        lastGenData = null;
        document.getElementById('letterOut').innerHTML = '';
        document.getElementById('letterOut').style.display = 'none';
        document.getElementById('emptyState').style.display = 'flex';
        document.getElementById('recruiterPanel').style.display = 'none';
        updateATSScore();
        showToast('Form reset.', 'ok');
      });
    }

    // Copy button
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!lastGenData) { showToast('Generate a letter first.', 'err'); return; }
        const text = document.getElementById('letterOut').innerText;
        navigator.clipboard.writeText(text)
          .then(() => showToast('Copied to clipboard!', 'ok'))
          .catch(() => showToast('Failed to copy.', 'err'));
      });
    }

    // Print/PDF
    if (printBtn) printBtn.addEventListener('click', () => openPrintWindow(false));
    if (pdfBtn) pdfBtn.addEventListener('click', () => openPrintWindow(true));

    // Load saved
    loadSavedForm();
  }

  function setupCounter(fieldId) {
    const el = document.getElementById(fieldId);
    const cntId = 'c-' + fieldId.replace('f-', '');
    const cnt = document.getElementById(cntId);

    if (el) {
      el.addEventListener('input', () => {
        if (cnt) cnt.textContent = el.value.length;
        el.classList.remove('invalid');
        autoSave();
        updateATSScore();
      });
    }
  }

  function autoSave() {
    const d = {};
    ['f-name', 'f-role', 'f-company', 'f-skills', 'f-exp', 'f-edu', 'f-why', 'f-extra', 'f-email', 'f-phone', 'f-linkedin'].forEach(id => {
      const el = document.getElementById(id);
      if (el) d[id] = el.value;
    });
    d.tpl = activeTemplate;
    try { localStorage.setItem('lf-form', JSON.stringify(d)); } catch (_) {}
  }

  function loadSavedForm() {
    try {
      const d = JSON.parse(localStorage.getItem('lf-form') || 'null');
      if (!d) return;

      Object.entries(d).forEach(([id, val]) => {
        if (id === 'tpl') {
          activeTemplate = val;
          document.querySelectorAll('.tpl-opt').forEach(b => {
            b.classList.toggle('active', b.dataset.tpl === val);
          });
        } else {
          const el = document.getElementById(id);
          const cnt = document.getElementById('c-' + id.replace('f-', ''));
          if (el) el.value = val;
          if (cnt && val) cnt.textContent = val.length;
        }
      });
      updateATSScore();
    } catch (_) {}
  }

  function validateForm() {
    let ok = true;

    function chk(fid, eid, msg, testFn) {
      const el = document.getElementById(fid);
      const err = document.getElementById(eid);
      const val = el ? el.value.trim() : '';
      const fail = !val || (testFn && !testFn(val));

      if (el) el.classList.toggle('invalid', fail);
      if (err) err.textContent = fail ? msg : '';
      if (fail) ok = false;
    }

    chk('f-name', 'e-name', 'Full name is required.');
    chk('f-email', 'e-email', 'Valid email is required.', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    chk('f-role', 'e-role', 'Job role is required.');
    chk('f-company', 'e-company', 'Company name is required.');
    chk('f-skills', 'e-skills', 'Add at least one skill.');
    chk('f-why', 'e-why', 'Please explain your motivation.');

    return ok;
  }

  function handleGenerateLetter(e) {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill in all required fields.', 'err');
      return;
    }

    const genBtn = document.getElementById('genBtn');
    genBtn.classList.add('loading');
    genBtn.disabled = true;

    setTimeout(() => {
      const data = buildFormData();
      lastGenData = data;
      renderLetter(data);

      // Save to IndexedDB
      saveCoverLetter(data);

      // Update dashboard
      incrementStat('lettersGenerated');

      // Trigger recruiter review
      updateRecruiterReview();

      genBtn.classList.remove('loading');
      genBtn.disabled = false;

      showToast('Letter generated!', 'ok');

      if (innerWidth < 1024) {
        document.querySelector('.preview-side').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 800);
  }

  function buildFormData() {
    const v = id => (document.getElementById(id) || { value: '' }).value.trim();
    return {
      name: v('f-name'),
      email: v('f-email'),
      phone: v('f-phone'),
      linkedin: v('f-linkedin'),
      role: v('f-role'),
      company: v('f-company'),
      skills: v('f-skills'),
      exp: v('f-exp'),
      edu: v('f-edu'),
      why: v('f-why'),
      extra: v('f-extra'),
      template: activeTemplate
    };
  }

  function renderLetter(d) {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const skills = d.skills.split(',').map(s => s.trim()).filter(Boolean);
    const s3 = skills.slice(0, 3).join(', ') || 'relevant technologies';

    const letterOut = document.getElementById('letterOut');
    const emptyState = document.getElementById('emptyState');

    let html = '';

    if (activeTemplate === 'corporate' || activeTemplate === 'default') {
      html = `
        <div class="lt-corp">
          <div class="lt-head">
            <div class="lt-head-text">
              <div class="lt-name">${d.name}</div>
              <div class="lt-contact">${d.email}${d.phone ? ' · ' + d.phone : ''}${d.linkedin ? ' · ' + d.linkedin : ''}</div>
            </div>
          </div>
          <div class="lt-body">
            <p>${today}</p>
            <p>Hiring Manager<br>${d.company}</p>
            <p><strong>Re: Application for ${d.role}</strong></p>
            <p>Dear Hiring Manager,</p>
            <p>I am writing to express my enthusiastic interest in the ${d.role} position at ${d.company}. With a strong foundation in ${s3}, and a genuine drive to deliver meaningful results, I am confident I would be a valuable addition to your team.</p>
            ${d.exp ? `<p>Throughout my career, ${d.exp.slice(0, 300)} This experience has sharpened my ability to tackle complex challenges and collaborate effectively.</p>` : ''}
            <p>${d.why.slice(0, 280)} I am particularly drawn to ${d.company}'s culture of innovation, and I believe my expertise aligns closely with the goals of this role.</p>
            ${d.edu ? `<p>My academic background — ${d.edu} — has provided me with a rigorous theoretical foundation that complements my practical experience.</p>` : ''}
            <p>I would welcome the opportunity to discuss how my background and enthusiasm align with ${d.company}'s vision. Thank you sincerely for your time and consideration.</p>
          </div>
          <div class="lt-sig">
            <p>Sincerely,</p>
            <p><strong>${d.name}</strong></p>
          </div>
        </div>
      `;
    } else if (activeTemplate === 'modern') {
      html = `
        <div class="lt-mod">
          <div class="lt-stripe"></div>
          <div class="lt-main">
            <div class="lt-name">${d.name}</div>
            <div class="lt-contact">${d.email}${d.phone ? ' · ' + d.phone : ''} · ${today}</div>
            <div class="lt-body">
              <p>Dear ${d.company} Team,</p>
              <p>I am writing to express my enthusiastic interest in the ${d.role} position at ${d.company}. With a strong foundation in ${s3}, and a genuine drive to deliver meaningful results, I am confident I would be a valuable addition to your team.</p>
              ${d.exp ? `<p>Throughout my career, ${d.exp.slice(0, 300)} This experience has sharpened my ability to tackle complex challenges and collaborate effectively.</p>` : ''}
              <p>${d.why.slice(0, 280)} I am particularly drawn to ${d.company}'s culture of innovation, and I believe my expertise aligns closely with the goals of this role.</p>
              ${d.edu ? `<p>My academic background — ${d.edu} — has provided me with a rigorous theoretical foundation.</p>` : ''}
              <p>I would welcome the opportunity to discuss how my background aligns with ${d.company}'s vision. Thank you for your time and consideration.</p>
            </div>
            <div class="lt-sig"><p>Warm regards,<br><strong>${d.name}</strong></p></div>
          </div>
        </div>
      `;
    } else if (activeTemplate === 'minimal') {
      html = `
        <div class="lt-min">
          <div class="lt-name">${d.name}</div>
          <div class="lt-contact">${d.email}${d.phone ? ' · ' + d.phone : ''}<br>${today}</div>
          <div class="lt-body">
            <p>To the Hiring Team at ${d.company},</p>
            <p>I am writing to express my enthusiastic interest in the ${d.role} position. With my background in ${s3}, I am confident I would be a valuable addition to your team.</p>
            ${d.exp ? `<p>${d.exp.slice(0, 300)}</p>` : ''}
            <p>${d.why.slice(0, 280)}</p>
            ${d.edu ? `<p>Educational background: ${d.edu}.</p>` : ''}
            <p>I would welcome the opportunity to discuss my qualifications further. Thank you for your time.</p>
          </div>
          <div class="lt-sig"><p>Best regards,<br><strong>${d.name}</strong></p></div>
        </div>
      `;
    }

    letterOut.innerHTML = html;
    letterOut.style.display = 'block';
    emptyState.style.display = 'none';
  }

  function openPrintWindow(saveAsPdf) {
    if (!lastGenData) { showToast('Generate a letter first.', 'err'); return; }

    if (saveAsPdf) showToast('Set destination to "Save as PDF" in the dialog', 'ok');

    const letterOut = document.getElementById('letterOut');
    const css = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Georgia, "Times New Roman", serif; font-size: 10pt; line-height: 1.6; color: #1a1a2e; background: #fff; padding: 1.5cm; }
      .lt-corp .lt-head { border-bottom: 3px solid #6366f1; padding-bottom: 1rem; margin-bottom: 1rem; }
      .lt-corp .lt-name { font-size: 1.25rem; font-weight: 700; color: #6366f1; }
      .lt-corp .lt-contact { font-size: .75rem; color: #64748b; }
      .lt-corp .lt-body p { margin-bottom: .75rem; }
      .lt-mod { display: flex; }
      .lt-mod .lt-stripe { width: 5px; background: linear-gradient(180deg, #0ea5e9, #6366f1, #8b5cf6); border-radius: 3px 0 0 3px; }
      .lt-mod .lt-main { padding-left: 1rem; flex: 1; }
      .lt-mod .lt-name { font-size: 1.25rem; font-weight: 700; color: #6366f1; }
      .lt-mod .lt-contact { font-size: .75rem; color: #64748b; margin-bottom: 1rem; }
      .lt-mod .lt-body p { margin-bottom: .75rem; }
      .lt-min .lt-name { font-size: 1.25rem; font-weight: 700; color: #0f172a; }
      .lt-min .lt-contact { font-size: .75rem; color: #64748b; margin-bottom: 1rem; padding-bottom: .75rem; border-bottom: 1px solid #e2e8f0; }
      .lt-min .lt-body p { margin-bottom: .75rem; }
      .lt-sig { margin-top: 1.5rem; }
      @page { size: A4; margin: 0; }
      @media print { body { padding: 1.5cm; } }
    `;

    const iframe = document.createElement('iframe');
    iframe.id = '__printFrame';
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:none;opacity:0;pointer-events:none;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' + css + '</style></head><body>' + letterOut.innerHTML + '</body></html>');
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => iframe.remove(), 2000);
    }, 600);
  }

  function updateATSScore() {
    const v = id => (document.getElementById(id) || { value: '' }).value.trim();

    const checks = {
      'ai-name': v('f-name').length > 0,
      'ai-role': v('f-role').length > 0,
      'ai-skills': v('f-skills').split(',').filter(s => s.trim()).length >= 2,
      'ai-exp': v('f-exp').length > 20,
      'ai-edu': v('f-edu').length > 4,
      'ai-why': v('f-why').length > 30
    };

    const pct = Math.round(Object.values(checks).filter(Boolean).length / 6 * 100);

    const atsFill = document.getElementById('atsFill');
    const atsPct = document.getElementById('atsPct');

    if (atsFill) atsFill.style.width = pct + '%';
    if (atsPct) atsPct.textContent = pct + '%';

    if (atsFill) {
      atsFill.style.background =
        pct < 40 ? 'linear-gradient(90deg,#ef4444,#f97316)' :
        pct < 70 ? 'linear-gradient(90deg,#f59e0b,#eab308)' :
        'linear-gradient(90deg,#10b981,#059669)';
    }

    Object.entries(checks).forEach(([id, ok]) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('ok', ok);
    });

    // Update dashboard KPI
    updateKPI('ats', pct);

    return pct;
  }

  // ═══════════════════════════════════════════════════════════════
  // RECRUITER REVIEW
  // ═══════════════════════════════════════════════════════════════

  function initRecruiterReview() {
    // Review panel updates automatically after letter generation
  }

  function updateRecruiterReview() {
    if (!lastGenData) return;

    const letterText = document.getElementById('letterOut').innerText;
    if (!letterText || letterText.length < 50) return;

    // Use the RecruiterReview module
    const review = window.LetterForge?.RecruiterReview?.analyze(letterText, lastGenData.role);

    if (!review) return;

    const panel = document.getElementById('recruiterPanel');
    const scoreEl = document.getElementById('recScore');
    const verdictEl = document.getElementById('recVerdict');
    const breakdownEl = document.getElementById('recBreakdown');
    const feedbackEl = document.getElementById('recFeedback');

    if (panel) panel.style.display = 'block';

    if (scoreEl) {
      scoreEl.innerHTML = `<span class="score-val">${review.score}</span>/100`;
    }

    if (verdictEl) {
      verdictEl.innerHTML = `
        <span class="verdict-badge" style="background: ${review.recommendation.color}20; color: ${review.recommendation.color}; border-color: ${review.recommendation.color}">
          <i class="fas ${review.recommendation.icon}"></i>
          <span>${review.recommendation.level}</span>
        </span>
      `;
    }

    if (breakdownEl && review.breakdown) {
      breakdownEl.innerHTML = `
        <div class="breakdown-grid">
          ${Object.entries(review.breakdown).map(([key, val]) => `
            <div class="breakdown-item">
              <span class="breakdown-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <div class="breakdown-bar"><div class="breakdown-fill" style="width: ${val}%"></div></div>
              <span class="breakdown-val">${val}%</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (feedbackEl && review.feedback) {
      feedbackEl.innerHTML = `<p class="feedback-text">${review.feedback}</p>`;

      if (review.suggestions && review.suggestions.length > 0) {
        feedbackEl.innerHTML += `
          <div class="suggestions">
            <strong>Suggestions:</strong>
            <ul>
              ${review.suggestions.slice(0, 3).map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }

    // Update dashboard KPI
    updateKPI('recruiter', review.score);
  }

  // ═══════════════════════════════════════════════════════════════
  // JOB MATCH ANALYZER
  // ═══════════════════════════════════════════════════════════════

  function initJobMatchAnalyzer() {
    const btn = document.getElementById('analyzeMatchBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const resume = document.getElementById('matchResume')?.value || '';
      const jobDesc = document.getElementById('matchJob')?.value || '';

      if (!resume || !jobDesc) {
        showToast('Please fill in both fields.', 'err');
        return;
      }

      buttonTextLoading(btn, 'Analyzing...');

      setTimeout(() => {
        const result = window.LetterForge?.JobMatchAnalyzer?.analyze(resume, jobDesc);

        if (result) {
          displayMatchResults(result);
          updateKPI('match', result.matchPercentage);
        }

        buttonTextReset(btn, 'Analyze Match');
      }, 800);
    });
  }

  function displayMatchResults(result) {
    const container = document.getElementById('matchResults');
    if (!container) return;

    container.style.display = 'flex';

    // Score
    const scoreEl = document.getElementById('matchScoreBig');
    if (scoreEl) scoreEl.textContent = result.matchPercentage + '%';

    // Draw ring
    const canvas = document.getElementById('matchRing');
    if (canvas) drawProgressRing(canvas, result.matchPercentage);

    // Matched skills
    const matchedEl = document.getElementById('matchedSkills');
    if (matchedEl) {
      matchedEl.innerHTML = result.matchedSkills.slice(0, 10).map(s =>
        `<span class="skill-tag">${typeof s === 'object' ? s.jobSkill : s}</span>`
      ).join('') + result.strongMatches.slice(0, 5).map(s =>
        `<span class="skill-tag">${s.jobSkill}</span>`
      ).join('');
    }

    // Missing skills
    const missingEl = document.getElementById('missingSkills');
    if (missingEl) {
      missingEl.innerHTML = result.missingSkills.slice(0, 8).map(s =>
        `<span class="skill-tag">${typeof s === 'object' ? s.skill : s}</span>`
      ).join('');
    }

    // Recommendations
    const recEl = document.getElementById('matchRecommendations');
    if (recEl) {
      const gap = result.skillGaps?.[0];
      if (gap) {
        recEl.innerHTML = `
          <p><strong>Recommendation:</strong> ${result.recommendation?.action || 'Improve your skill match'}</p>
          ${gap.suggestion ? `<p class="suggestion">${gap.suggestion}</p>` : ''}
        `;
      }
    }

    // Radar chart
    if (result.radarData) {
      const radarCanvas = document.getElementById('matchRadar');
      if (radarCanvas) {
        window.LetterForge?.ChartUtils?.createRadarChart('matchRadar', result.radarData);
      }
    }

    // Update skill gap list
    updateSkillGapList(result);
  }

  // ═══════════════════════════════════════════════════════════════
  // INTERVIEW QUESTION GENERATOR
  // ═══════════════════════════════════════════════════════════════

  function initInterviewGenerator() {
    const genBtn = document.getElementById('genInterviewBtn');
    const downloadBtn = document.getElementById('downloadInterviewBtn');

    if (genBtn) {
      genBtn.addEventListener('click', () => {
        const role = document.getElementById('intRole')?.value || 'Software Engineer';
        const skills = document.getElementById('intSkills')?.value || '';
        const level = document.getElementById('intLevel')?.value || 'mid';
        const count = parseInt(document.getElementById('intCount')?.value || '25');

        buttonTextLoading(genBtn, 'Generating...');

        setTimeout(() => {
          const questions = window.LetterForge?.InterviewGenerator?.generate(role, skills, level, 'tech', count);

          if (questions && questions.length > 0) {
            displayInterviewQuestions(questions);
          }

          buttonTextReset(genBtn, 'Generate Questions');
        }, 600);
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const text = document.getElementById('questionList')?.innerText || '';
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'interview-questions.txt';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Tab switching
    document.querySelectorAll('.question-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.question-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterInterviewQuestions(btn.dataset.tab);
      });
    });
  }

  let allInterviewQuestions = [];

  function displayInterviewQuestions(questions) {
    allInterviewQuestions = questions;

    const container = document.getElementById('interviewResults');
    const listEl = document.getElementById('questionList');

    if (container) container.style.display = 'block';
    if (!listEl) return;

    listEl.innerHTML = questions.map((q, i) => `
      <div class="question-item" data-type="${q.type || 'technical'}">
        <span class="question-num">${i + 1}</span>
        <div class="question-content">
          <span class="question-text">${q.question}</span>
          <div class="question-meta">
            <span class="question-category">${q.category || 'General'}</span>
            ${q.difficulty ? `<span class="question-difficulty">${q.difficulty}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  function filterInterviewQuestions(type) {
    const items = document.querySelectorAll('.question-item');
    items.forEach(item => {
      const qType = item.dataset.type;
      if (type === 'all' || qType === type || (type === 'technical' && ['technical', 'project'].includes(qType))) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CAREER COACH
  // ═══════════════════════════════════════════════════════════════

  function initCareerCoach() {
    const btn = document.getElementById('genCareerBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const skills = document.getElementById('careerSkills')?.value || '';
      const target = document.getElementById('careerTarget')?.value || 'Software Engineer';
      const years = parseInt(document.getElementById('careerYears')?.value || '3');

      buttonTextLoading(btn, 'Building Roadmap...');

      setTimeout(() => {
        const roadmap = window.LetterForge?.CareerCoach?.generateRoadmap(skills, target, years);

        if (roadmap) {
          displayCareerRoadmap(roadmap);
        }

        buttonTextReset(btn, 'Generate Roadmap');
      }, 600);
    });
  }

  function displayCareerRoadmap(roadmap) {
    const container = document.getElementById('careerResults');
    const timelineEl = document.getElementById('roadmapTimeline');
    const missingEl = document.getElementById('missingCareerSkills');
    const certsEl = document.getElementById('recommendedCerts');
    const salaryEl = document.getElementById('salaryRange');

    if (container) container.style.display = 'block';

    // Timeline
    if (timelineEl && roadmap.roadmap) {
      timelineEl.innerHTML = roadmap.roadmap.map((step, i) => `
        <div class="roadmap-step ${i === 0 ? 'current' : ''}">
          <span class="roadmap-level">${step.level}</span>
          <span class="roadmap-milestone">${step.milestone} · ${step.timeframe}</span>
          <div class="roadmap-skills">
            ${(step.skills || []).slice(0, 4).map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // Missing skills
    if (missingEl && roadmap.missingSkills) {
      missingEl.innerHTML = roadmap.missingSkills.slice(0, 6).map(s => `
        <div class="skill-gap-item">
          <span class="gap-skill">${s.skill}</span>
          <span class="gap-priority ${s.priority}">${s.priority}</span>
        </div>
      `).join('');
    }

    // Certifications
    if (certsEl && roadmap.certifications) {
      certsEl.innerHTML = roadmap.certifications.slice(0, 4).map(c => `
        <div class="cert-item">
          <strong>${c.name}</strong>
          <span class="cert-meta">${c.provider} · ${c.duration}</span>
        </div>
      `).join('');
    }

    // Salary
    if (salaryEl && roadmap.salaryRange) {
      salaryEl.innerHTML = `
        <span class="salary-range">$${(roadmap.salaryRange.min / 1000).toFixed(0)}K - $${(roadmap.salaryRange.max / 1000).toFixed(0)}K</span>
        <span class="salary-label">Expected Annual</span>
      `;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // MESSAGE GENERATORS
  // ═══════════════════════════════════════════════════════════════

  function initMessageGenerators() {
    // Tab switching
    document.querySelectorAll('.message-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.msgTab;

        document.querySelectorAll('.message-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.msg-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('msg-' + tab)?.classList.add('active');
      });
    });

    // Message type selection
    document.querySelectorAll('.msg-type').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.msg-panel');
        parent?.querySelectorAll('.msg-type').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Networking
    const networkBtn = document.getElementById('genNetworkBtn');
    if (networkBtn) {
      networkBtn.addEventListener('click', () => {
        const type = document.querySelector('#msg-networking .msg-type.active')?.dataset.type || 'linkedinConnection';
        const data = {
          name: document.getElementById('msgRecruiterName')?.value || '[Name]',
          company: document.getElementById('msgCompany')?.value || '[Company]',
          your_name: document.getElementById('msgYourName')?.value || '[Your Name]'
        };

        const msg = window.LetterForge?.MessageGenerator?.generateNetworkingMessage(type, data);
        displayGeneratedMessage('Networking', msg);
      });
    }

    // Thank You
    const thankBtn = document.getElementById('genThankBtn');
    if (thankBtn) {
      thankBtn.addEventListener('click', () => {
        const type = document.querySelector('#msg-thankyou .msg-type.active')?.dataset.type || 'postInterview';
        const data = {
          interviewer_name: document.getElementById('thankInterviewer')?.value || '[Name]',
          position: document.getElementById('thankPosition')?.value || '[Position]',
          company: document.getElementById('thankCompany')?.value || '[Company]',
          your_name: document.getElementById('thankYourName')?.value || '[Your Name]'
        };

        const msg = window.LetterForge?.MessageGenerator?.generateThankYouEmail(type, data);
        displayGeneratedMessage('ThankYou', msg);
      });
    }

    // Salary
    const salaryBtn = document.getElementById('genSalaryBtn');
    if (salaryBtn) {
      salaryBtn.addEventListener('click', () => {
        const type = document.querySelector('#msg-salary .msg-type.active')?.dataset.type || 'negotiation';
        const data = {
          hr_name: document.getElementById('salaryHRName')?.value || '[HR Name]',
          position: document.getElementById('salaryPosition')?.value || '[Position]',
          company: document.getElementById('salaryCompany')?.value || '[Company]',
          target_range: document.getElementById('salaryTarget')?.value || '[Range]',
          your_name: document.getElementById('salaryYourName')?.value || '[Your Name]'
        };

        const msg = window.LetterForge?.MessageGenerator?.generateSalaryEmail(type, data);
        displayGeneratedMessage('Salary', msg);
      });
    }
  }

  function displayGeneratedMessage(type, message) {
    if (!message) return;

    const outputId = 'msgOutput' + type;
    const textId = 'msgText' + type;

    const output = document.getElementById(outputId);
    const text = document.getElementById(textId);

    if (output) output.style.display = 'block';
    if (text) text.value = message;
  }

  // Global functions for message actions
  window.copyMsg = function(textId) {
    const text = document.getElementById(textId)?.value || '';
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copied!', 'ok'))
      .catch(() => showToast('Failed to copy', 'err'));
  };

  window.downloadMsg = function(textId, filename) {
    const text = document.getElementById(textId)?.value || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  window.emailMsg = function(textId) {
    const text = document.getElementById(textId)?.value || '';
    const subject = encodeURIComponent('Follow Up');
    const body = encodeURIComponent(text);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // ═══════════════════════════════════════════════════════════════
  // PROFILE ANALYZERS
  // ═══════════════════════════════════════════════════════════════

  function initProfileAnalyzers() {
    // LinkedIn
    const linkedinBtn = document.getElementById('analyzeLinkedInBtn');
    if (linkedinBtn) {
      linkedinBtn.addEventListener('click', () => {
        const data = {
          about: document.getElementById('linkedinAbout')?.value || '',
          experience: document.getElementById('linkedinExperience')?.value || '',
          skills: document.getElementById('linkedinSkills')?.value || '',
          headline: document.getElementById('linkedinHeadline')?.value || ''
        };

        const result = window.LetterForge?.LinkedInAnalyzer?.analyze(data);

        if (result) {
          displayLinkedInResult(result);
          updateKPI('linkedin', result.strengthScore);
          updateDashboardScore('linkedinScore', result.strengthScore);
        }
      });
    }

    // GitHub
    const githubBtn = document.getElementById('analyzeGithubBtn');
    if (githubBtn) {
      githubBtn.addEventListener('click', () => {
        const data = {
          repositories: document.getElementById('githubRepos')?.value || '',
          readme: document.getElementById('githubReadme')?.value || '',
          technologies: document.getElementById('githubTech')?.value || ''
        };

        const result = window.LetterForge?.GitHubAnalyzer?.analyze(data);

        if (result) {
          displayGithubResult(result);
          updateKPI('github', result.portfolioScore);
          updateDashboardScore('githubScore', result.portfolioScore);
        }
      });
    }
  }

  function displayLinkedInResult(result) {
    const container = document.getElementById('linkedinResults');
    const scoreEl = document.getElementById('linkedinStrengthScore');
    const insightsEl = document.getElementById('linkedinInsights');

    if (container) container.style.display = 'block';
    if (scoreEl) scoreEl.textContent = result.strengthScore;

    if (insightsEl) {
      insightsEl.innerHTML = `
        <ul>
          ${result.optimizationSuggestions.slice(0, 4).map(s => `<li><i class="fas fa-lightbulb"></i> ${s}</li>`).join('')}
        </ul>
        <p><strong>Missing Keywords:</strong> ${result.missingKeywords.slice(0, 5).join(', ') || 'None'}</p>
        <p><strong>Profile Completeness:</strong> ${result.profileCompleteness.percentage}%</p>
      `;
    }
  }

  function displayGithubResult(result) {
    const container = document.getElementById('githubResults');
    const scoreEl = document.getElementById('githubPortfolioScore');
    const insightsEl = document.getElementById('githubInsights');

    if (container) container.style.display = 'block';
    if (scoreEl) scoreEl.textContent = result.portfolioScore;

    if (insightsEl) {
      insightsEl.innerHTML = `
        <p><strong>Recruiter Impression:</strong> ${result.recruiterImpression?.rating || 'N/A'} (${result.recruiterImpression?.score || 0}/100)</p>
        <p><strong>Project Quality:</strong> ${result.projectQuality?.rating || 'N/A'}</p>
        <p><strong>Technologies:</strong> ${(result.mostUsedTechnologies || []).slice(0, 5).map(t => t.technology).join(', ') || 'None detected'}</p>
      `;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SUCCESS PREDICTOR
  // ═══════════════════════════════════════════════════════════════

  function initSuccessPredictor() {
    // Range inputs
    const ranges = ['successResume', 'successMatch', 'successCover', 'successAts', 'successExp', 'successSkill'];
    ranges.forEach(id => {
      const input = document.getElementById(id);
      const valEl = document.getElementById(id + 'Val');

      if (input && valEl) {
        input.addEventListener('input', () => {
          valEl.textContent = input.value;
        });
      }
    });

    // Calculate button
    const btn = document.getElementById('predictSuccessBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        const inputs = {
          resumeQuality: parseInt(document.getElementById('successResume')?.value || 50),
          jobMatchScore: parseInt(document.getElementById('successMatch')?.value || 50),
          coverLetterQuality: parseInt(document.getElementById('successCover')?.value || 50),
          atsScore: parseInt(document.getElementById('successAts')?.value || 50),
          experienceMatch: parseInt(document.getElementById('successExp')?.value || 50),
          skillAlignment: parseInt(document.getElementById('successSkill')?.value || 50)
        };

        const result = window.LetterForge?.SuccessPredictor?.calculate(inputs);

        if (result) {
          displaySuccessResult(result, inputs);
          updateKPI('success', result.probability);
        }
      });
    }
  }

  function displaySuccessResult(result, inputs) {
    const container = document.getElementById('successResults');
    if (container) container.style.display = 'flex';

    // Values
    document.getElementById('successProb').textContent = result.probability + '%';
    document.getElementById('successInterview').textContent = result.interviewChance + '%';
    document.getElementById('successReadiness').textContent = result.applicationReadiness?.level || '--';

    // Success factors
    const factorsEl = document.getElementById('successFactors');
    if (factorsEl) {
      factorsEl.innerHTML = `
        <h5><i class="fas fa-thumbs-up"></i> Key Strengths</h5>
        <ul>
          ${result.keySuccessFactors.map(f => `<li><strong>${f.factor}</strong>: ${f.score}%</li>`).join('')}
        </ul>
      `;
    }

    // Weak areas
    const weakEl = document.getElementById('successWeaknesses');
    if (weakEl) {
      weakEl.innerHTML = `
        <h5><i class="fas fa-exclamation-triangle"></i> Weak Areas</h5>
        <ul>
          ${result.weakAreas.map(w => `<li><strong>${w.area}</strong>: ${w.score}%</li>`).join('')}
        </ul>
      `;
    }

    // Suggestions
    const suggestionsEl = document.getElementById('successSuggestions');
    if (suggestionsEl) {
      suggestionsEl.innerHTML = `
        <h5><i class="fas fa-lightbulb"></i> Suggestions</h5>
        <ul>
          ${result.improvements.map(s => `<li>${s}</li>`).join('')}
        </ul>
      `;
    }

    // Draw gauge
    const canvas = document.getElementById('successGauge');
    if (canvas) drawSuccessGauge(canvas, result.probability);
  }

  // ═══════════════════════════════════════════════════════════════
  // BENTO ACCORDION RESPONSIVE
  // ═══════════════════════════════════════════════════════════════

  let activeFeatureIndex = 0;

  function initBentoAccordion() {
    // Bento card interactions
    document.querySelectorAll('.bento-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        activeFeatureIndex = index;
        activateBentoCard(index);
      });

      card.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 768) {
          activateBentoCard(index);
        }
      });
    });

    // Accordion panel interactions
    document.querySelectorAll('.feature-accordion .accordion-header').forEach((header, index) => {
      header.addEventListener('click', () => {
        activeFeatureIndex = index;
        openAccordionPanel(index);
      });
    });

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        transferBentoAccordionState();
      }, 150);
    });
  }

  function activateBentoCard(index) {
    document.querySelectorAll('.bento-card').forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  }

  function openAccordionPanel(index) {
    document.querySelectorAll('.feature-accordion .accordion-panel').forEach((panel, i) => {
      const content = panel.querySelector('.accordion-content');
      if (i === index) {
        panel.classList.add('open');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        panel.classList.remove('open');
        if (content) content.style.maxHeight = '0';
      }
    });
  }

  function transferBentoAccordionState() {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      openAccordionPanel(activeFeatureIndex);
    } else {
      activateBentoCard(activeFeatureIndex);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════

  function initDashboard() {
    updateDashboardKPIs();

    // Initialize ring charts
    drawProgressRing(document.getElementById('ringAts'), 0);
    drawProgressRing(document.getElementById('ringRecruiter'), 0);
    drawProgressRing(document.getElementById('ringMatch'), 0);
    drawProgressRing(document.getElementById('ringSuccess'), 0);

    // Radar chart
    const radarCanvas = document.getElementById('chartSkillRadar');
    if (radarCanvas) {
      window.LetterForge?.ChartUtils?.createRadarChart('chartSkillRadar', {
        labels: ['Technical', 'Tools', 'Soft Skills', 'Experience', 'ATS', 'Industry'],
        datasets: [{ data: [50, 50, 50, 50, 50, 50] }]
      });
    }
  }

  function updateDashboardKPIs() {
    // Load stats from localStorage
    try {
      const stats = JSON.parse(localStorage.getItem('lf-stats') || '{}');

      document.getElementById('kpiAts').textContent = (stats.ats || 0) + '%';
      document.getElementById('kpiRecruiter').textContent = stats.recruiter || 0;
      document.getElementById('kpiMatch').textContent = (stats.match || 0) + '%';
      document.getElementById('kpiSuccess').textContent = (stats.success || 0) + '%';
      document.getElementById('kpiLetters').textContent = stats.letters || 0;
      document.getElementById('kpiInterviews').textContent = stats.interviews || 0;

      // Update rings
      drawProgressRing(document.getElementById('ringAts'), stats.ats || 0, '#0ea5e9');
      drawProgressRing(document.getElementById('ringRecruiter'), stats.recruiter || 0, '#6366f1');
      drawProgressRing(document.getElementById('ringMatch'), stats.match || 0, '#10b981');
      drawProgressRing(document.getElementById('ringSuccess'), stats.success || 0, '#8b5cf6');

    } catch (_) {}
  }

  function updateKPI(type, value) {
    try {
      const stats = JSON.parse(localStorage.getItem('lf-stats') || '{}');
      stats[type] = value;
      localStorage.setItem('lf-stats', JSON.stringify(stats));
      updateDashboardKPIs();
    } catch (_) {}
  }

  function updateDashboardScore(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = value || '--';
  }

  function incrementStat(key) {
    try {
      const stats = JSON.parse(localStorage.getItem('lf-stats') || '{}');
      stats[key] = (stats[key] || 0) + 1;
      localStorage.setItem('lf-stats', JSON.stringify(stats));
      updateDashboardKPIs();
    } catch (_) {}
  }

  function updateSkillGapList(matchResult) {
    const list = document.getElementById('skillGapList');
    if (!list || !matchResult.skillGaps) return;

    list.innerHTML = matchResult.skillGaps.slice(0, 5).map(g => `
      <div class="skill-gap-item">
        <span class="gap-skill">${g.skill}</span>
        <span class="gap-priority ${g.importance}">${g.importance}</span>
      </div>
    `).join('');
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  function drawProgressRing(canvas, percentage, color = '#6366f1') {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 8;
    const lineWidth = 6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#334155' : '#e2e8f0';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress
    const endAngle = (percentage / 100) * 2 * Math.PI - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function drawSuccessGauge(canvas, percentage) {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height - 30;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#334155' : '#e2e8f0';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Progress arc
    const endAngle = Math.PI + (percentage / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, endAngle);

    // Gradient color based on percentage
    let color;
    if (percentage >= 70) color = '#10b981';
    else if (percentage >= 50) color = '#f59e0b';
    else color = '#ef4444';

    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.stroke();

    // Center text
    ctx.fillStyle = color;
    ctx.font = 'bold 32px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(percentage + '%', centerX, centerY - 10);
  }

  function saveCoverLetter(data) {
    try {
      const letters = JSON.parse(localStorage.getItem('lf-letters') || '[]');
      letters.unshift({
        ...data,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('lf-letters', JSON.stringify(letters.slice(0, 20)));
    } catch (_) {}
  }

  function showToast(message, type = 'ok') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const icon = type === 'err' ? 'exclamation-circle' : 'check-circle';
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    toast.className = `toast ${type} show`;

    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function buttonTextLoading(btn, text) {
    if (!btn) return;
    const span = btn.querySelector('span');
    if (span) span.textContent = text;
    btn.disabled = true;
  }

  function buttonTextReset(btn, text) {
    if (!btn) return;
    const span = btn.querySelector('span');
    if (span) span.textContent = text;
    btn.disabled = false;
  }

  function initRevealAnimations() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

})();
