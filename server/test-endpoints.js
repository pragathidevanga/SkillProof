// Comprehensive SkillProof Test & Verification Suite
// Tests all backend services, SSRF safety, scoring calculations, and single-host routes
process.env.NODE_ENV = 'test';

import assert from 'assert';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import app from './server.js';
import { analyzePortfolio } from './services/portfolioService.js';
import { fetchGitHubProjects, handleLinkedInProjectRequest } from './services/projectFetchService.js';
import { extractResumeText, analyzeResumeContent } from './services/resumeService.js';
import { calculateReadinessScore } from './services/readinessService.js';
import { generateAIPrompt, PROMPT_CATEGORIES } from './services/promptService.js';
import { matchSkills, normalizeSkill, skillsMatch } from './services/skillMatcherService.js';
import { generatePortfolioFiles } from './services/portfolioGeneratorService.js';
import { validateSafeUrl } from './utils/ssrf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.resolve(__dirname, '../client/dist');

console.log('====================================================');
console.log('   SKILLPROOF AUTOMATED TEST & VERIFICATION SUITE   ');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${testName}:`, err.message);
    failedTests++;
  }
}

async function runAsyncTest(testName, fn) {
  try {
    await fn();
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${testName}:`, err.message);
    failedTests++;
  }
}

// ----------------------------------------------------
// 1. SSRF & URL Safety Tests
// ----------------------------------------------------
await runAsyncTest('SSRF: Blocks loopback IP (127.0.0.1)', async () => {
  let threw = false;
  try {
    await validateSafeUrl('http://127.0.0.1/admin');
  } catch (e) {
    threw = true;
    assert(e.message.includes('not permitted') || e.message.includes('internal'));
  }
  assert.strictEqual(threw, true, 'Should block 127.0.0.1');
});

await runAsyncTest('SSRF: Blocks private RFC 1918 address (10.0.0.1)', async () => {
  let threw = false;
  try {
    await validateSafeUrl('http://10.0.0.1/status');
  } catch (e) {
    threw = true;
  }
  assert.strictEqual(threw, true, 'Should block 10.0.0.1');
});

await runAsyncTest('SSRF: Blocks link-local / AWS metadata (169.254.169.254)', async () => {
  let threw = false;
  try {
    await validateSafeUrl('http://169.254.169.254/latest/meta-data');
  } catch (e) {
    threw = true;
  }
  assert.strictEqual(threw, true, 'Should block 169.254.169.254');
});

await runAsyncTest('SSRF: Blocks localhost hostname', async () => {
  let threw = false;
  try {
    await validateSafeUrl('http://localhost:5001/secret');
  } catch (e) {
    threw = true;
  }
  assert.strictEqual(threw, true, 'Should block localhost');
});

await runAsyncTest('SSRF: Rejects non-HTTP protocols (ftp://, file://)', async () => {
  let threw = false;
  try {
    await validateSafeUrl('ftp://ftp.example.com/file.txt');
  } catch (e) {
    threw = true;
    assert(e.message.includes('Only HTTP and HTTPS'));
  }
  assert.strictEqual(threw, true, 'Should reject FTP protocol');
});

await runAsyncTest('SSRF: Permits valid public HTTPS URL', async () => {
  // Test valid public IP address (works offline/sandboxed without external DNS)
  const ipResult = await validateSafeUrl('https://93.184.216.34/');
  assert.strictEqual(ipResult, 'https://93.184.216.34/');

  // If environment has outbound DNS, verify domain resolution as well
  try {
    const domainResult = await validateSafeUrl('https://example.com');
    assert.strictEqual(domainResult, 'https://example.com/');
  } catch (err) {
    if (err.message && err.message.includes('Unable to resolve domain')) {
      // Offline/sandboxed environment without internet DNS - acceptable fallback
    } else {
      throw err;
    }
  }
});

