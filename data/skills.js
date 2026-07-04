/**
 * Skills Database
 * Comprehensive skill categorization, keywords, and career paths
 */

const SkillsDatabase = {
  // Technical Skills by Category
  categories: {
    frontend: {
      name: 'Frontend Development',
      skills: ['html', 'css', 'sass', 'javascript', 'typescript', 'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt.js', 'tailwind', 'bootstrap', 'jquery', 'webpack', 'vite', 'redux', 'mobx', 'graphql client'],
      keywords: ['responsive design', 'dom manipulation', 'state management', 'component architecture', 'accessibility', 'performance optimization', 'cross-browser compatibility', 'mobile-first', 'css grid', 'flexbox']
    },
    backend: {
      name: 'Backend Development',
      skills: ['node.js', 'express', 'python', 'django', 'flask', 'fastapi', 'java', 'spring boot', 'c#', 'asp.net', 'go', 'rust', 'php', 'laravel', 'ruby', 'rails', 'rest api', 'graphql', 'microservices'],
      keywords: ['api design', 'server-side logic', 'authentication', 'authorization', 'session management', 'middleware', 'request handling', 'routing', 'error handling', 'logging']
    },
    database: {
      name: 'Database & Data',
      skills: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'sqlite', 'oracle', 'sql server', 'cassandra', 'neo4j', 'firebase', 'supabase', 'prisma'],
      keywords: ['data modeling', 'query optimization', 'indexing', 'normalization', 'transactions', 'acid compliance', 'data migration', 'backup strategies', 'replication', 'sharding']
    },
    devops: {
      name: 'DevOps & Cloud',
      skills: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cicd', 'jenkins', 'github actions', 'gitlab ci', 'terraform', 'ansible', 'linux', 'nginx', 'apache', 'prometheus', 'grafana', 'elk stack'],
      keywords: ['containerization', 'orchestration', 'infrastructure as code', 'monitoring', 'deployment automation', 'cloud architecture', 'security', 'scalability', 'high availability']
    },
    mobile: {
      name: 'Mobile Development',
      skills: ['react native', 'flutter', 'swift', 'kotlin', 'java android', 'objective-c', 'ionic', 'xamarin', 'pwa'],
      keywords: ['mobile ui', 'push notifications', 'offline storage', 'device apis', 'app store optimization', 'mobile security', 'responsive layouts']
    },
    dataScience: {
      name: 'Data Science & AI',
      skills: ['python', 'r', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'jupyter', 'spark', 'hadoop', 'tableau', 'power bi', 'matplotlib', 'seaborn'],
      keywords: ['machine learning', 'deep learning', 'data visualization', 'statistical analysis', 'data preprocessing', 'feature engineering', 'model evaluation', 'nlp', 'computer vision']
    },
    security: {
      name: 'Security',
      skills: ['owasp', 'penetration testing', 'ethical hacking', 'cryptography', 'oauth', 'jwt', 'ssl/tls', 'security audits', 'siem'],
      keywords: ['vulnerability assessment', 'security protocols', 'encryption', 'authentication', 'authorization', 'security best practices', 'compliance', 'incident response']
    },
    testing: {
      name: 'Testing & QA',
      skills: ['jest', 'mocha', 'cypress', 'selenium', 'junit', 'pytest', 'testing library', 'playwright', 'karma', 'jasmine'],
      keywords: ['unit testing', 'integration testing', 'e2e testing', 'tdd', 'bdd', 'test automation', 'code coverage', 'mocking', 'assertion']
    },
    tools: {
      name: 'Tools & Collaboration',
      skills: ['git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'vscode', 'vim', 'postman', 'figma', 'notion', 'trello'],
      keywords: ['version control', 'project management', 'documentation', 'collaboration', 'code review', 'agile', 'scrum', 'kanban']
    }
  },

  // ATS Keywords by Industry
  atsKeywords: {
    software: ['developed', 'implemented', 'designed', 'architected', 'optimized', 'deployed', 'debugged', 'refactored', 'automated', 'integrated', 'tested', 'documented', 'collaborated', 'delivered', 'scaled'],
    management: ['led', 'managed', 'oversaw', 'coordinated', 'directed', 'supervised', 'mentored', 'trained', 'planned', 'executed', 'improved', 'increased', 'reduced', 'achieved', 'established'],
    marketing: ['analyzed', 'campaigned', 'increased', 'generated', 'optimized', 'measured', 'launched', 'developed', 'executed', 'managed', 'created', 'drove', 'improved', 'achieved', 'targeted'],
    finance: ['analyzed', 'forecasted', 'audited', 'reconciled', 'managed', 'prepared', 'reviewed', 'optimized', 'reduced', 'increased', 'implemented', 'developed', 'maintained', 'evaluated'],
    healthcare: ['diagnosed', 'treated', 'managed', 'administered', 'coordinated', 'implemented', 'improved', 'documented', 'monitored', 'assessed', 'collaborated', 'developed', 'maintained', 'ensured'],
    general: ['managed', 'developed', 'implemented', 'coordinated', 'improved', 'increased', 'reduced', 'achieved', 'led', 'created', 'analyzed', 'designed', 'executed', 'optimized', 'delivered']
  },

  // Action verbs for different contexts
  actionVerbs: {
    technical: ['Architected', 'Automated', 'Built', 'Coded', 'Created', 'Debugged', 'Designed', 'Developed', 'Engineered', 'Implemented', 'Integrated', 'Maintained', 'Optimized', 'Programmed', 'Refactored', 'Scaled', 'Tested', 'Validated'],
    leadership: ['Championed', 'Coached', 'Coordinated', 'Directed', 'Enabled', 'Guided', 'Headed', 'Influenced', 'Inspired', 'Led', 'Mentored', 'Mobilized', 'Orchestrated', 'Oversaw', 'Steered', 'Supervised'],
    impact: ['Accelerated', 'Achieved', 'Advanced', 'Amplified', 'Boosted', 'Delivered', 'Drove', 'Enhanced', 'Exceeded', 'Expanded', 'Generated', 'Grew', 'Improved', 'Increased', 'Maximized', 'Outperformed', 'Surpassed'],
    problemSolving: ['Analyzed', 'Clarified', 'Diagnosed', 'Evaluated', 'Examined', 'Identified', 'Inspected', 'Investigated', 'Mapped', 'Measured', 'Observed', 'Pinpointed', 'Researched', 'Resolved', 'Solved', 'Tracked'],
    communication: ['Authored', 'Communicated', 'Conveyed', 'Crafted', 'Demonstrated', 'Documented', 'Drafted', 'Edited', 'Explained', 'Formalized', 'Negotiated', 'Presented', 'Proposed', 'Represented', 'Summarized', 'Translated'],
    collaboration: ['Aligned', 'Assisted', 'Collaborated', 'Contributed', 'Cooperated', 'Facilitated', 'Galvanized', 'Harmonized', 'Liaised', 'Partnered', 'Participated', 'Provided', 'Responded', 'Supported', 'Synergized', 'Teamwork']
  },

  // Career Paths by Role
  careerPaths: {
    softwareEngineer: {
      title: 'Software Engineer',
      path: ['Intern', 'Junior Developer', 'Software Engineer', 'Senior Software Engineer', 'Staff Engineer', 'Principal Engineer', 'Distinguished Engineer'],
      skills: {
        intern: ['Basic programming', 'Version control', 'Problem solving', 'Communication'],
        junior: ['One programming language', 'Basic debugging', 'Code review', 'Testing basics'],
        softwareEngineer: ['Multiple languages', 'System design basics', 'API development', 'Database design'],
        seniorEngineer: ['Architecture design', 'Performance optimization', 'Mentoring', 'Technical leadership'],
        staffEngineer: ['Cross-team collaboration', 'Technical strategy', 'Innovation', 'Standards development'],
        principalEngineer: ['Organization-wide impact', 'Industry expertise', 'Thought leadership', 'Strategic direction'],
        distinguishedEngineer: ['Company-wide technical vision', 'Industry recognition', 'Research contributions', 'Executive influence']
      },
      avgSalary: {
        intern: { min: 25000, max: 50000 },
        junior: { min: 50000, max: 80000 },
        softwareEngineer: { min: 80000, max: 130000 },
        seniorEngineer: { min: 130000, max: 200000 },
        staffEngineer: { min: 180000, max: 280000 },
        principalEngineer: { min: 250000, max: 400000 },
        distinguishedEngineer: { min: 350000, max: 600000 }
      }
    },
    frontendDeveloper: {
      title: 'Frontend Developer',
      path: ['Intern', 'Junior Frontend Developer', 'Frontend Developer', 'Senior Frontend Developer', 'Lead Frontend Engineer', 'Frontend Architect', 'Principal Frontend Engineer'],
      skills: {
        intern: ['HTML/CSS basics', 'JavaScript basics', 'Responsive design', 'Git'],
        junior: ['React/Vue/Angular basics', 'CSS frameworks', 'State management basics', 'API integration'],
        frontendDeveloper: ['Advanced frameworks', 'Performance optimization', 'Accessibility', 'Testing'],
        seniorFrontendDeveloper: ['Architecture patterns', 'Design systems', 'Mentoring', 'Cross-browser optimization'],
        leadFrontendEngineer: ['Technical leadership', 'Team coordination', 'Standards definition', 'Code quality'],
        frontendArchitect: ['Platform decisions', 'Performance strategy', 'Developer experience', 'Innovation'],
        principalFrontendEngineer: ['Organization strategy', 'Industry leadership', 'Tool development', 'R&D']
      },
      avgSalary: {
        intern: { min: 25000, max: 45000 },
        junior: { min: 45000, max: 75000 },
        frontendDeveloper: { min: 75000, max: 120000 },
        seniorFrontendDeveloper: { min: 120000, max: 180000 },
        leadFrontendEngineer: { min: 160000, max: 230000 },
        frontendArchitect: { min: 200000, max: 300000 },
        principalFrontendEngineer: { min: 280000, max: 420000 }
      }
    },
    fullStackDeveloper: {
      title: 'Full Stack Developer',
      path: ['Intern', 'Junior Developer', 'Full Stack Developer', 'Senior Full Stack Developer', 'Tech Lead', 'Engineering Manager', 'Director of Engineering'],
      skills: {
        intern: ['Basic frontend', 'Basic backend', 'Database basics', 'Git'],
        junior: ['One frontend framework', 'One backend language', 'REST APIs', 'SQL basics'],
        fullStackDeveloper: ['React/Vue/Angular', 'Node/Python/Java', 'Authentication', 'Cloud basics'],
        seniorFullStackDeveloper: ['System architecture', 'Performance tuning', 'AWS/Azure', 'Team collaboration'],
        techLead: ['Technical direction', 'Architecture decisions', 'Team mentorship', 'Project planning'],
        engineeringManager: ['People management', 'Resource planning', 'Technical strategy', 'Hiring'],
        directorEngineering: ['Department strategy', 'Budget management', 'Org design', 'Executive alignment']
      },
      avgSalary: {
        intern: { min: 25000, max: 50000 },
        junior: { min: 50000, max: 85000 },
        fullStackDeveloper: { min: 85000, max: 140000 },
        seniorFullStackDeveloper: { min: 140000, max: 200000 },
        techLead: { min: 180000, max: 260000 },
        engineeringManager: { min: 200000, max: 300000 },
        directorEngineering: { min: 280000, max: 450000 }
      }
    },
    dataScientist: {
      title: 'Data Scientist',
      path: ['Intern', 'Junior Data Analyst', 'Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Principal Data Scientist'],
      skills: {
        intern: ['Excel', 'SQL basics', 'Statistics basics', 'Python basics'],
        juniorDataAnalyst: ['SQL advanced', 'Data visualization', 'Python/R', 'Basic ML concepts'],
        dataAnalyst: ['Data modeling', 'Dashboards', 'A/B testing basics', 'Business analytics'],
        dataScientist: ['Machine learning', 'Feature engineering', 'Statistical modeling', 'Cloud platforms'],
        seniorDataScientist: ['Advanced ML', 'Deep learning', 'Research', 'Mentoring'],
        leadDataScientist: ['Technical leadership', 'ML strategy', 'Team guidance', 'Stakeholder management'],
        principalDataScientist: ['Organization strategy', 'Research direction', 'Industry influence', 'Innovation']
      },
      avgSalary: {
        intern: { min: 30000, max: 55000 },
        juniorDataAnalyst: { min: 50000, max: 80000 },
        dataAnalyst: { min: 75000, max: 110000 },
        dataScientist: { min: 110000, max: 165000 },
        seniorDataScientist: { min: 155000, max: 220000 },
        leadDataScientist: { min: 190000, max: 280000 },
        principalDataScientist: { min: 250000, max: 400000 }
      }
    },
    devOpsEngineer: {
      title: 'DevOps Engineer',
      path: ['Intern', 'Junior DevOps', 'DevOps Engineer', 'Senior DevOps Engineer', 'Platform Engineer', 'Principal DevOps', 'VP Infrastructure'],
      skills: {
        intern: ['Linux basics', 'Networking basics', 'Scripting', 'Cloud fundamentals'],
        juniorDevOps: ['Docker', 'CI/CD basics', 'AWS/Azure basics', 'Monitoring basics'],
        devOpsEngineer: ['Kubernetes', 'Terraform', 'CI/CD pipelines', 'Security practices'],
        seniorDevOpsEngineer: ['Architecture', 'Automation', 'Performance', 'Incident management'],
        platformEngineer: ['Platform design', 'Developer experience', 'SRE practices', 'Multi-cloud'],
        principalDevOps: ['Organization strategy', 'Innovation', 'Cost optimization', 'Executive alignment'],
        vpInfrastructure: ['Department strategy', 'Budget', 'Team building', 'Business alignment']
      },
      avgSalary: {
        intern: { min: 25000, max: 50000 },
        juniorDevOps: { min: 60000, max: 95000 },
        devOpsEngineer: { min: 95000, max: 150000 },
        seniorDevOpsEngineer: { min: 145000, max: 200000 },
        platformEngineer: { min: 180000, max: 260000 },
        principalDevOps: { min: 230000, max: 350000 },
        vpInfrastructure: { min: 300000, max: 500000 }
      }
    }
  },

  // Certifications by Category
  certifications: {
    cloud: [
      { name: 'AWS Solutions Architect', provider: 'Amazon', duration: '2-3 months', difficulty: 'Intermediate', value: 95 },
      { name: 'AWS Developer Associate', provider: 'Amazon', duration: '1-2 months', difficulty: 'Foundational', value: 85 },
      { name: 'Azure Administrator', provider: 'Microsoft', duration: '2-3 months', difficulty: 'Intermediate', value: 90 },
      { name: 'Google Cloud Professional', provider: 'Google', duration: '2-3 months', difficulty: 'Advanced', value: 92 },
      { name: 'AWS DevOps Engineer', provider: 'Amazon', duration: '3-4 months', difficulty: 'Advanced', value: 93 }
    ],
    security: [
      { name: 'CISSP', provider: 'ISC', duration: '6-8 months', difficulty: 'Advanced', value: 98 },
      { name: 'CompTIA Security+', provider: 'CompTIA', duration: '2-3 months', difficulty: 'Foundational', value: 85 },
      { name: 'CEH', provider: 'EC-Council', duration: '3-4 months', difficulty: 'Intermediate', value: 88 },
      { name: 'OSCP', provider: 'Offensive Security', duration: '4-6 months', difficulty: 'Advanced', value: 95 }
    ],
    development: [
      { name: 'Oracle Java Certification', provider: 'Oracle', duration: '2-3 months', difficulty: 'Intermediate', value: 80 },
      { name: 'Google Professional Cloud Developer', provider: 'Google', duration: '2-3 months', difficulty: 'Intermediate', value: 88 },
      { name: 'HashiCorp Terraform Associate', provider: 'HashiCorp', duration: '1-2 months', difficulty: 'Foundational', value: 82 }
    ],
    data: [
      { name: 'Databricks Certified Associate', provider: 'Databricks', duration: '2-3 months', difficulty: 'Intermediate', value: 90 },
      { name: 'TensorFlow Developer Certificate', provider: 'Google', duration: '3-4 months', difficulty: 'Advanced', value: 88 },
      { name: 'AWS Machine Learning Specialty', provider: 'Amazon', duration: '3-4 months', difficulty: 'Advanced', value: 92 },
      { name: 'Microsoft Data Engineer', provider: 'Microsoft', duration: '2-3 months', difficulty: 'Intermediate', value: 85 }
    ],
    agile: [
      { name: 'Certified Scrum Master', provider: 'Scrum Alliance', duration: '1-2 months', difficulty: 'Foundational', value: 78 },
      { name: 'PMP', provider: 'PMI', duration: '4-6 months', difficulty: 'Advanced', value: 85 },
      { name: 'SAFe Agilist', provider: 'Scaled Agile', duration: '2-3 months', difficulty: 'Intermediate', value: 82 }
    ]
  },

  // Industry Keywords
  industryKeywords: {
    tech: ['software', 'hardware', 'startup', 'saas', 'cloud', 'ai', 'machine learning', 'data', 'automation', 'digital transformation', 'agile', 'scrum', 'devops', 'microservices', 'api'],
    finance: ['fintech', 'banking', 'investment', 'trading', 'risk management', 'compliance', 'analytics', 'audit', 'reconciliation', 'portfolio', 'derivatives', 'blockchain', 'cryptocurrency'],
    healthcare: ['electronic health records', 'telemedicine', 'clinical trials', 'healthcare analytics', 'hipaa', 'patient care', 'diagnostics', 'medical devices', 'pharma', 'biotech'],
    ecommerce: ['marketplace', 'payments', 'inventory', 'fulfillment', 'customer experience', 'personalization', 'recommendations', 'conversion optimization', 'analytics', 'supply chain'],
    education: ['edtech', 'learning management', 'curriculum', 'assessments', 'student engagement', 'online learning', 'accessibility', 'analytics', 'certification', 'gamification']
  },

  // Readability scoring
  readabilityFactors: {
    idealSentenceLength: 15,
    maxSentenceLength: 25,
    idealParagraphLength: 3,
    maxParagraphLength: 5,
    idealWordLength: 5,
    maxWordLength: 12
  }
};

// Skill synonyms for matching
const SkillSynonyms = {
  'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'nodejs', 'node.js'],
  'typescript': ['ts', 'tsx'],
  'react': ['reactjs', 'react.js', 'react-native'],
  'python': ['py', 'python3'],
  'node.js': ['nodejs', 'node', 'express'],
  'amazon web services': ['aws', 'ec2', 's3', 'lambda'],
  'google cloud': ['gcp', 'google cloud platform'],
  'microsoft azure': ['azure', 'ms azure'],
  'postgresql': ['postgres', 'psql', 'pg'],
  'mongodb': ['mongo', 'nosql'],
  'kubernetes': ['k8s', 'kubernetes', 'container orchestration'],
  'continuous integration': ['ci', 'cicd', 'ci/cd'],
  'continuous deployment': ['cd', 'cicd', 'ci/cd'],
  'machine learning': ['ml', 'ai', 'artificial intelligence'],
  'natural language processing': ['nlp', 'text analytics'],
  'user experience': ['ux', 'user experience design'],
  'user interface': ['ui', 'ui design'],
  'backend': ['back-end', 'server-side', 'server'],
  'frontend': ['front-end', 'client-side', 'client']
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SkillsDatabase, SkillSynonyms };
}
