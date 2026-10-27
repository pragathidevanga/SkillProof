// SkillProof Skill Matcher Service
// Deterministic role-to-skill library, job-description keyword extractor, and gap analyzer
// Supports extensive skill normalization (e.g. node / node.js, react / reactjs, postgres / postgresql)

export const ROLE_SKILL_LIBRARIES = {
  'frontend developer': {
    title: 'Frontend Developer',
    coreSkills: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'Responsive Design', 'REST APIs', 'Web Performance'],
    secondarySkills: ['Next.js', 'Redux', 'Jest', 'Cypress', 'Vite', 'GraphQL', 'Accessibility (WCAG)', 'UI/UX Design'],
    suggestedProjects: [
      {
        title: 'High-Performance E-Commerce Product Catalog',
        description: 'Build a lightning-fast catalog with instant client-side filtering, debounced search, responsive grid layouts, and Lighthouse 95+ score.',
        skillsDemonstrated: ['React', 'TypeScript', 'Tailwind CSS', 'Web Performance', 'REST APIs'],
        keyDeliverable: 'Live interactive demo on Vercel with automated test coverage report.'
      },
      {
        title: 'Accessible SaaS Analytics Dashboard',
        description: 'Design a keyboard-navigable dashboard featuring dark/light themes, WCAG AA compliance, and interactive data visualization charts.',
        skillsDemonstrated: ['React', 'Accessibility (WCAG)', 'CSS Modules / Tailwind', 'TypeScript'],
        keyDeliverable: 'GitHub repository with axe-core automated accessibility test suite.'
      }
    ]
  },
  'backend developer': {
    title: 'Backend Developer',
    coreSkills: ['Node.js', 'Express', 'Python', 'SQL', 'PostgreSQL', 'REST APIs', 'Git', 'Docker', 'Authentication (JWT)', 'Database Design'],
    secondarySkills: ['Redis', 'MongoDB', 'GraphQL', 'Microservices', 'CI/CD', 'Kafka', 'System Design', 'Unit Testing'],
    suggestedProjects: [
      {
        title: 'Rate-Limited Distributed API Gateway',
        description: 'Architect an Express or FastAPI microservice with token-bucket rate limiting, Redis caching, and structured JSON telemetry.',
        skillsDemonstrated: ['Node.js', 'Express', 'Redis', 'Docker', 'REST APIs'],
        keyDeliverable: 'Docker Compose orchestration file and Apache Benchmark latency benchmarks.'
      },
      {
        title: 'Event-Driven Job Queue & Notification Service',
        description: 'Implement a background task worker processing asynchronous email/webhook notifications with persistent database logging.',
        skillsDemonstrated: ['Node.js', 'PostgreSQL', 'Database Design', 'Authentication (JWT)'],
        keyDeliverable: 'GitHub repo with migration scripts, seed data, and Postman collection.'
      }
    ]
  },
  'full stack developer': {
    title: 'Full Stack Developer',
    coreSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'PostgreSQL', 'REST APIs', 'Git', 'Docker', 'Deployment'],
    secondarySkills: ['Tailwind CSS', 'Redis', 'Next.js', 'CI/CD', 'LocalStorage & IndexedDB', 'State Management', 'Testing'],
    suggestedProjects: [
      {
        title: 'Real-Time Collaborative Kanban Workspace',
        description: 'Build an end-to-end task board with optimistic UI updates, WebSocket synchronization, user authentication, and Postgres persistence.',
        skillsDemonstrated: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'WebSockets'],
        keyDeliverable: 'Full-stack production deployment with public GitHub repo and live demo URL.'
      },
      {
        title: 'Self-Hosted Developer Snippet Manager',
        description: 'Create a local-first code snippet library with syntax highlighting, tag categorization, full-text search, and cloud sync.',
        skillsDemonstrated: ['React', 'Node.js', 'SQL', 'REST APIs', 'Docker'],
        keyDeliverable: 'Ready-to-run Docker image and responsive single-page web app.'
      }
    ]
  },
  'data analyst': {
    title: 'Data Analyst',
    coreSkills: ['SQL', 'Python', 'Pandas', 'NumPy', 'Excel', 'Tableau', 'Power BI', 'Data Visualization', 'Statistics', 'Data Cleaning'],
    secondarySkills: ['ETL Pipelines', 'A/B Testing', 'Reporting', 'Jupyter Notebooks', 'PostgreSQL', 'Data Storytelling'],
    suggestedProjects: [
      {
        title: 'Customer Churn Analysis & Executive Dashboard',
        description: 'Clean raw transaction logs, calculate cohort retention, and build an interactive Tableau/Power BI dashboard identifying revenue churn risks.',
        skillsDemonstrated: ['Python', 'Pandas', 'SQL', 'Data Visualization', 'Statistics'],
        keyDeliverable: 'Jupyter notebook analysis with annotated visualizations and business recommendations.'
      },
      {
        title: 'Public Health Trends Automated ETL Pipeline',
        description: 'Build an automated Python script extracting public datasets, normalizing schemas in SQL, and updating summary charts.',
        skillsDemonstrated: ['Python', 'SQL', 'ETL Pipelines', 'Data Cleaning'],
        keyDeliverable: 'Documented GitHub repository with reproducibility instructions.'
      }
    ]
  },
  'machine learning engineer': {
    title: 'Machine Learning Engineer',
    coreSkills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'Docker', 'Model Evaluation', 'Feature Engineering', 'Git'],
    secondarySkills: ['MLOps', 'FastAPI', 'MLflow', 'Deep Learning', 'Computer Vision', 'NLP', 'Data Pipelines'],
    suggestedProjects: [
      {
        title: 'Real-Time Text Classification Microservice',
        description: 'Train a fine-tuned sentiment or topic classification model and serve inference via a low-latency FastAPI container with Docker.',
        skillsDemonstrated: ['Python', 'PyTorch / Scikit-Learn', 'FastAPI', 'Docker', 'Model Evaluation'],
        keyDeliverable: 'Containerized API with Swagger documentation and benchmark latency curves.'
      },
      {
        title: 'Automated Model Drift Monitoring Pipeline',
        description: 'Implement automated data drift detection on streaming inputs and log evaluation metrics using Scikit-Learn.',
        skillsDemonstrated: ['Python', 'Pandas', 'Feature Engineering', 'MLOps'],
        keyDeliverable: 'Open-source GitHub repository with automated GitHub Actions testing.'
      }
    ]
  },
  'python developer': {
    title: 'Python Developer',
    coreSkills: ['Python', 'FastAPI', 'Django', 'Flask', 'SQL', 'PostgreSQL', 'Object-Oriented Programming', 'Git', 'Unit Testing (pytest)', 'REST APIs'],
    secondarySkills: ['Docker', 'Asyncio', 'Celery', 'Redis', 'Web Scraping (BeautifulSoup)', 'Type Hinting'],
    suggestedProjects: [
      {
        title: 'Asynchronous Web Scraper & Price Aggregator',
        description: 'Develop an asyncio-powered crawler with proxy rotation, rate-limit handling, and automated relational database storage.',
        skillsDemonstrated: ['Python', 'Asyncio', 'PostgreSQL', 'Git', 'Unit Testing (pytest)'],
        keyDeliverable: 'Clean CLI interface with 90%+ pytest coverage.'
      },
      {
        title: 'Production REST API with FastAPI & SQLAlchemy',
        description: 'Build a secure backend service featuring Pydantic schemas, JWT auth, database migrations, and Alembic tracking.',
        skillsDemonstrated: ['Python', 'FastAPI', 'SQL', 'REST APIs', 'Docker'],
        keyDeliverable: 'Interactive OpenAPI/Swagger documentation with live server deployment.'
      }
    ]
  },
  'software developer': {
    title: 'Software Developer',
    coreSkills: ['Data Structures', 'Algorithms', 'Git', 'Object-Oriented Programming', 'Testing', 'Debugging', 'REST APIs', 'SQL', 'Agile / Scrum'],
    secondarySkills: ['CI/CD', 'System Design', 'Design Patterns', 'Code Review', 'Clean Code'],
    suggestedProjects: [
      {
        title: 'Custom In-Memory Cache with Eviction Policies',
        description: 'Implement an LRU/LFU cache from scratch in your primary language with thread-safety, unit tests, and performance benchmarks.',
        skillsDemonstrated: ['Data Structures', 'Algorithms', 'Testing', 'Clean Code'],
        keyDeliverable: 'Well-documented repository with algorithmic complexity analysis (Big-O).'
      }
    ]
  }
};

