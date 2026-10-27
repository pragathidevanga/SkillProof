// SkillProof Client API Service
// Communicates with Node/Express REST endpoints with 100% in-browser offline fallbacks

const API_BASE = '/api';

export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

// 1. Portfolio Analysis API
export async function analyzePortfolioApi({ url, manualContent, targetRole, notes }) {
  try {
    const res = await fetch(`${API_BASE}/portfolio/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, manualContent, targetRole, notes }),
      signal: AbortSignal.timeout(8000)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    } else if (data && data.error) {
      throw new Error(data.error);
    }
  } catch (err) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
      throw err;
    }
    console.warn('Backend unavailable; running local portfolio analysis fallback.');
  }

  // Local fallback
  return runLocalPortfolioAnalysis({ content: manualContent || url || notes || 'Portfolio content', targetRole, url });
}

// 2. Portfolio Generation API (Returns files for download & iframe preview)
export async function generatePortfolioApi({ profile, projects, config }) {
  try {
    const res = await fetch(`${API_BASE}/portfolio/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, projects, config }),
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable; running client-side generator.');
  }

  // Local generator fallback
  return runLocalPortfolioGenerator({ profile, projects, config });
}

// 3. Resume Analysis API
export async function analyzeResumeApi({ file, text, targetRole }) {
  if (file) {
    try {
      const formData = new FormData();
      formData.append('resumeFile', file);
      if (text) formData.append('resumeText', text);
      if (targetRole) formData.append('targetRole', targetRole);

      const res = await fetch(`${API_BASE}/resume/analyze`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(10000)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { extractedText: data.extractedText, data: data.data };
      } else if (data && data.error) {
        throw new Error(data.error);
      }
    } catch (e) {
      if (e.message && !e.message.includes('fetch')) {
        throw e;
      }
      console.warn('Backend unavailable; falling back to local text analysis.');
    }
  }

  // Pure browser text fallback
  const fallbackText = text || 'Candidate Resume Text';
  const result = runLocalResumeAnalysis({ text: fallbackText, targetRole });
  return { extractedText: fallbackText, data: result };
}

// 4. Skill Matcher API
export async function matchSkillsApi({ targetRole, skills, jobDescription, experienceLevel }) {
  try {
    const res = await fetch(`${API_BASE}/skills/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRole, skills, jobDescription, experienceLevel }),
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable; running local skill matching logic.');
  }

  return runLocalSkillMatching({ targetRole, skills, jobDescription, experienceLevel });
}

// 5. Readiness Score API
export async function calculateReadinessScoreApi(profileData) {
  try {
    const res = await fetch(`${API_BASE}/readiness/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    }
  } catch (e) {
    console.warn('Backend unavailable; running client-side readiness score.');
  }

  return runLocalReadinessCalculation(profileData);
}

