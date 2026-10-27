// SkillProof Static Portfolio Generator Service
// Generates standalone static website files (HTML, CSS, JS, README)
// Supports 3 distinct layouts: Modern Developer, Minimal Professional, Creative Portfolio
// Calibrated for high-impact engineering presentations and job applications

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const ICONS = {
  github: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
  linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
  external: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  email: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  code: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  award: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
  location: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

export function generatePortfolioFiles({ profile = {}, projects = [], config = {} }) {
  const template = config.template || 'modern'; // 'minimal' | 'modern' | 'creative'
  const accentColor = config.accentColor || '#635BFF';
  const font = config.font || 'Inter';
  const visibleSections = config.visibleSections || {
    about: true,
    skills: true,
    projects: true,
    experience: true,
    education: true,
    certifications: true,
    contact: true
  };

  const name = escapeHtml(profile.basic?.fullName || 'Candidate Name');
  const headline = escapeHtml(profile.basic?.headline || `${profile.targetRole || 'Software Engineer'}`);
  const about = escapeHtml(profile.basic?.about || 'Software engineer dedicated to crafting clean, robust web architectures and high-performance applications.');
  const location = escapeHtml(profile.basic?.location || '');
  const email = escapeHtml(profile.basic?.email || profile.resume?.analysis?.contactInfo?.email || 'hello@example.com');
  const avatar = escapeHtml(profile.basic?.avatar || '');

  const links = profile.links || {};
  const githubUrl = escapeHtml(links.github || '');
  const linkedinUrl = escapeHtml(links.linkedin || '');
  const portfolioUrl = escapeHtml(links.portfolio || '');

  const skills = (profile.skills || []).map(s => escapeHtml(typeof s === 'string' ? s : s.name || '')).filter(Boolean);
  const softSkills = (profile.softSkills || []).map(s => escapeHtml(typeof s === 'string' ? s : s.name || '')).filter(Boolean);
  const certifications = (profile.certifications || []).map(c => ({
    title: escapeHtml(c.title || c.name || ''),
    issuer: escapeHtml(c.issuer || ''),
    year: escapeHtml(c.year || '')
  })).filter(c => c.title);

  const education = (profile.education || []).map(e => ({
    institution: escapeHtml(e.institution || ''),
    degree: escapeHtml(e.degree || ''),
    specialization: escapeHtml(e.specialization || ''),
    year: escapeHtml(e.year || '')
  })).filter(e => e.institution || e.degree);

  const experience = (profile.experience || []).map(exp => ({
    role: escapeHtml(exp.role || ''),
    organization: escapeHtml(exp.organization || ''),
    startDate: escapeHtml(exp.startDate || ''),
    endDate: escapeHtml(exp.endDate || ''),
    type: escapeHtml(exp.type || 'Full-time'),
    description: escapeHtml(exp.description || '')
  })).filter(exp => exp.role || exp.organization);

  const projectList = (projects && projects.length > 0 ? projects : (profile.projects || [])).map(p => ({
    title: escapeHtml(p.title || 'Project Title'),
    category: escapeHtml(p.category || 'Web Application'),
    problemStatement: escapeHtml(p.problemStatement || ''),
    description: escapeHtml(p.description || ''),
    keyOutcomes: escapeHtml(p.keyOutcomes || ''),
    technologies: (p.technologies || []).map(t => escapeHtml(t)),
    githubUrl: escapeHtml(p.githubUrl || ''),
    demoUrl: escapeHtml(p.demoUrl || ''),
    featured: Boolean(p.featured)
  }));

  // Reusable Shared Client Script (smooth scroll, mobile hamburger menu, back-to-top)
  const js = `// SkillProof Generated Client Script
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
    });
    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
      });
    });
  }
});
`;

  let html = '';
  let css = '';

  // ---------------------------------------------------------------
  // Template 1: Minimal Professional (Swiss Editorial Elegance)
  // ---------------------------------------------------------------
  if (template === 'minimal') {
    css = `/* Minimal Professional Template */
:root {
  --accent: ${accentColor};
  --accent-soft: rgba(99, 91, 255, 0.08);
  --text-primary: #18181B;
  --text-secondary: #71717A;
  --border: #E4E4E7;
  --bg-page: #FAFAFA;
  --bg-card: #FFFFFF;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-primary);
  background-color: var(--bg-page);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
.container { max-width: 860px; margin: 0 auto; padding: 0 28px; }
header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(250, 250, 250, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  padding: 18px 0;
}
.nav-wrap { display: flex; justify-content: space-between; align-items: center; }
.brand { font-size: 1.125rem; font-weight: 700; letter-spacing: -0.01em; color: var(--text-primary); text-decoration: none; }
.nav-links { display: flex; gap: 24px; list-style: none; }
.nav-links a { color: var(--text-secondary); text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.15s; }
.nav-links a:hover { color: var(--accent); }
.mobile-btn { display: none; background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--text-primary); }

.hero { padding: 72px 0 48px; border-bottom: 1px solid var(--border); }
.status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.75rem; font-weight: 600; padding: 4px 12px;
  background: #ECFDF5; color: #047857; border-radius: 9999px;
  margin-bottom: 16px; border: 1px solid #A7F3D0;
}
.pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; }
.hero h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px; line-height: 1.2; }
.hero .headline { font-size: 1.125rem; color: var(--accent); font-weight: 600; margin-bottom: 16px; }
.hero .bio { font-size: 1.0625rem; color: var(--text-secondary); margin-bottom: 24px; max-width: 700px; line-height: 1.7; }
.hero-links { display: flex; gap: 12px; flex-wrap: wrap; }
.btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
  border-radius: 6px; font-size: 0.875rem; font-weight: 600; text-decoration: none;
  cursor: pointer; transition: all 0.15s;
}
.btn-primary { background-color: var(--accent); color: #FFF; border: none; }
.btn-primary:hover { opacity: 0.92; transform: translateY(-1px); }
.btn-outline { border: 1px solid var(--border); color: var(--text-primary); background: #FFF; }
.btn-outline:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }

section { padding: 48px 0; border-bottom: 1px solid var(--border); }
.section-title { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-secondary); margin-bottom: 24px; }

.skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-badge { font-size: 0.8125rem; padding: 6px 12px; border-radius: 6px; background: #FFF; border: 1px solid var(--border); color: var(--text-primary); font-weight: 500; }

.project-item { padding: 24px 0; border-bottom: 1px dashed var(--border); }
.project-item:last-child { border-bottom: none; }
.project-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; flex-wrap: wrap; gap: 8px; }
.project-title { font-size: 1.1875rem; font-weight: 700; color: var(--text-primary); }
.project-category { font-size: 0.75rem; color: var(--accent); font-weight: 600; }
.project-problem { font-size: 0.8125rem; color: var(--text-secondary); background: #FFF; border: 1px solid var(--border); padding: 8px 12px; border-radius: 6px; margin: 10px 0; border-left: 3px solid var(--accent); }
.project-desc { font-size: 0.9375rem; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.6; }
.project-outcomes { font-size: 0.8125rem; color: #047857; font-weight: 600; margin-bottom: 12px; }
.project-tech { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.tech-tag { font-size: 0.6875rem; color: var(--text-secondary); background: #FFF; border: 1px solid var(--border); padding: 3px 8px; border-radius: 4px; font-family: monospace; }
.project-links { display: flex; gap: 10px; }

.timeline-item { margin-bottom: 24px; }
.timeline-title { font-weight: 700; font-size: 1rem; color: var(--text-primary); }
.timeline-meta { font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 6px; }
.timeline-desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; }

.contact-card { background: #FFF; border: 1px solid var(--border); border-radius: 8px; padding: 28px; text-align: center; }
footer { padding: 48px 0; text-align: center; font-size: 0.8125rem; color: var(--text-secondary); }

@media (max-width: 640px) {
  .hero h1 { font-size: 1.875rem; }
  .nav-links { display: none; flex-direction: column; width: 100%; padding-top: 16px; gap: 12px; }
  .nav-links.nav-open { display: flex; }
  .mobile-btn { display: block; }
  .nav-wrap { flex-wrap: wrap; }
}
`;

    html = `<!DOCTYPE html>
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
      <button class="mobile-btn" id="mobile-menu-toggle" aria-label="Toggle navigation">☰</button>
      <ul class="nav-links" id="nav-links">
        ${visibleSections.projects ? '<li><a href="#projects">Projects</a></li>' : ''}
        ${visibleSections.skills ? '<li><a href="#skills">Skills</a></li>' : ''}
        ${visibleSections.experience && experience.length > 0 ? '<li><a href="#experience">Experience</a></li>' : ''}
        ${visibleSections.education && education.length > 0 ? '<li><a href="#education">Education</a></li>' : ''}
        ${visibleSections.contact ? '<li><a href="#contact">Contact</a></li>' : ''}
      </ul>
    </div>
  </header>

  <div class="container">
    <section class="hero" id="about">
      <div class="status-pill"><span class="pulse-dot"></span> Available for Software Engineering Roles</div>
      <h1>${name}</h1>
      <div class="headline">${headline}</div>
      <p class="bio">${about}</p>
      <div class="hero-links">
        ${githubUrl ? `<a href="${githubUrl}" target="_blank" rel="noreferrer" class="btn btn-outline">${ICONS.github} GitHub</a>` : ''}
        ${linkedinUrl ? `<a href="${linkedinUrl}" target="_blank" rel="noreferrer" class="btn btn-outline">${ICONS.linkedin} LinkedIn</a>` : ''}
        <a href="#contact" class="btn btn-primary">${ICONS.email} Get In Touch</a>
      </div>
    </section>

    ${visibleSections.skills && skills.length > 0 ? `
    <section id="skills">
      <h2 class="section-title">Technical Competencies</h2>
      <div class="skills-list">
        ${skills.map(s => `<span class="skill-badge">${s}</span>`).join('')}
        ${softSkills.map(s => `<span class="skill-badge" style="border-style:dashed;">${s}</span>`).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.projects && projectList.length > 0 ? `
    <section id="projects">
      <h2 class="section-title">Selected Projects</h2>
      <div>
        ${projectList.map(p => `
          <div class="project-item">
            <div class="project-header">
              <span class="project-title">${p.title}</span>
              <span class="project-category">${p.category}</span>
            </div>
            ${p.problemStatement ? `<div class="project-problem"><strong>Context:</strong> ${p.problemStatement}</div>` : ''}
            <div class="project-desc">${p.description}</div>
            ${p.keyOutcomes ? `<div class="project-outcomes">✓ ${p.keyOutcomes}</div>` : ''}
            <div class="project-tech">
              ${p.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <div class="project-links">
              ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noreferrer" class="btn btn-outline" style="font-size:0.75rem; padding:4px 10px;">${ICONS.code} Source Code</a>` : ''}
              ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" rel="noreferrer" class="btn btn-primary" style="font-size:0.75rem; padding:4px 10px;">${ICONS.external} Live Demo</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.experience && experience.length > 0 ? `
    <section id="experience">
      <h2 class="section-title">Experience & Internships</h2>
      <div>
        ${experience.map(e => `
          <div class="timeline-item">
            <div class="timeline-title">${e.role} &mdash; ${e.organization}</div>
            <div class="timeline-meta">${e.startDate} - ${e.endDate} &bull; ${e.type}</div>
            <div class="timeline-desc">${e.description}</div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.education && education.length > 0 ? `
    <section id="education">
      <h2 class="section-title">Education</h2>
      <div>
        ${education.map(ed => `
          <div class="timeline-item">
            <div class="timeline-title">${ed.degree} &mdash; ${ed.institution}</div>
            <div class="timeline-meta">Year: ${ed.year}${ed.specialization ? ` &bull; ${ed.specialization}` : ''}</div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.certifications && certifications.length > 0 ? `
    <section id="certifications">
      <h2 class="section-title">Certifications & Honors</h2>
      <div>
        ${certifications.map(c => `
          <div class="timeline-item">
            <div class="timeline-title">${c.title}</div>
            <div class="timeline-meta">${c.issuer} &bull; ${c.year}</div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.contact ? `
    <section id="contact">
      <div class="contact-card">
        <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:8px;">Get In Touch</h2>
        <p style="color:var(--text-secondary); margin-bottom:20px;">Open to discussing engineering roles, projects, and technical collaborations.</p>
        <a href="mailto:${email}" class="btn btn-primary" style="font-size:0.9375rem; padding:10px 20px;">${ICONS.email} Email ${email}</a>
      </div>
    </section>` : ''}

    <footer>
      &copy; ${new Date().getFullYear()} ${name}. Verified Engineering Portfolio.
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>`;
  }

  // ---------------------------------------------------------------
  // Template 2: Creative Portfolio (Dynamic, Modern Pill UI)
  // ---------------------------------------------------------------
  else if (template === 'creative') {
    css = `/* Creative Portfolio Template */
:root {
  --accent: ${accentColor};
  --accent-soft: rgba(99, 91, 255, 0.08);
  --bg: #F8FAFC;
  --text: #0F172A;
  --muted: #64748B;
  --card-bg: #FFFFFF;
  --border: #E2E8F0;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
.container { max-width: 1040px; margin: 0 auto; padding: 0 28px; }
header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 18px 0;
  position: sticky; top: 0; z-index: 50;
}
.nav-wrap { display: flex; justify-content: space-between; align-items: center; }
.brand {
  font-size: 1.25rem; font-weight: 800; text-decoration: none;
  background: linear-gradient(135deg, var(--accent), #2563EB);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.nav-links { display: flex; gap: 20px; list-style: none; }
.nav-links a { color: var(--muted); text-decoration: none; font-size: 0.875rem; font-weight: 600; transition: color 0.15s; }
.nav-links a:hover { color: var(--accent); }
.mobile-btn { display: none; background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--text); }

.hero { padding: 80px 0 60px; }
.pill-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 9999px; background: var(--accent-soft);
  color: var(--accent); font-weight: 700; font-size: 0.75rem; margin-bottom: 16px;
}
.hero h1 { font-size: 3rem; font-weight: 900; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 14px; }
.hero-headline { font-size: 1.25rem; font-weight: 700; color: var(--muted); margin-bottom: 18px; }
.hero-bio { font-size: 1.0625rem; color: var(--muted); line-height: 1.65; margin-bottom: 28px; max-width: 660px; }
.hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px;
  border-radius: 10px; font-weight: 700; font-size: 0.875rem; text-decoration: none;
  transition: all 0.2s; cursor: pointer;
}
.btn-primary { background: var(--accent); color: #FFF; box-shadow: 0 4px 14px rgba(99, 91, 255, 0.25); border: none; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 91, 255, 0.35); }
.btn-secondary { background: #FFFFFF; border: 1px solid var(--border); color: var(--text); }
.btn-secondary:hover { background: #F1F5F9; border-color: var(--accent); transform: translateY(-2px); }

section { padding: 64px 0; border-top: 1px solid var(--border); }
.section-tag { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 8px; }
.section-heading { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 32px; }

.skills-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
.creative-tag {
  background: #FFFFFF; border: 1px solid var(--border); padding: 8px 16px;
  border-radius: 12px; font-weight: 700; font-size: 0.875rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02); transition: all 0.2s;
}
.creative-tag:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
.project-card {
  background: #FFFFFF; border: 1px solid var(--border); border-radius: 16px;
  padding: 28px; display: flex; flex-direction: column; justify-content: space-between;
  transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.project-card:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(0,0,0,0.06); border-color: var(--accent); }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px; }
.card-title { font-size: 1.25rem; font-weight: 800; color: var(--text); }
.card-category { font-size: 0.6875rem; font-weight: 700; color: var(--accent); background: var(--accent-soft); padding: 3px 8px; border-radius: 6px; }
.card-desc { font-size: 0.9375rem; color: var(--muted); margin-bottom: 16px; line-height: 1.55; }
.outcome-pill { background: #ECFDF5; color: #047857; font-weight: 700; font-size: 0.75rem; padding: 6px 12px; border-radius: 6px; margin-bottom: 16px; border: 1px solid #A7F3D0; }
.tech-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
.tech-item { font-size: 0.75rem; background: var(--bg); border: 1px solid var(--border); padding: 3px 10px; border-radius: 6px; font-weight: 600; color: var(--muted); }
.card-actions { display: flex; gap: 10px; }

.timeline-cards { display: flex; flex-direction: column; gap: 16px; }
.timeline-card { background: #FFFFFF; border: 1px solid var(--border); border-radius: 12px; padding: 22px; }
.timeline-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; }
.timeline-role { font-weight: 800; font-size: 1.0625rem; }
.timeline-dates { font-size: 0.8125rem; color: var(--muted); font-weight: 600; }
.timeline-body { font-size: 0.875rem; color: var(--muted); margin-top: 8px; line-height: 1.6; }

footer { padding: 48px 0; text-align: center; font-size: 0.875rem; color: var(--muted); border-top: 1px solid var(--border); }

@media (max-width: 640px) {
  .hero h1 { font-size: 2.125rem; }
  .nav-links { display: none; flex-direction: column; width: 100%; padding-top: 16px; gap: 12px; }
  .nav-links.nav-open { display: flex; }
  .mobile-btn { display: block; }
  .nav-wrap { flex-wrap: wrap; }
}
`;

    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} &bull; Software Portfolio</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="container nav-wrap">
      <a href="#" class="brand">${name}</a>
      <button class="mobile-btn" id="mobile-menu-toggle" aria-label="Toggle navigation">☰</button>
      <ul class="nav-links" id="nav-links">
        ${visibleSections.projects ? '<li><a href="#projects">Work</a></li>' : ''}
        ${visibleSections.skills ? '<li><a href="#skills">Skills</a></li>' : ''}
        ${visibleSections.experience && experience.length > 0 ? '<li><a href="#experience">Journey</a></li>' : ''}
        ${visibleSections.education && education.length > 0 ? '<li><a href="#education">Education</a></li>' : ''}
        ${visibleSections.contact ? '<li><a href="#contact">Contact</a></li>' : ''}
      </ul>
    </div>
  </header>

  <div class="container">
    <div class="hero">
      <div>
        <div class="pill-badge">&bull; Verified Engineering Profile</div>
        <h1>${name}</h1>
        <div class="hero-headline">${headline}</div>
        <p class="hero-bio">${about}</p>
        <div class="hero-btns">
          <a href="#projects" class="btn btn-primary">View Featured Projects</a>
          ${githubUrl ? `<a href="${githubUrl}" target="_blank" rel="noreferrer" class="btn btn-secondary">${ICONS.github} GitHub</a>` : ''}
          ${linkedinUrl ? `<a href="${linkedinUrl}" target="_blank" rel="noreferrer" class="btn btn-secondary">${ICONS.linkedin} LinkedIn</a>` : ''}
        </div>
      </div>
    </div>

    ${visibleSections.skills && skills.length > 0 ? `
    <section id="skills">
      <div class="section-tag">Capabilities</div>
      <h2 class="section-heading">Technical Arsenal</h2>
      <div class="skills-cloud">
        ${skills.map(s => `<span class="creative-tag">${s}</span>`).join('')}
        ${softSkills.map(s => `<span class="creative-tag" style="border-style:dashed;">${s}</span>`).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.projects && projectList.length > 0 ? `
    <section id="projects">
      <div class="section-tag">Case Studies</div>
      <h2 class="section-heading">Engineered Projects</h2>
      <div class="projects-grid">
        ${projectList.map(p => `
          <div class="project-card">
            <div>
              <div class="card-header">
                <div class="card-title">${p.title}</div>
                <span class="card-category">${p.category}</span>
              </div>
              <p class="card-desc">${p.description}</p>
              ${p.keyOutcomes ? `<div class="outcome-pill">⚡ ${p.keyOutcomes}</div>` : ''}
            </div>
            <div>
              <div class="tech-pills">
                ${p.technologies.map(t => `<span class="tech-item">${t}</span>`).join('')}
              </div>
              <div class="card-actions">
                ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noreferrer" class="btn btn-secondary" style="font-size:0.75rem; padding:6px 12px; flex:1; justify-content:center;">${ICONS.code} Code</a>` : ''}
                ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" rel="noreferrer" class="btn btn-primary" style="font-size:0.75rem; padding:6px 12px; flex:1; justify-content:center;">${ICONS.external} Live Demo</a>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.experience && experience.length > 0 ? `
    <section id="experience">
      <div class="section-tag">Background</div>
      <h2 class="section-heading">Experience & Roles</h2>
      <div class="timeline-cards">
        ${experience.map(e => `
          <div class="timeline-card">
            <div class="timeline-header">
              <span class="timeline-role">${e.role} &mdash; ${e.organization}</span>
              <span class="timeline-dates">${e.startDate} - ${e.endDate}</span>
            </div>
            <div class="timeline-body">${e.description}</div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.education && education.length > 0 ? `
    <section id="education">
      <div class="section-tag">Academics</div>
      <h2 class="section-heading">Education</h2>
      <div class="timeline-cards">
        ${education.map(ed => `
          <div class="timeline-card">
            <div class="timeline-header">
              <span class="timeline-role">${ed.degree} &mdash; ${ed.institution}</span>
              <span class="timeline-dates">${ed.year}</span>
            </div>
            ${ed.specialization ? `<div class="timeline-body">Specialization: ${ed.specialization}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.certifications && certifications.length > 0 ? `
    <section id="certifications">
      <div class="section-tag">Credentials</div>
      <h2 class="section-heading">Certifications</h2>
      <div class="timeline-cards">
        ${certifications.map(c => `
          <div class="timeline-card">
            <div class="timeline-header">
              <span class="timeline-role">${c.title}</span>
              <span class="timeline-dates">${c.year}</span>
            </div>
            <div class="timeline-body">Issued by: ${c.issuer}</div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.contact ? `
    <section id="contact">
      <div class="section-tag">Connect</div>
      <h2 class="section-heading">Let's Build Something Together</h2>
      <p style="color:var(--muted); margin-bottom:24px; font-size:1.0625rem;">Interested in hiring or discussing technical collaboration? Reach out anytime:</p>
      <a href="mailto:${email}" class="btn btn-primary" style="font-size:1rem; padding:12px 24px;">${ICONS.email} Send Message (${email})</a>
    </section>` : ''}

    <footer>
      &copy; ${new Date().getFullYear()} ${name} &bull; Generated with SkillProof
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>`;
  }

  // ---------------------------------------------------------------
  // Template 3: Modern Developer (Flagship High-Performance Theme)
  // ---------------------------------------------------------------
  else {
    css = `/* Modern Developer Template */
:root {
  --accent: ${accentColor};
  --accent-soft: rgba(99, 91, 255, 0.08);
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --border: #E2E8F0;
  --card-bg: #FFFFFF;
  --font-family: '${font}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
.container { max-width: 980px; margin: 0 auto; padding: 0 24px; }
header {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 50;
}
.nav-wrap { display: flex; justify-content: space-between; align-items: center; height: 68px; }
.brand {
  font-size: 1.1875rem; font-weight: 800; color: var(--text-primary);
  text-decoration: none; display: flex; align-items: center; gap: 8px;
  letter-spacing: -0.02em;
}
.brand-badge {
  font-size: 0.6875rem; background: var(--accent-soft); color: var(--accent);
  padding: 2px 8px; border-radius: 4px; font-weight: 700;
}
.nav-links { display: flex; gap: 24px; list-style: none; font-size: 0.875rem; font-weight: 600; }
.nav-links a { color: var(--text-secondary); text-decoration: none; transition: color 0.15s; }
.nav-links a:hover { color: var(--accent); }
.mobile-btn { display: none; background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--text-primary); }

.hero { padding: 72px 0 52px; border-bottom: 1px solid var(--border); }
.hero-tag {
  display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px;
  border-radius: 9999px; background: #ECFDF5; border: 1px solid #A7F3D0;
  color: #047857; font-size: 0.75rem; font-weight: 700; margin-bottom: 20px;
}
.pulse-circle {
  width: 7px; height: 7px; border-radius: 50%; background: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}
.hero h1 { font-size: 3rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.18; margin-bottom: 12px; color: var(--text-primary); }
.hero .headline { font-size: 1.25rem; font-weight: 600; color: var(--accent); margin-bottom: 16px; }
.hero .bio { font-size: 1.0625rem; color: var(--text-secondary); line-height: 1.7; max-width: 720px; margin-bottom: 28px; }
.hero-links { display: flex; gap: 12px; flex-wrap: wrap; }
.btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
  border-radius: 8px; font-weight: 600; font-size: 0.875rem; text-decoration: none;
  cursor: pointer; transition: all 0.15s;
}
.btn-primary { background: var(--accent); color: #FFF; border: none; }
.btn-primary:hover { opacity: 0.94; transform: translateY(-1px); }
.btn-secondary { background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-primary); }
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }

section { padding: 56px 0; border-bottom: 1px solid var(--border); }
.section-title {
  font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 24px;
  display: flex; align-items: center; justify-content: space-between;
}
.section-subtitle { font-size: 0.875rem; color: var(--text-secondary); font-weight: normal; margin-top: 4px; }

.skills-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.skill-pill {
  font-size: 0.8125rem; padding: 7px 14px; border-radius: 8px;
  background: var(--bg-secondary); border: 1px solid var(--border);
  font-weight: 600; color: var(--text-primary); transition: all 0.15s;
}
.skill-pill:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }

.projects-stack { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
.project-card {
  border: 1px solid var(--border); border-radius: 14px; padding: 24px;
  background: var(--card-bg); transition: all 0.2s; display: flex;
  flex-direction: column; justify-content: space-between;
}
.project-card:hover { border-color: var(--accent); box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06); transform: translateY(-3px); }
.project-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 8px; }
.project-name { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
.project-category-badge {
  font-size: 0.6875rem; padding: 3px 8px; border-radius: 6px;
  background: var(--bg-secondary); border: 1px solid var(--border);
  color: var(--text-secondary); font-weight: 600;
}
.problem-box {
  font-size: 0.8125rem; background: var(--bg-secondary);
  border-left: 3px solid var(--accent); padding: 8px 12px;
  border-radius: 0 6px 6px 0; margin: 12px 0; color: var(--text-secondary);
}
.project-summary { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px; }
.outcomes-callout {
  font-size: 0.8125rem; color: #047857; font-weight: 700;
  background: #ECFDF5; border: 1px solid #A7F3D0;
  padding: 6px 10px; border-radius: 6px; margin-bottom: 14px;
  display: flex; align-items: center; gap: 6px;
}
.tech-pills-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
.tech-tag-sm {
  font-size: 0.6875rem; background: var(--bg-secondary);
  border: 1px solid var(--border); padding: 3px 8px; border-radius: 4px;
  font-weight: 600; font-family: monospace; color: var(--text-secondary);
}
.project-btns { display: flex; gap: 10px; }

.exp-list { display: flex; flex-direction: column; gap: 16px; }
.exp-card {
  padding: 20px; border-radius: 12px; background: var(--bg-secondary);
  border: 1px solid var(--border);
}
.exp-heading { font-weight: 700; font-size: 1rem; color: var(--text-primary); }
.exp-dates { font-size: 0.78125rem; color: var(--text-secondary); margin-bottom: 8px; }
.exp-desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; }

.contact-box {
  background: linear-gradient(135deg, var(--bg-secondary), #FFFFFF);
  border: 1px solid var(--border); border-radius: 16px; padding: 36px;
  text-align: center;
}
footer { padding: 48px 0; text-align: center; font-size: 0.8125rem; color: var(--text-secondary); }

@media (max-width: 640px) {
  .hero h1 { font-size: 2rem; }
  .nav-links { display: none; flex-direction: column; width: 100%; padding-top: 16px; gap: 12px; }
  .nav-links.nav-open { display: flex; }
  .mobile-btn { display: block; }
  .nav-wrap { flex-wrap: wrap; height: auto; padding: 14px 0; }
  .projects-stack { grid-template-columns: 1fr; }
}
`;

    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — ${headline}</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="container nav-wrap">
      <a href="#" class="brand">
        <span>${name}</span>
        <span class="brand-badge">${profile.targetRole || 'Engineer'}</span>
      </a>
      <button class="mobile-btn" id="mobile-menu-toggle" aria-label="Toggle navigation">☰</button>
      <ul class="nav-links" id="nav-links">
        ${visibleSections.projects ? '<li><a href="#projects">Projects</a></li>' : ''}
        ${visibleSections.skills ? '<li><a href="#skills">Skills</a></li>' : ''}
        ${visibleSections.experience && experience.length > 0 ? '<li><a href="#experience">Experience</a></li>' : ''}
        ${visibleSections.education && education.length > 0 ? '<li><a href="#education">Education</a></li>' : ''}
        ${visibleSections.contact ? '<li><a href="#contact">Contact</a></li>' : ''}
      </ul>
    </div>
  </header>

  <div class="container">
    <div class="hero">
      <div class="hero-tag">
        <span class="pulse-circle"></span>
        <span>Available for Software Engineering Roles</span>
      </div>
      <h1>${name}</h1>
      <div class="headline">${headline}</div>
      <p class="bio">${about}</p>
      <div class="hero-links">
        ${githubUrl ? `<a href="${githubUrl}" target="_blank" rel="noreferrer" class="btn btn-secondary">${ICONS.github} GitHub</a>` : ''}
        ${linkedinUrl ? `<a href="${linkedinUrl}" target="_blank" rel="noreferrer" class="btn btn-secondary">${ICONS.linkedin} LinkedIn</a>` : ''}
        <a href="#contact" class="btn btn-primary">${ICONS.email} Get In Touch</a>
      </div>
    </div>

    ${visibleSections.skills && skills.length > 0 ? `
    <section id="skills">
      <h2 class="section-title">
        <span>Technical Competencies</span>
      </h2>
      <div class="skills-grid">
        ${skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
        ${softSkills.map(s => `<span class="skill-pill" style="border-style:dashed;">${s}</span>`).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.projects && projectList.length > 0 ? `
    <section id="projects">
      <h2 class="section-title">
        <span>Featured Engineering Projects</span>
        <span class="section-subtitle">${projectList.length} verified projects</span>
      </h2>
      <div class="projects-stack">
        ${projectList.map(p => `
          <div class="project-card">
            <div>
              <div class="project-top">
                <span class="project-name">${p.title}</span>
                <span class="project-category-badge">${p.category}</span>
              </div>
              ${p.problemStatement ? `<div class="problem-box"><strong>Problem:</strong> ${p.problemStatement}</div>` : ''}
              <div class="project-summary">${p.description}</div>
              ${p.keyOutcomes ? `<div class="outcomes-callout">⚡ Impact: ${p.keyOutcomes}</div>` : ''}
            </div>
            <div>
              <div class="tech-pills-row">
                ${p.technologies.map(t => `<span class="tech-tag-sm">${t}</span>`).join('')}
              </div>
              <div class="project-btns">
                ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noreferrer" class="btn btn-secondary" style="font-size:0.75rem; padding:6px 12px; flex:1; justify-content:center;">${ICONS.code} Code</a>` : ''}
                ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" rel="noreferrer" class="btn btn-primary" style="font-size:0.75rem; padding:6px 12px; flex:1; justify-content:center;">${ICONS.external} Live Demo</a>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.experience && experience.length > 0 ? `
    <section id="experience">
      <h2 class="section-title">Experience & Internships</h2>
      <div class="exp-list">
        ${experience.map(e => `
          <div class="exp-card">
            <div class="exp-heading">${e.role} &mdash; ${e.organization}</div>
            <div class="exp-dates">${e.startDate} - ${e.endDate} &bull; ${e.type}</div>
            <div class="exp-desc">${e.description}</div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.education && education.length > 0 ? `
    <section id="education">
      <h2 class="section-title">Education</h2>
      <div class="exp-list">
        ${education.map(ed => `
          <div class="exp-card">
            <div class="exp-heading">${ed.degree} &mdash; ${ed.institution}</div>
            <div class="exp-dates">Year: ${ed.year}${ed.specialization ? ` &bull; ${ed.specialization}` : ''}</div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.certifications && certifications.length > 0 ? `
    <section id="certifications">
      <h2 class="section-title">Certifications & Honors</h2>
      <div class="exp-list">
        ${certifications.map(c => `
          <div class="exp-card">
            <div class="exp-heading">${c.title}</div>
            <div class="exp-dates">${c.issuer} &bull; ${c.year}</div>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${visibleSections.contact ? `
    <section id="contact">
      <div class="contact-box">
        <h2 style="font-size:1.75rem; font-weight:800; margin-bottom:10px;">Get in Touch</h2>
        <p style="color:var(--text-secondary); margin-bottom:20px; max-width:540px; margin-left:auto; margin-right:auto;">
          Open to discussing full-time engineering roles, distributed architecture, and project collaborations.
        </p>
        <a href="mailto:${email}" class="btn btn-primary" style="font-size:0.9375rem; padding:12px 24px;">${ICONS.email} Email ${email}</a>
      </div>
    </section>` : ''}

    <footer>
      &copy; ${new Date().getFullYear()} ${name} &bull; Verified Portfolio Platform
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>`;
  }

  const readme = `# Portfolio Website of ${name}

Generated with **SkillProof** (The Portfolio & Skill-Evidence Platform).

## Template
- **Style:** ${template}
- **Accent Color:** ${accentColor}
- **Primary Role:** ${headline}

## How to Run Locally
1. Simply double-click \`index.html\` or open it in any modern web browser.
2. Or serve it using any local static file server:
   \`\`\`bash
   npx serve .
   \`\`\`

## How to Deploy to GitHub Pages
1. Create a new GitHub repository named \`<your-username>.github.io\`.
2. Push \`index.html\`, \`styles.css\`, and \`script.js\` to the \`main\` branch.
3. Enable GitHub Pages in your repository Settings -> Pages.
4. Your verified portfolio will be live at \`https://<your-username>.github.io\`!
`;

  // Combine into a standalone HTML string for live iframe preview
  const standalonePreviewHtml = html.replace(
    '<link rel="stylesheet" href="styles.css">',
    `<style>${css}</style>`
  ).replace(
    '<script src="script.js"></script>',
    `<script>${js}</script>`
  );

  return {
    template,
    files: {
      'index.html': html,
      'styles.css': css,
      'script.js': js,
      'README.md': readme
    },
    standalonePreviewHtml
  };
}
