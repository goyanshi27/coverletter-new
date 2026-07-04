/**
 * LetterForge AI - Core Analysis Engine
 * Rule-based NLP, TF-IDF, Keyword Matching, and Scoring Algorithms
 * NO external APIs - All intelligence is local
 */

// ═══════════════════════════════════════════════════════════════
// TEXT PROCESSING UTILITIES
// ═══════════════════════════════════════════════════════════════

const TextProcessor = {
  // Tokenize text into words
  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[^\w\s'-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1);
  },

  // Remove common stopwords
  removeStopwords(words) {
    const stopwords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
      'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
      'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
      'his', 'our', 'their', 'what', 'which', 'who', 'whom', 'whose',
      'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
      'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
      'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also',
      'now', 'here', 'there', 'then', 'once', 'about', 'into', 'through'
    ]);
    return words.filter(word => !stopwords.has(word));
  },

  // Calculate word frequency
  wordFrequency(words) {
    const freq = {};
    words.forEach(word => {
      freq[word] = (freq[word] || 0) + 1;
    });
    return freq;
  },

  // Get n-grams
  getNgrams(words, n = 2) {
    const ngrams = [];
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n).join(' '));
    }
    return ngrams;
  },

  // Calculate text statistics
  textStats(text) {
    if (!text) return { words: 0, sentences: 0, paragraphs: 0, avgWordLength: 0, avgSentenceLength: 0 };
    const words = this.tokenize(text);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

    const totalWordLength = words.reduce((sum, w) => sum + w.length, 0);
    const totalSentenceWords = sentences.map(s => this.tokenize(s).length);

    return {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgWordLength: words.length > 0 ? totalWordLength / words.length : 0,
      avgSentenceLength: totalSentenceWords.length > 0
        ? totalSentenceWords.reduce((a, b) => a + b, 0) / totalSentenceWords.length
        : 0,
      uniqueWords: new Set(words).size,
      lexicalDensity: words.length > 0 ? new Set(words).size / words.length : 0
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// TF-IDF IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════

const TFIDF = {
  documents: [],

  // Add document to corpus
  addDocument(text, id) {
    const tokens = TextProcessor.removeStopwords(TextProcessor.tokenize(text));
    this.documents.push({ id, tokens, text });
    return this;
  },

  // Clear corpus
  clear() {
    this.documents = [];
    return this;
  },

  // Term frequency in a document
  termFrequency(docTokens, term) {
    const freq = docTokens.filter(t => t === term).length;
    return freq / docTokens.length;
  },

  // Inverse document frequency
  inverseDocumentFrequency(term) {
    const docsContainingTerm = this.documents.filter(doc =>
      doc.tokens.includes(term)
    ).length;
    // Laplace smoothing to avoid division by zero
    return Math.log((this.documents.length + 1) / (docsContainingTerm + 1)) + 1;
  },

  // TF-IDF score for a term in a document
  tfidf(docTokens, term) {
    return this.termFrequency(docTokens, term) * this.inverseDocumentFrequency(term);
  },

  // Get top keywords from a document
  getTopKeywords(docTokens, limit = 20) {
    const uniqueTerms = [...new Set(docTokens)];
    const scores = uniqueTerms.map(term => ({
      term,
      score: this.tfidf(docTokens, term)
    }));

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },

  // Cosine similarity between two documents
  cosineSimilarity(tokens1, tokens2) {
    const allTerms = new Set([...tokens1, ...tokens2]);
    const vector1 = [];
    const vector2 = [];

    allTerms.forEach(term => {
      vector1.push(this.tfidf(tokens1, term));
      vector2.push(this.tfidf(tokens2, term));
    });

    // Dot product
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      mag1 += vector1[i] * vector1[i];
      mag2 += vector2[i] * vector2[i];
    }

    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);

    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (mag1 * mag2);
  }
};

// ═══════════════════════════════════════════════════════════════
// STRING SIMILARITY ALGORITHMS
// ═══════════════════════════════════════════════════════════════