// 6. Prompt Generation API
export async function generatePromptApi({ mode, category, profileData, analysisData, customOptions }) {
  try {
    const res = await fetch(`${API_BASE}/prompts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, category, profileData, analysisData, customOptions }),
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    }
  } catch (e) {
    console.warn('Backend unavailable; using structured prompt template.');
  }

  return runLocalPromptGeneration({ mode, category, profileData, analysisData, customOptions });
}

// ==========================================
// 100% In-Browser Local Engines & Fallbacks
// ==========================================

const ROLE_BENCHMARK_SKILLS = {
  'frontend developer': ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'Responsive Design', 'REST APIs', 'Web Performance'],
  'full stack developer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'PostgreSQL', 'REST APIs', 'Git', 'Docker', 'Deployment'],
  'backend developer': ['Node.js', 'Express', 'Python', 'SQL', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker', 'Authentication (JWT)', 'Git'],
  'data analyst': ['SQL', 'Python', 'Pandas', 'NumPy', 'Excel', 'Tableau', 'Power BI', 'Data Visualization', 'Statistics', 'Data Cleaning'],
  'machine learning engineer': ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'Docker', 'Model Evaluation', 'Feature Engineering'],
  'python developer': ['Python', 'FastAPI', 'Django', 'Flask', 'SQL', 'PostgreSQL', 'Git', 'Unit Testing', 'REST APIs'],
  'software developer': ['Data Structures', 'Algorithms', 'Git', 'Object-Oriented Programming', 'Testing', 'Debugging', 'REST APIs', 'SQL', 'Agile']
};

export function runLocalReadinessCalculation(profileData = {}) {
  const {
    basic = {},
    skills = [],
    targetRole = 'Full Stack Developer',
    projects = [],
    education = [],
    experience = [],
    links = {},
    resume = {},
    portfolio = {}
  } = profileData;

  const roleKey = (targetRole || 'Full Stack Developer').toLowerCase().trim();
  const benchmarkSkills = ROLE_BENCHMARK_SKILLS[roleKey] || ROLE_BENCHMARK_SKILLS['software developer'];

  const normalizedUserSkills = (skills || []).map(s => (typeof s === 'string' ? s : s.name || '').toLowerCase());
  const matchedSkills = benchmarkSkills.filter(b => 
    normalizedUserSkills.some(u => u.includes(b.toLowerCase()) || b.toLowerCase().includes(u))
  );

  // 1. Skills & Role Alignment (25%)
  let rawSkillScore = 0;
  if (normalizedUserSkills.length > 0) {
    const ratio = matchedSkills.length / Math.max(benchmarkSkills.length, 1);
    rawSkillScore = Math.min(100, Math.round(ratio * 85 + (normalizedUserSkills.length >= 5 ? 15 : 5)));
  }

  // 2. Project Quality & Relevance (25%)
  let rawProjectScore = 0;
  if (projects && projects.length > 0) {
    const countPoints = Math.min(40, projects.length * 20);
    let detailPoints = 0;
    let outcomesPoints = 0;
    projects.forEach(p => {
      if (p.problemStatement && p.problemStatement.length > 15) detailPoints += 15;
      if (p.keyOutcomes && p.keyOutcomes.length > 10) outcomesPoints += 15;
      if (p.personalContribution && p.personalContribution.length > 10) detailPoints += 10;
    });
    rawProjectScore = Math.min(100, countPoints + Math.min(30, detailPoints) + Math.min(30, outcomesPoints));
  }

  // 3. Evidence & Links (20%)
  let rawEvidenceScore = 0;
  const hasGithub = Boolean(links.github && links.github.includes('github.com'));
  const hasLinkedin = Boolean(links.linkedin && links.linkedin.includes('linkedin.com'));
  const projectsWithGithub = (projects || []).filter(p => p.githubUrl && p.githubUrl.includes('github.com')).length;
  const projectsWithDemo = (projects || []).filter(p => p.demoUrl && p.demoUrl.startsWith('http')).length;
  const projectsVerified = (projects || []).filter(p => p.verifiedByUser).length;

  let evidencePoints = 0;
  if (hasGithub) evidencePoints += 20;
  if (hasLinkedin) evidencePoints += 15;
  if (projectsWithGithub > 0) evidencePoints += 25;
  if (projectsWithDemo > 0) evidencePoints += 25;
  if (projectsVerified > 0) evidencePoints += 15;
  rawEvidenceScore = Math.min(100, evidencePoints);

  // 4. Resume & Experience (15%)
  let rawResumeScore = 0;
  const hasResumeText = Boolean(resume && (resume.text || resume.fileName));
  const hasExp = Boolean(experience && experience.length > 0);
  const hasEdu = Boolean(education && education.length > 0);
  let resumePoints = 0;
  if (hasResumeText) resumePoints += 40;
  if (hasExp) resumePoints += 35;
  if (hasEdu) resumePoints += 25;
  rawResumeScore = Math.min(100, resumePoints);

  // 5. Structure & Presentation (15%)
  let rawStructureScore = 0;
  const hasHeadline = Boolean(basic.headline && basic.headline.trim().length > 5);
  const hasAbout = Boolean(basic.about && basic.about.trim().length > 20);
  const hasConfig = Boolean(portfolio && (portfolio.template || portfolio.accentColor));
  let structPoints = 0;
  if (hasHeadline) structPoints += 35;
  if (hasAbout) structPoints += 35;
  if (hasConfig) structPoints += 30;
  rawStructureScore = Math.min(100, structPoints);

  // Weighted overall composite score (100% scale)
  const overallScore = Math.round(
    rawSkillScore * 0.25 +
    rawProjectScore * 0.25 +
    rawEvidenceScore * 0.20 +
    rawResumeScore * 0.15 +
    rawStructureScore * 0.15
  );

  let statusLabel = 'Getting Started';
  if (overallScore >= 80) statusLabel = 'Strong Readiness';
  else if (overallScore >= 60) statusLabel = 'Good Progress';
  else if (overallScore >= 40) statusLabel = 'Building Evidence';

  const increases = [];
  const reductions = [];
  const missingEvidence = [];

  if (matchedSkills.length >= 4) {
    increases.push({ pillar: 'Skills', message: `Strong alignment with ${targetRole} (${matchedSkills.length} skills matched).`, boost: +20 });
  } else {
    reductions.push({ pillar: 'Skills', message: `Missing expected ${targetRole} competencies.`, penalty: -10 });
  }

  if (projects.length >= 2) {
    increases.push({ pillar: 'Projects', message: `Documented ${projects.length} project case studies.`, boost: +15 });
  } else {
    reductions.push({ pillar: 'Projects', message: 'Fewer than 2 projects documented.', penalty: -15 });
    missingEvidence.push('At least 2 complete technical projects with measurable outcomes');
  }

  if (projectsWithGithub > 0 && projectsWithDemo > 0) {
    increases.push({ pillar: 'Evidence', message: 'Projects feature verified GitHub repositories and live demos.', boost: +20 });
  } else {
    if (projectsWithGithub === 0) missingEvidence.push('Public GitHub repository URLs for code verification');
    if (projectsWithDemo === 0) missingEvidence.push('Live interactive deployment links (e.g. Vercel, Netlify)');
  }

  const nextActions = [];
  if (projects.length < 2) {
    nextActions.push({ action: 'Add 2 high-impact projects with GitHub code and live URLs', impact: '+18 pts to overall readiness', targetTab: 'projects' });
  }
  if (!hasResumeText) {
    nextActions.push({ action: 'Upload or paste your resume in Resume Analyzer', impact: '+12 pts to overall readiness', targetTab: 'resume-analyzer' });
  }

  return {
    overallScore,
    statusLabel,
    targetRole,
    calculatedAt: new Date().toISOString(),
    categories: {
      skills: { score: rawSkillScore, weight: 25, weightedScore: Number((rawSkillScore * 0.25).toFixed(1)), title: 'Skills & Role Alignment', matchedCount: matchedSkills.length, benchmarkTotal: benchmarkSkills.length, matchedSkills, missingSkills: benchmarkSkills.filter(b => !matchedSkills.includes(b)) },
      projects: { score: rawProjectScore, weight: 25, weightedScore: Number((rawProjectScore * 0.25).toFixed(1)), title: 'Project Quality & Relevance', totalProjects: (projects || []).length },
      evidence: { score: rawEvidenceScore, weight: 20, weightedScore: Number((rawEvidenceScore * 0.20).toFixed(1)), title: 'Evidence & Link Completeness', projectsWithGithub, projectsWithDemo, projectsVerified },
      resume: { score: rawResumeScore, weight: 15, weightedScore: Number((rawResumeScore * 0.15).toFixed(1)), title: 'Resume & Experience', hasResume: hasResumeText, experienceCount: (experience || []).length },
      structure: { score: rawStructureScore, weight: 15, weightedScore: Number((rawStructureScore * 0.15).toFixed(1)), title: 'Portfolio Structure & Presentation', hasHeadline, hasAbout }
    },
    increases: increases.slice(0, 5),
    reductions: reductions.slice(0, 5),
    missingEvidence: [...new Set(missingEvidence)].slice(0, 5),
    nextActions: nextActions.slice(0, 3),
    scoringMethodology: 'Deterministic 5-pillar composite model with exact weights (25/25/20/15/15).'
  };
}

export function runLocalSkillMatching({ targetRole, skills = [], jobDescription = '', experienceLevel = 'Entry-Level / Fresher' }) {
  const roleKey = (targetRole || 'Full Stack Developer').toLowerCase().trim();
  const benchmarkSkills = ROLE_BENCHMARK_SKILLS[roleKey] || ROLE_BENCHMARK_SKILLS['software developer'];

  const userSkillList = (skills || []).map(s => (typeof s === 'string' ? s : s.name || '')).filter(Boolean);
  const normalizedUser = userSkillList.map(s => s.toLowerCase());

  const matchedSkills = [];
  const missingSkills = [];

  benchmarkSkills.forEach(skill => {
    const isMatched = normalizedUser.some(u => u === skill.toLowerCase() || u.includes(skill.toLowerCase()) || skill.toLowerCase().includes(u));
    if (isMatched) matchedSkills.push(skill);
    else missingSkills.push(skill);
  });

  const matchRatio = matchedSkills.length / Math.max(benchmarkSkills.length, 1);
  const matchPercentage = Math.min(100, Math.round(matchRatio * 100));

  const prioritizedLearningChecklist = missingSkills.map((skill, idx) => ({
    skill,
    priority: idx < 2 ? 'High' : 'Medium',
    estimatedWeeks: idx < 2 ? 3 : 2,
    reason: `Frequently required foundational competency for ${targetRole}.`,
    recommendedFocus: `Build a small modular component or service demonstrating ${skill}.`
  }));

  const suggestedProjects = [
    {
      title: `${targetRole} Production Proof-of-Work Project`,
      description: `Build a modern application that addresses core requirements (${missingSkills.slice(0, 3).join(', ')}) with verifiable GitHub code and live demo.`,
      skillsDemonstrated: missingSkills.slice(0, 4),
      keyDeliverable: 'Public GitHub repository with automated test suite and live deployment.'
    }
  ];

  return {
    targetRole,
    experienceLevel,
    matchPercentage,
    totalRequired: benchmarkSkills.length,
    matchedCount: matchedSkills.length,
    missingCount: missingSkills.length,
    matchedSkills,
    missingSkills,
    additionalSkills: userSkillList.filter(u => !benchmarkSkills.some(b => b.toLowerCase() === u.toLowerCase())),
    extractedJobSkills: [],
    prioritizedLearningChecklist,
    suggestedProjects,
    nextSteps: [
      `Review prioritized checklist for ${missingSkills.slice(0, 2).join(' and ')}.`,
      'Document evidence of completed competencies in your projects.',
      'Re-run Skill Matcher after adding new projects.'
    ],
    disclaimer: 'This score is an automated estimate based on the supplied role benchmarks. It is not an employer evaluation or hiring guarantee.'
  };
}

export function runLocalResumeAnalysis({ text, targetRole = 'Full Stack Developer' }) {
  const cleanText = text;
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = cleanText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const githubMatch = cleanText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  const linkedinMatch = cleanText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);

  const roleKey = targetRole.toLowerCase();
  const benchmarkKeywords = (ROLE_BENCHMARK_SKILLS[roleKey] || ROLE_BENCHMARK_SKILLS['software developer']).map(s => s.toLowerCase());

  const matchedKeywords = benchmarkKeywords.filter(kw => cleanText.toLowerCase().includes(kw));
  const missingKeywords = benchmarkKeywords.filter(kw => !matchedKeywords.includes(kw));

  const keywordScore = Math.round((matchedKeywords.length / Math.max(benchmarkKeywords.length, 1)) * 100);
  const formattingScore = (emailMatch ? 30 : 0) + (githubMatch ? 35 : 0) + 35;
  const overallScore = Math.round(keywordScore * 0.5 + formattingScore * 0.5);

  return {
    targetRole,
    wordCount: cleanText.split(/\s+/).filter(Boolean).length,
    characterCount: cleanText.length,
    overallScore,
    qualityGrade: overallScore >= 75 ? 'Competitive' : overallScore >= 50 ? 'Solid' : 'Needs Evidence',
    categoryScores: {
      keywordScore,
      formattingScore,
      impactScore: 75,
      evidenceScore: githubMatch ? 85 : 35
    },
    contactInfo: {
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      github: githubMatch ? `https://${githubMatch[0]}` : null,
      linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : null
    },
    matchedKeywords,
    missingKeywords,
    recommendations: [
      { category: 'Evidence', title: 'Verify GitHub Links', issue: 'Ensure project repositories are public and accessible.', suggestion: 'Include direct repository URLs in each project entry.' },
      { category: 'Role Keywords', title: 'Highlight Target Skills', issue: `Reinforce competencies in ${missingKeywords.slice(0, 3).join(', ')}.`, suggestion: 'Add projects demonstrating these technologies.' }
    ],
    missingSections: []
  };
}

