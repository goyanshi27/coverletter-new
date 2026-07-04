/**
 * LetterForge AI - Main Application
 * Complete Feature Implementation
 */

// ═══════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════

const AppState = {
  userId: null,
  userData: {},
  appStats: {
    lettersGenerated: 0,
    atsAverage: 0,
    recruiterAverage: 0,
    jobMatchAverage: 0,
    applicationsSent: 0,
    interviewsPredicted: 0,
    successAverage: 0,
    linkedinScore: 0,
    portfolioScore: 0,
    resumeStrength: 0
  },
  currentSection: 'dashboard',
  theme: 'light',
  activeFeatureIndex: 0,
  isMobile: window.innerWidth < 768,
  lastInteraction: Date.now()
};

// ═══════════════════════════════════════════════════════════════
// INDEXEDDB STORAGE
// ═══════════════════════════════════════════════════════════════

const DB = {
  name: 'letterforge_db',
  version: 1,
  db: null,

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create stores
        if (!db.objectStoreNames.contains('users')) {
          const usersStore = db.createObjectStore('users', { keyPath: 'id' });
          usersStore.createIndex('email', 'email', { unique: false });
        }

        if (!db.objectStoreNames.contains('coverLetters')) {
          const lettersStore = db.createObjectStore('coverLetters', { keyPath: 'id', autoIncrement: true });
          lettersStore.createIndex('userId', 'userId', { unique: false });
          lettersStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('resumes')) {
          db.createObjectStore('resumes', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
          analyticsStore.createIndex('type', 'type', { unique: false });
          analyticsStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('jobDescriptions')) {
          db.createObjectStore('jobDescriptions', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  },

  async put(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async clear(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// MOBILE NAVIGATION & RESPONSIVE SYSTEM
// ═══════════════════════════════════════════════════════════════

const Navigation = {
  init() {
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupActiveTracking();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  },

  setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const navItems = document.querySelectorAll('.nav-item');

    if (menuBtn && navMenu) {
      menuBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        menuBtn.classList.toggle('open', isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
      });

      navItems.forEach(item => {
        item.addEventListener('click', () => {
          navMenu.classList.remove('open');
          menuBtn.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  },

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  },

  setupActiveTracking() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPos = window.scrollY;
          let current = '';

          sections.forEach(section => {
            if (scrollPos >= section.offsetTop - 130) {
              current = section.getAttribute('id');
            }
          });

          navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === '#' + current);
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  },

  handleResize() {
    const wasMobile = AppState.isMobile;
    AppState.isMobile = window.innerWidth < 768;

    if (wasMobile !== AppState.isMobile) {
      // Transfer state between layouts
      BentoAccordion.transferState(AppState.activeFeatureIndex);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// BENTO-TO-ACCORDION RESPONSIVE SYSTEM WITH STATE PERSISTENCE
// ═══════════════════════════════════════════════════════════════

const BentoAccordion = {
  container: null,
  cards: [],
  panels: [],
  activeIndex: 0,
  breakpoint: 768,
  debounceTimer: null,

  init() {
    this.container = document.getElementById('featureGrid');
    if (!this.container) return;

    this.setupCards();
    this.setupResizeObserver();
    this.render();
  },

  setupCards() {
    this.cards = Array.from(document.querySelectorAll('.bento-card'));
    this.panels = Array.from(document.querySelectorAll('.accordion-panel'));
  },

  setupResizeObserver() {
    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            const isMobile = entry.contentRect.width < this.breakpoint;
            this.render(isMobile);
          }, 100);
        }
      });
      resizeObserver.observe(document.body);
    }

    window.addEventListener('resize', () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.render(window.innerWidth < this.breakpoint);
      }, 100);
    });
  },

  render(isMobile = window.innerWidth < this.breakpoint) {
    if (isMobile) {
      this.renderAccordion();
    } else {
      this.renderBento();
    }
  },

  renderBento() {
    const bentoGrid = document.getElementById('bentoGrid');
    const accordion = document.getElementById('accordionView');

    if (bentoGrid) bentoGrid.style.display = 'grid';
    if (accordion) accordion.style.display = 'none';

    this.activateBentoCard(this.activeIndex);
  },

  renderAccordion() {
    const bentoGrid = document.getElementById('bentoGrid');
    const accordion = document.getElementById('accordionView');

    if (bentoGrid) bentoGrid.style.display = 'none';
    if (accordion) accordion.style.display = 'flex';

    this.openAccordionPanel(this.activeIndex);
  },

  activateBentoCard(index) {
    this.activeIndex = index;
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
        card.style.transform = 'scale(1.02)';
        card.style.zIndex = '10';
      } else {
        card.classList.remove('active');
        card.style.transform = 'scale(1)';
        card.style.zIndex = '1';
      }
    });
  },

  openAccordionPanel(index) {
    this.activeIndex = index;
    const panels = document.querySelectorAll('.accordion-panel');

    panels.forEach((panel, i) => {
      const content = panel.querySelector('.accordion-content');
      if (i === index) {
        panel.classList.add('open');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        panel.classList.remove('open');
        if (content) content.style.maxHeight = '0';
      }
    });
  },

  transferState(activeIndex) {
    this.activeIndex = activeIndex;
    this.render(window.innerWidth < this.breakpoint);
  },

  bindEvents() {
    // Bento card interactions
    document.querySelectorAll('.bento-card').forEach((card, index) => {
      card.addEventListener('click', () => this.activateBentoCard(index));
      card.addEventListener('mouseenter', () => {
        if (!AppState.isMobile) this.activateBentoCard(index);
      });
    });

    // Accordion panel interactions
    document.querySelectorAll('.accordion-header').forEach((header, index) => {
      header.addEventListener('click', () => this.openAccordionPanel(index));
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// THEME MANAGEMENT
// ═══════════════════════════════════════════════════════════════

const ThemeManager = {
  init() {
    const saved = localStorage.getItem('lf-theme') || 'light';
    this.apply(saved);

    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggle());
    }
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    AppState.theme = theme;

    const themeBtn = document.getElementById('themeBtn');
    const themeBtnIcon = document.getElementById('themeIco');
    if (themeBtnIcon) {
      themeBtnIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    localStorage.setItem('lf-theme', theme);
  },

  toggle() {
    const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
    this.apply(newTheme);
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 1: MOCK RECRUITER REVIEW ENGINE
// ═══════════════════════════════════════════════════════════════

const RecruiterReview = {
  analyze(coverLetter, jobRole = 'Software Engineer') {
    if (!coverLetter || coverLetter.trim().length < 50) {
      return this.getEmptyResult();
    }

    const lengthScore = this.analyzeLength(coverLetter);
    const toneScore = this.analyzeTone(coverLetter);
    const atsScore = this.analyzeATSKeywords(coverLetter);
    const grammarScore = this.analyzeGrammar(coverLetter);
    const readabilityScore = this.analyzeReadability(coverLetter);
    const actionVerbScore = this.analyzeActionVerbs(coverLetter);
    const achievementScore = this.analyzeAchievements(coverLetter);
    const skillScore = this.analyzeSkills(coverLetter);

    const weights = {
      length: 0.10,
      tone: 0.15,
      ats: 0.20,
      grammar: 0.10,
      readability: 0.15,
      actionVerbs: 0.10,
      achievements: 0.10,
      skills: 0.10
    };

    const totalScore = Math.round(
      lengthScore * weights.length +
      toneScore * weights.tone +
      atsScore * weights.ats +
      grammarScore * weights.grammar +
      readabilityScore * weights.readability +
      actionVerbScore * weights.actionVerbs +
      achievementScore * weights.achievements +
      skillScore * weights.skills
    );

    return {
      score: totalScore,
      recommendation: this.getRecommendation(totalScore),
      strengths: this.getStrengths({
        lengthScore, toneScore, atsScore, grammarScore,
        readabilityScore, actionVerbScore, achievementScore, skillScore
      }),
      weaknesses: this.getWeaknesses({
        lengthScore, toneScore, atsScore, grammarScore,
        readabilityScore, actionVerbScore, achievementScore, skillScore
      }),
      suggestions: this.getSuggestions({
        lengthScore, toneScore, atsScore, grammarScore,
        readabilityScore, actionVerbScore, achievementScore, skillScore
      }),
      feedback: this.generateFeedback(totalScore, {
        lengthScore, toneScore, atsScore, grammarScore,
        readabilityScore, actionVerbScore, achievementScore, skillScore
      }),
      breakdown: {
        length: lengthScore,
        tone: toneScore,
        ats: atsScore,
        grammar: grammarScore,
        readability: readabilityScore,
        actionVerbs: actionVerbScore,
        achievements: achievementScore,
        skills: skillScore
      }
    };
  },

  analyzeLength(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;

    // Ideal: 200-400 words, 4-8 sentences, 3-5 paragraphs
    let score = 100;

    if (words < 150) score -= (150 - words) * 0.5;
    else if (words > 500) score -= (words - 500) * 0.2;

    if (sentences < 4) score -= (4 - sentences) * 8;
    else if (sentences > 10) score -= (sentences - 10) * 5;

    if (paragraphs < 3) score -= (3 - paragraphs) * 10;
    else if (paragraphs > 6) score -= (paragraphs - 6) * 5;

    return Math.max(0, Math.min(100, score));
  },

  analyzeTone(text) {
    let score = 100;
    const textLower = text.toLowerCase();

    // Check for professional language
    const formalIndicators = ['sincerely', 'regarding', 'concerning', 'opportunity', 'professional', 'experience', 'qualifications', 'contribute', 'skills'];
    const informalIndicators = ['hey', 'what\'s up', 'cool', 'awesome', 'super', 'stuff', 'thing', 'gonna', 'wanna'];

    const formalCount = formalIndicators.filter(w => textLower.includes(w)).length;
    const informalCount = informalIndicators.filter(w => textLower.includes(w)).length;

    score += formalCount * 3;
    score -= informalCount * 15;

    // Check for confident language
    const confidentWords = ['confident', 'certain', 'proven', 'demonstrated', 'achieved', 'accomplished', 'expert', 'skilled'];
    const hedgingWords = ['maybe', 'might', 'possibly', 'perhaps', 'somewhat', 'kind of', 'sort of', 'i think', 'i guess'];

    const confidentCount = confidentWords.filter(w => textLower.includes(w)).length;
    const hedgingCount = hedgingWords.filter(w => textLower.includes(w)).length;

    score += confidentCount * 5;
    score -= hedgingCount * 10;

    return Math.max(0, Math.min(100, score));
  },

  analyzeATSKeywords(text) {
    const result = KeywordMatcher.matchATSKeywords(text, 'software');
    const coverage = result.coverage;

    // Bonus for high coverage
    let score = coverage;

    // Check for quantified achievements
    const hasNumbers = /\d+%|\$\d+|\d+\s*(years?|months?|projects?|employees?|team)/i.test(text);
    if (hasNumbers) score += 10;

    // Check for specific technologies/frameworks
    const techPatterns = /\b(react|angular|vue|node|python|java|javascript|typescript|sql|aws|docker|kubernetes|git)\b/i;
    const techMatches = text.match(techPatterns);
    if (techMatches) score += 10;

    return Math.max(0, Math.min(100, score));
  },

  analyzeGrammar(text) {
    const analysis = GrammarAnalyzer.analyze(text);
    return analysis.overallScore;
  },

  analyzeReadability(text) {
    const analysis = ReadabilityAnalyzer.analyze(text);
    // Ideal readability: 50-70 (professional documents)
    const score = analysis.score;
    let adjusted = 100;

    if (score < 40) adjusted = 40 + (score * 1.5);
    else if (score > 80) adjusted = 100 - ((score - 80) * 2);
    else adjusted = 80 + ((score - 50) * 0.5);

    return Math.max(0, Math.min(100, adjusted));
  },

  analyzeActionVerbs(text) {
    const verbs = KeywordMatcher.findActionVerbs(text);
    const totalVerbs = Object.values(verbs).flat().length;

    // Score based on variety and quantity
    let score = Math.min(100, totalVerbs * 8);

    // Bonus for variety
    const categories = Object.keys(verbs).filter(k => verbs[k].length > 0).length;
    score += categories * 5;

    return Math.max(0, Math.min(100, score));
  },

  analyzeAchievements(text) {
    let score = 50;

    // Check for quantified results
    const quantified = /(increased|decreased|reduced|improved|achieved|delivered|generated)\s+(by\s+)?\d+/i.test(text);
    if (quantified) score += 20;

    // Check for percentages
    const hasPercent = /\d+%/i.test(text);
    if (hasPercent) score += 15;

    // Check for specific metrics
    const hasMetrics = /\$\d+|\d+\s*(users?|customers?|revenue|sales|downloads?|views?|performance)/i.test(text);
    if (hasMetrics) score += 15;

    // Check for result-oriented language
    const resultWords = ['resulted in', 'led to', 'contributed to', 'delivered', 'achieved', 'improved'];
    const hasResultOriented = resultWords.some(w => text.toLowerCase().includes(w));
    if (hasResultOriented) score += 10;

    return Math.max(0, Math.min(100, score));
  },

  analyzeSkills(text) {
    const extracted = KeywordMatcher.extractSkills(text, SkillsDatabase);
    const uniqueSkills = new Set(extracted.map(s => s.skill.toLowerCase()));

    // Score based on skill density
    let score = Math.min(100, uniqueSkills.size * 10);

    // Bonus for varied skill categories
    const categories = new Set(extracted.map(s => s.category));
    score += categories.size * 5;

    return Math.max(0, Math.min(100, score));
  },

  getRecommendation(score) {
    if (score >= 85) return { level: 'Strongly Recommend', color: '#10b981', icon: 'fa-thumbs-up' };
    if (score >= 70) return { level: 'Recommend', color: '#0ea5e9', icon: 'fa-check' };
    if (score >= 50) return { level: 'Consider', color: '#f59e0b', icon: 'fa-minus' };
    return { level: 'Reject', color: '#ef4444', icon: 'fa-thumbs-down' };
  },

  getStrengths(scores) {
    const strengths = [];

    if (scores.atsScore >= 70) strengths.push('Strong ATS keyword optimization');
    if (scores.actionVerbScore >= 70) strengths.push('Excellent use of action verbs');
    if (scores.achievementScore >= 70) strengths.push('Well-quantified achievements');
    if (scores.toneScore >= 70) strengths.push('Professional and confident tone');
    if (scores.lengthScore >= 70) strengths.push('Appropriate length');
    if (scores.readabilityScore >= 70) strengths.push('Clear and readable content');
    if (scores.skillScore >= 70) strengths.push('Good skill demonstration');
    if (scores.grammarScore >= 70) strengths.push('Strong grammar and structure');

    return strengths.length > 0 ? strengths : ['Cover letter shows potential'];
  },

  getWeaknesses(scores) {
    const weaknesses = [];

    if (scores.atsScore < 50) weaknesses.push('Low ATS keyword coverage - may not pass automated screening');
    if (scores.actionVerbScore < 50) weaknesses.push('Weak action verbs - lacks impact');
    if (scores.achievementScore < 50) weaknesses.push('Missing quantified achievements');
    if (scores.toneScore < 50) weaknesses.push('Tone needs improvement - consider more professional language');
    if (scores.lengthScore < 50) weaknesses.push('Length issues - too short or too long');
    if (scores.readabilityScore < 50) weaknesses.push('Readability concerns - may be too complex or too simple');
    if (scores.skillScore < 50) weaknesses.push('Insufficient skill demonstration');

    return weaknesses;
  },

  getSuggestions(scores) {
    const suggestions = [];

    if (scores.atsScore < 70) {
      suggestions.push('Add more industry-specific keywords from the job description');
      suggestions.push('Include relevant technical skills and tools');
    }
    if (scores.actionVerbScore < 70) {
      suggestions.push('Use strong action verbs: developed, implemented, designed, achieved');
    }
    if (scores.achievementScore < 70) {
      suggestions.push('Quantify your achievements with numbers, percentages, or metrics');
      suggestions.push('Show the impact of your work with specific results');
    }
    if (scores.lengthScore < 70) {
      suggestions.push('Aim for 250-400 words across 4-6 paragraphs');
    }
    if (scores.toneScore < 70) {
      suggestions.push('Use confident, professional language');
      suggestions.push('Remove hedging words like "maybe" or "perhaps"');
    }

    return suggestions.length > 0 ? suggestions : ['Continue refining your content for even better results'];
  },

  generateFeedback(score, scores) {
    const level = this.getRecommendation(score);
    let feedback = `This cover letter scores ${score}/100 and receives a "${level.level}" recommendation. `;

    if (score >= 85) {
      feedback += 'The letter demonstrates excellent professional writing with strong ATS optimization and compelling content.';
    } else if (score >= 70) {
      feedback += 'The letter is well-structured and professional, with room for improvement in certain areas.';
    } else if (score >= 50) {
      feedback += 'The letter has potential but needs significant improvements to be competitive.';
    } else {
      feedback += 'This letter requires substantial revision to meet professional standards and pass ATS screening.';
    }

    return feedback;
  },

  getEmptyResult() {
    return {
      score: 0,
      recommendation: { level: 'Incomplete', color: '#94a3b8', icon: 'fa-exclamation' },
      strengths: [],
      weaknesses: ['No content to analyze'],
      suggestions: ['Add content to your cover letter to receive feedback'],
      feedback: 'Please generate or paste a cover letter to receive recruiter feedback.',
      breakdown: { length: 0, tone: 0, ats: 0, grammar: 0, readability: 0, actionVerbs: 0, achievements: 0, skills: 0 }
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 2: INTERVIEW QUESTION GENERATOR
// ═══════════════════════════════════════════════════════════════

const InterviewGenerator = {
  generate(jobRole, skills, experienceLevel = 'mid', industry = 'tech', count = 25) {
    const relevantCategories = this.getRelevantCategories(skills);
    const questions = [];

    // Technical questions (40% of total)
    const technicalCount = Math.ceil(count * 0.4);
    questions.push(...this.getTechnicalQuestions(relevantCategories, technicalCount));

    // Behavioral questions (20%)
    const behavioralCount = Math.ceil(count * 0.2);
    questions.push(...this.getBehavioralQuestions(behavioralCount));

    // HR questions (15%)
    questions.push(...this.getHRQuestions(Math.ceil(count * 0.15)));

    // Scenario questions (15%)
    questions.push(...this.getScenarioQuestions(Math.ceil(count * 0.15)));

    // Leadership/Project questions (10%)
    if (experienceLevel === 'senior' || experienceLevel === 'lead') {
      questions.push(...this.getLeadershipQuestions(Math.ceil(count * 0.1)));
    }
    questions.push(...this.getProjectQuestions(Math.ceil(count * 0.1)));

    // Shuffle and trim
    return this.shuffleArray(questions).slice(0, count).map((q, i) => ({
      id: i + 1,
      ...q,
      difficulty: this.assignDifficulty(q.category, experienceLevel)
    }));
  },

  getRelevantCategories(skills) {
    if (!skills) return DefaultCategories || ['general'];

    const skillArray = skills.toLowerCase().split(',').map(s => s.trim());
    const categories = new Set(['general']);

    skillArray.forEach(skill => {
      const mapping = SkillQuestionMapping[skill];
      if (mapping) {
        mapping.forEach(cat => categories.add(cat));
      }
    });

    return Array.from(categories);
  },

  getTechnicalQuestions(categories, count) {
    const questions = [];
    const db = QuestionDatabase.technical;

    categories.forEach(category => {
      if (db[category]) {
        const available = db[category];
        questions.push(...available.map(q => ({
          question: q,
          category: 'Technical',
          subCategory: category,
          type: 'technical'
        })));
      }
    });

    return this.shuffleArray(questions).slice(0, count);
  },

  getBehavioralQuestions(count) {
    const questions = QuestionDatabase.behavioral || [];
    return this.shuffleArray(questions).slice(0, count).map(q => ({
      question: q,
      category: 'Behavioral',
      type: 'behavioral'
    }));
  },

  getHRQuestions(count) {
    const questions = QuestionDatabase.hr || [];
    return this.shuffleArray(questions).slice(0, count).map(q => ({
      question: q,
      category: 'HR',
      type: 'hr'
    }));
  },

  getScenarioQuestions(count) {
    const questions = QuestionDatabase.scenario || [];
    return this.shuffleArray(questions).slice(0, count).map(q => ({
      question: q,
      category: 'Scenario',
      type: 'scenario'
    }));
  },

  getLeadershipQuestions(count) {
    const questions = QuestionDatabase.leadership || [];
    return this.shuffleArray(questions).slice(0, count).map(q => ({
      question: q,
      category: 'Leadership',
      type: 'leadership'
    }));
  },

  getProjectQuestions(count) {
    const questions = QuestionDatabase.project || [];
    return this.shuffleArray(questions).slice(0, count).map(q => ({
      question: q,
      category: 'Project',
      type: 'project'
    }));
  },

  assignDifficulty(category, experience) {
    const difficulties = {
      junior: ['easy', 'easy', 'medium'],
      mid: ['easy', 'medium', 'medium', 'hard'],
      senior: ['medium', 'hard', 'hard', 'expert'],
      lead: ['medium', 'hard', 'expert', 'expert']
    };
    const pool = difficulties[experience] || difficulties.mid;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 3: JOB MATCH ANALYZER
// ═══════════════════════════════════════════════════════════════

const JobMatchAnalyzer = {
  analyze(resumeSkills, jobDescription) {
    if (!resumeSkills || !jobDescription) {
      return this.getEmptyResult();
    }

    // Extract skills from inputs
    const resumeSkillArray = this.parseSkills(resumeSkills);
    const jobSkills = this.extractJobSkills(jobDescription);

    // Calculate match
    const matchResult = this.calculateMatch(resumeSkillArray, jobSkills);

    // Analyze gaps
    const gapAnalysis = this.analyzeGaps(resumeSkillArray, jobSkills);

    // Calculate ATS coverage
    const atsResult = this.calculateATSCoverage(resumeSkills, jobDescription);

    // Calculate readiness score
    const readiness = this.calculateReadiness(matchResult.score, atsResult.score, gapAnalysis);

    return {
      matchPercentage: matchResult.score,
      matchedSkills: matchResult.matched,
      missingSkills: matchResult.missing,
      strongMatches: matchResult.strong,
      skillGaps: gapAnalysis.gaps,
      atsCoverage: atsResult.score,
      atsKeywords: atsResult.keywords,
      readinessScore: readiness,
      recommendation: this.getRecommendation(readiness),
      radarData: this.generateRadarData(matchResult)
    };
  },

  parseSkills(skillsInput) {
    if (Array.isArray(skillsInput)) return skillsInput;
    return skillsInput.toLowerCase()
      .split(/[,\n•;]/)
      .map(s => s.trim())
      .filter(s => s.length > 1);
  },

  extractJobSkills(jobDescription) {
    const skills = [];
    const textLower = jobDescription.toLowerCase();

    // Check against skills database
    Object.values(SkillsDatabase?.categories || {}).forEach(category => {
      category.skills.forEach(skill => {
        if (textLower.includes(skill.toLowerCase())) {
          skills.push(skill.toLowerCase());
        }
      });
    });

    // Also extract words that look like technologies
    const techPattern = /\b(react|vue|angular|node|python|java|javascript|typescript|sql|aws|azure|docker|kubernetes|git|mongodb|postgresql|redis|graphql|rest|api)\b/gi;
    const matches = jobDescription.match(techPattern) || [];
    matches.forEach(m => {
      if (!skills.includes(m.toLowerCase())) {
        skills.push(m.toLowerCase());
      }
    });

    return [...new Set(skills)];
  },

  calculateMatch(resumeSkills, jobSkills) {
    const matched = [];
    const strong = [];
    const missing = [];

    jobSkills.forEach(jobSkill => {
      let found = false;
      let matchedAs = null;

      for (const resumeSkill of resumeSkills) {
        const similarity = StringSimilarity.overallSimilarity(jobSkill, resumeSkill);
        if (similarity > 0.9) {
          strong.push({ jobSkill, resumeSkill, confidence: similarity });
          found = true;
          break;
        } else if (similarity > 0.7) {
          matched.push({ jobSkill, resumeSkill, confidence: similarity });
          found = true;
          break;
        }
      }

      if (!found) {
        missing.push(jobSkill);
      }
    });

    const score = jobSkills.length > 0
      ? Math.round(((strong.length * 1 + matched.length * 0.7) / jobSkills.length) * 100)
      : 0;

    return { score, matched, strong, missing };
  },

  analyzeGaps(resumeSkills, jobSkills) {
    const gaps = [];

    jobSkills.forEach(jobSkill => {
      const hasSkill = resumeSkills.some(rs =>
        StringSimilarity.overallSimilarity(jobSkill, rs) > 0.7
      );

      if (!hasSkill) {
        gaps.push({
          skill: jobSkill,
          importance: this.assessSkillImportance(jobSkill),
          suggestion: this.getGapSuggestion(jobSkill)
        });
      }
    });

    return { gaps, gapCount: gaps.length, gapPercentage: jobSkills.length > 0 ? (gaps.length / jobSkills.length) * 100 : 0 };
  },

  assessSkillImportance(skill) {
    const highImportance = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'git'];
    const mediumImportance = ['typescript', 'docker', 'kubernetes', 'mongodb', 'redis', 'graphql'];

    if (highImportance.includes(skill.toLowerCase())) return 'high';
    if (mediumImportance.includes(skill.toLowerCase())) return 'medium';
    return 'low';
  },

  getGapSuggestion(skill) {
    const suggestions = {
      default: `Consider learning ${skill} through online courses or personal projects.`,
      react: 'Build a React project and learn hooks, state management, and component patterns.',
      python: 'Practice Python through data analysis scripts, web scrapers, or Django projects.',
      aws: 'Set up a free AWS account and experiment with EC2, S3, and Lambda.',
      docker: 'Containerize one of your existing projects and learn Docker Compose.',
      kubernetes: 'Start with minikube and deploy a simple multi-service application.'
    };
    return suggestions[skill.toLowerCase()] || suggestions.default;
  },

  calculateATSCoverage(resume, jobDesc) {
    const resumeTokens = TextProcessor.removeStopwords(TextProcessor.tokenize(resume));
    const jobTokens = TextProcessor.removeStopwords(TextProcessor.tokenize(jobDesc));

    const uniqueJobTokens = [...new Set(jobTokens)];
    const matchedKeywords = uniqueJobTokens.filter(t => resumeTokens.includes(t));

    const score = uniqueJobTokens.length > 0
      ? Math.round((matchedKeywords.length / uniqueJobTokens.length) * 100)
      : 0;

    return {
      score,
      keywords: {
        matched: matchedKeywords.slice(0, 20),
        missing: uniqueJobTokens.filter(t => !resumeTokens.includes(t)).slice(0, 20)
      }
    };
  },

  calculateReadiness(matchScore, atsScore, gapAnalysis) {
    // Weighted formula
    const weights = {
      match: 0.5,
      ats: 0.3,
      gaps: 0.2
    };

    const gapPenalty = Math.min(100, gapAnalysis.gapPercentage);

    return Math.round(
      matchScore * weights.match +
      atsScore * weights.ats +
      (100 - gapPenalty) * weights.gaps
    );
  },

  getRecommendation(readiness) {
    if (readiness >= 75) return { level: 'Highly Qualified', color: '#10b981', action: 'Apply with confidence' };
    if (readiness >= 50) return { level: 'Qualified', color: '#0ea5e9', action: 'Apply and address gaps in cover letter' };
    if (readiness >= 30) return { level: 'Partially Qualified', color: '#f59e0b', action: 'Consider skill development before applying' };
    return { level: 'Under Qualified', color: '#ef4444', action: 'Focus on building required skills first' };
  },

  generateRadarData(matchResult) {
    return {
      labels: ['Technical Skills', 'Tools & Frameworks', 'Soft Skills', 'Experience', 'ATS Optimization', 'Industry Knowledge'],
      datasets: [{
        label: 'Your Profile',
        data: [
          Math.min(100, matchResult.strong.length * 15 + matchResult.matched.length * 10),
          matchResult.score,
          75, // Placeholder for soft skills
          70, // Placeholder for experience
          matchResult.score * 0.8, // ATS estimation
          65  // Placeholder
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2
      }]
    };
  },

  getEmptyResult() {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      strongMatches: [],
      skillGaps: [],
      atsCoverage: 0,
      atsKeywords: { matched: [], missing: [] },
      readinessScore: 0,
      recommendation: { level: 'Incomplete', color: '#94a3b8', action: 'Add resume and job description' },
      radarData: null
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 4: SUCCESS PROBABILITY PREDICTOR
// ═══════════════════════════════════════════════════════════════

const SuccessPredictor = {
  calculate(inputs) {
    const {
      resumeQuality = 50,
      jobMatchScore = 50,
      coverLetterQuality = 50,
      atsScore = 50,
      experienceMatch = 50,
      skillAlignment = 50,
      companyFit = 50,
      marketConditions = 50
    } = inputs;

    // Weighted calculation
    const weights = {
      resumeQuality: 0.15,
      jobMatch: 0.20,
      coverLetter: 0.15,
      ats: 0.15,
      experience: 0.10,
      skills: 0.10,
      companyFit: 0.10,
      market: 0.05
    };

    const probability = Math.round(
      resumeQuality * weights.resumeQuality +
      jobMatchScore * weights.jobMatch +
      coverLetterQuality * weights.coverLetter +
      atsScore * weights.ats +
      experienceMatch * weights.experience +
      skillAlignment * weights.skills +
      companyFit * weights.companyFit +
      marketConditions * weights.market
    );

    return {
      probability,
      interviewChance: this.calculateInterviewChance(probability),
      applicationReadiness: this.calculateReadiness(inputs),
      keySuccessFactors: this.identifySuccessFactors(inputs),
      weakAreas: this.identifyWeakAreas(inputs),
      improvements: this.suggestImprovements(inputs),
      confidence: this.calculateConfidence(inputs)
    };
  },

  calculateInterviewChance(baseProbability) {
    // Interview chance is higher than application success
    // because good applications may still face competition
    return Math.min(100, Math.round(baseProbability * 1.2));
  },

  calculateReadiness(inputs) {
    const factors = Object.values(inputs).filter(v => typeof v === 'number');
    const average = factors.reduce((a, b) => a + b, 0) / factors.length;

    if (average >= 70) return { level: 'High', description: 'Ready to apply with strong positioning' };
    if (average >= 50) return { level: 'Medium', description: 'Apply but address identified weaknesses' };
    return { level: 'Low', description: 'Improve key areas before applying' };
  },

  identifySuccessFactors(inputs) {
    const factors = [];

    if (inputs.resumeQuality >= 70) factors.push({ factor: 'Strong Resume', score: inputs.resumeQuality });
    if (inputs.jobMatchScore >= 70) factors.push({ factor: 'Good Job Match', score: inputs.jobMatchScore });
    if (inputs.coverLetterQuality >= 70) factors.push({ factor: 'Compelling Cover Letter', score: inputs.coverLetterQuality });
    if (inputs.atsScore >= 70) factors.push({ factor: 'ATS Optimized', score: inputs.atsScore });
    if (inputs.experienceMatch >= 70) factors.push({ factor: 'Relevant Experience', score: inputs.experienceMatch });
    if (inputs.skillAlignment >= 70) factors.push({ factor: 'Aligned Skills', score: inputs.skillAlignment });

    return factors.sort((a, b) => b.score - a.score).slice(0, 3);
  },

  identifyWeakAreas(inputs) {
    const areas = [];

    if (inputs.resumeQuality < 60) areas.push({ area: 'Resume Quality', score: inputs.resumeQuality, priority: 'high' });
    if (inputs.jobMatchScore < 60) areas.push({ area: 'Job Match', score: inputs.jobMatchScore, priority: 'high' });
    if (inputs.coverLetterQuality < 60) areas.push({ area: 'Cover Letter', score: inputs.coverLetterQuality, priority: 'medium' });
    if (inputs.atsScore < 60) areas.push({ area: 'ATS Optimization', score: inputs.atsScore, priority: 'medium' });
    if (inputs.experienceMatch < 60) areas.push({ area: 'Experience Match', score: inputs.experienceMatch, priority: 'high' });
    if (inputs.skillAlignment < 60) areas.push({ area: 'Skill Alignment', score: inputs.skillAlignment, priority: 'medium' });

    return areas;
  },

  suggestImprovements(inputs) {
    const suggestions = [];

    if (inputs.atsScore < 70) {
      suggestions.push('Add more keywords from the job description to improve ATS compatibility');
    }
    if (inputs.coverLetterQuality < 70) {
      suggestions.push('Strengthen your cover letter with specific achievements and quantified results');
    }
    if (inputs.jobMatchScore < 70) {
      suggestions.push('Highlight relevant skills that match the job requirements more prominently');
    }
    if (inputs.experienceMatch < 70) {
      suggestions.push('Emphasize experience that directly relates to the target role');
    }

    return suggestions;
  },

  calculateConfidence(inputs) {
    // Calculate how confident we are in our prediction
    const factors = Object.values(inputs).filter(v => typeof v === 'number');
    const variance = factors.reduce((sum, f) => sum + Math.pow(f - 50, 2), 0) / factors.length;

    // Lower variance = more confident prediction
    const confidence = Math.min(100, 50 + (100 - Math.sqrt(variance)));
    return Math.round(confidence);
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 5: CAREER COACH ENGINE
// ═══════════════════════════════════════════════════════════════

const CareerCoach = {
  generateRoadmap(currentSkills, desiredRole, yearsExperience) {
    const roleData = this.getRoleData(desiredRole);
    const skillGaps = this.analyzeSkillGaps(currentSkills, roleData);
    const currentLevel = this.determineLevel(yearsExperience, roleData);

    return {
      currentLevel,
      targetLevel: roleData.path[roleData.path.length - 1],
      roadmap: this.buildRoadmap(currentLevel, roleData),
      missingSkills: skillGaps,
      certifications: this.recommendCertifications(skillGaps, desiredRole),
      salaryRange: roleData.avgSalary[currentLevel] || { min: 0, max: 0 },
      timeline: this.generateTimeline(skillGaps, yearsExperience),
      nextSteps: this.generateNextSteps(currentLevel, roleData)
    };
  },

  getRoleData(role) {
    const roleMap = {
      'software engineer': SkillsDatabase?.careerPaths?.softwareEngineer,
      'frontend developer': SkillsDatabase?.careerPaths?.frontendDeveloper,
      'full stack developer': SkillsDatabase?.careerPaths?.fullStackDeveloper,
      'data scientist': SkillsDatabase?.careerPaths?.dataScientist,
      'devops engineer': SkillsDatabase?.careerPaths?.devOpsEngineer
    };

    // Normalize role name
    const normalizedRole = role.toLowerCase().replace(/[\s-]/g, '');
    for (const [key, value] of Object.entries(roleMap)) {
      if (normalizedRole.includes(key.replace(/\s/g, ''))) {
        return value;
      }
    }

    // Default to software engineer path
    return SkillsDatabase?.careerPaths?.softwareEngineer;
  },

  analyzeSkillGaps(currentSkills, roleData) {
    if (!roleData) return [];

    const skillArray = currentSkills.toLowerCase().split(',').map(s => s.trim());
    const allRequired = Object.values(roleData.skills).flat();

    const gaps = [];
    allRequired.forEach(required => {
      const hasSkill = skillArray.some(s =>
        StringSimilarity.overallSimilarity(s, required) > 0.7
      );
      if (!hasSkill) {
        gaps.push({
          skill: required,
          priority: this.prioritizeSkill(required, roleData)
        });
      }
    });

    return gaps.sort((a, b) => b.priority - a.priority).slice(0, 10);
  },

  prioritizeSkill(skill, roleData) {
    const highPrioritySkills = ['programming', 'architecture', 'system design', 'leadership', 'mentoring'];
    const skillLower = skill.toLowerCase();

    for (const hp of highPrioritySkills) {
      if (skillLower.includes(hp)) return 3;
    }
    return 1;
  },

  determineLevel(years, roleData) {
    if (!roleData) return 'junior';

    const path = roleData.path;
    if (years < 1) return path[0]?.toLowerCase().replace(/\s/g, '') || 'intern';
    if (years < 2) return 'junior';
    if (years < 4) return path[Math.min(2, path.length - 1)]?.toLowerCase().replace(/\s/g, '') || 'mid';
    if (years < 7) return 'senior';
    if (years < 10) return 'lead';
    return 'principal';
  },

  buildRoadmap(currentLevel, roleData) {
    if (!roleData) return [];

    const path = roleData.path;
    const roadmap = [];

    path.forEach((level, index) => {
      const levelSkills = roleData.skills[Object.keys(roleData.skills)[index]];
      roadmap.push({
        level,
        skills: levelSkills || [],
        milestone: this.getMilestone(level, index),
        timeframe: this.estimateTimeframe(index)
      });
    });

    return roadmap;
  },

  getMilestone(level, index) {
    const milestones = {
      0: 'Foundation building',
      1: 'Technical proficiency',
      2: 'Professional development',
      3: 'Senior-level expertise',
      4: 'Technical leadership',
      5: 'Strategic impact',
      6: 'Industry leadership'
    };
    return milestones[index] || 'Advanced expertise';
  },

  estimateTimeframe(index) {
    const timeframes = ['6 months', '1-2 years', '2-4 years', '4-6 years', '6-8 years', '8-12 years', '10+ years'];
    return timeframes[index] || 'Varies';
  },

  recommendCertifications(skillGaps, role) {
    const relevant = [];

    // Check relevant certification categories
    Object.entries(SkillsDatabase?.certifications || {}).forEach(([category, certs]) => {
      certs.forEach(cert => {
        const relevantGap = skillGaps.find(gap =>
          gap.skill.toLowerCase().includes(cert.name.toLowerCase().split(' ')[0])
        );
        if (relevantGap) {
          relevant.push(cert);
        }
      });
    });

    // Always recommend some relevant ones
    const cloudCerts = SkillsDatabase?.certifications?.cloud || [];
    const devCerts = SkillsDatabase?.certifications?.development || [];

    return [...new Set([...relevant, ...cloudCerts.slice(0, 2), ...devCerts.slice(0, 1)])].slice(0, 5);
  },

  generateTimeline(skillGaps, yearsExperience) {
    const months = Math.max(3, Math.min(36, skillGaps.length * 2));

    return {
      totalMonths: months,
      phases: [
        { phase: 'Foundation', duration: '1-3 months', focus: skillGaps.slice(0, 3) },
        { phase: 'Intermediate', duration: '3-6 months', focus: skillGaps.slice(3, 6) },
        { phase: 'Advanced', duration: '6-12 months', focus: skillGaps.slice(6, 10) }
      ]
    };
  },

  generateNextSteps(currentLevel, roleData) {
    return [
      'Build a portfolio project demonstrating core skills',
      'Contribute to open-source projects in your target domain',
      'Network with professionals in your desired role',
      'Complete a relevant certification',
      'Practice technical interview questions',
      'Seek mentorship from senior professionals'
    ];
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 6: APPLICATION STRATEGY GENERATOR
// ═══════════════════════════════════════════════════════════════

const ApplicationStrategy = {
  generate(profile) {
    const { skills, experience, targetRole, targetIndustry, location } = profile;

    return {
      priorityScore: this.calculatePriorityScore(profile),
      recommendedResumeType: this.recommendResumeType(profile),
      coverLetterStyle: this.recommendCoverLetterStyle(profile),
      weeklyPlan: this.generateWeeklyPlan(),
      monthlyTargets: this.generateMonthlyTargets(),
      recommendedIndustries: this.recommendIndustries(skills),
      recommendedCompanies: this.recommendCompanies(targetIndustry),
      searchStrategy: this.generateSearchStrategy(profile)
    };
  },

  calculatePriorityScore(profile) {
    let score = 50;

    if (profile.experience && profile.experience > 3) score += 15;
    if (profile.skills && profile.skills.split(',').length > 5) score += 10;
    if (profile.targetRole) score += 15;
    if (profile.portfolio) score += 10;

    return Math.min(100, score);
  },

  recommendResumeType(profile) {
    const years = profile.experience || 0;

    if (years < 2) return { type: 'Functional', reason: 'Highlight skills over chronological experience' };
    if (years < 5) return { type: 'Hybrid', reason: 'Balance skills and experience' };
    return { type: 'Chronological', reason: 'Showcase career progression' };
  },

  recommendCoverLetterStyle(profile) {
    const role = (profile.targetRole || '').toLowerCase();

    if (role.includes('startup')) return { style: 'Passionate & Story-driven', template: 'startup' };
    if (role.includes('senior') || role.includes('lead')) return { style: 'Results-focused', template: 'experienced' };
    if (role.includes('manager') || role.includes('director')) return { style: 'Leadership-oriented', template: 'corporate' };
    return { style: 'Professional & Balanced', template: 'corporate' };
  },

  generateWeeklyPlan() {
    return [
      { day: 'Monday', tasks: ['Research 5 target companies', 'Update LinkedIn profile', 'Review job boards'] },
      { day: 'Tuesday', tasks: ['Apply to 3-5 positions', 'Customize resume for each', 'Write targeted cover letters'] },
      { day: 'Wednesday', tasks: ['Network outreach', 'Connect with recruiters', 'Follow up on applications'] },
      { day: 'Thursday', tasks: ['Skill development', 'Online courses', 'Practice interview questions'] },
      { day: 'Friday', tasks: ['Portfolio updates', 'Application tracking', 'Week review'] }
    ];
  },

  generateMonthlyTargets() {
    return {
      applicationsTarget: 20,
      networkingGoal: 'Connect with 15 professionals',
      skillDevelopment: 'Complete 1 certification course',
      interviewPrep: 'Practice 50 interview questions'
    };
  },

  recommendIndustries(skills) {
    const industries = [];
    const skillLower = (skills || '').toLowerCase();

    if (skillLower.includes('react') || skillLower.includes('javascript')) {
      industries.push('Technology', 'FinTech', 'E-commerce');
    }
    if (skillLower.includes('python') || skillLower.includes('machine learning')) {
      industries.push('Technology', 'Healthcare', 'Finance');
    }
    if (skillLower.includes('aws') || skillLower.includes('cloud')) {
      industries.push('Cloud Services', 'Enterprise', 'Startups');
    }

    return industries.length > 0 ? industries : ['Technology', 'Finance', 'Healthcare'];
  },

  recommendCompanies(industry) {
    const companyMap = {
      'technology': ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Stripe', 'Shopify'],
      'fintech': ['Stripe', 'Square', 'PayPal', 'Coinbase', 'Robinhood', 'Plaid'],
      'healthcare': ['UnitedHealth', 'CVS Health', 'Teladoc', 'Epic Systems', 'Flatiron Health'],
      'finance': ['JPMorgan', 'Goldman Sachs', 'Morgan Stanley', 'Bloomberg', 'Capital One'],
      'default': ['Google', 'Microsoft', 'Amazon', 'Stripe', 'Shopify']
    };

    return companyMap[industry?.toLowerCase()] || companyMap.default;
  },

  generateSearchStrategy(profile) {
    return {
      primaryPlatforms: ['LinkedIn', 'Indeed', 'Company Careers Pages'],
      nichePlatforms: this.getNichePlatforms(profile.targetRole),
      networkingApproach: 'Connect with employees at target companies before applying',
      timing: 'Apply Tuesday-Thursday between 9-11 AM for best visibility',
      followUp: 'Follow up after 1 week if no response'
    };
  },

  getNichePlatforms(role) {
    const platforms = {
      'software engineer': ['Stack Overflow Jobs', 'Hacker News', 'AngelList'],
      'front-end developer': ['CodePen Jobs', 'CSS-Tricks Jobs'],
      'designer': ['Dribbble', 'Behance', 'AIGA'],
      'data scientist': ['Kaggle Jobs', 'Data Science Central'],
      'default': ['Glassdoor', 'AngelList', 'Hired']
    };

    return platforms[role?.toLowerCase()] || platforms.default;
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 7: LINKEDIN PROFILE ANALYZER
// ═══════════════════════════════════════════════════════════════

const LinkedInAnalyzer = {
  analyze(profileData) {
    const { about, experience, skills, headline } = profileData;

    const aboutScore = this.analyzeAbout(about);
    const experienceScore = this.analyzeExperience(experience);
    const skillsScore = this.analyzeSkills(skills);
    const headlineScore = this.analyzeHeadline(headline);

    const overallScore = Math.round(
      aboutScore * 0.25 +
      experienceScore * 0.30 +
      skillsScore * 0.25 +
      headlineScore * 0.20
    );

    return {
      strengthScore: overallScore,
      keywordDensity: this.calculateKeywordDensity(profileData),
      profileCompleteness: this.calculateCompleteness(profileData),
      missingKeywords: this.identifyMissingKeywords(profileData),
      optimizationSuggestions: this.generateOptimizations(profileData),
      recruiterVisibilityScore: this.calculateVisibility(overallScore)
    };
  },

  analyzeAbout(about) {
    if (!about || about.trim().length < 50) return 20;

    let score = 50;

    // Check length (ideal: 300-700 chars)
    if (about.length >= 300 && about.length <= 700) score += 20;
    else if (about.length >= 200) score += 10;

    // Check for keywords
    const keywords = ['experience', 'passionate', 'expertise', 'achieved', 'leadership', 'strategic'];
    const found = keywords.filter(k => about.toLowerCase().includes(k)).length;
    score += found * 3;

    // Check for numbers/achievements
    if (/\d+%|\d+\s*(years?|projects?|team)/.test(about)) score += 15;

    return Math.min(100, score);
  },

  analyzeExperience(experience) {
    if (!experience || experience.trim().length < 100) return 30;

    let score = 40;

    // Check for action verbs
    const verbs = KeywordMatcher.findActionVerbs(experience);
    const verbCount = Object.values(verbs).flat().length;
    score += Math.min(30, verbCount * 3);

    // Check for quantified achievements
    if (/\d+%|\$\d+|\d+\s*(users?|revenue|sales)/.test(experience)) score += 20;
    else if (/\d+/.test(experience)) score += 10;

    return Math.min(100, score);
  },

  analyzeSkills(skills) {
    if (!skills) return 20;

    const skillArray = skills.split(',').map(s => s.trim()).filter(s => s);
    let score = Math.min(50, skillArray.length * 5);

    // Bonus for relevant skills
    const relevantCount = KeywordMatcher.extractSkills(skills, SkillsDatabase).length;
    score += Math.min(30, relevantCount * 5);

    return Math.min(100, score);
  },

  analyzeHeadline(headline) {
    if (!headline || headline.trim().length < 5) return 20;

    let score = 40;

    // Check for role keywords
    if (/\b(engineer|developer|manager|director|analyst|designer|consultant)\b/i.test(headline)) score += 20;

    // Check for company
    if (/at\s+\w+/.test(headline)) score += 15;

    // Check for unique value proposition
    if (headline.length > 30 && headline.length < 120) score += 15;

    return Math.min(100, score);
  },

  calculateKeywordDensity(profileData) {
    const allText = Object.values(profileData).join(' ').toLowerCase();
    const tokens = TextProcessor.tokenize(allText);
    const unique = new Set(tokens);
    const density = unique.size / tokens.length;

    return {
      density: Math.round(density * 100),
      uniqueKeywords: unique.size,
      totalWords: tokens.length,
      rating: density > 0.5 ? 'Good' : density > 0.3 ? 'Moderate' : 'Sparse'
    };
  },

  calculateCompleteness(data) {
    const fields = ['about', 'experience', 'skills', 'headline'];
    const filled = fields.filter(f => data[f] && data[f].trim().length > 0).length;

    const completion = {
      about: data.about?.length > 50,
      experience: data.experience?.length > 100,
      skills: data.skills?.split(',').length > 3,
      headline: data.headline?.length > 10
    };

    const score = Math.round((Object.values(completion).filter(Boolean).length / 4) * 100);

    return { score, fields: completion, percentage: score };
  },

  identifyMissingKeywords(data) {
    const allText = Object.values(data).join(' ').toLowerCase();
    const missing = [];

    // Check against industry keywords
    const industryKeywords = SkillsDatabase?.industryKeywords?.tech || [];
    industryKeywords.forEach(kw => {
      if (!allText.includes(kw.toLowerCase())) {
        missing.push(kw);
      }
    });

    return missing.slice(0, 15);
  },

  generateOptimizations(data) {
    const suggestions = [];

    if (!data.about || data.about.length < 100) {
      suggestions.push('Add a detailed About section (300-700 characters) highlighting your unique value');
    }
    if (!data.experience || !/\d+%|\d+\s*(years?|projects?)/.test(data.experience)) {
      suggestions.push('Add quantified achievements to your experience (e.g., "Increased sales by 25%")');
    }
    if (!data.skills || data.skills.split(',').length < 5) {
      suggestions.push('Add at least 10 relevant skills to improve discoverability');
    }
    if (!data.headline || data.headline.length < 30) {
      suggestions.push('Create a compelling headline that includes your role and unique value');
    }

    return suggestions;
  },

  calculateVisibility(strengthScore) {
    // LinkedIn's algorithm factors
    const visibility = Math.min(100, strengthScore * 1.1);
    return {
      score: Math.round(visibility),
      level: visibility >= 70 ? 'High' : visibility >= 50 ? 'Medium' : 'Low',
      factors: ['Profile completeness', 'Keyword optimization', 'Activity level', 'Network size']
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 8: GITHUB PROFILE ANALYZER
// ═══════════════════════════════════════════════════════════════

const GitHubAnalyzer = {
  analyze(profileData) {
    const { repositories, readme, technologies } = profileData;

    return {
      portfolioScore: this.calculatePortfolioScore(profileData),
      techStack: this.analyzeTechStack(technologies),
      mostUsedTechnologies: this.getMostUsedTechnologies(profileData),
      recruiterImpression: this.calculateRecruiterImpression(profileData),
      projectQuality: this.assessProjectQuality(profileData),
      skillDistribution: this.calculateSkillDistribution(profileData)
    };
  },

  calculatePortfolioScore(data) {
    let score = 40;

    // Repository count
    const repoCount = (data.repositories?.match(/\n/g) || []).length + 1;
    score += Math.min(20, repoCount * 2);

    // README presence
    if (data.readme && data.readme.length > 200) score += 15;

    // Technology diversity
    const techCount = (data.technologies?.split(',') || []).length;
    score += Math.min(20, techCount * 3);

    // Pin quality projects
    if (data.pinned && data.pinned.length > 0) score += 10;

    return Math.min(100, score);
  },

  analyzeTechStack(technologies) {
    if (!technologies) return { primary: [], secondary: [], total: 0 };

    const techs = technologies.toLowerCase().split(',').map(t => t.trim());
    const categorized = {
      languages: [],
      frameworks: [],
      tools: []
    };

    const languagePatterns = ['javascript', 'python', 'java', 'typescript', 'go', 'rust', 'c++', 'ruby'];
    const frameworkPatterns = ['react', 'vue', 'angular', 'node', 'django', 'flask', 'spring', 'express'];
    const toolPatterns = ['docker', 'kubernetes', 'aws', 'git', 'mongodb', 'postgresql', 'redis'];

    techs.forEach(tech => {
      if (languagePatterns.some(l => tech.includes(l))) categorized.languages.push(tech);
      else if (frameworkPatterns.some(f => tech.includes(f))) categorized.frameworks.push(tech);
      else categorized.tools.push(tech);
    });

    return {
      primary: categorized.languages.slice(0, 3),
      frameworks: categorized.frameworks.slice(0, 5),
      tools: categorized.tools.slice(0, 5),
      total: techs.length
    };
  },

  getMostUsedTechnologies(data) {
    const allTech = (data.technologies || '').toLowerCase();
    const techArray = allTech.split(',').map(t => t.trim()).filter(t => t);
    const freq = {};

    techArray.forEach(t => {
      freq[t] = (freq[t] || 0) + 1;
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tech, count]) => ({ technology: tech, count }));
  },

  calculateRecruiterImpression(data) {
    let score = 50;

    // README quality
    if (data.readme && data.readme.length > 500) score += 15;
    else if (data.readme && data.readme.length > 200) score += 8;

    // Tech diversity
    const techCount = (data.technologies?.split(',') || []).length;
    score += Math.min(15, techCount);

    // Documentation
    if (data.readme?.toLowerCase().includes('documentation') ||
        data.readme?.toLowerCase().includes('install')) {
      score += 10;
    }

    // Project organization
    if (data.repositories?.split('\n').length > 5) score += 10;

    return { score, rating: score >= 70 ? 'Strong' : score >= 50 ? 'Moderate' : 'Needs Work' };
  },

  assessProjectQuality(data) {
    const readme = data.readme || '';
    const criteria = {
      hasInstallInstructions: readme.toLowerCase().includes('install') || readme.toLowerCase().includes('npm'),
      hasUsage: readme.toLowerCase().includes('usage') || readme.toLowerCase().includes('example'),
      hasDocumentation: readme.length > 300,
      hasScreenshots: readme.includes('![') || readme.includes('<img'),
      hasTests: readme.toLowerCase().includes('test'),
      hasContributing: readme.toLowerCase().includes('contributing')
    };

    const score = Math.round(
      (Object.values(criteria).filter(Boolean).length / Object.keys(criteria).length) * 100
    );

    return {
      score,
      criteria,
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'
    };
  },

  calculateSkillDistribution(data) {
    const techStack = this.analyzeTechStack(data.technologies);
    const categories = SkillsDatabase?.categories || {};

    const distribution = {};
    Object.keys(categories).forEach(cat => {
      const catSkills = categories[cat].skills.map(s => s.toLowerCase());
      const matches = Object.keys(techStack).flat().filter(t =>
        catSkills.some(cs => t.includes(cs))
      );
      if (matches.length > 0) {
        distribution[categories[cat].name] = matches.length;
      }
    });

    return distribution;
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 9-11: MESSAGE GENERATORS (Networking, Thank You, Salary)
// ═══════════════════════════════════════════════════════════════

const MessageGenerator = {
  generate(type, subtype, variables) {
    const templates = TemplateDatabase[type];
    if (!templates) return null;

    let template;
    if (Array.isArray(templates[subtype])) {
      template = templates[subtype][Math.floor(Math.random() * templates[subtype].length)];
    } else {
      template = templates[subtype];
    }

    if (!template) return null;

    const content = template.template || template;
    return this.fillTemplate(content, variables);
  },

  fillTemplate(template, variables) {
    let result = template;

    // Replace all {placeholder} patterns
    Object.entries(variables).forEach(([key, value]) => {
      const pattern = new RegExp(`\\{${key}\\}`, 'gi');
      result = result.replace(pattern, value || `[${key}]`);
    });

    // Clean up any unreplaced placeholders
    result = result.replace(/\{[^}]+\}/g, '[please fill]');

    return result;
  },

  // Networking messages
  generateNetworkingMessage(type, data) {
    return this.generate('networking', type, data);
  },

  // Thank you emails
  generateThankYouEmail(type, data) {
    if (type === 'postInterview') {
      const templates = TemplateDatabase.thankYou.postInterview;
      const template = templates[Math.floor(Math.random() * templates.length)];
      return this.fillTemplate(template.template, data);
    }
    return this.generate('thankYou', type, data);
  },

  // Salary negotiation
  generateSalaryEmail(type, data) {
    return this.generate('salaryNegotiation', type, data);
  },

  // Get available placeholders
  getPlaceholders() {
    return TemplateDatabase.placeholders;
  }
};

// ═══════════════════════════════════════════════════════════════
// FEATURE 12: PORTFOLIO ANALYZER
// ═══════════════════════════════════════════════════════════════

const PortfolioAnalyzer = {
  analyze(portfolioData) {
    const { content, about, projects } = portfolioData;

    return {
      portfolioScore: this.calculateOverallScore(portfolioData),
      recruiterAppeal: this.calculateRecruiterAppeal(portfolioData),
      uxQuality: this.assessUXQuality(portfolioData),
      missingSections: this.identifyMissingSections(portfolioData),
      contentQuality: this.assessContentQuality(portfolioData),
      improvementSuggestions: this.generateSuggestions(portfolioData)
    };
  },

  calculateOverallScore(data) {
    let score = 30;

    // About section
    if (data.about && data.about.length > 100) score += 15;

    // Projects
    if (data.projects && data.projects.split('\n').length > 2) score += 20;

    // Content richness
    const totalLength = Object.values(data).join('').length;
    score += Math.min(20, totalLength / 100);

    // Contact info presence
    if (data.content?.toLowerCase().includes('contact')) score += 10;

    // Links presence
    if (data.content?.includes('github') || data.content?.includes('linkedin')) score += 5;

    return Math.min(100, score);
  },

  calculateRecruiterAppeal(data) {
    let score = 50;

    // Quantified achievements
    if (/\d+%|\$\d+|\d+\s*(users?|clients?|downloads?)/.test(Object.values(data).join(' '))) {
      score += 20;
    }

    // Clear value proposition
    if (data.about?.toLowerCase().includes('passionate') ||
        data.about?.toLowerCase().includes('specialist') ||
        data.about?.toLowerCase().includes('expert')) {
      score += 15;
    }

    // Tech stack visible
    if (data.content?.match(/react|python|javascript|node/i)) {
      score += 15;
    }

    return { score, rating: score >= 75 ? 'High' : score >= 55 ? 'Medium' : 'Low' };
  },

  assessUXQuality(data) {
    const criteria = {
      hasNavigation: data.content?.toLowerCase().includes('home') || data.content?.toLowerCase().includes('about'),
      hasClearSections: data.content?.split('\n\n').length > 3,
      hasVisualElements: data.content?.includes('![') || data.content?.includes('<img'),
      hasCallToAction: data.content?.toLowerCase().includes('contact') || data.content?.toLowerCase().includes('hire'),
      responsive: true // Can't actually test this
    };

    const score = Math.round(
      (Object.values(criteria).filter(Boolean).length / Object.keys(criteria).length) * 100
    );

    return { score, criteria };
  },

  identifyMissingSections(data) {
    const required = ['about', 'projects', 'contact', 'skills', 'experience', 'education'];
    const content = Object.values(data).join(' ').toLowerCase();

    return required.filter(section => !content.includes(section));
  },

  assessContentQuality(data) {
    const allContent = Object.values(data).join(' ');
    const readability = ReadabilityAnalyzer.analyze(allContent);

    let score = 50;

    // Good readability
    if (readability.score >= 50 && readability.score <= 70) score += 20;

    // Not too short, not too long per section
    if (data.about && data.about.length > 100 && data.about.length < 500) score += 15;

    // Professional tone
    const toneAnalysis = RecruiterReview.analyzeTone(allContent);
    score += toneAnalysis * 0.15;

    return Math.min(100, Math.round(score));
  },

  generateSuggestions(data) {
    const suggestions = [];

    if (!data.about || data.about.length < 100) {
      suggestions.push('Add a compelling About section (100-300 words) that highlights your unique value');
    }
    if (!data.projects || data.projects.split('\n').length < 3) {
      suggestions.push('Showcase at least 3-5 projects with descriptions, technologies used, and outcomes');
    }
    if (!data.content?.toLowerCase().includes('contact')) {
      suggestions.push('Add a clear Contact section with email, LinkedIn, or contact form');
    }
    if (!/\d+%|\$\d+|\d+\s*(users?|downloads?)/.test(Object.values(data).join(' '))) {
      suggestions.push('Add quantified results and metrics to demonstrate impact');
    }

    return suggestions;
  }
};

// ═══════════════════════════════════════════════════════════════
// CHART UTILITIES (Using Chart.js-like interface, built with vanilla JS)
// ═══════════════════════════════════════════════════════════════

const ChartUtils = {
  // Create radar chart using canvas
  createRadarChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const labels = data.labels || [];
    const values = data.datasets?.[0]?.data || [];
    const maxValue = 100;

    const angleStep = (2 * Math.PI) / labels.length;

    // Draw grid circles
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw axes
    labels.forEach((label, i) => {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.stroke();

      // Draw labels
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      const labelX = centerX + (radius + 25) * Math.cos(angle);
      const labelY = centerY + (radius + 25) * Math.sin(angle);
      ctx.fillText(label, labelX, labelY);
    });

    // Draw data area
    if (values.length > 0) {
      ctx.beginPath();
      values.forEach((value, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (value / maxValue) * radius;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(99, 102, 241, 1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw data points
      values.forEach((value, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (value / maxValue) * radius;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
      });
    }
  },

  // Create progress ring
  createProgressRing(canvasId, percentage, color = '#6366f1') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const lineWidth = 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress arc
    const endAngle = (percentage / 100) * 2 * Math.PI - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = color;
    ctx.font = 'bold 24px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${percentage}%`, centerX, centerY);
  },

  // Create doughnut chart
  createDoughnutChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 20;
    const innerRadius = outerRadius * 0.6;
    const total = data.reduce((sum, d) => sum + d.value, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startAngle = -Math.PI / 2;
    const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = d.color || colors[i % colors.length];
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
};

// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

const Toast = {
  show(message, type = 'ok', duration = 3500) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const icon = type === 'err' ? 'exclamation-circle' : 'check-circle';
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPORT / PDF GENERATION
// ═══════════════════════════════════════════════════════════════

const ExportManager = {
  exportToPDF(content, filename = 'document') {
    const css = this.getPrintCSS();
    const iframe = document.createElement('iframe');
    iframe.id = '__printFrame';
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:none;opacity:0;pointer-events:none;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${css}</style></head><body>${content}</body></html>`);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => iframe.remove(), 2000);
    }, 600);
  },

  exportToTXT(content, filename = 'document') {
    const blob = new Blob([content], { type: 'text/plain' });
    this.download(blob, `${filename}.txt`);
  },

  download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  getPrintCSS() {
    return `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Georgia, "Times New Roman", serif; font-size: 11pt; line-height: 1.6; color: #1a1a2e; background: #fff; padding: 2cm; }
      h1, h2, h3 { margin-bottom: 0.5em; }
      p { margin-bottom: 0.8em; }
      @page { size: A4; margin: 2cm; }
      @media print { body { padding: 0; } }
    `;
  }
};

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

async function initializeApp() {
  try {
    // Initialize IndexedDB
    await DB.init();
    console.log('IndexedDB initialized');

    // Initialize theme
    ThemeManager.init();

    // Initialize navigation
    Navigation.init();

    // Initialize Bento/Accordion
    BentoAccordion.init();
    BentoAccordion.bindEvents();

    // Load app stats
    await loadAppStats();

    // Initialize all feature modules
    initializeFeatures();

    // Setup reveal animations
    setupRevealAnimations();

    console.log('LetterForge AI initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

async function loadAppStats() {
  try {
    const stats = await DB.get('settings', 'appStats');
    if (stats) {
      AppState.appStats = { ...AppState.appStats, ...stats.value };
    }
  } catch (e) {
    console.log('No saved stats found');
  }
}

function initializeFeatures() {
  // This will be called after DOM is ready
  // Each feature component should have its own init function
}

function setupRevealAnimations() {
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

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Expose modules globally for UI integration
window.LetterForge = {
  // State
  AppState,
  DB,

  // Core analysis
  TextProcessor,
  TFIDF,
  StringSimilarity,
  KeywordMatcher,
  ReadabilityAnalyzer,
  GrammarAnalyzer,
  ScoringModel,

  // Features
  RecruiterReview,
  InterviewGenerator,
  JobMatchAnalyzer,
  SuccessPredictor,
  CareerCoach,
  ApplicationStrategy,
  LinkedInAnalyzer,
  GitHubAnalyzer,
  MessageGenerator,
  PortfolioAnalyzer,

  // UI utilities
  ChartUtils,
  Toast,
  ExportManager,
  BentoAccordion,

  // Data
  QuestionDatabase,
  SkillsDatabase,
  TemplateDatabase,
  SkillSynonyms,
  DefaultCategories
};
