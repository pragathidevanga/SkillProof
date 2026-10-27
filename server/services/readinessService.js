// Deterministic Portfolio Readiness Scoring Engine
// Strict 5-Pillar Weighted Model:
// 1. Skills & Target-Role Alignment: 25%
// 2. Project Quality & Relevance: 25%
// 3. Evidence & Link Completeness: 20%
// 4. Resume & Experience: 15%
// 5. Portfolio Structure & Presentation: 15%
// Total: 100%

import { ROLE_SKILL_LIBRARIES, skillsMatch } from './skillMatcherService.js';

export function calculateReadinessScore(profileData = {}) {
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

  const increases = [];
  const reductions = [];
  const missingEvidence = [];
  let isPreliminary = false;

  // ==========================================
  // Pillar 1: Skills & Role Alignment (Weight: 25%)
  // ==========================================
  const roleKey = (targetRole || 'Full Stack Developer').toLowerCase().trim();
  const library = ROLE_SKILL_LIBRARIES[roleKey] || ROLE_SKILL_LIBRARIES['software developer'];
  const benchmarkSkills = library.coreSkills;

  const normalizedUserSkills = (skills || []).map(s => (typeof s === 'string' ? s : s.name || '').trim()).filter(Boolean);
  const matchedSkills = benchmarkSkills.filter(b => 
    normalizedUserSkills.some(u => skillsMatch(u, b))
  );

  let rawSkillScore = 0;
  if (normalizedUserSkills.length === 0) {
    isPreliminary = true;
    reductions.push({ pillar: 'Skills', message: 'No skills entered in profile yet.', penalty: -25 });
    missingEvidence.push('Core technical skills entered in My Profile');
  } else {
    const matchRatio = matchedSkills.length / Math.max(benchmarkSkills.length, 1);
    rawSkillScore = Math.min(100, Math.round(matchRatio * 85 + (normalizedUserSkills.length >= 5 ? 15 : 5)));
    
    if (matchedSkills.length >= 5) {
      increases.push({ pillar: 'Skills', message: `Strong alignment with ${targetRole} requirements (${matchedSkills.length} core competencies matched).`, boost: +20 });
    } else {
      reductions.push({ pillar: 'Skills', message: `Missing several expected competencies for ${targetRole}: ${benchmarkSkills.filter(b => !matchedSkills.includes(b)).slice(0, 3).join(', ')}.`, penalty: -10 });
    }
  }

  // ==========================================
  // Pillar 2: Project Quality & Relevance (Weight: 25%)
  // ==========================================
  let rawProjectScore = 0;
  if (!projects || projects.length === 0) {
    isPreliminary = true;
    reductions.push({ pillar: 'Projects', message: 'No projects added to showcase practical abilities.', penalty: -25 });
    missingEvidence.push('At least 2 complete technical projects with problem statements and tech stacks');
  } else {
    const countPoints = Math.min(40, projects.length * 20); // 1 = 20, 2+ = 40
    let detailPoints = 0;
    let outcomesPoints = 0;

    projects.forEach(p => {
      if (p.problemStatement && p.problemStatement.trim().length > 15) detailPoints += 15;
      if (p.keyOutcomes && p.keyOutcomes.trim().length > 10) outcomesPoints += 15;
      if (p.personalContribution && p.personalContribution.trim().length > 10) detailPoints += 10;
    });

    rawProjectScore = Math.min(100, countPoints + Math.min(30, detailPoints) + Math.min(30, outcomesPoints));

    if (projects.length >= 2 && outcomesPoints > 0) {
      increases.push({ pillar: 'Projects', message: `Documented ${projects.length} project case studies with measurable outcomes.`, boost: +20 });
    } else if (projects.length < 2) {
      reductions.push({ pillar: 'Projects', message: 'Only 1 project documented. Employers typically evaluate 2-3 case studies.', penalty: -10 });
    }
  }

  // ==========================================
  // Pillar 3: Evidence & Link Completeness (Weight: 20%)
  // ==========================================
  let rawEvidenceScore = 0;
  const hasGithubProfile = Boolean(links.github && links.github.toLowerCase().includes('github.com'));
  const hasLinkedinProfile = Boolean(links.linkedin && links.linkedin.toLowerCase().includes('linkedin.com'));
  
  const projectsWithGithub = (projects || []).filter(p => p.githubUrl && p.githubUrl.toLowerCase().includes('github.com')).length;
  const projectsWithDemo = (projects || []).filter(p => p.demoUrl && p.demoUrl.startsWith('http')).length;
  const projectsVerified = (projects || []).filter(p => p.verifiedByUser).length;

  let evidencePoints = 0;
  if (hasGithubProfile) evidencePoints += 20;
  if (hasLinkedinProfile) evidencePoints += 15;
  if (projectsWithGithub > 0) evidencePoints += 25;
  if (projectsWithDemo > 0) evidencePoints += 25;
  if (projectsVerified > 0) evidencePoints += 15;

  rawEvidenceScore = Math.min(100, evidencePoints);

  if (projectsWithGithub > 0 && projectsWithDemo > 0) {
    increases.push({ pillar: 'Evidence', message: 'Projects feature 1-click verifiable GitHub source code and live deployed demos.', boost: +25 });
  } else {
    if (projectsWithGithub === 0) {
      missingEvidence.push('Public GitHub repository URLs on projects for code inspection');
      reductions.push({ pillar: 'Evidence', message: 'No public GitHub repositories attached to projects.', penalty: -15 });
    }
    if (projectsWithDemo === 0) {
      missingEvidence.push('Live interactive deployment links (e.g. Vercel, Netlify, Render)');
      reductions.push({ pillar: 'Evidence', message: 'No live deployed demo links on projects.', penalty: -10 });
    }
  }

  // ==========================================
  // Pillar 4: Resume & Experience (Weight: 15%)
  // ==========================================
  let rawResumeScore = 0;
  const hasResumeText = Boolean(resume && (resume.text || resume.fileName));
  const hasExp = Boolean(experience && experience.length > 0);
  const hasEdu = Boolean(education && education.length > 0);

  let resumePoints = 0;
  if (hasResumeText) resumePoints += 40;
  if (hasExp) resumePoints += 35;
  if (hasEdu) resumePoints += 25;

  rawResumeScore = Math.min(100, resumePoints);

  if (hasResumeText && (hasExp || hasEdu)) {
    increases.push({ pillar: 'Resume', message: 'Structured resume and educational/work background recorded.', boost: +15 });
  } else {
    if (!hasResumeText) missingEvidence.push('Uploaded or pasted resume document in Resume Analyzer');
    if (!hasEdu) missingEvidence.push('Educational degree or coursework credentials in profile');
  }

  // ==========================================
  // Pillar 5: Portfolio Structure & Presentation (Weight: 15%)
  // ==========================================
  let rawStructureScore = 0;
  const hasHeadline = Boolean(basic.headline && basic.headline.trim().length > 5);
  const hasAbout = Boolean(basic.about && basic.about.trim().length > 20);
  const hasPortfolioConfig = Boolean(portfolio && (portfolio.template || portfolio.accentColor));

  let structPoints = 0;
  if (hasHeadline) structPoints += 35;
  if (hasAbout) structPoints += 35;
  if (hasPortfolioConfig) structPoints += 30;

  rawStructureScore = Math.min(100, structPoints);

  if (hasHeadline && hasAbout) {
    increases.push({ pillar: 'Structure', message: 'Clear professional identity and personal engineering narrative.', boost: +15 });
  } else {
    if (!hasHeadline) missingEvidence.push('Professional headline in profile');
    if (!hasAbout) missingEvidence.push('Professional summary / About Me in profile');
  }

  // ==========================================
  // Calculate Weighted Composite Score (0-100)
  // ==========================================
  const weightedSkills = Number((rawSkillScore * 0.25).toFixed(1));
  const weightedProjects = Number((rawProjectScore * 0.25).toFixed(1));
  const weightedEvidence = Number((rawEvidenceScore * 0.20).toFixed(1));
  const weightedResume = Number((rawResumeScore * 0.15).toFixed(1));
  const weightedStructure = Number((rawStructureScore * 0.15).toFixed(1));

  const overallScore = Math.min(100, Math.max(0, Math.round(
    weightedSkills + weightedProjects + weightedEvidence + weightedResume + weightedStructure
  )));

  let statusLabel = 'Getting Started';
  if (overallScore >= 80) statusLabel = 'Strong Readiness';
  else if (overallScore >= 60) statusLabel = 'Solid Progress';
  else if (overallScore >= 40) statusLabel = 'Building Evidence';

  // Prioritized Next Actions
  const nextActions = [];
  if (projects.length < 2) {
    nextActions.push({
      action: 'Document 2 high-impact technical projects with GitHub code and live URLs',
      impact: '+18 pts to overall readiness',
      targetTab: 'projects'
    });
  }
  if (!hasResumeText) {
    nextActions.push({
      action: 'Upload or paste your resume in the Resume Analyzer',
      impact: '+12 pts to overall readiness',
      targetTab: 'resume-analyzer'
    });
  }
  if (matchedSkills.length < benchmarkSkills.length) {
    const missingTop = benchmarkSkills.filter(b => !matchedSkills.includes(b)).slice(0, 2).join(', ');
    nextActions.push({
      action: `Demonstrate competencies in ${missingTop || 'core technologies'} in project descriptions`,
      impact: '+10 pts to role alignment',
      targetTab: 'projects'
    });
  }

  return {
    overallScore,
    statusLabel,
    isPreliminary,
    preliminaryNotice: isPreliminary
      ? 'Note: This readiness score is preliminary because your profile is missing fundamental information (such as documented projects or core skills).'
      : null,
    targetRole,
    calculatedAt: new Date().toISOString(),
    categories: {
      skills: {
        score: rawSkillScore,
        weight: 25,
        weightedScore: weightedSkills,
        title: 'Skills & Role Alignment',
        matchedCount: matchedSkills.length,
        benchmarkTotal: benchmarkSkills.length,
        matchedSkills,
        missingSkills: benchmarkSkills.filter(b => !matchedSkills.includes(b))
      },
      projects: {
        score: rawProjectScore,
        weight: 25,
        weightedScore: weightedProjects,
        title: 'Project Quality & Relevance',
        totalProjects: (projects || []).length
      },
      evidence: {
        score: rawEvidenceScore,
        weight: 20,
        weightedScore: weightedEvidence,
        title: 'Evidence & Link Completeness',
        projectsWithGithub,
        projectsWithDemo,
        projectsVerified
      },
      resume: {
        score: rawResumeScore,
        weight: 15,
        weightedScore: weightedResume,
        title: 'Resume & Experience',
        hasResume: hasResumeText,
        experienceCount: (experience || []).length
      },
      structure: {
        score: rawStructureScore,
        weight: 15,
        weightedScore: weightedStructure,
        title: 'Portfolio Structure & Presentation',
        hasHeadline,
        hasAbout
      }
    },
    increases: increases.slice(0, 5),
    reductions: reductions.slice(0, 5),
    missingEvidence: [...new Set(missingEvidence)].slice(0, 5),
    nextActions: nextActions.slice(0, 3),
    scoringMethodology: 'Deterministic 5-pillar composite model with exact weights (25/25/20/15/15). Fully transparent and reproducible.'
  };
}