// ----------------------------------------------------
// 2. Skill Normalization & Matching Tests
// ----------------------------------------------------
runTest('Skill Normalization: Node synonyms (node, nodejs, node.js)', () => {
  assert(skillsMatch('node', 'Node.js'));
  assert(skillsMatch('nodejs', 'node.js'));
  assert(skillsMatch('ReactJS', 'React'));
  assert(skillsMatch('Postgres', 'PostgreSQL'));
  assert(skillsMatch('Tailwind', 'Tailwind CSS'));
  assert(skillsMatch('TS', 'TypeScript'));
});

runTest('Skill Matcher: Calculates match ratio against Frontend Developer', () => {
  const result = matchSkills({
    targetRole: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'Tailwind CSS'],
    jobDescription: '',
    experienceLevel: 'Entry-Level / Fresher'
  });

  assert(result.matchPercentage >= 50);
  assert(result.matchedSkills.includes('React'));
  assert(result.matchedSkills.includes('JavaScript'));
  assert(result.missingSkills.includes('TypeScript') || result.missingSkills.includes('Responsive Design'));
  assert(result.prioritizedLearningChecklist.length > 0);
  assert(result.suggestedProjects.length > 0);
});

runTest('Skill Matcher: Extracts skills from pasted job description', () => {
  const result = matchSkills({
    targetRole: 'Full Stack Developer',
    skills: ['React', 'Node.js'],
    jobDescription: 'We are seeking an engineer experienced with PostgreSQL, Docker, and Redis.',
    experienceLevel: 'Mid-Level'
  });

  assert(result.extractedJobSkills.includes('Postgresql') || result.extractedJobSkills.includes('PostgreSQL') || result.extractedJobSkills.includes('Docker'));
  assert(result.totalRequired > 10);
});

// ----------------------------------------------------
// 3. Readiness Scoring Engine Tests
// ----------------------------------------------------
runTest('Readiness Scoring: Edge Case - Completely Empty Profile', () => {
  const report = calculateReadinessScore({});
  assert.strictEqual(report.overallScore, 0, 'Score should be 0 for empty profile');
  assert.strictEqual(report.isPreliminary, true, 'Should mark score as preliminary');
  assert(report.preliminaryNotice !== null);
  assert.strictEqual(report.categories.projects.score, 0);
  assert.strictEqual(report.categories.skills.score, 0);
});

runTest('Readiness Scoring: Comprehensive Profile calculation', () => {
  const report = calculateReadinessScore({
    basic: { fullName: 'Alex Morgan', headline: 'Full Stack Engineer', about: 'Building web systems with verified proof.' },
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'PostgreSQL', 'REST APIs', 'Git', 'Docker'],
    projects: [
      {
        title: 'Project Alpha',
        problemStatement: 'Engineers needed automated latency telemetry for distributed microservices.',
        keyOutcomes: 'Reduced latency spikes by 35% across 100k events/min.',
        personalContribution: 'Designed client architecture and WebSocket pipeline.',
        githubUrl: 'https://github.com/alex/alpha',
        demoUrl: 'https://alpha-demo.vercel.app',
        verifiedByUser: true
      },
      {
        title: 'Project Beta',
        problemStatement: 'Teams lacked a lightweight local-first document workspace.',
        keyOutcomes: 'Achieved 98 Lighthouse performance score.',
        githubUrl: 'https://github.com/alex/beta',
        demoUrl: 'https://beta-demo.vercel.app',
        verifiedByUser: true
      }
    ],
    education: [{ degree: 'B.S. in Computer Science', institution: 'University of Washington', year: '2025' }],
    experience: [{ role: 'Developer Intern', organization: 'CloudScale', description: 'Engineered caching layer' }],
    links: { github: 'https://github.com/alexmorgan', linkedin: 'https://linkedin.com/in/alexmorgan-dev' },
    resume: { text: 'Alex Morgan | alex@example.com | Full Stack Developer | React, Node.js, SQL' },
    portfolio: { template: 'modern', accentColor: '#635BFF' }
  });

  assert(report.overallScore >= 75, `Expected score >= 75, got ${report.overallScore}`);
  assert.strictEqual(report.isPreliminary, false);
  assert(report.categories.skills.weightedScore > 0);
  assert(report.categories.projects.weightedScore > 0);
  assert(report.categories.evidence.weightedScore > 0);
  assert(report.categories.resume.weightedScore > 0);
  assert(report.categories.structure.weightedScore > 0);
});

