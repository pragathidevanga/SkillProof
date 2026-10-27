import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { analyzePortfolio } from './services/portfolioService.js';
import { extractResumeText, analyzeResumeContent } from './services/resumeService.js';
import { calculateReadinessScore } from './services/readinessService.js';
import { generateAIPrompt, PROMPT_CATEGORIES } from './services/promptService.js';
import { matchSkills, ROLE_SKILL_LIBRARIES } from './services/skillMatcherService.js';
import { generatePortfolioFiles } from './services/portfolioGeneratorService.js';
import { fetchGitHubProjects, handleLinkedInProjectRequest } from './services/projectFetchService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.resolve(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5001;

// Multer memory storage for safe, in-memory resume parsing (capped at 5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'SkillProof API',
      version: '1.1.0',
      singleHostEnabled: fs.existsSync(CLIENT_DIST),
      timestamp: new Date().toISOString()
    },
    message: 'SkillProof API is healthy and running.'
  });
});

// 2. Portfolio Analysis Endpoint (Supports both paths)
const handlePortfolioAnalysis = async (req, res) => {
  try {
    const { url, manualContent, targetRole, notes } = req.body || {};
    if (!url && !manualContent) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either a portfolio website URL or paste your portfolio content manually.'
      });
    }

    const result = await analyzePortfolio({ url, manualContent, targetRole, notes });
    res.json({
      success: true,
      data: result,
      message: 'Portfolio analysis completed successfully.'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'An error occurred while analyzing the portfolio.'
    });
  }
};

app.post('/api/portfolio/analyze', handlePortfolioAnalysis);
app.post('/api/analyze/portfolio', handlePortfolioAnalysis);

// 3. Portfolio Generation Endpoint (Generates static website bundle)
app.post('/api/portfolio/generate', (req, res) => {
  try {
    const { profile = {}, projects = [], config = {} } = req.body || {};
    const generated = generatePortfolioFiles({ profile, projects, config });

    res.json({
      success: true,
      data: generated,
      message: `Generated ${generated.template} portfolio website files successfully.`
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to generate portfolio files.'
    });
  }
});

// 4. Resume Analysis Endpoint (Handles File Upload or Raw Text, supports both paths)
const handleResumeAnalysis = async (req, res) => {
  try {
    const textFromPayload = req.body ? req.body.resumeText : null;
    const targetRole = (req.body && req.body.targetRole) ? req.body.targetRole : 'Full Stack Developer';
    const file = req.file;

    const extractedText = await extractResumeText({ file, text: textFromPayload });
    const analysis = analyzeResumeContent({ text: extractedText, targetRole });

    res.json({
      success: true,
      extractedText,
      data: analysis,
      message: 'Resume analyzed successfully.'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to analyze resume content.'
    });
  }
};

app.post('/api/resume/analyze', upload.single('resumeFile'), handleResumeAnalysis);
app.post('/api/analyze/resume', upload.single('resumeFile'), handleResumeAnalysis);

// 5. Skill Matching & Gap Analysis Endpoint
app.post('/api/skills/match', (req, res) => {
  try {
    const { targetRole, skills, jobDescription, experienceLevel } = req.body || {};
    const matchReport = matchSkills({
      targetRole,
      skills,
      jobDescription,
      experienceLevel
    });

    res.json({
      success: true,
      data: matchReport,
      message: 'Skill matching analysis completed successfully.'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to perform skill matching.'
    });
  }
});

// Helper endpoint to get all supported benchmark roles
app.get('/api/skills/roles', (req, res) => {
  res.json({
    success: true,
    data: Object.keys(ROLE_SKILL_LIBRARIES).map(k => ({
      key: k,
      title: ROLE_SKILL_LIBRARIES[k].title,
      coreSkills: ROLE_SKILL_LIBRARIES[k].coreSkills
    })),
    message: 'Roles retrieved successfully.'
  });
});

// 6. Readiness Score Calculation Endpoint
app.post('/api/readiness/score', (req, res) => {
  try {
    const profileData = req.body || {};
    const scoreReport = calculateReadinessScore(profileData);
    res.json({
      success: true,
      data: scoreReport,
      message: 'Readiness score calculated successfully.'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to calculate readiness score.'
    });
  }
});

// 7. AI Prompt Generation Endpoint
app.post('/api/prompts/generate', (req, res) => {
  try {
    const { mode, category, profileData, analysisData, customOptions } = req.body || {};
    const promptReport = generateAIPrompt({ mode, category, profileData, analysisData, customOptions });
    res.json({
      success: true,
      data: promptReport,
      message: 'AI Prompt generated successfully.'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to generate prompt.'
    });
  }
});

// Get prompt categories
app.get('/api/prompts/categories', (req, res) => {
  res.json({
    success: true,
    data: PROMPT_CATEGORIES,
    message: 'Prompt categories retrieved successfully.'
  });
});

// 8. Fetch Real Projects from GitHub & LinkedIn
app.post('/api/projects/fetch-github', async (req, res) => {
  try {
    const { githubUrl, username } = req.body || {};
    const result = await fetchGitHubProjects({ githubUrl, username });
    res.json({
      success: true,
      data: result,
      message: `Successfully retrieved ${result.totalRetrieved} real repositories from GitHub.`
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to fetch repositories from GitHub.'
    });
  }
});

app.post('/api/projects/fetch-linkedin', (req, res) => {
  try {
    const { linkedinUrl } = req.body || {};
    const result = handleLinkedInProjectRequest({ linkedinUrl });
    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to process LinkedIn request.'
    });
  }
});

// ----------------------------------------------------
// SINGLE-HOST DEPLOYMENT CONFIGURATION
// ----------------------------------------------------

// 1. Any unmatched request under /api/* must return JSON 404
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint '${req.method} ${req.url}' not found.`
  });
});

// 2. Serve static assets from client/dist
app.use(express.static(CLIENT_DIST));

// 3. SPA fallback for all frontend GET routes (ensures refresh on any route works without 404)
app.get('*', (req, res) => {
  const indexPath = path.join(CLIENT_DIST, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>SkillProof API</title></head>
        <body style="font-family:sans-serif; max-width:600px; margin:50px auto; padding:20px; line-height:1.6;">
          <h2>SkillProof API Service is Running</h2>
          <p>The Express backend is live. To enable single-host public deployment, compile the React frontend:</p>
          <pre style="background:#f4f4f4; padding:10px; border-radius:6px;">npm run build</pre>
          <p>Health endpoint: <a href="/api/health">/api/health</a></p>
        </body>
      </html>
    `);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred.'
  });
});

// Start listening only if executed directly as main script (e.g. `node server.js`), not when imported by test suites
const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  app.listen(PORT, () => {
    console.log(`[SkillProof] Single-Host Server running smoothly on http://localhost:${PORT}`);
    if (fs.existsSync(CLIENT_DIST)) {
      console.log(`[SkillProof] Serving production React frontend from: ${CLIENT_DIST}`);
    } else {
      console.log(`[SkillProof] Notice: client/dist not found. Run 'npm run build' to serve frontend from this server.`);
    }
  });
}

export default app;
