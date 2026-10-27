import React, { useState } from 'react';
import {
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Layers,
  ChevronDown,
  Laptop,
  Check,
  Lock,
  Compass,
  Eye,
  EyeOff,
  Code2,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function LandingPage({ onLogin, onOpenDemo }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'
  const [targetDestination, setTargetDestination] = useState('dashboard');
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState('modern');

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleOpenAuth = (mode = 'login', destination = 'dashboard') => {
    setAuthModalMode(mode);
    setTargetDestination(destination);
    setShowSignInModal(true);
  };

  const faqs = [
    {
      q: 'How is the Portfolio Readiness Score calculated?',
      a: 'SkillProof calculates a transparent composite score based on 5 weighted pillars: Skills & Target Role Alignment (25%), Project Quality & Relevance (25%), Evidence & Link Completeness (20%), Resume & Experience (15%), and Portfolio Presentation (15%). It measures concrete documentation completeness relative to your chosen role benchmark.'
    },
    {
      q: 'Do I need paid AI API keys to use SkillProof?',
      a: 'No paid API keys are required. SkillProof operates completely free out of the box using deterministic analysis engines, benchmark libraries, and structured prompt generators that run directly in your environment.'
    },
    {
      q: 'Where is my data stored?',
      a: 'All profile records, projects, and analysis reports are persisted in your browser via LocalStorage. Your data remains entirely private on your device, and you can export or import your workspace JSON backup anytime in Settings.'
    },
    {
      q: 'Can I analyze an existing external portfolio or resume?',
      a: 'Yes. The Portfolio Analyzer safely audits public URLs with SSRF protection or analyzes pasted text directly. The Resume Analyzer parses selectable PDF/DOCX files or pasted resume text to benchmark ATS keywords against your target role.'
    },
    {
      q: 'How does SkillProof help me use ChatGPT or Google Antigravity?',
      a: 'The AI Prompt Studio crafts production-ready specifications across 12 categories, embedding your actual project outcomes, metrics, and technology constraints so you can build and polish code with AI tools effectively.'
    }
  ];

  const targetRoles = [
    { name: 'Full Stack Developer', tags: ['React', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git', 'Docker'] },
    { name: 'Frontend Developer', tags: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Web Vitals'] },
    { name: 'Backend Developer', tags: ['Node.js', 'Python', 'Go', 'Databases', 'Microservices', 'Docker'] },
    { name: 'Data Analyst', tags: ['SQL', 'Python', 'Pandas', 'Tableau', 'Power BI', 'ETL'] },
    { name: 'Machine Learning Engineer', tags: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'MLOps', 'Docker'] },
    { name: 'Python Developer', tags: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Unit Testing'] },
    { name: 'Software Developer', tags: ['Data Structures', 'Algorithms', 'Testing', 'CI/CD', 'Git'] }
  ];

  const templates = [
    {
      id: 'minimal',
      name: 'Minimal Professional',
      desc: 'Elegant, typography-focused layout with restrained borders and editorial clarity.',
      accent: '#1E293B'
    },
    {
      id: 'modern',
      name: 'Modern Developer',
      desc: 'Technical, outcome-driven layout with status badges, problem statements, and metrics.',
      accent: '#635BFF'
    },
    {
      id: 'creative',
      name: 'Creative Portfolio',
      desc: 'Visually expressive with asymmetric hero presentation and elevated project cards.',
      accent: '#0D9488'
    }
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header / Navigation */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 50
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Award size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Skill<span style={{ color: 'var(--primary)' }}>Proof</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="landing-nav">
            <a href="#features" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Features</a>
            <a href="#how-it-works" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>How It Works</a>
            <a href="#templates" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Templates</a>
            <a href="#sample-report" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Sample Readiness</a>
            <a href="#faq" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>FAQ</a>
          </nav>

          {/* Auth Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => handleOpenAuth('login', 'dashboard')}
              className="btn btn-ghost btn-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => handleOpenAuth('signup', 'portfolio-builder')}
              className="btn btn-primary btn-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{ padding: '72px 24px 80px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }} className="hero-grid">
          {/* Left Column: Value Proposition */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-soft)',
                border: '1px solid rgba(99, 91, 255, 0.2)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--primary)',
                marginBottom: '20px'
              }}
            >
              <Sparkles size={14} />
              <span>Evidence-First Career & Portfolio Platform</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: '20px'
              }}
            >
              Build a Portfolio That <br />
              <span style={{ color: 'var(--primary)' }}>Proves Your Skills.</span>
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                maxWidth: '540px'
              }}
            >
              SkillProof helps students and software job seekers organize skills, document verified project evidence, audit resumes, benchmark readiness for target roles, and export professional portfolio websites.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleOpenAuth('signup', 'portfolio-builder')}
                className="btn btn-primary btn-lg"
              >
                <span>Build My Portfolio</span>
                <ArrowRight size={18} />
              </button>

              <a
                href="#features"
                className="btn btn-secondary btn-lg"
              >
                <span>Explore Features</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>Deterministic Scoring</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>No Paid API Required</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>Local-First Privacy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Dashboard / Portfolio Preview */}
          <div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
                padding: '24px',
                position: 'relative'
              }}
            >
              {/* Illustrative Watermark Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  marginBottom: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  <Compass size={13} />
                  <span>Interactive Product Preview</span>
                </div>
                <span className="badge badge-warning">Sample Preview Data</span>
              </div>

              {/* Candidate Quick Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Alex Morgan</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Targeting: <strong>Full Stack Developer</strong></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                    78<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>
                    Competitive Profile
                  </div>
                </div>
              </div>

              {/* Completeness Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Profile & Evidence Completeness</span>
                  <span style={{ color: 'var(--text-primary)' }}>85%</span>
                </div>
                <div style={{ height: '7px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Skill-to-Evidence Mapping Snippet */}
              <div style={{ marginBottom: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Skill-to-Evidence Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 600 }}>React + WebSockets</span>
                    <span className="badge badge-success">Live Demo Verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 600 }}>PostgreSQL + Queries</span>
                    <span className="badge badge-primary">GitHub Repository</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 600 }}>Docker / MLOps</span>
                    <span className="badge badge-warning">Self-Reported Only</span>
                  </div>
                </div>
              </div>

              {/* High-Impact Action */}
              <div style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--primary-soft)', border: '1px solid rgba(99, 91, 255, 0.15)' }}>
                <AlertCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                  <strong>Prioritized Action:</strong> Add verified Docker container configuration to your project repository to unlock +8 evidence points.
                </div>
              </div>

              {/* Interactive CTA */}
              <button
                onClick={() => handleOpenAuth('signup', 'portfolio-builder')}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--text-primary)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Build My Portfolio Website</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Overview */}
      <section id="features" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Everything You Need for Career Readiness
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
              Transform unverified resume claims into concrete proof with integrated portfolio building, skill matching, and AI prompt generation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Feature 1 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Laptop size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>Portfolio Builder & ZIP Export</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                Choose between 3 distinct architectural templates, toggle sections, select accent palettes, and export standalone HTML/CSS/JS ready to deploy to GitHub Pages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-soft)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>Skill Matcher & Gap Analysis</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                Benchmark your profile against 7 core software roles or paste an employer's job description to extract demanded keywords, matched skills, and learning checklists.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--warning-soft)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FileSearch size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>Resume & Portfolio Analyzers</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                Extract and evaluate selectable PDF/DOCX resumes for ATS readability and scan external portfolio URLs with SSRF protection and honest fallback handling.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>AI Prompt Studio (12 Categories)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                Generate tailored, context-injected prompts for Google Antigravity or ChatGPT to accelerate code implementation, write READMEs, and prepare for interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works (5 Numbered Steps) */}
      <section id="how-it-works" style={{ padding: '80px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              How SkillProof Works
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              From initial project input to an evidence-backed developer portfolio in 5 clear steps:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                num: 1,
                title: 'Create Your Profile',
                desc: 'Set up your headline, degree, technical competencies, and GitHub/LinkedIn links through our guided onboarding wizard.'
              },
              {
                num: 2,
                title: 'Add Projects & Evidence',
                desc: 'Document case studies with concrete problem statements, outcomes, quantifiable metrics, and verified repository links.'
              },
              {
                num: 3,
                title: 'Build Your Portfolio',
                desc: 'Select from 3 distinct templates, customize typography and accent palettes, and export standalone production code.'
              },
              {
                num: 4,
                title: 'Analyze Your Resume & Skills',
                desc: 'Run ATS readability scans and benchmark your competencies against job postings to identify high-priority skill gaps.'
              },
              {
                num: 5,
                title: 'Improve Your Readiness',
                desc: 'Follow prioritized learning recommendations and generate tailored AI prompts to build projects that close your gaps.'
              }
            ].map(step => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '18px',
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    flexShrink: 0
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Portfolio Templates Showcase */}
      <section id="templates" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              3 Distinct Portfolio Templates
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
              SkillProof generates standalone, clean HTML/CSS websites tailored to different developer presentation styles.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {templates.map(tpl => (
              <div
                key={tpl.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `4px solid ${tpl.accent}`,
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{tpl.name}</h3>
                  <span className="badge badge-primary">Standalone ZIP</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                  {tpl.desc}
                </p>

                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup', 'portfolio-builder')}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  <span>Build with {tpl.name}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Sample Readiness Report (Clearly Labeled Illustrative Data) */}
      <section id="sample-report" style={{ padding: '80px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--warning-soft)',
                color: 'var(--warning)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}
            >
              Illustrative Demo Data
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Sample 5-Pillar Readiness Audit
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              See how SkillProof evaluates candidates against target roles across 5 weighted pillars.
            </p>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Composite Readiness Score: 78 / 100
                </h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Target Benchmark: Full Stack Developer (Entry-Level / Fresher)
                </span>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.8125rem', padding: '4px 10px' }}>
                Competitive Profile
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'Skills & Role Alignment', weight: '25%', score: 82, color: 'var(--primary)' },
                { name: 'Project Quality & Relevance', weight: '25%', score: 75, color: 'var(--primary)' },
                { name: 'Evidence & Link Completeness', weight: '20%', score: 85, color: 'var(--success)' },
                { name: 'Resume & Experience', weight: '15%', score: 70, color: 'var(--warning)' },
                { name: 'Portfolio Structure & Presentation', weight: '15%', score: 78, color: 'var(--primary)' }
              ].map(pillar => (
                <div key={pillar.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                    <span>{pillar.name} ({pillar.weight})</span>
                    <span>{pillar.score}%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
                    <div style={{ width: `${pillar.score}%`, height: '100%', backgroundColor: pillar.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                * Scores are computed deterministically. They do not constitute an employer hiring guarantee.
              </span>
              <button
                type="button"
                onClick={() => handleOpenAuth('signup', 'dashboard')}
                className="btn btn-primary btn-sm"
              >
                Compute Your Real Score
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Supported Role Benchmarks */}
      <section id="roles" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Standardized Role Benchmarks
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Built-in benchmark competencies for 7 standard software engineering paths:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {targetRoles.map(role => (
              <div
                key={role.name}
                className="card"
                style={{ padding: '16px' }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {role.name}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {role.tags.map(tag => (
                    <span key={tag} className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQs */}
      <section id="faq" style={{ padding: '80px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Clear answers on how SkillProof stores data and calculates readiness.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="card"
                style={{ padding: '18px', cursor: 'pointer' }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    color="var(--text-muted)"
                    style={{
                      transform: openFaq === idx ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </div>
                {openFaq === idx && (
                  <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '12px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Professional Footer */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)', padding: '48px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Award size={18} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)' }}>
                Skill<span style={{ color: 'var(--primary)' }}>Proof</span>
              </span>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                Your work speaks. Make the proof visible.
              </p>
            </div>
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            Browser-based local prototype • LocalStorage persistence • Single-host deployment ready
          </div>
        </div>
      </footer>

      {/* Sign In & Sign Up Modal */}
      {showSignInModal && (
        <SignInModal
          initialMode={authModalMode}
          targetDestination={targetDestination}
          onClose={() => setShowSignInModal(false)}
          onLogin={onLogin}
          onOpenDemo={onOpenDemo}
        />
      )}
    </div>
  );
}

function SignInModal({ initialMode = 'login', targetDestination = 'dashboard', onClose, onLogin, onOpenDemo }) {
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters for this local session.');
      return;
    }

    if (authMode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (confirmPassword && confirmPassword !== password) {
        setError('Passwords do not match.');
        return;
      }
    }

    onClose();
    if (authMode === 'signup') {
      onLogin({
        email: email.trim(),
        name: fullName.trim(),
        isNewUser: true,
        targetDestination
      });
    } else {
      onLogin({
        email: email.trim(),
        name: fullName.trim() || 'SkillProof Developer',
        isNewUser: false,
        targetDestination
      });
    }
  };

  const handleDemoClick = () => {
    onClose();
    if (onOpenDemo) onOpenDemo(targetDestination);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>SkillProof Access</span>
          </div>
          <span className="badge badge-primary">Local Session</span>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            padding: '3px',
            marginBottom: '16px'
          }}
        >
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: authMode === 'login' ? '#FFFFFF' : 'transparent',
              color: authMode === 'login' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: authMode === 'login' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: authMode === 'signup' ? '#FFFFFF' : 'transparent',
              color: authMode === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: authMode === 'signup' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            Create Account (Sign Up)
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'var(--error-soft)',
              color: 'var(--error)',
              fontSize: '0.8125rem',
              marginBottom: '14px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authMode === 'signup' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="form-control"
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password *</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-control"
            />
          </div>

          {authMode === 'signup' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password (Optional)</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '6px' }}
          >
            {authMode === 'login' ? 'Sign In to Workspace' : 'Create Account & Start Onboarding'}
          </button>
        </form>

        {/* Demo Mode Button */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '18px 0 14px' }}>
          <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#FFFFFF',
              padding: '0 8px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}
          >
            or instant test
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoClick}
          className="btn btn-secondary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <Sparkles size={14} color="var(--primary)" />
          <span>Enter 1-Click Demo Mode (No Setup)</span>
        </button>

        <p style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '14px', lineHeight: 1.4 }}>
          This prototype runs locally in your browser. All data persists via <strong>browser LocalStorage</strong>. Real passwords are not stored in plain text.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