// ----------------------------------------------------
// 4. Resume Analyzer Tests
// ----------------------------------------------------
runTest('Resume Analyzer: Extracts contact info, keywords, and action verbs', () => {
  const sample = `Alex Morgan
alex.morgan@example.com | (555) 234-5678 | San Francisco, CA
GitHub: github.com/alexmorgan | LinkedIn: linkedin.com/in/alexmorgan-dev | Portfolio: alexmorgan.dev

SUMMARY
Full Stack Software Engineer specializing in React, TypeScript, Node.js, and PostgreSQL.

EXPERIENCE
CloudScale Technologies — Software Engineer Intern
- Engineered Redis cache layer for high-traffic endpoints, cutting median response time by 34%.
- Developed reusable React component library, boosting team delivery velocity by 25%.

PROJECTS
MetricsPulse: Telemetry Monitor (React, Node.js, PostgreSQL)
- Built live telemetry system processing 150k events/min with <80ms latency.`;

  const analysis = analyzeResumeContent({ text: sample, targetRole: 'Full Stack Developer' });
  assert.strictEqual(analysis.contactInfo.email, 'alex.morgan@example.com');
  assert.strictEqual(analysis.contactInfo.github, 'https://github.com/alexmorgan');
  assert(analysis.matchedKeywords.includes('react'));
  assert(analysis.matchedKeywords.includes('node.js'));
  assert(analysis.matchedVerbs.includes('engineered'));
  assert(analysis.overallScore >= 70);
  assert(analysis.bulletExamples.length > 0);
});

await runAsyncTest('Resume Extraction: Rejects empty or invalid file safely', async () => {
  let threwEmpty = false;
  try {
    await extractResumeText({ file: { buffer: Buffer.from('') }, text: '' });
  } catch (e) {
    threwEmpty = true;
    assert(e.message.includes('empty'));
  }
  assert.strictEqual(threwEmpty, true);

  let threwUnsupported = false;
  try {
    await extractResumeText({ file: { buffer: Buffer.from('hello'), originalname: 'malware.exe', mimetype: 'application/x-msdownload' } });
  } catch (e) {
    threwUnsupported = true;
    assert(e.message.includes('Unsupported file format'));
  }
  assert.strictEqual(threwUnsupported, true);
});

// ----------------------------------------------------
// 5. Portfolio Analyzer (Content Fallback & 6-Criterion Rubric) Tests
// ----------------------------------------------------
await runAsyncTest('Portfolio Analyzer: Evaluates pasted text content', async () => {
  const result = await analyzePortfolio({
    manualContent: `About Me: Full Stack Software Engineer.
Projects: MetricsPulse (github.com/alexmorgan/metricspulse) - Live demo at metricspulse.vercel.app.
Skills: React, Node.js, Express, PostgreSQL, Git.
Contact: Reach out at alex@example.com.`,
    targetRole: 'Full Stack Developer'
  });

  assert(result.overallScore >= 60);
  assert(result.strengths.length > 0);
  assert(result.detectedSkills.includes('react'));
});

