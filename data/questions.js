/**
 * Interview Question Database
 * Local dataset for generating interview questions
 */

const QuestionDatabase = {
  // Technical Questions by Category
  technical: {
    javascript: [
      "What is the difference between '==' and '===' in JavaScript?",
      "Explain closures in JavaScript with an example.",
      "What is the event loop and how does it work?",
      "What are arrow functions and how do they differ from regular functions?",
      "Explain the concept of prototypal inheritance.",
      "What is hoisting in JavaScript?",
      "How does 'this' keyword work in different contexts?",
      "What is the difference between 'let', 'const', and 'var'?",
      "Explain async/await and how it relates to Promises.",
      "What are generator functions and when would you use them?",
      "How do you handle errors in async functions?",
      "What is the difference between 'map' and 'forEach'?",
      "Explain the concept of memoization.",
      "What are higher-order functions? Give examples.",
      "How would you implement deep cloning of an object?"
    ],
    react: [
      "What is the Virtual DOM and how does React use it?",
      "Explain the difference between class components and functional components.",
      "What are React Hooks and why were they introduced?",
      "How does useEffect work? Explain its dependencies array.",
      "What is the difference between 'useState' and 'useReducer'?",
      "Explain the Context API and when to use it.",
      "What is code splitting and how do you implement it in React?",
      "How do you optimize performance in React applications?",
      "Explain React.memo and when to use it.",
      "What are custom hooks and how do you create them?",
      "How does React handle forms and form validation?",
      "What is the difference between controlled and uncontrolled components?",
      "Explain server-side rendering in React.",
      "How do you test React components?",
      "What is React StrictMode and why is it useful?"
    ],
    python: [
      "What is the difference between lists and tuples in Python?",
      "Explain decorators in Python with examples.",
      "What are generators and how do they differ from regular functions?",
      "Explain the GIL (Global Interpreter Lock) in Python.",
      "What is the difference between 'deepcopy' and 'copy'?",
      "How does Python handle memory management?",
      "What are context managers and the 'with' statement?",
      "Explain list comprehensions and generator expressions.",
      "What is the difference between 'is' and '==' in Python?",
      "How do you handle exceptions in Python?",
      "What are dataclasses and when would you use them?",
      "Explain Python's asyncio library.",
      "What is the difference between 'classmethod' and 'staticmethod'?",
      "How do you profile and optimize Python code?",
      "What are metaclasses in Python?"
    ],
    databases: [
      "What is the difference between SQL and NoSQL databases?",
      "Explain normalization in database design.",
      "What are indexes and how do they improve performance?",
      "Explain ACID properties in database transactions.",
      "What is database sharding and when would you use it?",
      "Explain the difference between INNER JOIN and LEFT JOIN.",
      "What are stored procedures and their advantages?",
      "How do you prevent SQL injection attacks?",
      "What is connection pooling and why is it important?",
      "Explain database replication strategies.",
      "What are database triggers and when to use them?",
      "How would you optimize a slow database query?",
      "What is the CAP theorem and how does it apply to distributed databases?",
      "Explain database migrations and version control.",
      "What are the different types of database indexes?"
    ],
    systemDesign: [
      "How would you design a URL shortening service?",
      "Design a rate limiter for an API.",
      "How would you design a notification system?",
      "Design a real-time chat application.",
      "How would you design a scalable e-commerce platform?",
      "Explain the microservices architecture pattern.",
      "What is load balancing and what algorithms are used?",
      "How do you handle session management in distributed systems?",
      "Design a caching strategy for a high-traffic website.",
      "How would you design a job scheduler?",
      "What is the difference between SQL and NoSQL for scaling?",
      "How do you handle eventually consistent data?",
      "Design a distributed logging system.",
      "What is the circuit breaker pattern?",
      "How would you design a recommendation system?"
    ],
    general: [
      "What is the time complexity of binary search?",
      "Explain Big O notation and give examples.",
      "What is the difference between arrays and linked lists?",
      "How does a hash table work internally?",
      "What are the different sorting algorithms and their complexities?",
      "Explain recursion with a practical example.",
      "What is dynamic programming? Give an example.",
      "How do you approach debugging a complex issue?",
      "What is the difference between stack and queue?",
      "Explain the concept of breadth-first search.",
      "What are design patterns? Name a few you've used.",
      "How do you write clean, maintainable code?",
      "What is the SOLID principle? Explain each letter.",
      "How do you handle technical debt?",
      "What is the difference between REST and GraphQL?"
    ]
  },

  // Behavioral Questions
  behavioral: [
    "Tell me about a time you had to work with a difficult team member.",
    "Describe a project where you had to learn a new technology quickly.",
    "Tell me about a time you failed and what you learned from it.",
    "Describe a situation where you had to meet a tight deadline.",
    "Tell me about a time you had a conflict with your manager.",
    "Describe a time when you went above and beyond for a project.",
    "Tell me about a time you had to prioritize multiple tasks.",
    "Describe a situation where you had to adapt to change.",
    "Tell me about a time you demonstrated leadership.",
    "Describe a time when you had to make a decision with incomplete information.",
    "Tell me about a time you received difficult feedback.",
    "Describe a situation where you improved a process.",
    "Tell me about a time you had to work with limited resources.",
    "Describe a time when you mentored or helped a colleague.",
    "Tell me about a challenging bug you had to fix.",
    "Describe a time when you had to convince others of your idea.",
    "Tell me about a time you took initiative on a project.",
    "Describe a situation where you had to collaborate across teams.",
    "Tell me about a time you had to handle multiple competing priorities.",
    "Describe a time when you had to give difficult feedback to someone."
  ],

  // HR Questions
  hr: [
    "Tell me about yourself.",
    "Why are you interested in this position?",
    "What do you know about our company?",
    "Why are you leaving your current job?",
    "What are your strengths?",
    "What are your weaknesses?",
    "Where do you see yourself in 5 years?",
    "What is your expected salary?",
    "Why should we hire you?",
    "What motivates you in your work?",
    "How do you handle stress and pressure?",
    "What is your ideal work environment?",
    "Describe your ideal manager.",
    "What are you looking for in your next role?",
    "How do you maintain work-life balance?",
    "What's your biggest professional achievement?",
    "How do you stay current with technology trends?",
    "What do you do outside of work?",
    "Are you willing to relocate?",
    "When can you start?"
  ],

  // Scenario Questions
  scenario: [
    "How would you handle a disagreement with a teammate about code quality?",
    "What would you do if you discovered a critical bug the day before release?",
    "How would you approach a project with unclear requirements?",
    "What would you do if your project timeline was cut in half?",
    "How would you handle a situation where your code broke production?",
    "What would you do if you disagreed with your manager's technical decision?",
    "How would you onboard a new team member?",
    "What would you do if you inherited poorly written legacy code?",
    "How would you handle a situation where a feature is taking longer than estimated?",
    "What would you do if you saw a colleague making a mistake?",
    "How would you approach learning a completely new technology stack?",
    "What would you do if a client changed requirements mid-project?",
    "How would you handle a situation where you're blocked on another team's work?",
    "What would you do if you noticed a security vulnerability in production?",
    "How would you approach improving team productivity?"
  ],

  // Leadership Questions
  leadership: [
    "How do you motivate team members who are disengaged?",
    "Describe your approach to delegating tasks.",
    "How do you handle underperforming team members?",
    "What's your approach to building team culture?",
    "How do you make difficult decisions that affect the team?",
    "Describe how you've handled conflict between team members.",
    "How do you balance technical work with management responsibilities?",
    "What's your approach to performance reviews?",
    "How do you advocate for your team to upper management?",
    "How do you ensure knowledge sharing within your team?",
    "Describe your approach to hiring and building teams.",
    "How do you handle situations where the team is burned out?",
    "What's your approach to setting team goals and KPIs?",
    "How do you foster innovation within your team?",
    "Describe a time you had to make an unpopular decision."
  ],

  // Project-Based Questions
  project: [
    "Walk me through the architecture of your most complex project.",
    "What was the most difficult technical challenge you faced?",
    "How did you measure the success of your project?",
    "What would you do differently if you could redo the project?",
    "How did you handle requirement changes during the project?",
    "What testing strategies did you use?",
    "How did you ensure code quality throughout the project?",
    "Describe how you deployed and monitored the project.",
    "What was the biggest risk in the project and how did you mitigate it?",
    "How did you document the project for future maintenance?",
    "What technologies did you choose and why?",
    "How did you estimate the project timeline?",
    "Describe the most difficult bug you encountered.",
    "How did you collaborate with non-technical stakeholders?",
    "What would you improve about the project now?"
  ]
};

