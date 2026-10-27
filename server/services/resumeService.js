import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const ROLE_KEYWORDS = {
  'frontend developer': ['javascript', 'typescript', 'react', 'next.js', 'html5', 'css3', 'tailwind', 'redux', 'webpack', 'vite', 'ui/ux', 'responsive design', 'web vitals', 'jest', 'cypress', 'accessibility', 'wcag', 'rest api', 'git'],
  'full stack developer': ['javascript', 'typescript', 'react', 'node.js', 'express', 'postgresql', 'mongodb', 'docker', 'rest api', 'graphql', 'aws', 'ci/cd', 'git', 'microservices', 'redis', 'tailwind', 'sql'],
  'backend developer': ['node.js', 'express', 'python', 'django', 'fastapi', 'java', 'spring boot', 'go', 'postgresql', 'mongodb', 'redis', 'kafka', 'docker', 'kubernetes', 'rest api', 'microservices', 'git', 'sql'],
  'data analyst': ['sql', 'python', 'pandas', 'numpy', 'tableau', 'power bi', 'excel', 'data visualization', 'etl', 'statistics', 'a/b testing', 'r', 'data cleaning', 'dashboards', 'reporting'],
  'machine learning engineer': ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'deep learning', 'nlp', 'computer vision', 'mlops', 'pandas', 'numpy', 'docker', 'model evaluation', 'huggingface', 'git'],
  'ai/ml developer': ['python', 'langchain', 'openai', 'llm', 'rag', 'vector database', 'pinecone', 'pytorch', 'huggingface', 'fastapi', 'docker', 'prompt engineering'],
  'software developer': ['git', 'data structures', 'algorithms', 'oop', 'unit testing', 'ci/cd', 'agile', 'scrum', 'debugging', 'system design', 'rest api', 'sql']
};

const ACTION_VERBS = [
  'engineered', 'architected', 'developed', 'deployed', 'implemented', 'designed',
  'optimized', 'reduced', 'increased', 'scaled', 'automated', 'collaborated',
  'built', 'refactored', 'migrated', 'streamlined', 'spearheaded', 'orchestrated'
];

/**
 * Extracts raw text from uploaded PDF/DOCX buffers or validated text payloads.
 * Handles empty, password-protected, corrupted, or unsupported formats safely.
 */
export async function extractResumeText({ file, text }) {
  if (text && typeof text === 'string' && text.trim().length > 0) {
    return text.trim();
  }

  if (!file) {
    throw new Error('No resume file or text content was provided.');
  }

  if (!file.buffer || file.buffer.length === 0) {
    throw new Error('The uploaded file is empty (0 bytes). Please upload a valid document or paste your resume text.');
  }

  // Maximum file size check (5MB)
  if (file.buffer.length > 5 * 1024 * 1024) {
    throw new Error('File size exceeds the 5MB limit. Please upload a smaller document or paste your resume text.');
  }

  const mime = (file.mimetype || '').toLowerCase();
  const originalName = (file.originalname || '').toLowerCase();

  // 1. PDF Handling
  if (mime === 'application/pdf' || originalName.endsWith('.pdf')) {
    try {
      const data = await pdfParse(file.buffer);
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('The PDF appears to be a scanned document or contains only images without an embedded text layer. Scanned OCR is not supported; please copy and paste your resume text directly into the text box.');
      }
      return data.text.trim();
    } catch (err) {
      if (err.message && err.message.includes('scanned document')) {
        throw err;
      }
      if (err.message && (err.message.includes('password') || err.message.includes('encrypt'))) {
        throw new Error('This PDF is password-protected or encrypted. Please remove password encryption or paste your resume text.');
      }
      throw new Error(`Failed to read PDF document: ${err.message || 'Corrupted file format'}. Please paste your resume text manually.`);
    }
  }

  // 2. DOCX Handling
  if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    originalName.endsWith('.docx')
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('The DOCX file contains no readable text. Please paste your resume text manually.');
      }
      return result.value.trim();
    } catch (err) {
      throw new Error(`Failed to extract text from DOCX: ${err.message || 'Corrupted file'}. Please paste your resume text.`);
    }
  }

  // 3. Plain Text File (.txt)
  if (mime === 'text/plain' || originalName.endsWith('.txt')) {
    const textContent = file.buffer.toString('utf-8').trim();
    if (textContent.length === 0) {
      throw new Error('The uploaded text file is empty.');
    }
    return textContent;
  }

  throw new Error('Unsupported file format. Please upload a PDF or DOCX file, or paste your resume text.');
}

