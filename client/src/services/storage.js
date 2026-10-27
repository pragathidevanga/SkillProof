// Centralized LocalStorage Data Management for SkillProof
// Adheres strictly to Section 10 & 17 versioned keys and local-first architecture
// Robust quota handling, malformed JSON recovery, and schema validation

export const KEYS = {
  PROFILE: 'skillproof_profile_v1',
  PROJECTS: 'skillproof_projects_v1',
  PORTFOLIO_CONFIG: 'skillproof_portfolio_config_v1',
  PROMPT_HISTORY: 'skillproof_prompt_history_v1',
  ANALYSIS_HISTORY: 'skillproof_analysis_history_v1',
  PREFERENCES: 'skillproof_preferences_v1',
  SESSION: 'skillproof_session_v1'
};

// Default Sample Profile Data
export const SAMPLE_PROFILE = {
  isSampleData: true,
  isOnboarded: true,
  basic: {
    fullName: 'Alex Morgan',
    headline: 'Full Stack Engineer & Distributed Systems Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    about: 'Computer Science graduate with experience developing full-stack web applications and scalable REST APIs. Passionate about observable architectures, test-driven development, and clean UI engineering.',
    email: 'alex.morgan@example.com',
    location: 'San Francisco, CA'
  },
  targetRole: 'Full Stack Developer',
  secondaryRole: 'Backend Developer',
  experienceLevel: 'Entry-Level / Fresher',
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Express',
    'PostgreSQL',
    'LocalStorage & IndexedDB',
    'REST APIs',
    'Git',
    'Docker',
    'Tailwind CSS'
  ],
  softSkills: [
    'Technical Communication',
    'Problem Solving',
    'Code Reviews',
    'Agile Collaboration'
  ],
  languages: ['English (Fluent)', 'Spanish (Conversational)'],
  certifications: [
    { id: 'cert-1', title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
    { id: 'cert-2', title: 'Meta Front-End Developer Certificate', issuer: 'Coursera / Meta', year: '2023' }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Washington',
      degree: 'B.S. in Computer Science',
      specialization: 'Software Engineering & Database Systems',
      year: '2025'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      organization: 'CloudScale Technologies',
      role: 'Full Stack Developer Intern',
      startDate: 'May 2024',
      endDate: 'Aug 2024',
      type: 'Internship',
      description: 'Collaborated on migrating legacy microservices to Express & TypeScript. Implemented Redis caching that slashed median database query latency by 34%.'
    }
  ],
  links: {
    github: 'https://github.com/alexmorgan',
    linkedin: 'https://linkedin.com/in/alexmorgan-dev',
    portfolio: 'https://alexmorgan.dev',
    twitter: ''
  },
  resume: {
    fileName: 'Alex_Morgan_Resume_2025.pdf',
    text: `ALEX MORGAN
alex.morgan@example.com | (555) 234-5678 | San Francisco, CA
GitHub: github.com/alexmorgan | LinkedIn: linkedin.com/in/alexmorgan-dev | Portfolio: alexmorgan.dev

SUMMARY
Full Stack Software Engineer with deep hands-on expertise in React, TypeScript, Node.js, and PostgreSQL. Experienced in building high-throughput web apps and microservices with verified proof of work.

EDUCATION
University of Washington — B.S. in Computer Science (2021 - 2025)
Relevant Coursework: Distributed Systems, Database Management, Algorithms, Web Engineering.

EXPERIENCE
CloudScale Technologies — Full Stack Developer Intern (May 2024 - Aug 2024)
- Engineered Redis cache layer for high-traffic query endpoints, cutting median response time by 34%.
- Developed reusable React component library in TypeScript, boosting team development velocity by 25%.
- Implemented CI/CD pipeline using GitHub Actions, reducing deployment errors by 40%.

PROJECTS
MetricsPulse: Real-Time API Health Monitor (React, Node.js, PostgreSQL, WebSockets)
- Built live telemetry system processing 150k events/min with <80ms broadcast latency.
- Code: github.com/alexmorgan/metricspulse-monitor | Demo: metricspulse-demo.vercel.app

DevCollab: Documentation Hub (TypeScript, React, PostgreSQL)
- Developed markdown documentation engine with full-text search indexing and 98 Lighthouse performance score.
- Code: github.com/alexmorgan/devcollab-docs | Demo: devcollab-workspace.vercel.app

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Express, Tailwind CSS, Prisma
Databases & Tools: PostgreSQL, LocalStorage, Redis, Docker, Git, REST APIs, Vercel`,
    parsedAt: new Date().toISOString()
  }
};