// Skill to Question Category Mapping
const SkillQuestionMapping = {
  'javascript': ['javascript', 'general'],
  'react': ['react', 'javascript', 'general'],
  'vue': ['javascript', 'general'],
  'angular': ['javascript', 'general'],
  'node': ['javascript', 'databases', 'systemDesign'],
  'python': ['python', 'general'],
  'django': ['python', 'databases', 'systemDesign'],
  'flask': ['python', 'general'],
  'java': ['general', 'systemDesign', 'databases'],
  'spring': ['java', 'databases', 'systemDesign'],
  'c++': ['general'],
  'c#': ['general', 'databases'],
  'sql': ['databases'],
  'mysql': ['databases'],
  'postgresql': ['databases'],
  'mongodb': ['databases'],
  'redis': ['databases', 'systemDesign'],
  'aws': ['systemDesign', 'databases'],
  'azure': ['systemDesign', 'databases'],
  'gcp': ['systemDesign', 'databases'],
  'docker': ['systemDesign'],
  'kubernetes': ['systemDesign'],
  'graphql': ['databases', 'general'],
  'rest': ['general', 'systemDesign'],
  'microservices': ['systemDesign'],
  'devops': ['systemDesign', 'databases']
};

// Default categories for general questions
const DefaultCategories = ['general', 'hr', 'behavioral'];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuestionDatabase, SkillQuestionMapping, DefaultCategories };
}