// Skill synonym map for bidirectional normalization
const SKILL_SYNONYMS = {
  'js': 'javascript',
  'vanilla js': 'javascript',
  'es6': 'javascript',
  'ts': 'typescript',
  'react.js': 'react',
  'reactjs': 'react',
  'node': 'node.js',
  'nodejs': 'node.js',
  'express.js': 'express',
  'expressjs': 'express',
  'postgres': 'postgresql',
  'pgsql': 'postgresql',
  'mongo': 'mongodb',
  'tailwind': 'tailwind css',
  'tailwindcss': 'tailwind css',
  'py': 'python',
  'python3': 'python',
  'html': 'html5',
  'css': 'css3',
  'next': 'next.js',
  'nextjs': 'next.js',
  'vue': 'vue.js',
  'vuejs': 'vue.js',
  'containerization': 'docker',
  'containers': 'docker',
  'k8s': 'kubernetes',
  'rest': 'rest apis',
  'rest api': 'rest apis',
  'restful': 'rest apis',
  'restful apis': 'rest apis',
  'github': 'git',
  'version control': 'git',
  'vcs': 'git',
  'aws': 'aws',
  'amazon web services': 'aws',
  'gcp': 'gcp',
  'google cloud': 'gcp',
  'google cloud platform': 'gcp',
  'cicd': 'ci/cd',
  'github actions': 'ci/cd',
  'unit testing': 'testing',
  'jest': 'testing',
  'pytest': 'unit testing (pytest)',
  'sql database': 'sql',
  'relational databases': 'sql',
  'jwt': 'authentication (jwt)',
  'jwt auth': 'authentication (jwt)',
  'scikit learn': 'scikit-learn',
  'sklearn': 'scikit-learn'
};