export const SAMPLE_PROJECTS = [
  {
    id: 'proj-1',
    title: 'MetricsPulse — Real-Time API Health Monitor',
    category: 'Full Stack Web App',
    status: 'Completed',
    featured: true,
    problemStatement: 'Engineers struggled to detect transient 5xx latency spikes across distributed microservices before customers reported downtime.',
    description: 'A real-time telemetry dashboard that monitors API uptime, p99 response times, and error budgets across microservices with instant Slack webhook alerts.',
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'WebSockets', 'Tailwind CSS'],
    personalContribution: 'Designed and built the full client architecture, the WebSocket server pub/sub pipeline, and automated alerting engine.',
    githubUrl: 'https://github.com/alexmorgan/metricspulse-monitor',
    demoUrl: 'https://metricspulse-demo.vercel.app',
    keyOutcomes: 'Processed 150k simulated events/min with sub-80ms WebSocket broadcast latency; deployed live on Vercel.',
    skillsDemonstrated: ['React', 'Node.js', 'PostgreSQL', 'WebSockets', 'REST APIs'],
    verifiedByUser: true,
    startDate: '2024-01',
    completionDate: '2024-04'
  },
  {
    id: 'proj-2',
    title: 'DevCollab — Markdown Documentation Hub',
    category: 'Frontend & Tooling',
    status: 'Completed',
    featured: true,
    problemStatement: 'Engineering teams lacked a lightweight, self-hosted knowledge base with versioned docs and instant search indexing.',
    description: 'A collaborative documentation workspace featuring live markdown preview, full-text search indexing, and role-based permissions.',
    technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
    personalContribution: 'Engineered the rich-text Markdown AST parser, client-side caching layer, and full-text PostgreSQL search queries.',
    githubUrl: 'https://github.com/alexmorgan/devcollab-docs',
    demoUrl: 'https://devcollab-workspace.vercel.app',
    keyOutcomes: 'Achieved 98/100 Google Lighthouse score; 100% test coverage across core parser utilities.',
    skillsDemonstrated: ['TypeScript', 'React', 'PostgreSQL', 'Git'],
    verifiedByUser: true,
    startDate: '2024-05',
    completionDate: '2024-07'
  },
  {
    id: 'proj-3',
    title: 'TaskFlow — Team Sprint Planner',
    category: 'Local-First Productivity',
    status: 'Completed',
    featured: false,
    problemStatement: 'Simple project trackers were either bloated with enterprise overhead or lacked keyboard-first productivity controls.',
    description: 'A keyboard-first sprint planning tool featuring drag-and-drop task boards, burndown estimates, and local-first offline syncing.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'LocalStorage', 'IndexedDB'],
    personalContribution: 'Architected local-first sync pipeline with optimistic UI updates and zero layout shifts.',
    githubUrl: 'https://github.com/alexmorgan/taskflow-planner',
    demoUrl: 'https://taskflow-planner.vercel.app',
    keyOutcomes: 'Zero external database latency; 60fps drag-and-drop board performance on mobile and desktop.',
    skillsDemonstrated: ['React', 'TypeScript', 'Tailwind CSS', 'Git'],
    verifiedByUser: true,
    startDate: '2024-08',
    completionDate: '2024-10'
  }
];

export const DEFAULT_PORTFOLIO_CONFIG = {
  template: 'modern', // 'minimal' | 'modern' | 'creative'
  accentColor: '#635BFF',
  font: 'Inter',
  customBio: '',
  featuredProjectIds: ['proj-1', 'proj-2'],
  visibleSections: {
    about: true,
    skills: true,
    projects: true,
    experience: true,
    education: true,
    certifications: true,
    contact: true
  }
};

export const DEFAULT_PREFERENCES = {
  theme: 'light',
  displayName: 'Alex Morgan',
  targetRole: 'Full Stack Developer',
  emailNotifications: false,
  compactView: false
};