/**
 * Analyzes resume text against target role expectations, extracting sections,
 * checking keyword density, action verbs, and quantifiable metrics.
 */
export function analyzeResumeContent({ text, targetRole = 'Full Stack Developer' }) {
  if (!text || text.trim().length < 40) {
    throw new Error('Resume text is too brief to analyze. Please provide a more complete resume (at least 40 characters).');
  }

  const cleanText = text;
  const lower = cleanText.toLowerCase();

  // Contact Information Extraction
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = cleanText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const githubMatch = cleanText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  const linkedinMatch = cleanText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const portfolioMatch = cleanText.match(/https?:\/\/(?!github|linkedin)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*/i);

  const contactInfo = {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    github: githubMatch ? `https://${githubMatch[0]}` : null,
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : null,
    portfolio: portfolioMatch ? portfolioMatch[0] : null
  };

  // Section Headers Check
  const hasExperience = /(experience|work history|employment|internship|professional experience)/i.test(cleanText);
  const hasEducation = /(education|academic background|university|college|b\.tech|bachelor|degree)/i.test(cleanText);
  const hasProjects = /(projects?|personal projects|academic projects|key projects)/i.test(cleanText);
  const hasSkillsSection = /(skills|technical skills|technologies|core competencies|tools)/i.test(cleanText);
  const hasSummary = /(summary|profile|about me|objective|professional summary)/i.test(cleanText);
  const hasCertifications = /(certifications?|certificates?|credentials|licenses)/i.test(cleanText);

  // Target Role Matching
  const roleKey = targetRole.toLowerCase();
  const benchmarkKeywords = ROLE_KEYWORDS[roleKey] || ROLE_KEYWORDS['software developer'];

  const matchedKeywords = [];
  const missingKeywords = [];

  benchmarkKeywords.forEach(kw => {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const rx = new RegExp(`\\b${escaped}\\b`, 'i');
    if (rx.test(cleanText)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Action Verbs Detection
  const matchedVerbs = ACTION_VERBS.filter(verb => {
    const rx = new RegExp(`\\b${verb}\\b`, 'i');
    return rx.test(cleanText);
  });

  // Quantifiable metrics / numbers detection (e.g. 34%, 150k, 2x, 500ms)
  const metricMatches = cleanText.match(/\b\d+(\.\d+)?(%|k|x|ms|s|users|events|qps|req\/s)?\b/gi) || [];
  const hasQuantifiedOutcomes = metricMatches.length >= 3;

  // Category Scoring
  // 1. Role Keyword Density (35%) - Evaluated against realistic core competence density
  const targetThreshold = Math.min(6, benchmarkKeywords.length);
  const keywordRatio = Math.min(1, matchedKeywords.length / Math.max(targetThreshold, 1));
  const keywordScore = Math.min(100, Math.round(keywordRatio * 100));

  // 2. Contact Information Completeness (20%)
  let contactScore = 0;
  if (contactInfo.email) contactScore += 35;
  if (contactInfo.phone) contactScore += 25;
  if (contactInfo.github) contactScore += 25;
  if (contactInfo.linkedin) contactScore += 15;
  contactScore = Math.min(100, contactScore);

  // 3. Impact & Action Verbs (25%)
  const verbScore = Math.min(50, matchedVerbs.length * 15);
  const metricScore = Math.min(50, metricMatches.length * 15);
  const impactScore = Math.min(100, verbScore + metricScore);

  // 4. Structural Readability & Completeness (20%)
  let structScore = 0;
  if (hasExperience) structScore += 30;
  if (hasProjects) structScore += 30;
  if (hasEducation) structScore += 20;
  if (hasSkillsSection) structScore += 10;
  if (hasSummary) structScore += 10;
  structScore = Math.min(100, structScore);

  // Overall Score (0-100)
  const overallScore = Math.round(
    keywordScore * 0.35 +
    contactScore * 0.20 +
    impactScore * 0.25 +
    structScore * 0.20
  );

  let qualityGrade = 'Needs Evidence';
  if (overallScore >= 80) qualityGrade = 'Competitive';
  else if (overallScore >= 60) qualityGrade = 'Solid Profile';
  else if (overallScore >= 40) qualityGrade = 'Building Foundation';

  // Strengths & Recommendations
  const strengths = [];
  const missingSections = [];
  const recommendations = [];

  if (contactInfo.github) strengths.push('Direct GitHub profile provided for code ownership verification.');
  if (matchedKeywords.length >= 6) strengths.push(`Strong keyword density for ${targetRole} (${matchedKeywords.length} competencies detected).`);
  if (matchedVerbs.length >= 4) strengths.push(`Good use of action verbs (${matchedVerbs.slice(0, 4).join(', ')}).`);
  if (hasQuantifiedOutcomes) strengths.push('Contains quantifiable metrics and outcomes.');

  if (!contactInfo.github) {
    recommendations.push({
      category: 'Evidence',
      title: 'Add Public GitHub Link',
      issue: 'Missing GitHub URL in contact header.',
      suggestion: 'Include your GitHub profile link near your email so technical reviewers can inspect code directly.'
    });
  }

  if (missingKeywords.length > 0) {
    recommendations.push({
      category: 'Keywords',
      title: 'Target Role Alignment',
      issue: `Underrepresented core technologies: ${missingKeywords.slice(0, 3).join(', ')}.`,
      suggestion: `Incorporate these technologies in project descriptions where you have utilized them.`
    });
  }

  if (!hasQuantifiedOutcomes) {
    recommendations.push({
      category: 'Impact',
      title: 'Quantify Engineering Results',
      issue: 'Few quantifiable performance or business outcomes detected.',
      suggestion: 'Use the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]" (e.g. "Reduced query latency by 34% by implementing Redis caching").'
    });
  }

  if (!hasSummary) missingSections.push('Professional Summary / Headline');
  if (!hasProjects) missingSections.push('Projects Section');
  if (!hasExperience) missingSections.push('Experience or Internships Section');
  if (!hasEducation) missingSections.push('Education Section');
  if (!hasCertifications) missingSections.push('Certifications (Optional)');

  // Bullet point improvement examples based on detected text
  const bulletExamples = [
    {
      before: 'Worked on building frontend components for the app.',
      after: 'Engineered 12 reusable TypeScript + React components with zero layout shifts, slashing feature delivery time by 25%.'
    },
    {
      before: 'Helped with the backend database queries.',
      after: 'Optimized PostgreSQL indexing and queries, cutting p99 response times from 420ms to 85ms.'
    }
  ];

  return {
    targetRole,
    wordCount: cleanText.split(/\s+/).filter(Boolean).length,
    characterCount: cleanText.length,
    overallScore,
    qualityGrade,
    categoryScores: {
      keywordScore,
      contactScore,
      impactScore,
      structScore
    },
    contactInfo,
    matchedKeywords,
    missingKeywords,
    matchedVerbs,
    strengths,
    missingSections,
    recommendations,
    bulletExamples,
    disclaimer: 'This evaluation is an automated estimate designed for career preparation. It is not an ATS or employer hiring guarantee.'
  };
}
