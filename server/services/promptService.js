// SkillProof AI Prompt Generation Engine
// Generates production-grade, highly structured, tailored prompts based on actual user profile data and target specifications
// Supports all 12 prompt categories for Google Antigravity and ChatGPT

export const PROMPT_CATEGORIES = [
  { id: 'portfolio_generation', label: 'Portfolio website generation', desc: 'Generate a complete, verified portfolio specification for modern web frameworks.' },
  { id: 'portfolio_improvement', label: 'Portfolio improvement', desc: 'Audit and elevate an existing portfolio to eliminate fluff and amplify evidence.' },
  { id: 'project_development', label: 'Project development', desc: 'Prompt to build a complete full-stack project demonstrating target skills.' },
  { id: 'resume_improvement', label: 'Resume improvement', desc: 'Transform passive resume bullets into quantifiable action-oriented achievements.' },
  { id: 'learning_plan', label: 'Job-role skill learning plan', desc: 'Structured, multi-week roadmap to master missing competencies.' },
  { id: 'readme_generation', label: 'GitHub README generation', desc: 'Professional, employer-ready GitHub README for an existing project.' },
  { id: 'project_documentation', label: 'Project documentation', desc: 'Architecture decision records (ADRs), API docs, and setup instructions.' },
  { id: 'ui_ux_redesign', label: 'UI/UX redesign', desc: 'Modernize UI aesthetics with Linear/Stripe design systems, accessibility, and micro-interactions.' },
  { id: 'bug_fixing', label: 'Bug fixing and debugging', desc: 'Systematic debugging plan for complex bugs, race conditions, or memory leaks.' },
  { id: 'code_explanation', label: 'Code explanation', desc: 'Deep-dive technical breakdown of complex algorithms, architectures, or designs.' },
  { id: 'interview_preparation', label: 'Interview preparation', desc: 'Technical questions, system design mocks, and STAR-format behavioral prompts.' },
  { id: 'custom_prompt', label: 'Custom prompt', desc: 'Highly personalized prompt structured around your custom specifications.' }
];

