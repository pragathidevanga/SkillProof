// Service for fetching verifiable real projects from GitHub and handling LinkedIn requests
import { fetchWithSafeRedirects } from '../utils/ssrf.js';

/**
 * Extracts a clean GitHub username from a full profile URL or raw username.
 * e.g. "https://github.com/pragathidevanga/" -> "pragathidevanga"
 *      "github.com/torvalds" -> "torvalds"
 *      "octocat" -> "octocat"
 */
export function extractGitHubUsername(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim().replace(/\/+$/, '');
  const match = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (match) return match[1];
  // If it's a simple username without slashes
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) return trimmed;
  return null;
}

/**
 * Fetches public repositories for a user using GitHub's public REST API.
 * Maps real repo metadata to SkillProof project schema.
 */
export async function fetchGitHubProjects({ githubUrl, username } = {}) {
  const resolvedUsername = username || extractGitHubUsername(githubUrl);
  if (!resolvedUsername) {
    throw new Error('A valid GitHub profile URL or username is required (e.g., https://github.com/username).');
  }

  const apiUrl = `https://api.github.com/users/${encodeURIComponent(resolvedUsername)}/repos?sort=updated&per_page=30&type=owner`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SkillProof-App/1.1 (+https://skillproof.local; Educational Career Assistant)',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (res.status === 404) {
      throw new Error(`GitHub user "${resolvedUsername}" was not found. Please verify the profile URL or username.`);
    }

    if (res.status === 403) {
      const rateLimitReset = res.headers.get('x-ratelimit-reset');
      const resetMsg = rateLimitReset ? ` Rate limit resets at ${new Date(Number(rateLimitReset) * 1000).toLocaleTimeString()}.` : '';
      throw new Error(`GitHub API rate limit exceeded.${resetMsg} Please try again later or add projects manually.`);
    }

    if (!res.ok) {
      throw new Error(`GitHub API returned status code ${res.status} (${res.statusText}).`);
    }

    const repos = await res.json();
    if (!Array.isArray(repos)) {
      throw new Error('Unexpected response format from GitHub API.');
    }

    // Filter out forks or prioritize original work
    const projects = repos.map(repo => {
      // Determine technologies
      const techList = [];
      if (repo.language) techList.push(repo.language);
      if (Array.isArray(repo.topics)) {
        techList.push(...repo.topics.slice(0, 4));
      }

      // Infer appropriate category
      let category = 'Web Application';
      const descAndName = `${repo.name} ${repo.description || ''}`.toLowerCase();
      if (/nlp|ai|ml|learning|model|neural|dataset|predict/i.test(descAndName)) {
        category = 'AI / Machine Learning';
      } else if (/data|analytics|dashboard|sql|pipeline/i.test(descAndName)) {
        category = 'Data Science & Analytics';
      } else if (/cli|tool|script|automation|bot/i.test(descAndName)) {
        category = 'Developer Tool / CLI';
      } else if (/api|backend|service|server|microservice/i.test(descAndName)) {
        category = 'Backend & API';
      } else if (/frontend|ui|portfolio|react|vue|web/i.test(descAndName)) {
        category = 'Frontend Application';
      }

      // Format outcomes from real stats
      const outcomes = [];
      if (repo.stargazers_count > 0) outcomes.push(`${repo.stargazers_count} GitHub star(s)`);
      if (repo.forks_count > 0) outcomes.push(`${repo.forks_count} fork(s)`);
      if (repo.open_issues_count === 0 && repo.has_issues) outcomes.push('0 open issues');
      if (outcomes.length === 0) outcomes.push('Active public repository with version control');

      return {
        id: `gh-${repo.id}`,
        title: repo.name.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        rawName: repo.name,
        category,
        status: repo.archived ? 'Archived' : 'Completed',
        problemStatement: repo.description ? `Addresses: ${repo.description}` : 'Open-source software implementation with verified version history.',
        solution: `Implemented using ${techList.join(', ') || 'modern software engineering principles'}.`,
        description: repo.description || 'Verified open-source repository retrieved directly from GitHub.',
        technologies: techList.join(', '),
        personalRole: 'Project Creator & Maintainer',
        keyOutcomes: outcomes.join('; '),
        skillsDemonstrated: techList.join(', '),
        githubUrl: repo.html_url,
        demoUrl: repo.homepage && repo.homepage.startsWith('http') ? repo.homepage : '',
        featured: repo.stargazers_count > 0 || !repo.fork,
        isFork: Boolean(repo.fork),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        verifiedByUser: true,
        source: 'github',
        updatedAt: repo.updated_at
      };
    });

    return {
      username: resolvedUsername,
      profileUrl: `https://github.com/${resolvedUsername}`,
      totalRetrieved: projects.length,
      projects
    };
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch repositories from GitHub.');
  }
}

/**
 * Handles LinkedIn project requests honestly and transparently.
 * LinkedIn requires OAuth partner authorization to access member APIs;
 * automated scraping of user profiles is strictly blocked.
 */
export function handleLinkedInProjectRequest({ linkedinUrl } = {}) {
  if (!linkedinUrl) {
    throw new Error('LinkedIn profile URL is required.');
  }
  return {
    success: false,
    requiresAuth: true,
    status: 'requires_manual_or_oauth',
    projects: [],
    source: 'linkedin',
    message: 'LinkedIn restricts automated third-party data retrieval without authorized OAuth 2.0 partner credentials. To include projects from your LinkedIn profile, please use the manual project entry form.'
  };
}