// Safe LocalStorage Helpers with Quota and Malformed JSON Protection
function safeGet(key, fallback) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading ${key} from LocalStorage (recovering to fallback):`, e);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('skillproof_storage_updated', { detail: { key } }));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      console.error('LocalStorage quota exceeded! Please clear unused prompt history or export data.');
      alert('LocalStorage storage quota exceeded. Consider exporting your application data or deleting old prompts.');
    } else {
      console.error(`Error writing ${key} to LocalStorage:`, e);
    }
    return false;
  }
}

// User-Scoped Isolation Helpers
// Gives each user a stable unique identifier to prevent cross-user data leaks in LocalStorage
export function getStableUserId(email, name) {
  if (email && typeof email === 'string' && email.trim()) {
    const cleanEmail = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `u_${cleanEmail}`;
  }
  if (name && typeof name === 'string' && name.trim()) {
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `u_${cleanName}`;
  }
  return `u_user_${Math.random().toString(36).substring(2, 9)}`;
}

export function getCurrentUserId() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = localStorage.getItem(KEYS.SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.user?.id || null;
  } catch (e) {
    return null;
  }
}

export function getUserScopedKey(baseKey, userId) {
  const activeId = userId || getCurrentUserId();
  if (!activeId) return baseKey;
  return `${baseKey}_${activeId}`;
}

// 1. Profile Management (Isolated per User)
export function loadProfile(userId) {
  const activeId = userId || getCurrentUserId();
  
  if (!activeId) {
    // If no active session, check legacy key
    const legacy = safeGet(KEYS.PROFILE, null);
    return legacy || null;
  }

  const scopedKey = getUserScopedKey(KEYS.PROFILE, activeId);
  const existing = safeGet(scopedKey, null);
  if (existing) {
    return existing;
  }

  // If this is the demo account session, seed with sample profile
  if (activeId === 'u_demo_alex_morgan' || activeId.includes('demo') || activeId.includes('alex_morgan')) {
    safeSet(scopedKey, SAMPLE_PROFILE);
    return SAMPLE_PROFILE;
  }

  return null;
}

export function saveProfile(profile, userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.PROFILE, activeId);
  const success = safeSet(scopedKey, profile);

  // Keep active session user data (role & name) in sync with profile updates
  if (success && typeof window !== 'undefined' && window.localStorage) {
    try {
      const rawSession = localStorage.getItem(KEYS.SESSION);
      if (rawSession) {
        const session = JSON.parse(rawSession);
        if (session && session.user) {
          let updated = false;
          if (profile?.targetRole && session.user.role !== profile.targetRole) {
            session.user.role = profile.targetRole;
            updated = true;
          }
          if (profile?.basic?.fullName && session.user.name !== profile.basic.fullName) {
            session.user.name = profile.basic.fullName;
            updated = true;
          }
          if (profile?.basic?.avatar && session.user.avatar !== profile.basic.avatar) {
            session.user.avatar = profile.basic.avatar;
            updated = true;
          }
          if (updated) {
            localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
          }
        }
      }
    } catch (e) {
      console.warn('Error syncing session with profile:', e);
    }
  }

  return success;
}

// 2. Projects Management (Isolated per User)
export function loadProjects(userId) {
  const activeId = userId || getCurrentUserId();
  
  if (!activeId) {
    const legacy = safeGet(KEYS.PROJECTS, null);
    return Array.isArray(legacy) ? legacy : [];
  }

  const scopedKey = getUserScopedKey(KEYS.PROJECTS, activeId);
  const existing = safeGet(scopedKey, null);
  if (Array.isArray(existing)) {
    return existing;
  }

  // Seed sample projects ONLY if demo user
  if (activeId === 'u_demo_alex_morgan' || activeId.includes('demo') || activeId.includes('alex_morgan')) {
    safeSet(scopedKey, SAMPLE_PROJECTS);
    return SAMPLE_PROJECTS;
  }

  // Real users start with their own empty project workspace
  return [];
}

export function saveProjects(projects, userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.PROJECTS, activeId);
  return safeSet(scopedKey, projects);
}

// 3. Portfolio Config Management (Isolated per User)
export function loadPortfolioConfig(userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.PORTFOLIO_CONFIG, activeId);
  return safeGet(scopedKey, DEFAULT_PORTFOLIO_CONFIG);
}

export function savePortfolioConfig(config, userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.PORTFOLIO_CONFIG, activeId);
  return safeSet(scopedKey, config);
}

// 4. Prompt History Management (Isolated per User)
export function loadPromptHistory(userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.PROMPT_HISTORY, activeId);
  return safeGet(scopedKey, []);
}

export function savePromptHistory(history, userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.PROMPT_HISTORY, activeId);
  return safeSet(scopedKey, history);
}

export function addPromptToHistory(item, userId) {
  const current = loadPromptHistory(userId);
  const newItem = {
    id: `prompt-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...item
  };
  const updated = [newItem, ...current].slice(0, 50);
  savePromptHistory(updated, userId);
  return newItem;
}

export function deletePromptFromHistory(id, userId) {
  const current = loadPromptHistory(userId);
  const updated = current.filter(p => p.id !== id);
  savePromptHistory(updated, userId);
  return updated;
}

// 5. Analysis History Management (Isolated per User)
export function loadAnalysisHistory(userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.ANALYSIS_HISTORY, activeId);
  return safeGet(scopedKey, []);
}

export function saveAnalysisHistory(history, userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.ANALYSIS_HISTORY, activeId);
  return safeSet(scopedKey, history);
}

export function addAnalysisToHistory(item, userId) {
  const current = loadAnalysisHistory(userId);
  const newItem = {
    id: `analysis-${Date.now()}`,
    savedAt: new Date().toISOString(),
    ...item
  };
  const updated = [newItem, ...current].slice(0, 30);
  saveAnalysisHistory(updated, userId);
  return newItem;
}

// 6. User Preferences (Isolated per User)
export function loadPreferences(userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.PREFERENCES, activeId);
  return safeGet(scopedKey, DEFAULT_PREFERENCES);
}