const StringSimilarity = {
  // Levenshtein distance
  levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[m][n];
  },

  // Jaccard similarity coefficient
  jaccardSimilarity(str1, str2) {
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  },

  // N-gram similarity
  ngramSimilarity(str1, str2, n = 3) {
    const ngrams1 = this.getNgrams(str1.toLowerCase(), n);
    const ngrams2 = this.getNgrams(str2.toLowerCase(), n);

    const set1 = new Set(ngrams1);
    const set2 = new Set(ngrams2);

    const intersection = new Set([...set1].filter(x => set2.has(x)));

    return (2 * intersection.size) / (set1.size + set2.size);
  },

  getNgrams(str, n) {
    const ngrams = [];
    for (let i = 0; i <= str.length - n; i++) {
      ngrams.push(str.slice(i, i + n));
    }
    return ngrams;
  },

  // Overall similarity score (weighted combination)
  overallSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;

    const lev = 1 - (this.levenshteinDistance(str1.toLowerCase(), str2.toLowerCase()) /
              Math.max(str1.length, str2.length));
    const jac = this.jaccardSimilarity(str1, str2);
    const ng = this.ngramSimilarity(str1, str2);

    return (lev * 0.3 + jac * 0.4 + ng * 0.3);
  }
};

// ═══════════════════════════════════════════════════════════════
// KEYWORD MATCHING ENGINE
// ═══════════════════════════════════════════════════════════════