export function generateAIPrompt({
  mode = 'portfolio_generation',
  category = '',
  profileData = {},
  analysisData = {},
  customOptions = {}
}) {
  const effectiveCategory = category || mode || 'portfolio_generation';
  const {
    basic = {},
    skills = [],
    targetRole = 'Full Stack Developer',
    projects = [],
    education = [],
    experience = [],
    links = {}
  } = profileData;

  const {
    toolTarget = 'Google Antigravity', // 'Google Antigravity' | 'ChatGPT'
    projectName = '',
    projectDescription = '',
    technologyStack = '',
    targetAudience = '',
    designStyle = 'Clean SaaS Minimalist (Linear & Stripe inspired)',
    desiredFeatures = '',
    constraints = '',
    additionalInstructions = ''
  } = customOptions;

  const candidateName = basic.fullName || 'Engineering Candidate';
  const headline = basic.headline || `${targetRole} specializing in modern software development`;
  const skillList = skills.map(s => (typeof s === 'string' ? s : s.name)).filter(Boolean);
  const formattedSkills = skillList.length > 0 ? skillList.join(', ') : 'JavaScript, React, Node.js, Git, REST APIs, SQL';

  // Format projects
  const formattedProjects = projects.length > 0
    ? projects.map((p, idx) => `### Project ${idx + 1}: ${p.title || 'Untitled Project'}
- **Category:** ${p.category || 'Web Application'}
- **Problem Statement:** ${p.problemStatement || 'Not specified'}
- **Description:** ${p.description || 'Not specified'}
- **Technologies:** ${(p.technologies || []).join(', ') || 'Modern Web Stack'}
- **Key Outcomes:** ${p.keyOutcomes || 'Demonstrated architecture stability and performance'}
- **GitHub URL:** ${p.githubUrl || 'N/A'}
- **Live Demo:** ${p.demoUrl || 'N/A'}`).join('\n\n')
    : 'No projects supplied yet. Use modern full-stack case studies with realistic metrics.';

  let promptContent = '';
  const aiPrefix = toolTarget === 'Google Antigravity'
    ? `You are paired with a senior software architect in Google Antigravity. Write production-ready, testable, fully implemented code without skipping implementation details.`
    : `Act as a senior software engineer and technical hiring manager in ChatGPT. Provide concrete, actionable, high-quality deliverables with clean formatting.`;

  switch (effectiveCategory) {
    case 'portfolio_generation':
    case 'new_portfolio':
      promptContent = `${aiPrefix}

# TASK: Build a Production-Grade Developer Portfolio Website

## Candidate Context
- **Candidate Name:** ${candidateName}
- **Professional Headline:** ${headline}
- **Target Role:** ${targetRole}
- **Primary Skills:** ${formattedSkills}
- **Design Aesthetic:** ${designStyle}
- **Target AI Platform:** ${toolTarget}

## Documented Projects to Feature
${formattedProjects}

## Specifications & Requirements
1. **Architecture:** Single-page responsive web application using clean semantic HTML5, modern CSS, and lightweight vanilla JS or React.
2. **Key Sections:**
   - Hero: Strong headline, verified proof badge, quick link to GitHub (${links.github || 'github.com'}), and contact CTA.
   - Project Showcase: Card-based layout with problem statement, tech stack badges, GitHub repo link, and live demo link.
   - Technical Skills: Clean categorization (Languages, Frameworks, Tools, Databases).
   - Experience / Journey: Chronological timeline with impact bullet points.
   - Contact: Simple, accessible contact form and email link.
3. **Design Requirements:**
   - Light theme with restrained violet accent (#635BFF).
   - Generous whitespace, subtle 1px borders (#E2E8F0), crisp typography (Inter).
   - Zero layout shifts, full keyboard accessibility (WCAG AA).
4. **Constraints:** ${constraints || 'Do not use heavy external frameworks or unnecessary runtime dependencies. Keep code modular and readable.'}

${additionalInstructions ? `## Additional Instructions\n${additionalInstructions}` : ''}`;
      break;

    case 'portfolio_improvement':
    case 'improve_portfolio':
      promptContent = `${aiPrefix}

# TASK: Comprehensive Portfolio Audit and Enhancement Plan

## Candidate & Portfolio Context
- **Target Role:** ${targetRole}
- **Candidate:** ${candidateName} (${headline})
- **Current Skills:** ${formattedSkills}
- **Aesthetic Direction:** ${designStyle}

## Current Projects
${formattedProjects}

## Objectives
1. **Fluff Elimination:** Remove buzzwords, generic summaries, and self-reported claims that lack verifiable evidence.
2. **Evidence Amplification:** Rewrite project case studies to follow the Problem-Solution-Tech-Outcome formula with quantified impact.
3. **ATS & Recruiter Alignment:** Align technical vocabulary with current industry expectations for ${targetRole}.
4. **Call to Action:** Elevate GitHub source code and live demo links to prominent positions.

Please provide a section-by-section before/after critique and ready-to-paste copy improvements.`;
      break;

    case 'project_development':
      promptContent = `${aiPrefix}

# TASK: End-to-End Technical Project Specification

## Project Details
- **Project Name:** ${projectName || 'Next-Generation Full-Stack Application'}
- **Target Job Role:** ${targetRole}
- **Tech Stack:** ${technologyStack || formattedSkills}
- **Core Concept & Description:** ${projectDescription || 'A high-impact web application solving a real developer or business pain point.'}
- **Desired Features:** ${desiredFeatures || 'Authentication, real-time data sync, persistent storage, responsive dashboard, automated tests.'}
- **Constraints:** ${constraints || 'Local-first architecture or zero-cost cloud hosting compatibility.'}

## Deliverables Required
1. **Architecture Blueprint:** Folder structure, database/storage schema, and REST API endpoint specifications.
2. **Core Implementation:** Step-by-step code implementation for key modules with error handling and input validation.
3. **Testing Strategy:** Unit and integration test specs verifying critical paths.
4. **Documentation:** README with setup instructions and architecture decision notes.`;
      break;

    case 'resume_improvement':
      promptContent = `${aiPrefix}

# TASK: High-Impact Resume Bullet Point & Keyword Optimization

## Candidate Profile
- **Target Role:** ${targetRole}
- **Candidate:** ${candidateName}
- **Technical Skills:** ${formattedSkills}

## Goal
Transform the following technical projects and experiences into action-oriented, metric-driven resume bullets using the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]".

## Current Projects to Translate
${formattedProjects}

## Requirements
1. Generate 3-4 compelling bullet points for each project.
2. Incorporate high-signal keywords for ${targetRole} (e.g. latency, throughput, test coverage, scalability, uptime).
3. Ensure every bullet is grounded in real engineering actions without fabricating fictional company metrics.`;
      break;

    case 'learning_plan':
      promptContent = `${aiPrefix}

# TASK: 6-Week High-Yield Learning Roadmap for ${targetRole}

## Learner Context
- **Current Skills:** ${formattedSkills}
- **Target Role:** ${targetRole}
- **Available Time:** 10-15 hours per week

## Learning Objectives
Create a structured 6-week curriculum designed to bridge the gap from current competencies to job-ready proficiency in ${targetRole}.

For each week, provide:
1. **Core Topic:** Specific tools, concepts, and architectural patterns.
2. **Hands-On Mini Project:** A small, verifiable module with code deliverables.
3. **Recommended Resources:** Free, high-quality documentation, tutorials, or open-source repositories.
4. **Self-Assessment Checkpoint:** 3 technical interview questions to test mastery.`;
      break;

    case 'readme_generation':
      promptContent = `${aiPrefix}

# TASK: Generate a Professional, Recruiter-Ready GitHub README.md

## Project Metadata
- **Project Name:** ${projectName || (projects[0]?.title || 'Featured Project')}
- **Description:** ${projectDescription || (projects[0]?.description || 'A modern web application built with clean architecture.')}
- **Tech Stack:** ${technologyStack || ((projects[0]?.technologies || []).join(', ') || formattedSkills)}
- **Key Outcomes:** ${projects[0]?.keyOutcomes || 'Optimized performance and complete test coverage.'}

## README Requirements
1. Hero banner with project badges (License, Tech, Status).
2. "Why I Built This" / Problem Statement section explaining real engineering motivation.
3. High-level architecture diagram or flow description.
4. Key features with clean bullet points.
5. Quick Start / Installation instructions (npm install, environment variables, npm run dev).
6. Performance & Testing highlights.
7. Author & Contact section linking to GitHub and LinkedIn.`;
      break;

    case 'project_documentation':
      promptContent = `${aiPrefix}

# TASK: Technical Architecture & API Documentation

## Target System
- **System Name:** ${projectName || 'Core Service'}
- **Tech Stack:** ${technologyStack || formattedSkills}
- **Overview:** ${projectDescription || 'A robust backend and client service architecture.'}

## Required Sections
1. **Architecture Decision Record (ADR 001):** Rationale for chosen data storage, communication protocols, and framework choices.
2. **API Specification:** Endpoint paths, HTTP methods, request payloads, response codes, and error formats in standard OpenAPI/Swagger markdown.
3. **Data Flow & State Management:** How data moves from user interaction to persistence.
4. **Deployment & Environment:** Environment variables and production considerations.`;
      break;

    case 'ui_ux_redesign':
      promptContent = `${aiPrefix}

# TASK: UI/UX Modernization & Design System Upgrade

## Target Product
- **Product Name:** ${projectName || 'Developer Dashboard'}
- **Current Aesthetic:** Basic utilitarian UI
- **Target Aesthetic:** ${designStyle}
- **Design Tokens:** Violet primary accent (#635BFF), clean neutrals (#F8F9FC, #E2E8F0, #0F172A), Inter font.

## Deliverables
1. **Component Hierarchy:** Card containers, buttons (primary, secondary, ghost, destructive), badges, and form controls.
2. **CSS Variables & Utility Classes:** Production-ready modern CSS code.
3. **Responsive Layout Guidelines:** Mobile breakpoint (375px), tablet (768px), desktop (1280px).
4. **Micro-Interactions & Accessibility:** Subtle hover transitions, focus-visible outlines, and ARIA roles.`;
      break;

    case 'bug_fixing':
      promptContent = `${aiPrefix}

# TASK: Root Cause Analysis & Systematic Debugging Plan

## System Context
- **Stack:** ${technologyStack || formattedSkills}
- **Issue Description:** ${projectDescription || 'Unexpected behavior or error state encountered in component/service.'}
- **Constraints:** ${constraints || 'Must preserve existing state and avoid performance regressions.'}

## Step-by-Step Instructions
1. Formulate 3 plausible root cause hypotheses based on the symptoms.
2. Outline exact reproduction and logging steps to isolate the fault.
3. Provide a defensive, minimal fix with regression test coverage.
4. Detail long-term prevention strategies (linting rules, type boundaries, or automated tests).`;
      break;

    case 'code_explanation':
      promptContent = `${aiPrefix}

# TASK: Technical Deep-Dive Code Explanation

## Audience
- **Target Audience:** Engineering interviewers or peer code reviewers
- **Focus Area:** Clean architecture, performance trade-offs, and Big-O time/space complexity
- **Topic / Code Snippet Context:** ${projectDescription || 'Core business logic or state machine utility.'}

## Breakdown Required
1. High-level conceptual intuition (analogy or executive summary).
2. Line-by-line or block-by-block structural walkthrough.
3. Algorithmic complexity analysis (Time & Space).
4. Edge cases, failure modes, and potential optimizations.`;
      break;

    case 'interview_preparation':
      promptContent = `${aiPrefix}

# TASK: Technical Interview Preparation & Mock Drill for ${targetRole}

## Candidate Profile
- **Candidate:** ${candidateName}
- **Target Role:** ${targetRole}
- **Skills:** ${formattedSkills}

## Interview Structure
Please generate:
1. **5 Role-Specific Coding / Conceptual Questions:** Focusing on real-world problems in ${targetRole} (not purely leetcode trivia).
2. **1 System Design Scenario:** Practical architecture question relevant to entry/mid-level engineering.
3. **3 Behavioral Questions in STAR Format:** Questions designed to showcase leadership, conflict resolution, and technical problem-solving, with suggested frameworks tailored to the candidate's projects.`;
      break;

    case 'custom_prompt':
    default:
      promptContent = `${aiPrefix}

# TASK: Customized Engineering Specification

## Context
- **Candidate:** ${candidateName}
- **Target Role:** ${targetRole}
- **Skills:** ${formattedSkills}
- **Target AI:** ${toolTarget}

## Custom Objectives
${projectDescription || 'Design and implement a robust software solution.'}

## Technical Requirements
- **Stack:** ${technologyStack || formattedSkills}
- **Style:** ${designStyle}
- **Constraints:** ${constraints || 'Clean code, fully functional, no missing implementations.'}

${additionalInstructions ? `## Additional Instructions\n${additionalInstructions}` : ''}`;
      break;
  }

  return {
    category: effectiveCategory,
    targetRole,
    toolTarget,
    generatorType: 'SkillProof Structured Prompt Engine',
    generatedAt: new Date().toISOString(),
    promptContent
  };
}