runTest('Portfolio Analyzer: Rubric sum equals exactly 100 with all 6 criteria', async () => {
  const result = await analyzePortfolio({
    manualContent: `Portfolio of Jane Doe. About me. React, TypeScript, Node.js. Project: E-commerce github.com/jane/shop demo.vercel.app`,
    targetRole: 'Frontend Developer'
  });

  const rubric = result.rubric;
  assert(rubric.visualDesign, 'Rubric must contain visualDesign');
  assert(rubric.structureNav, 'Rubric must contain structureNav');
  assert(rubric.projectQuality, 'Rubric must contain projectQuality');
  assert(rubric.technicalSkills, 'Rubric must contain technicalSkills');
  assert(rubric.aboutExperience, 'Rubric must contain aboutExperience');
  assert(rubric.responsivenessLinks, 'Rubric must contain responsivenessLinks');

  assert.strictEqual(rubric.visualDesign.max, 20);
  assert.strictEqual(rubric.structureNav.max, 15);
  assert.strictEqual(rubric.projectQuality.max, 25);
  assert.strictEqual(rubric.technicalSkills.max, 15);
  assert.strictEqual(rubric.aboutExperience.max, 10);
  assert.strictEqual(rubric.responsivenessLinks.max, 15);

  const totalMax = rubric.visualDesign.max + rubric.structureNav.max + rubric.projectQuality.max +
                   rubric.technicalSkills.max + rubric.aboutExperience.max + rubric.responsivenessLinks.max;
  assert.strictEqual(totalMax, 100, 'Sum of all rubric criteria max scores must equal exactly 100');

  // Verify score label format
  assert(result.scoreLabel, 'Must provide scoreLabel');
  const validLabels = ['Needs Improvement', 'Good Foundation', 'Good', 'Very Good', 'Excellent'];
  assert(validLabels.includes(result.scoreLabel), `scoreLabel "${result.scoreLabel}" must be one of ${validLabels.join(', ')}`);
  assert(result.formattedScore.includes('/100 — ' + result.scoreLabel), `formattedScore "${result.formattedScore}" must match pattern [score]/100 — [Label]`);
});

// ----------------------------------------------------
// 5B. Real Project Fetching (GitHub & LinkedIn) Tests
// ----------------------------------------------------
await runAsyncTest('Project Fetcher: GitHub rejects missing inputs', async () => {
  let threw = false;
  try {
    await fetchGitHubProjects({});
  } catch (err) {
    threw = true;
    assert(err.message.includes('required'));
  }
  assert.strictEqual(threw, true);
});

await runAsyncTest('Project Fetcher: GitHub fetches public repository metadata or handles rate limiting gracefully', async () => {
  try {
    const result = await fetchGitHubProjects({ username: 'octocat' });
    assert(result.username === 'octocat');
    assert(Array.isArray(result.projects));
    if (result.projects.length > 0) {
      const p = result.projects[0];
      assert(p.title, 'Project must have a title');
      assert(p.source === 'github', 'Project source must be github');
      assert(p.githubUrl, 'Project must have githubUrl');
    }
  } catch (err) {
    // If rate-limited or offline, verify it is a descriptive error
    assert(err.message.includes('GitHub') || err.message.includes('rate limit') || err.message.includes('network') || err.message.includes('fetch'));
  }
});

await runAsyncTest('Project Fetcher: LinkedIn handles private access transparently', async () => {
  let threw = false;
  try {
    await handleLinkedInProjectRequest({});
  } catch (err) {
    threw = true;
    assert(err.message.includes('required'));
  }
  assert.strictEqual(threw, true);

  const response = await handleLinkedInProjectRequest({ linkedinUrl: 'https://www.linkedin.com/in/alexmorgan' });
  assert.strictEqual(response.status, 'requires_manual_or_oauth');
  assert.strictEqual(response.projects.length, 0, 'Must never invent fictitious projects');
  assert(response.message.includes('OAuth') || response.message.includes('privacy') || response.message.includes('restrict'));
});


// ----------------------------------------------------
// 6. Portfolio Generator & 3 Distinct Templates Tests
// ----------------------------------------------------
['minimal', 'modern', 'creative'].forEach(template => {
  runTest(`Portfolio Generator: Validates template [${template}]`, () => {
    const res = generatePortfolioFiles({
      profile: {
        basic: { fullName: 'Alex Morgan', headline: 'Full Stack Engineer', about: 'Clean code enthusiast' },
        skills: ['React', 'TypeScript', 'Node.js'],
        links: { github: 'https://github.com/alex' }
      },
      projects: [{ title: 'MetricsPulse', description: 'API health monitor', technologies: ['React', 'Node.js'] }],
      config: { template, accentColor: '#635BFF' }
    });

    assert.strictEqual(res.template, template);
    assert(res.files['index.html'].includes('Alex Morgan'));
    assert(res.files['styles.css'].length > 100);
    assert(res.files['script.js'].length > 10);
    assert(res.files['README.md'].includes('How to Run Locally'));
    assert(res.standalonePreviewHtml.includes('Alex Morgan'));
  });
});

