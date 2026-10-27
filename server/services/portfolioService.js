import { fetchWithSafeRedirects } from '../utils/ssrf.js';

// Target role keyword dictionaries for relevant skill evaluation
const ROLE_SKILL_PROFILES = {
  'frontend developer': ['javascript', 'typescript', 'react', 'vue', 'next.js', 'html', 'css', 'tailwind', 'redux', 'responsive design', 'git', 'web performance', 'testing'],
  'full stack developer': ['javascript', 'typescript', 'react', 'node.js', 'express', 'sql', 'mongodb', 'postgresql', 'rest api', 'git', 'docker', 'ci/cd', 'deployment'],
  'backend developer': ['node.js', 'express', 'python', 'java', 'go', 'sql', 'postgresql', 'mongodb', 'redis', 'rest api', 'graphql', 'docker', 'microservices', 'git'],
  'data analyst': ['sql', 'python', 'pandas', 'numpy', 'excel', 'tableau', 'power bi', 'data visualization', 'statistics', 'etl', 'reporting'],
  'machine learning engineer': ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'nlp', 'computer vision', 'mlops', 'docker', 'model evaluation'],
  'ai/ml developer': ['python', 'llm', 'langchain', 'openai', 'pytorch', 'huggingface', 'vector database', 'rag', 'rest api', 'fastapi'],
  'software developer': ['git', 'data structures', 'algorithms', 'object-oriented programming', 'testing', 'debugging', 'ci/cd', 'agile', 'system design']
};

/**
 * Assigns standardized score label matching Section 3 specification:
 * 0–39: Needs Improvement
 * 40–59: Good Foundation
 * 60–74: Good
 * 75–89: Very Good
 * 90–100: Excellent
 */
export function getScoreLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Good Foundation';
  return 'Needs Improvement';
}

/**
 * Analyzes a user's submitted portfolio URL or pasted content.
 * Evaluates against the exact 6-criterion rubric totaling 100 points:
 * 1. Visual design and readability (20 pts)
 * 2. Portfolio structure and navigation (15 pts)
 * 3. Project quality and presentation (25 pts)
 * 4. Technical skills and evidence (15 pts)
 * 5. About, experience and profile completeness (10 pts)
 * 6. Responsiveness, accessibility and working links (15 pts)
 */