export function savePreferences(prefs, userId) {
  const activeId = userId || getCurrentUserId();
  const scopedKey = getUserScopedKey(KEYS.PREFERENCES, activeId);
  return safeSet(scopedKey, prefs);
}

// 7. Session Management (Demo prototype authentication with stable user ID)
export function loadSession() {
  return safeGet(KEYS.SESSION, null);
}

export function saveSession(session) {
  return safeSet(KEYS.SESSION, session);
}

export function createSession({ email, name, role = 'User', isDemo = false, userId }) {
  const stableId = userId || getStableUserId(email, name);
  const session = {
    isAuthenticated: true,
    user: {
      id: stableId,
      email: email || (isDemo ? 'alex.morgan@example.com' : 'user@skillproof.local'),
      name: name || (isDemo ? 'Alex Morgan' : 'SkillProof User'),
      role: role || (isDemo ? 'Full Stack Developer' : 'Software Engineer')
    },
    isDemo,
    loginTime: new Date().toISOString()
  };
  saveSession(session);
  return session;
}

export function clearSession() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(KEYS.SESSION);
      window.dispatchEvent(new CustomEvent('skillproof_storage_updated', { detail: { key: KEYS.SESSION } }));
    }
  } catch (e) {
    console.error(e);
  }
}

export function isProfileOnboarded(profile) {
  if (!profile) return false;
  if (profile.isOnboarded === true) return true;
  if (profile.basic?.fullName && profile.basic?.headline && (profile.skills || []).length >= 1) {
    return true;
  }
  return false;
}

// 8. Full Export & Import (JSON) — Scoped to Active User
export function exportAllData(userId) {
  const activeId = userId || getCurrentUserId();
  const fullBackup = {
    schemaVersion: '2.0',
    userId: activeId,
    exportedAt: new Date().toISOString(),
    source: 'SkillProof Platform',
    profile: loadProfile(activeId),
    projects: loadProjects(activeId),
    portfolioConfig: loadPortfolioConfig(activeId),
    promptHistory: loadPromptHistory(activeId),
    analysisHistory: loadAnalysisHistory(activeId),
    preferences: loadPreferences(activeId)
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `skillproof_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function importAllData(jsonString, userId) {
  const activeId = userId || getCurrentUserId();
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'File is not a valid JSON object.' };
    }

    if (data.profile && typeof data.profile === 'object') {
      saveProfile({ ...data.profile, isSampleData: false }, activeId);
    }
    if (Array.isArray(data.projects)) {
      saveProjects(data.projects, activeId);
    }
    if (data.portfolioConfig && typeof data.portfolioConfig === 'object') {
      savePortfolioConfig(data.portfolioConfig, activeId);
    }
    if (Array.isArray(data.promptHistory)) {
      savePromptHistory(data.promptHistory, activeId);
    }
    if (Array.isArray(data.analysisHistory)) {
      saveAnalysisHistory(data.analysisHistory, activeId);
    }
    if (data.preferences && typeof data.preferences === 'object') {
      savePreferences(data.preferences, activeId);
    }

    window.dispatchEvent(new CustomEvent('skillproof_storage_updated', { detail: { key: 'all' } }));
    return { success: true, message: 'Backup imported and restored successfully!' };
  } catch (err) {
    return { success: false, error: err.message || 'Invalid JSON format.' };
  }
}

// 9. Reset and Clean Slate — Clears only the active user's workspace
export function clearUserData(userId) {
  const activeId = userId || getCurrentUserId();
  if (!activeId) return;
  const userKeys = [
    getUserScopedKey(KEYS.PROFILE, activeId),
    getUserScopedKey(KEYS.PROJECTS, activeId),
    getUserScopedKey(KEYS.PORTFOLIO_CONFIG, activeId),
    getUserScopedKey(KEYS.PROMPT_HISTORY, activeId),
    getUserScopedKey(KEYS.ANALYSIS_HISTORY, activeId),
    getUserScopedKey(KEYS.PREFERENCES, activeId)
  ];
  userKeys.forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });
  window.dispatchEvent(new CustomEvent('skillproof_storage_updated', { detail: { key: 'user' } }));
}

export function clearAllData() {
  clearUserData();
  return true;
}

export function loadSampleData(userId = 'u_demo_alex_morgan') {
  saveProfile(SAMPLE_PROFILE, userId);
  saveProjects(SAMPLE_PROJECTS, userId);
  savePortfolioConfig(DEFAULT_PORTFOLIO_CONFIG, userId);
  savePreferences(DEFAULT_PREFERENCES, userId);
  window.dispatchEvent(new CustomEvent('skillproof_storage_updated', { detail: { key: 'all' } }));
  return { profile: SAMPLE_PROFILE, projects: SAMPLE_PROJECTS };
}