runTest('Portfolio Generator: Quality, Personalization & Zero Leaks of Reference Portfolio', () => {
  const customUser = {
    basic: {
      fullName: 'Samantha Vance',
      headline: 'Cloud Systems & Backend Engineer',
      about: 'Designing high-throughput distributed microservices.',
      email: 'samantha@example.dev',
      location: 'Seattle, WA'
    },
    targetRole: 'Backend Developer',
    skills: ['Go', 'Node.js', 'Docker', 'PostgreSQL', 'Redis'],
    softSkills: ['System Design', 'Incident Response'],
    experience: [
      { role: 'Backend Intern', organization: 'Apex Cloud', startDate: '2024', endDate: '2025', description: 'Built Redis cache pipeline.' }
    ],
    education: [
      { degree: 'B.S. Software Engineering', institution: 'State University', year: '2025' }
    ],
    certifications: [
      { title: 'AWS Solutions Architect Associate', issuer: 'AWS', year: '2024' }
    ],
    links: { github: 'https://github.com/samanthavance', linkedin: 'https://linkedin.com/in/samanthavance' }
  };

  const customProjects = [
    {
      title: 'Distributed Queue Engine',
      category: 'Backend System',
      problemStatement: 'Message queues were losing events during failovers.',
      description: 'Built distributed Raft consensus queue with automated replication.',
      keyOutcomes: 'Processed 50,000 msgs/sec with zero message drop.',
      technologies: ['Go', 'Docker', 'gRPC'],
      githubUrl: 'https://github.com/samanthavance/queue-engine',
      demoUrl: 'https://queue-demo.example.dev',
      featured: true
    }
  ];

  const generated = generatePortfolioFiles({
    profile: customUser,
    projects: customProjects,
    config: { template: 'modern', accentColor: '#0D9488' }
  });

  const html = generated.files['index.html'];
  const css = generated.files['styles.css'];

  // Verify personalization
  assert(html.includes('Samantha Vance'), 'Must include personalized user name');
  assert(html.includes('Cloud Systems &amp; Backend Engineer') || html.includes('Cloud Systems'), 'Must include personalized headline');
  assert(html.includes('Distributed Queue Engine'), 'Must include user project');
  assert(html.includes('50,000 msgs/sec'), 'Must include user impact outcomes');
  assert(html.includes('AWS Solutions Architect'), 'Must include certifications');
  assert(html.includes('https://github.com/samanthavance/queue-engine'), 'Must include real project repository link');
  assert(html.includes('https://queue-demo.example.dev'), 'Must include real demo link');

  // Verify zero hardcoding of reference URL or external personal details
  assert(!html.includes('pragathi-br.vercel.app'), 'Must NEVER include reference portfolio URL in generated website');
  assert(!html.includes('Pragathi'), 'Must NEVER copy reference personal name into user portfolio');

  // Verify visual polish & responsive assets
  assert(css.includes('@media (max-width:'), 'CSS must include responsive media queries');
  assert(html.includes('<svg'), 'Must include crisp self-contained SVG icons');
  assert(css.includes('--accent: #0D9488'), 'CSS must use selected accent color');
});