export async function analyzePortfolio({ url, manualContent, targetRole = 'Full Stack Developer', notes = '' }) {
  let html = '';
  let fetchedUrl = url;
  let fetchMethod = 'manual';
  let siteTitle = '';
  let metaDescription = '';
  let scriptBundleText = '';

  if (url && url.trim()) {
    fetchMethod = 'crawler';
    try {
      const response = await fetchWithSafeRedirects(url.trim(), {
        headers: {
          'User-Agent': 'SkillProof-Portfolio-Analyzer/1.1 (+https://skillproof.local; Educational Career Assistant)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5'
        },
        timeoutMs: 7000
      });

      if (!response.ok) {
        throw new Error(`The website responded with HTTP status code ${response.status} (${response.statusText}).`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html') && !contentType.includes('text/plain') && !contentType.includes('application/xhtml')) {
        throw new Error(`The URL returned "${contentType}" instead of HTML web content.`);
      }

      html = await response.text();
      // Cap at 2.5MB
      if (html.length > 2500000) {
        html = html.substring(0, 2500000);
      }

      // Extract site title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) {
        siteTitle = titleMatch[1].trim();
      }

      // Extract meta description
      const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
      if (metaMatch) {
        metaDescription = metaMatch[1].trim();
      }

      // Check for Client-Side Rendered (CSR) SPAs (e.g. Vite, React, Vue, Next.js)
      // When <div id="root"> or <div id="app"> is present with minimal HTML text,
      // inspect the linked JavaScript assets to analyze rendered projects and evidence.
      const isSpa = html.includes('id="root"') || html.includes('id="app"') || html.includes('id="__next"');
      if (isSpa) {
        const scriptSrcMatches = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
        const mainBundle = scriptSrcMatches.find(src => src.includes('index-') || src.includes('main') || src.includes('bundle') || src.endsWith('.js'));
        if (mainBundle) {
          try {
            const parsedBase = new URL(url.trim());
            const bundleUrl = new URL(mainBundle, parsedBase).toString();
            const jsRes = await fetchWithSafeRedirects(bundleUrl, {
              headers: { 'User-Agent': 'SkillProof-Portfolio-Analyzer/1.1' },
              timeoutMs: 4000
            });
            if (jsRes.ok) {
              const jsContent = await jsRes.text();
              // Extract text strings and links up to 1MB
              scriptBundleText = jsContent.substring(0, 1000000);
            }
          } catch {
            // Non-fatal if secondary bundle fetch times out
          }
        }
      }
    } catch (err) {
      if (manualContent && manualContent.trim()) {
        fetchMethod = 'manual_fallback';
        html = manualContent;
      } else {
        const errorMsg = err.message || 'Failed to fetch the URL.';
        throw new Error(`${errorMsg} Analysis could not be completed. Please verify the URL is public and accessible, or paste your portfolio content manually in the Fallback tab.`);
      }
    }
  } else if (manualContent && manualContent.trim()) {
    html = manualContent;
    fetchMethod = 'manual';
  } else {
    throw new Error('Please provide either a public portfolio website URL or paste your portfolio content manually.');
  }

  // Combine raw HTML, SPA bundle strings, and optional notes
  const combinedRawText = `${html}\n${scriptBundleText}\n${notes || ''}`;
  const lowerText = combinedRawText.toLowerCase();

  // Extract all public links
  const linkMatches = [
    ...combinedRawText.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi),
    ...combinedRawText.matchAll(/(https:\/\/github\.com\/[a-zA-Z0-9_\-\/]+)/gi),
    ...combinedRawText.matchAll(/(https:\/\/[a-zA-Z0-9_\-]+\.(?:vercel\.app|netlify\.app|pages\.dev|onrender\.com))/gi)
  ].map(m => m[1]);

  const uniqueLinks = Array.from(new Set(linkMatches));
  const githubLinks = uniqueLinks.filter(l => l.includes('github.com'));
  const linkedinLinks = uniqueLinks.filter(l => l.includes('linkedin.com'));
  const demoLinks = uniqueLinks.filter(l =>
    !l.includes('github.com') &&
    !l.includes('linkedin.com') &&
    !l.includes('twitter.com') &&
    !l.includes('x.com') &&
    !l.includes('fonts.google') &&
    !l.includes('w3.org')
  );

  const hasGithub = githubLinks.length > 0 || lowerText.includes('github.com');
  const hasLinkedin = linkedinLinks.length > 0 || lowerText.includes('linkedin.com');
  const hasDemoLinks = demoLinks.length > 0 || lowerText.includes('live demo') || lowerText.includes('view live') || lowerText.includes('deployed at') || lowerText.includes('vercel.app') || lowerText.includes('netlify.app');
  const hasResume = lowerText.includes('resume') || lowerText.includes('cv') || lowerText.includes('.pdf');

  // Semantic Section Markers
  const hasAbout = /about(\s+me)?|who\s+i\s+am|bio|background|summary|student|developer|engineer/i.test(combinedRawText);
  const hasProjects = /projects?|work|case\s+studies|featured|portfolio/i.test(combinedRawText);
  const hasSkills = /skills?|tech(nolog(y|ies))?|stack|tools|competencies/i.test(combinedRawText);
  const hasContact = /contact|get\s+in\s+touch|email|reach\s+out|mailto:/i.test(combinedRawText);
  const hasExperience = /experience|employment|work\s+history|internship|career|bca|b\.tech|bachelor|education/i.test(combinedRawText);
  const hasNavigation = /<nav|class=["'][^"']*(?:nav|navbar|menu)|aria-label=["'](?:nav|main navigation)/i.test(html) || lowerText.includes('navigation');
  const hasMetaViewport = html.includes('name="viewport"') || html.includes("name='viewport'") || fetchMethod === 'manual';
  const hasCleanTypography = html.includes('fonts.googleapis.com') || html.includes('font-family') || html.includes('class="') || fetchMethod === 'manual';

  // Detected skills against role benchmark
  const roleKey = targetRole.toLowerCase();
  const benchmarkSkills = ROLE_SKILL_PROFILES[roleKey] || ROLE_SKILL_PROFILES['software developer'];
  const detectedSkills = [];
  const missingRoleSkills = [];

  for (const skill of benchmarkSkills) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(combinedRawText)) {
      detectedSkills.push(skill);
    } else {
      missingRoleSkills.push(skill);
    }
  }

  // Count project titles / descriptions detected
  const projectMentionCount = (combinedRawText.match(/project|case\s+study|application|tracker|dashboard|system/gi) || []).length;
  const hasMultipleProjects = githubLinks.length >= 2 || projectMentionCount >= 4;

  // ========================================================
  // EXACT 6-CRITERION SCORING RUBRIC (MAX 100 POINTS TOTAL)
  // ========================================================

  // 1. Visual design and readability (Maximum 20 points)
  let visualDesignScore = 0;
  if (hasMetaViewport) visualDesignScore += 4;
  if (hasCleanTypography) visualDesignScore += 4;
  if (siteTitle && siteTitle.length > 3) visualDesignScore += 4;
  if (combinedRawText.length >= 300) visualDesignScore += 4;
  if (metaDescription || html.includes('<header') || lowerText.includes('dark') || lowerText.includes('light')) visualDesignScore += 4;
  visualDesignScore = Math.min(20, Math.max(0, visualDesignScore));

  // 2. Portfolio structure and navigation (Maximum 15 points)
  let structureNavScore = 0;
  if (hasNavigation || html.includes('<nav')) structureNavScore += 5;
  if (hasAbout && hasProjects) structureNavScore += 5;
  if (hasContact || hasSkills) structureNavScore += 5;
  structureNavScore = Math.min(15, Math.max(0, structureNavScore));

  // 3. Project quality and presentation (Maximum 25 points)
  let projectQualityScore = 0;
  if (hasProjects) projectQualityScore += 8;
  if (hasMultipleProjects) projectQualityScore += 4;
  if (hasGithub) projectQualityScore += 7; // Code repository proof
  if (hasDemoLinks) projectQualityScore += 6; // Live deployment proof
  projectQualityScore = Math.min(25, Math.max(0, projectQualityScore));

  // 4. Technical skills and evidence (Maximum 15 points)
  let technicalSkillsScore = 0;
  if (hasSkills) technicalSkillsScore += 5;
  const skillRatio = detectedSkills.length / Math.max(benchmarkSkills.length, 1);
  technicalSkillsScore += Math.round(skillRatio * 7);
  if (detectedSkills.length >= 4) technicalSkillsScore += 3;
  technicalSkillsScore = Math.min(15, Math.max(0, technicalSkillsScore));

  // 5. About, experience and profile completeness (Maximum 10 points)
  let aboutExperienceScore = 0;
  if (hasAbout) aboutExperienceScore += 4;
  if (hasExperience) aboutExperienceScore += 3;
  if (hasContact) aboutExperienceScore += 3;
  aboutExperienceScore = Math.min(10, Math.max(0, aboutExperienceScore));

  // 6. Responsiveness, accessibility and working links (Maximum 15 points)
  let responsivenessLinksScore = 0;
  if (hasMetaViewport) responsivenessLinksScore += 5;
  if (html.includes('alt=') || html.includes('<main') || html.includes('<footer') || html.includes('<header') || fetchMethod === 'manual') responsivenessLinksScore += 5;
  if (hasGithub || hasLinkedin || hasDemoLinks) responsivenessLinksScore += 5;
  responsivenessLinksScore = Math.min(15, Math.max(0, responsivenessLinksScore));

  // Compute final exact score (0 to 100)
  const overallScore = Math.min(100, Math.max(0,
    visualDesignScore +
    structureNavScore +
    projectQualityScore +
    technicalSkillsScore +
    aboutExperienceScore +
    responsivenessLinksScore
  ));

  const scoreLabel = getScoreLabel(overallScore);
  const formattedScore = `${overallScore}/100 — ${scoreLabel}`;

  // Strengths, Weaknesses, and Improvements
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  if (hasGithub) {
    strengths.push(`Direct GitHub repository links provided (${githubLinks.length > 0 ? `${githubLinks.length} repo(s) detected` : 'source code accessible'}).`);
  } else {
    weaknesses.push('No direct GitHub repository links detected linking to project code.');
    recommendations.push({
      criterion: 'Project quality and presentation',
      priority: 'High',
      action: 'Add 1-click GitHub buttons on every showcased project.',
      why: 'Technical recruiters prioritize inspecting source code architecture and commit history.'
    });
  }

  if (hasDemoLinks) {
    strengths.push('Live interactive deployment links detected for project demonstrations.');
  } else {
    weaknesses.push('Missing live interactive deployment links (e.g. Vercel, Netlify, Render).');
    recommendations.push({
      criterion: 'Project quality and presentation',
      priority: 'High',
      action: 'Deploy projects to cloud hosting and attach live demo links.',
      why: 'Enables reviewers to test user interactions without setting up a local runtime.'
    });
  }

  if (hasSkills && detectedSkills.length >= 4) {
    strengths.push(`Relevant ${targetRole} technical competencies demonstrated (${detectedSkills.slice(0, 5).join(', ')}).`);
  } else {
    weaknesses.push(`Underrepresented core technologies for ${targetRole}.`);
    recommendations.push({
      criterion: 'Technical skills and evidence',
      priority: 'Medium',
      action: `Explicitly feature key ${targetRole} technologies: ${missingRoleSkills.slice(0, 3).join(', ')}.`,
      why: 'Improves technical keyword discovery for recruiting systems and engineering managers.'
    });
  }

  if (hasAbout) {
    strengths.push('Professional narrative and biographical summary clearly presented.');
  } else {
    weaknesses.push('Missing personal About Me / Professional Summary section.');
    recommendations.push({
      criterion: 'About, experience and profile completeness',
      priority: 'Medium',
      action: 'Include an introductory summary outlining your engineering background and goals.',
      why: 'Gives reviewers personal context beyond pure code repositories.'
    });
  }

  if (hasContact) {
    strengths.push('Clear contact channels provided for recruiter outreach.');
  } else {
    weaknesses.push('No direct email, contact form, or communication links found.');
    recommendations.push({
      criterion: 'About, experience and profile completeness',
      priority: 'High',
      action: 'Add a visible contact section with your professional email.',
      why: 'Ensures hiring teams can contact you directly without searching external directories.'
    });
  }

  return {
    url: fetchedUrl || 'Pasted Content Input',
    fetchMethod,
    siteTitle,
    metaDescription,
    targetRole,
    overallScore,
    scoreLabel,
    formattedScore,
    rubric: {
      visualDesign: {
        title: 'Visual design and readability',
        score: visualDesignScore,
        max: 20
      },
      structureNav: {
        title: 'Portfolio structure and navigation',
        score: structureNavScore,
        max: 15
      },
      projectQuality: {
        title: 'Project quality and presentation',
        score: projectQualityScore,
        max: 25
      },
      technicalSkills: {
        title: 'Technical skills and evidence',
        score: technicalSkillsScore,
        max: 15
      },
      aboutExperience: {
        title: 'About, experience and profile completeness',
        score: aboutExperienceScore,
        max: 10
      },
      responsivenessLinks: {
        title: 'Responsiveness, accessibility and working links',
        score: responsivenessLinksScore,
        max: 15
      }
    },
    detectedSkills,
    missingRoleSkills,
    strengths,
    weaknesses,
    recommendations,
    analyzedAt: new Date().toISOString()
  };
}