/**
 * Normalizes a skill string to its canonical lower-case representation.
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const clean = skill.trim().toLowerCase();
  return SKILL_SYNONYMS[clean] || clean;
}

/**
 * Checks if two skill names match directly or via synonym mappings.
 */
export function skillsMatch(skillA, skillB) {
  const normA = normalizeSkill(skillA);
  const normB = normalizeSkill(skillB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;
  if (normA.includes(normB) || normB.includes(normA)) return true;
  return false;
}

// Known technical keywords to detect from arbitrary pasted job descriptions
const COMMON_TECH_KEYWORDS = [
  'javascript', 'typescript', 'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'node.js', 'express',
  'python', 'django', 'fastapi', 'flask', 'java', 'spring', 'spring boot', 'c#', '.net', 'c++', 'go', 'golang',
  'rust', 'php', 'laravel', 'ruby', 'rails', 'sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'mongodb',
  'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'graphql', 'rest api', 'restful', 'docker', 'kubernetes',
  'aws', 'azure', 'gcp', 'cloud', 'ci/cd', 'github actions', 'git', 'linux', 'html', 'html5', 'css', 'css3',
  'tailwind', 'tailwind css', 'sass', 'bootstrap', 'webpack', 'vite', 'jest', 'cypress', 'pytest', 'unit testing', 'testing',
  'agile', 'scrum', 'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow', 'machine learning', 'deep learning',
  'tableau', 'power bi', 'excel', 'data visualization', 'statistics', 'etl', 'system design', 'microservices'
];

export function extractKeywordsFromJobText(text) {
  if (!text || typeof text !== 'string') return [];
  const lower = text.toLowerCase();
  const found = new Set();

  COMMON_TECH_KEYWORDS.forEach(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s,;:.()/-])${escaped}(?:[\\s,;:.()/-]|$)`, 'i');
    if (regex.test(lower)) {
      const pretty = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      found.add(pretty);
    }
  });

  return Array.from(found);
}

export function matchSkills({
  targetRole = 'Full Stack Developer',
  skills = [],
  jobDescription = '',
  experienceLevel = 'Entry-Level / Fresher'
}) {
  const roleKey = (targetRole || 'Full Stack Developer').toLowerCase().trim();
  const library = ROLE_SKILL_LIBRARIES[roleKey] || ROLE_SKILL_LIBRARIES['software developer'];

  // Normalize user skills list
  const userSkillList = (skills || []).map(s => {
    const name = typeof s === 'string' ? s : s.name || '';
    return name.trim();
  }).filter(Boolean);

  // Extract skills from job description if provided
  const extractedJobSkills = extractKeywordsFromJobText(jobDescription);

  // Determine required benchmark skills
  let requiredSkills = [...library.coreSkills];
  if (extractedJobSkills.length >= 2) {
    extractedJobSkills.forEach(jobSkill => {
      if (!requiredSkills.some(r => skillsMatch(r, jobSkill))) {
        requiredSkills.push(jobSkill);
      }
    });
  }

  // Compare skills with bidirectional normalization
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(req => {
    const isMatched = userSkillList.some(u => skillsMatch(u, req));
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  // Identify additional skills from profile that aren't in required list
  const additionalSkills = userSkillList.filter(u => {
    return !requiredSkills.some(r => skillsMatch(r, u));
  });

  // Calculate match percentage
  const totalRequired = Math.max(requiredSkills.length, 1);
  const matchRatio = matchedSkills.length / totalRequired;
  
  let basePercentage = Math.round(matchRatio * 100);
  if (experienceLevel.toLowerCase().includes('senior') && basePercentage > 20) {
    basePercentage = Math.max(10, basePercentage - 10);
  } else if (experienceLevel.toLowerCase().includes('entry') && basePercentage < 90 && matchedSkills.length >= 4) {
    basePercentage = Math.min(100, basePercentage + 5);
  }

  // Prioritized learning checklist
  const prioritizedLearningChecklist = missingSkills.map((skill, index) => {
    let priority = 'Medium';
    let estimatedWeeks = 2;
    let reason = `Frequently required for ${library.title} roles.`;

    if (library.coreSkills.some(c => skillsMatch(c, skill))) {
      if (index < 3) {
        priority = 'High';
        estimatedWeeks = 3;
        reason = `Essential foundational competency for ${library.title}.`;
      }
    } else {
      priority = 'Low';
      estimatedWeeks = 1;
      reason = 'Complementary skill that differentiates your profile.';
    }

    return {
      skill,
      priority,
      estimatedWeeks,
      reason,
      recommendedFocus: `Build a small focused module demonstrating ${skill} with public code and documentation.`
    };
  });

  // Next actionable steps
  const nextSteps = [];
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 2).join(' and ');
    nextSteps.push(`Focus on acquiring hands-on practice in ${topMissing}.`);
  }
  if (library.suggestedProjects && library.suggestedProjects.length > 0) {
    nextSteps.push(`Build a portfolio project like "${library.suggestedProjects[0].title}" to provide tangible proof of work.`);
  }
  nextSteps.push('Update your SkillProof profile and project tech stacks as you complete these competencies.');

  return {
    targetRole: library.title,
    experienceLevel,
    matchPercentage: basePercentage,
    totalRequired: requiredSkills.length,
    matchedCount: matchedSkills.length,
    missingCount: missingSkills.length,
    matchedSkills,
    missingSkills,
    additionalSkills,
    extractedJobSkills,
    prioritizedLearningChecklist,
    suggestedProjects: library.suggestedProjects || [],
    nextSteps,
    disclaimer: 'This match percentage and gap analysis is an automated estimate based on standard industry benchmarks and input text. It is designed for structured career guidance and does not guarantee employer hiring decisions.'
  };
}