const KeywordMatcher = {
  // Match skills against text
  matchSkills(text, skills) {
    if (!text || !skills) return { matched: [], missing: [], score: 0 };

    const textLower = text.toLowerCase();
    const tokens = TextProcessor.tokenize(text);
    const matched = [];
    const missing = [];

    skills.forEach(skill => {
      const skillLower = skill.toLowerCase().trim();
      const skillTokens = skillLower.split(/\s+/);

      // Direct match
      if (textLower.includes(skillLower)) {
        matched.push({ skill, type: 'exact', confidence: 1 });
      }
      // Token match (multi-word skill)
      else if (skillTokens.length > 1 && skillTokens.every(t => textLower.includes(t))) {
        matched.push({ skill, type: 'partial', confidence: 0.8 });
      }
      // Synonym match
      else if (SkillSynonyms && SkillSynonyms[skillLower]) {
        const synonyms = SkillSynonyms[skillLower];
        for (const syn of synonyms) {
          if (textLower.includes(syn.toLowerCase())) {
            matched.push({ skill, type: 'synonym', matchedAs: syn, confidence: 0.9 });
            return;
          }
        }
        missing.push(skill);
      }
      else {
        missing.push(skill);
      }
    });

    const score = skills.length > 0 ? (matched.length / skills.length) * 100 : 0;

    return { matched, missing, score };
  },

  // Extract skills from text
  extractSkills(text, skillDatabase) {
    if (!text || !skillDatabase) return [];

    const found = [];
    const textLower = text.toLowerCase();

    Object.entries(skillDatabase.categories || {}).forEach(([category, data]) => {
      data.skills.forEach(skill => {
        if (textLower.includes(skill.toLowerCase())) {
          found.push({ skill, category: data.name, confidence: 1 });
        }
      });
    });

    return found;
  },

  // Match ATS keywords
  matchATSKeywords(text, industry = 'software') {
    const keywords = SkillsDatabase?.atsKeywords?.[industry] || SkillsDatabase?.atsKeywords?.general || [];
    const textLower = text.toLowerCase();
    const matched = [];
    const missing = [];

    keywords.forEach(kw => {
      if (textLower.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    return {
      matched,
      missing,
      coverage: keywords.length > 0 ? (matched.length / keywords.length) * 100 : 0
    };
  },

  // Find action verbs
  findActionVerbs(text) {
    const found = {
      technical: [],
      leadership: [],
      impact: [],
      problemSolving: [],
      communication: [],
      collaboration: []
    };

    if (!text) return found;

    const textLower = text.toLowerCase();
    const words = textLower.split(/\s+/);

    Object.entries(SkillsDatabase?.actionVerbs || {}).forEach(([category, verbs]) => {
      verbs.forEach(verb => {
        const verbLower = verb.toLowerCase();
        if (words.some(w => w.startsWith(verbLower) || w === verbLower)) {
          found[category].push(verb);
        }
      });
    });

    return found;
  }
};

// ═══════════════════════════════════════════════════════════════
// READABILITY ANALYZER
// ═══════════════════════════════════════════════════════════════

const ReadabilityAnalyzer = {
  // Flesch Reading Ease
  fleschReadingEase(text) {
    const stats = TextProcessor.textStats(text);
    if (stats.words === 0 || stats.sentences === 0) return 0;

    const syllableCount = this.countSyllables(text);

    // Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    const score = 206.835 - 1.015 * (stats.words / stats.sentences)
                  - 84.6 * (syllableCount / stats.words);

    return Math.max(0, Math.min(100, score));
  },

  // Flesch-Kincaid Grade Level
  fleschKincaidGrade(text) {
    const stats = TextProcessor.textStats(text);
    if (stats.words === 0 || stats.sentences === 0) return 0;

    const syllableCount = this.countSyllables(text);

    // Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    return 0.39 * (stats.words / stats.sentences)
           + 11.8 * (syllableCount / stats.words) - 15.59;
  },

  // Estimate syllables
  countSyllables(text) {
    const words = TextProcessor.tokenize(text);
    let count = 0;

    words.forEach(word => {
      word = word.toLowerCase().replace(/[^a-z]/g, '');
      if (word.length <= 3) {
        count += 1;
        return;
      }

      // Count vowel groups
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
      word = word.replace(/^y/, '');
      const matches = word.match(/[aeiouy]{1,2}/g);
      count += matches ? matches.length : 1;
    });

    return count;
  },

  // Get readability category
  getCategory(score) {
    if (score >= 90) return { level: 'Very Easy', description: 'Easily understood by an average 5th grader', grade: '5th grade' };
    if (score >= 80) return { level: 'Easy', description: 'Conversational English for consumers', grade: '6th grade' };
    if (score >= 70) return { level: 'Fairly Easy', description: 'Plain English, good for most audiences', grade: '7th grade' };
    if (score >= 60) return { level: 'Standard', description: 'Reasonably readable for most adult readers', grade: '8th-9th grade' };
    if (score >= 50) return { level: 'Fairly Difficult', description: 'Academic or technical content', grade: '10th-12th grade' };
    if (score >= 30) return { level: 'Difficult', description: 'College-level academic or legal text', grade: 'College' };
    return { level: 'Very Difficult', description: 'Professional or graduate-level content', grade: 'Graduate' };
  },

  // Full readability report
  analyze(text) {
    const score = this.fleschReadingEase(text);
    const grade = this.fleschKincaidGrade(text);
    const category = this.getCategory(score);

    return {
      score: Math.round(score),
      grade: Math.round(grade * 10) / 10,
      category,
      isAppropriate: score >= 50 && score <= 70 // Ideal range for cover letters
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// GRAMMAR PATTERN ANALYZER
// ═══════════════════════════════════════════════════════════════

const GrammarAnalyzer = {
  // Common grammar patterns
  patterns: {
    passive: /\b(is|are|was|were|been|being|am)\s+[a-z]+ed\b/gi,
    weakVerbs: /\b(got|made|did|had|took|gave|came|went|got)\b/gi,
    firstPerson: /\b(I|me|my|mine|we|us|our|ours)\b/gi,
    contractions: /\b(can't|won't|don't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|wouldn't|shouldn't|couldn't|i'm|i've|i'd|you're|you've|you'd|he's|she's|it's|we're|we've|we'd|they're|they've|they'd)\b/gi,
    repetitiveWords: null, // Computed dynamically
    cliches: /\b(think outside the box|team player|detail-oriented|self-starter|hard worker|go-getter|work well under pressure|quick learner|proven track record|results-oriented|dynamic|synergy|leverage|paradigm shift)\b/gi
  },

  // Detect passive voice
  detectPassiveVoice(text) {
    const matches = text.match(this.patterns.passive) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const ratio = sentences.length > 0 ? matches.length / sentences.length : 0;

    return {
      count: matches.length,
      instances: matches,
      ratio,
      recommendation: ratio > 0.3 ? 'Consider using more active voice for stronger impact' : 'Good balance of active voice'
    };
  },

  // Detect weak verbs
  detectWeakVerbs(text) {
    const matches = text.match(this.patterns.weakVerbs) || [];
    return {
      count: matches.length,
      instances: matches,
      recommendation: matches.length > 3
        ? 'Replace weak verbs with strong action verbs (e.g., "developed" instead of "made")'
        : 'Good use of strong verbs'
    };
  },

  // Check first person usage (appropriate for cover letters)
  checkFirstPerson(text) {
    const matches = text.match(this.patterns.firstPerson) || [];
    return {
      count: matches.length,
      isAppropriate: matches.length > 0, // Should have some first person
      recommendation: matches.length === 0
        ? 'Consider using first person perspective in a cover letter'
        : 'Appropriate use of first person'
    };
  },

  // Detect contractions (formal writing should avoid)
  detectContractions(text) {
    const matches = text.match(this.patterns.contractions) || [];
    return {
      count: matches.length,
      instances: matches,
      isFormal: matches.length === 0,
      recommendation: matches.length > 2
        ? 'Consider writing out contractions for a more formal tone'
        : 'Appropriate formality level'
    };
  },

  // Detect cliches
  detectCliches(text) {
    const matches = text.match(this.patterns.cliches) || [];
    return {
      count: matches.length,
      instances: matches,
      recommendation: matches.length > 0
        ? 'Replace cliches with specific, authentic examples'
        : 'No cliches detected'
    };
  },

  // Check sentence variety
  checkSentenceVariety(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length < 3) return { variety: 0, recommendation: 'Add more content' };

    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);

    return {
      averageLength: Math.round(avg),
      stdDev: Math.round(stdDev),
      variety: stdDev > 5 ? 'good' : stdDev > 3 ? 'moderate' : 'low',
      recommendation: stdDev < 5
        ? 'Vary sentence lengths for better flow and engagement'
        : 'Good sentence variety'
    };
  },

  // Full grammar analysis
  analyze(text) {
    return {
      passiveVoice: this.detectPassiveVoice(text),
      weakVerbs: this.detectWeakVerbs(text),
      firstPerson: this.checkFirstPerson(text),
      contractions: this.detectContractions(text),
      cliches: this.detectCliches(text),
      sentenceVariety: this.checkSentenceVariety(text),
      overallScore: this.calculateOverallScore(text)
    };
  },

  calculateOverallScore(text) {
    const passive = this.detectPassiveVoice(text);
    const weak = this.detectWeakVerbs(text);
    const cliches = this.detectCliches(text);
    const variety = this.checkSentenceVariety(text);

    let score = 100;

    // Penalize passive voice ratio
    score -= passive.ratio * 15;

    // Penalize weak verbs
    score -= weak.count * 3;

    // Penalize cliches
    score -= cliches.count * 5;

    // Reward sentence variety
    if (variety.variety === 'good') score += 5;
    else if (variety.variety === 'low') score -= 5;

    return Math.max(0, Math.min(100, score));
  }
};

// ═══════════════════════════════════════════════════════════════
// WEIGHTED SCORING MODEL
// ═══════════════════════════════════════════════════════════════

const ScoringModel = {
  // Cover Letter Scoring Weights
  coverLetterWeights: {
    length: { weight: 0.15, optimal: { min: 200, max: 400 } },
    atsKeywords: { weight: 0.25 },
    actionVerbs: { weight: 0.15 },
    readability: { weight: 0.15, optimal: { min: 50, max: 70 } },
    grammar: { weight: 0.10 },
    structure: { weight: 0.10 },
    personalization: { weight: 0.10 }
  },

  // Resume Scoring Weights
  resumeWeights: {
    atsKeywords: { weight: 0.30 },
    skillsMatch: { weight: 0.25 },
    achievements: { weight: 0.20 },
    clarity: { weight: 0.15 },
    formatting: { weight: 0.10 }
  },

  // Calculate weighted score
  calculateWeightedScore(scores, weights) {
    let totalWeight = 0;
    let weightedSum = 0;

    Object.entries(weights).forEach(([key, config]) => {
      const score = scores[key];
      if (score !== undefined && score !== null) {
        weightedSum += score * config.weight;
        totalWeight += config.weight;
      }
    });

    return totalWeight > 0 ? (weightedSum / totalWeight) : 0;
  },

  // Success probability calculation
  calculateSuccessProbability(inputs) {
    const {
      resumeScore = 0,
      jobMatchScore = 0,
      coverLetterScore = 0,
      atsScore = 0,
      experienceMatch = 0,
      skillAlignment = 0
    } = inputs;

    // Weighted formula
    const weights = {
      resumeQuality: 0.25,
      jobMatch: 0.25,
      coverLetter: 0.20,
      ats: 0.15,
      experience: 0.10,
      skills: 0.05
    };

    return (
      resumeScore * weights.resumeQuality +
      jobMatchScore * weights.jobMatch +
      coverLetterScore * weights.coverLetter +
      atsScore * weights.ats +
      experienceMatch * weights.experience +
      skillAlignment * weights.skills
    );
  },

  // Normalize score to 0-100
  normalize(value, min, max) {
    if (max === min) return 50;
    const normalized = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, normalized));
  }
};

// ═══════════════════════════════════════════════════════════════
// CONTENT GENERATOR (Rule-Based)
// ═══════════════════════════════════════════════════════════════

const ContentGenerator = {
  // Generate personalized opening
  generateOpening(name, role, company, tone = 'professional') {
    const openings = {
      professional: [
        `I am writing to express my strong interest in the ${role} position at ${company}. With my proven track record and passion for excellence, I am confident in my ability to contribute meaningfully to your team.`,
        `It is with great enthusiasm that I submit my application for the ${role} role at ${company}. My experience and dedication make me an ideal candidate for this position.`,
        `I am excited to apply for the ${role} opportunity at ${company}. My background aligns perfectly with the requirements of this role.`
      ],
      creative: [
        `Like a well-architected system, great careers are built on strong foundations. I am thrilled to apply my expertise as a ${role} at ${company}.`,
        `Passion meets precision in my work, and I see ${company} as the perfect place to apply this philosophy as your next ${role}.`
      ],
      formal: [
        `Please accept this letter as my formal application for the ${role} position currently available at ${company}. I am confident my qualifications align with your requirements.`,
        `I respectfully submit my candidacy for the ${role} role at ${company}. My qualifications make me a strong match for this position.`
      ]
    };

    const pool = openings[tone] || openings.professional;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  // Generate experience paragraph
  generateExperienceParagraph(experience, skills, company) {
    if (!experience || experience.trim().length < 10) {
      return `Throughout my career, I have developed strong expertise in ${skills.slice(0, 3).join(', ')}. I am eager to bring this knowledge to ${company}.`;
    }

    const trimmed = experience.length > 300 ? experience.slice(0, 300) + '...' : experience;
    return `In my professional experience, ${trimmed} This background has prepared me well for the challenges and opportunities at ${company}.`;
  },

  // Generate motivation paragraph
  generateMotivationParagraph(why, company, role) {
    const base = why && why.trim().length > 20
      ? why
      : `I am particularly drawn to ${company}'s reputation for innovation and excellence. The ${role} position represents an opportunity to contribute to meaningful work while continuing my professional growth.`;

    return `${base} I believe my skills and enthusiasm align perfectly with ${company}'s mission and values.`;
  },

  // Generate closing paragraph
  generateClosing(company) {
    const closings = [
      `I would welcome the opportunity to discuss how my background and skills would benefit ${company}. Thank you for your time and consideration.`,
      `I am excited about the possibility of contributing to ${company}'s success and would appreciate the opportunity to discuss my qualifications further.`,
      `Thank you for considering my application. I look forward to the possibility of contributing to your team at ${company}.`
    ];

    return closings[Math.floor(Math.random() * closings.length)];
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPORT ALL MODULES
// ═══════════════════════════════════════════════════════════════

// For browser usage
if (typeof window !== 'undefined') {
  window.TextProcessor = TextProcessor;
  window.TFIDF = TFIDF;
  window.StringSimilarity = StringSimilarity;
  window.KeywordMatcher = KeywordMatcher;
  window.ReadabilityAnalyzer = ReadabilityAnalyzer;
  window.GrammarAnalyzer = GrammarAnalyzer;
  window.ScoringModel = ScoringModel;
  window.ContentGenerator = ContentGenerator;
}