// ----------------------------------------------------
// 6B. LocalStorage Per-User Isolation Simulation Tests
// ----------------------------------------------------
runTest('LocalStorage Isolation: Multi-user data separation and role integrity', () => {
  // Simulated browser LocalStorage map
  const mockStorage = new Map();

  function getStableUserId(email, name) {
    if (email && email.trim()) {
      return 'u_' + email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    if (name && name.trim()) {
      return 'u_' + name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    return 'u_user_' + Math.random().toString(36).substring(2, 9);
  }

  function getUserScopedKey(baseKey, userId) {
    return `${baseKey}_${userId}`;
  }

  // 1. Simulate User A (Alice Cooper, Frontend Developer)
  const userA_email = 'alice@example.com';
  const userA_id = getStableUserId(userA_email, 'Alice Cooper');
  const userA_profile = {
    basic: { fullName: 'Alice Cooper', email: userA_email },
    targetRole: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'CSS3']
  };
  const userA_projects = [{ title: 'Alice Design System', technologies: ['React', 'Storybook'] }];

  mockStorage.set(getUserScopedKey('skillproof_profile_v1', userA_id), JSON.stringify(userA_profile));
  mockStorage.set(getUserScopedKey('skillproof_projects_v1', userA_id), JSON.stringify(userA_projects));

  // 2. Simulate User B (Bob Chen, Backend Developer)
  const userB_email = 'bob@example.com';
  const userB_id = getStableUserId(userB_email, 'Bob Chen');
  const userB_profile = {
    basic: { fullName: 'Bob Chen', email: userB_email },
    targetRole: 'Backend Developer',
    skills: ['Python', 'PostgreSQL', 'FastAPI']
  };
  const userB_projects = [{ title: 'Bob Microservice', technologies: ['Python', 'Docker'] }];

  mockStorage.set(getUserScopedKey('skillproof_profile_v1', userB_id), JSON.stringify(userB_profile));
  mockStorage.set(getUserScopedKey('skillproof_projects_v1', userB_id), JSON.stringify(userB_projects));

  // 3. Verify User A isolation
  const retrievedProfileA = JSON.parse(mockStorage.get(getUserScopedKey('skillproof_profile_v1', userA_id)));
  const retrievedProjectsA = JSON.parse(mockStorage.get(getUserScopedKey('skillproof_projects_v1', userA_id)));
  assert.strictEqual(retrievedProfileA.basic.fullName, 'Alice Cooper');
  assert.strictEqual(retrievedProfileA.targetRole, 'Frontend Developer');
  assert.strictEqual(retrievedProjectsA[0].title, 'Alice Design System');
  assert.strictEqual(retrievedProjectsA.some(p => p.title.includes('Bob')), false, 'User A must never see User B projects');

  // 4. Verify User B isolation
  const retrievedProfileB = JSON.parse(mockStorage.get(getUserScopedKey('skillproof_profile_v1', userB_id)));
  const retrievedProjectsB = JSON.parse(mockStorage.get(getUserScopedKey('skillproof_projects_v1', userB_id)));
  assert.strictEqual(retrievedProfileB.basic.fullName, 'Bob Chen');
  assert.strictEqual(retrievedProfileB.targetRole, 'Backend Developer');
  assert.strictEqual(retrievedProjectsB[0].title, 'Bob Microservice');
  assert.strictEqual(retrievedProjectsB.some(p => p.title.includes('Alice')), false, 'User B must never see User A projects');

  // 5. Verify modifying User B does NOT affect User A
  retrievedProfileB.targetRole = 'Senior Backend Architect';
  mockStorage.set(getUserScopedKey('skillproof_profile_v1', userB_id), JSON.stringify(retrievedProfileB));

  const reloadedProfileA = JSON.parse(mockStorage.get(getUserScopedKey('skillproof_profile_v1', userA_id)));
  assert.strictEqual(reloadedProfileA.targetRole, 'Frontend Developer', 'User A role must remain completely unchanged');
});

// ----------------------------------------------------
// 7. AI Prompt Studio: All 12 Categories Tests
// ----------------------------------------------------
runTest('AI Prompt Studio: Generates prompts for all 12 categories for Google Antigravity', () => {
  assert.strictEqual(PROMPT_CATEGORIES.length, 12, 'Must have 12 prompt categories');
  PROMPT_CATEGORIES.forEach(cat => {
    const p = generateAIPrompt({
      category: cat.id,
      profileData: { basic: { fullName: 'Alex Morgan' }, targetRole: 'Full Stack Developer', skills: ['React'] },
      customOptions: { toolTarget: 'Google Antigravity', projectName: 'TestProject' }
    });
    assert(p.promptContent.length > 100);
    assert(p.promptContent.includes('Google Antigravity'));
  });
});

runTest('AI Prompt Studio: Generates prompts for ChatGPT', () => {
  const p = generateAIPrompt({
    category: 'portfolio_generation',
    profileData: { basic: { fullName: 'Alex Morgan' } },
    customOptions: { toolTarget: 'ChatGPT' }
  });
  assert(p.promptContent.includes('ChatGPT'));
});

// ----------------------------------------------------
// 8. Single-Host Deployment & Production Endpoints Verification
// ----------------------------------------------------
runTest('Single-Host Deployment: client/dist exists and has index.html', () => {
  assert(fs.existsSync(CLIENT_DIST), 'client/dist directory must exist');
  const indexPath = path.join(CLIENT_DIST, 'index.html');
  assert(fs.existsSync(indexPath), 'client/dist/index.html must exist for single-host serving');
  const htmlContent = fs.readFileSync(indexPath, 'utf-8');
  assert(htmlContent.includes('<div id="root">'), 'index.html must contain React root container');
});

runTest('Production Server: GET /api/health route handler returns status ok', () => {
  const healthLayer = app._router.stack.find(l => l.route && l.route.path === '/api/health');
  assert(healthLayer, 'App must register /api/health route');
  assert.strictEqual(healthLayer.route.methods.get, true, '/api/health must handle GET');

  let sentJson = null;
  const req = {};
  const res = {
    json: (data) => { sentJson = data; }
  };
  healthLayer.route.stack[0].handle(req, res);
  assert(sentJson, 'Health endpoint must respond with JSON');
  assert.strictEqual(sentJson.success, true);
  assert.strictEqual(sentJson.data.status, 'ok');
  assert.strictEqual(sentJson.data.service, 'SkillProof API');
  assert.strictEqual(sentJson.data.singleHostEnabled, true);
});

runTest('Production Server: Single-Host SPA fallback and routing configuration (prevents 404 on refresh)', () => {
  // 1. Verify unmatched /api/* returns JSON 404
  const apiCatchLayer = app._router.stack.find(l => l.route && l.route.path === '/api/*');
  assert(apiCatchLayer, 'Must have catch-all 404 for /api/*');

  let statusCode = null;
  let statusJson = null;
  const mockApiRes = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => { statusJson = data; }
      };
    }
  };
  apiCatchLayer.handle({ method: 'GET', url: '/api/missing-endpoint' }, mockApiRes);
  assert.strictEqual(statusCode, 404, 'Unmatched /api/* must return HTTP 404');
  assert.strictEqual(statusJson.success, false);

  // 2. Verify static assets middleware is mounted
  const staticLayer = app._router.stack.find(l => l.name === 'serveStatic');
  assert(staticLayer, 'Must mount express.static for client/dist');

  // 3. Verify SPA fallback for frontend routes (like /projects, /portfolio-analyzer)
  const spaCatchLayer = app._router.stack.find(l => l.route && l.route.path === '*');
  assert(spaCatchLayer, 'Must have SPA wildcard fallback for all frontend routes');
  assert.strictEqual(spaCatchLayer.route.methods.get, true, 'SPA fallback must respond to GET');

  let sentFile = null;
  const mockSpaRes = {
    sendFile: (filepath) => { sentFile = filepath; }
  };
  spaCatchLayer.handle({ method: 'GET', url: '/projects' }, mockSpaRes);
  assert(sentFile, 'Must send file for SPA routes');
  assert(sentFile.endsWith('index.html'), 'Must send index.html for SPA frontend routes (no 404)');
  assert(fs.existsSync(sentFile), 'The target index.html must exist on disk');
});

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