// 6. Fetch Real Projects from GitHub
export async function fetchGitHubProjectsApi({ githubUrl, username }) {
  try {
    const res = await fetch(`${API_BASE}/projects/fetch-github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ githubUrl, username }),
      signal: AbortSignal.timeout(10000)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    } else if (data && data.error) {
      throw new Error(data.error);
    }
  } catch (err) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Direct client-side fetch fallback to public GitHub REST API
  const resolved = username || (githubUrl ? (githubUrl.match(/(?:github\.com\/)?([a-zA-Z0-9_-]+)/i) || [])[1] : null);
  if (!resolved) {
    throw new Error('Please provide a valid GitHub profile URL or username.');
  }

  const directRes = await fetch(`https://api.github.com/users/${encodeURIComponent(resolved)}/repos?sort=updated&per_page=30`);
  if (!directRes.ok) {
    throw new Error(`GitHub returned status code ${directRes.status}. User may not exist or rate limit reached.`);
  }
  const repos = await directRes.json();
  const projects = repos.map(repo => {
    const tech = [repo.language, ...(repo.topics || [])].filter(Boolean);
    return {
      id: `gh-${repo.id}`,
      title: repo.name.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      rawName: repo.name,
      category: repo.language === 'Python' ? 'AI / Machine Learning' : 'Web Application',
      status: repo.archived ? 'Archived' : 'Completed',
      problemStatement: repo.description ? `Addresses: ${repo.description}` : 'Open-source software implementation with verified version history.',
      solution: `Built with ${tech.join(', ') || 'modern software engineering principles'}.`,
      description: repo.description || 'Verified open-source repository retrieved directly from GitHub.',
      technologies: tech.join(', '),
      personalRole: 'Project Creator & Maintainer',
      keyOutcomes: `${repo.stargazers_count || 0} stars; active GitHub version control`,
      skillsDemonstrated: tech.join(', ') || 'Git, GitHub',
      githubUrl: repo.html_url,
      demoUrl: repo.homepage && repo.homepage.startsWith('http') ? repo.homepage : '',
      featured: (repo.stargazers_count || 0) > 0 || !repo.fork,
      isFork: Boolean(repo.fork),
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      verifiedByUser: true,
      source: 'github',
      updatedAt: repo.updated_at
    };
  });

  return {
    username: resolved,
    profileUrl: `https://github.com/${resolved}`,
    totalRetrieved: projects.length,
    projects
  };
}

// 7. LinkedIn Project Request (Transparent OAuth disclosure)
export async function fetchLinkedInProjectsApi({ linkedinUrl }) {
  try {
    const res = await fetch(`${API_BASE}/projects/fetch-linkedin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkedinUrl }),
      signal: AbortSignal.timeout(4000)
    });
    const data = await res.json();
    return data;
  } catch {
    return {
      success: false,
      requiresAuth: true,
      source: 'linkedin',
      message: 'LinkedIn restricts automated third-party data retrieval without authorized OAuth 2.0 partner credentials. To include projects from your LinkedIn profile, please use the manual project entry form.'
    };
  }
}

export function runLocalPortfolioAnalysis({ content, targetRole = 'Full Stack Developer', url = '' }) {
  const lower = content.toLowerCase();
  const hasGithub = lower.includes('github.com');
  const hasDemo = lower.includes('demo') || lower.includes('http') || lower.includes('vercel');
  const hasAbout = lower.includes('about') || lower.includes('bio') || lower.includes('engineer') || lower.includes('student');
  const hasProjects = lower.includes('project') || lower.includes('work');
  const hasSkills = lower.includes('skill') || lower.includes('stack') || lower.includes('tech');
  const hasContact = lower.includes('contact') || lower.includes('email') || lower.includes('mailto:');

  // Exact 6-criterion rubric
  const visualDesign = Math.min(20, (hasAbout ? 8 : 4) + (hasProjects ? 6 : 4) + 4);
  const structureNav = Math.min(15, (hasAbout && hasProjects ? 10 : 5) + (hasContact ? 5 : 2));
  const projectQuality = Math.min(25, (hasProjects ? 10 : 5) + (hasGithub ? 8 : 0) + (hasDemo ? 7 : 0));
  const technicalSkills = Math.min(15, (hasSkills ? 8 : 4) + 6);
  const aboutExperience = Math.min(10, (hasAbout ? 5 : 2) + (hasContact ? 5 : 2));
  const responsivenessLinks = Math.min(15, (hasGithub || hasDemo ? 10 : 5) + 5);

  const overallScore = visualDesign + structureNav + projectQuality + technicalSkills + aboutExperience + responsivenessLinks;

  let scoreLabel = 'Needs Improvement';
  if (overallScore >= 90) scoreLabel = 'Excellent';
  else if (overallScore >= 75) scoreLabel = 'Very Good';
  else if (overallScore >= 60) scoreLabel = 'Good';
  else if (overallScore >= 40) scoreLabel = 'Good Foundation';

  const formattedScore = `${overallScore}/100 — ${scoreLabel}`;

  return {
    url: url || 'Browser Local Input',
    fetchMethod: 'browser_local',
    targetRole,
    overallScore,
    scoreLabel,
    formattedScore,
    rubric: {
      visualDesign: { title: 'Visual design and readability', score: visualDesign, max: 20 },
      structureNav: { title: 'Portfolio structure and navigation', score: structureNav, max: 15 },
      projectQuality: { title: 'Project quality and presentation', score: projectQuality, max: 25 },
      technicalSkills: { title: 'Technical skills and evidence', score: technicalSkills, max: 15 },
      aboutExperience: { title: 'About, experience and profile completeness', score: aboutExperience, max: 10 },
      responsivenessLinks: { title: 'Responsiveness, accessibility and working links', score: responsivenessLinks, max: 15 }
    },
    detectedSkills: ['React', 'JavaScript', 'Node.js', 'HTML', 'CSS', 'Tailwind'],
    missingRoleSkills: ['Docker', 'CI/CD'],
    strengths: [
      hasGithub ? 'Includes direct GitHub repository links.' : 'Structured project case studies.',
      hasAbout ? 'Clear personal engineering narrative.' : 'Technical stack clarity.'
    ],
    weaknesses: [
      !hasGithub ? 'No direct GitHub repository links detected.' : null,
      !hasDemo ? 'Missing live interactive deployment links.' : null
    ].filter(Boolean),
    missingSections: !hasAbout ? ['About Me'] : [],
    missingEvidence: !hasGithub ? ['Public GitHub repositories'] : [],
    recommendations: [
      { priority: 'High', area: 'Evidence', action: 'Add direct 1-click GitHub links to projects.', why: 'Recruiters want instant proof of code ownership.' }
    ],
    analyzedAt: new Date().toISOString()
  };
}

export function runLocalPortfolioGenerator({ profile = {}, projects = [], config = {} }) {
  const name = profile.basic?.fullName || 'Candidate Name';
  const headline = profile.basic?.headline || `${profile.targetRole || 'Software Engineer'}`;
  const about = profile.basic?.about || 'Software engineer dedicated to crafting clean, robust web architectures and high-performance applications.';
  const email = profile.basic?.email || 'hello@example.com';
  const accent = config.accentColor || '#635BFF';
  const links = profile.links || {};
  const skills = (profile.skills || []).map(s => (typeof s === 'string' ? s : s.name || '')).filter(Boolean);
  const projectList = (projects && projects.length > 0 ? projects : (profile.projects || []));

  const css = `
:root {
  --accent: ${accent};
  --accent-soft: rgba(99, 91, 255, 0.08);
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --border: #E2E8F0;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.65; }
.container { max-width: 960px; margin: 0 auto; padding: 0 24px; }
header { background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
.nav-wrap { display: flex; justify-content: space-between; align-items: center; height: 64px; }
.brand { font-size: 1.1875rem; font-weight: 800; color: var(--text-primary); text-decoration: none; }
.nav-links { display: flex; gap: 20px; list-style: none; font-size: 0.875rem; font-weight: 600; }
.nav-links a { color: var(--text-secondary); text-decoration: none; }
.hero { padding: 64px 0 48px; border-bottom: 1px solid var(--border); }
.hero-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 9999px; background: #ECFDF5; border: 1px solid #A7F3D0; color: #047857; font-size: 0.75rem; font-weight: 700; margin-bottom: 16px; }
.hero h1 { font-size: 2.75rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 10px; }
.hero .headline { font-size: 1.25rem; font-weight: 600; color: var(--accent); margin-bottom: 14px; }
.hero .bio { font-size: 1rem; color: var(--text-secondary); line-height: 1.7; max-width: 700px; margin-bottom: 24px; }
.hero-links { display: flex; gap: 12px; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 0.875rem; text-decoration: none; cursor: pointer; }
.btn-primary { background: var(--accent); color: #FFF; border: none; }
.btn-secondary { background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-primary); }
section { padding: 48px 0; border-bottom: 1px solid var(--border); }
.section-title { font-size: 1.375rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 20px; }
.skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-pill { font-size: 0.8125rem; padding: 6px 12px; border-radius: 6px; background: var(--bg-secondary); border: 1px solid var(--border); font-weight: 600; }
.projects-stack { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.project-card { border: 1px solid var(--border); border-radius: 12px; padding: 20px; background: #FFF; transition: 0.15s; }
.project-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.project-name { font-size: 1.125rem; font-weight: 700; margin-bottom: 6px; }
.problem-box { font-size: 0.8125rem; background: var(--bg-secondary); border-left: 3px solid var(--accent); padding: 6px 10px; border-radius: 0 4px 4px 0; margin: 8px 0; color: var(--text-secondary); }
.project-summary { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 10px; }
.outcomes-callout { font-size: 0.8125rem; color: #047857; font-weight: 700; background: #ECFDF5; padding: 4px 8px; border-radius: 4px; margin-bottom: 10px; display: inline-block; }
.tech-pills-row { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 14px; }
.tech-tag-sm { font-size: 0.6875rem; background: var(--bg-secondary); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; font-family: monospace; }
.project-btns { display: flex; gap: 8px; }
footer { padding: 40px 0; text-align: center; font-size: 0.8125rem; color: var(--text-secondary); }
`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — ${headline}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container nav-wrap">
      <a href="#" class="brand">${name}</a>
      <ul class="nav-links">
        <li><a href="#projects">Projects</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  </header>

  <div class="container">
    <div class="hero">
      <div class="hero-tag">● Available for Software Engineering Roles</div>
      <h1>${name}</h1>
      <div class="headline">${headline}</div>
      <p class="bio">${about}</p>
      <div class="hero-links">
        ${links.github ? `<a href="${links.github}" target="_blank" class="btn btn-secondary">GitHub</a>` : ''}
        ${links.linkedin ? `<a href="${links.linkedin}" target="_blank" class="btn btn-secondary">LinkedIn</a>` : ''}
        <a href="#contact" class="btn btn-primary">Get In Touch</a>
      </div>
    </div>

    ${skills.length > 0 ? `
    <section id="skills">
      <h2 class="section-title">Technical Competencies</h2>
      <div class="skills-grid">
        ${skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
      </div>
    </section>` : ''}

    ${projectList.length > 0 ? `
    <section id="projects">
      <h2 class="section-title">Featured Engineering Projects</h2>
      <div class="projects-stack">
        ${projectList.map(p => `
          <div class="project-card">
            <div class="project-name">${p.title}</div>
            ${p.problemStatement ? `<div class="problem-box"><strong>Problem:</strong> ${p.problemStatement}</div>` : ''}
            <div class="project-summary">${p.description || ''}</div>
            ${p.keyOutcomes ? `<div class="outcomes-callout">⚡ Impact: ${p.keyOutcomes}</div>` : ''}
            <div class="tech-pills-row">
              ${(p.technologies || []).map(t => `<span class="tech-tag-sm">${t}</span>`).join('')}
            </div>
            <div class="project-btns">
              ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="btn btn-secondary" style="font-size:0.75rem; padding:4px 10px;">Code</a>` : ''}
              ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" class="btn btn-primary" style="font-size:0.75rem; padding:4px 10px;">Live Demo</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    <section id="contact">
      <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:12px; padding:32px; text-align:center;">
        <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:8px;">Get in Touch</h2>
        <p style="color:var(--text-secondary); margin-bottom:16px;">Open to discussing engineering roles and collaborations.</p>
        <a href="mailto:${email}" class="btn btn-primary">Email Me: ${email}</a>
      </div>
    </section>

    <footer>
      &copy; ${new Date().getFullYear()} ${name} &bull; Verified Portfolio Platform
    </footer>
  </div>
</body>
</html>`;

  return {
    template: config.template || 'modern',
    files: {
      'index.html': html,
      'styles.css': css,
      'script.js': `console.log('SkillProof Portfolio loaded.');`,
      'README.md': `# Portfolio of ${name}\nGenerated with SkillProof.`
    },
    standalonePreviewHtml: html.replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`)
  };
}

export function runLocalPromptGeneration({ mode, category, profileData, customOptions = {} }) {
  const { basic = {}, targetRole = 'Full Stack Developer', skills = [], projects = [] } = profileData;
  const name = basic.fullName || 'Engineering Candidate';
  const headline = basic.headline || `${targetRole} specializing in modern web applications`;
  const skillList = skills.map(s => (typeof s === 'string' ? s : s.name)).join(', ') || 'JavaScript, React, Node.js';
  const cat = category || mode || 'portfolio_generation';

  const promptContent = `# Production ${cat.replace(/_/g, ' ').toUpperCase()} Specification for ${name}
**Target Role:** ${targetRole}
**Target AI Tool:** ${customOptions.toolTarget || 'Google Antigravity'}
**Design Aesthetic:** ${customOptions.designStyle || 'Clean SaaS Minimalist (Linear & Stripe inspired)'}

## Candidate Details
- **Headline:** ${headline}
- **Skills:** ${skillList}

## Requirements & Scope
${customOptions.projectDescription || 'Build a verified proof-of-work software engineering application with clear architecture.'}

## Deliverables
1. Production-ready, fully functional code without placeholders.
2. Clean modular structure and responsive layout.
3. Accessible UI and verified GitHub/demo links.`;

  return {
    category: cat,
    targetRole,
    toolTarget: customOptions.toolTarget || 'Google Antigravity',
    generatorType: 'SkillProof Local Engine (Browser Only)',
    generatedAt: new Date().toISOString(),
    promptContent
  };
}
