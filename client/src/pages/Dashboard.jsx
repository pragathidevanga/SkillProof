import React, { useMemo } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Plus,
  Upload,
  Globe,
  Code2,
  Palette,
  ExternalLink,
  Github,
  TrendingUp,
  BarChart3,
  Layers,
  FileText,
  Network,
  User,
  ShieldCheck,
  Clock,
  Check,
  ListTodo
} from 'lucide-react';
import { runLocalReadinessCalculation } from '../services/api';
import { loadProjects, loadPromptHistory, loadAnalysisHistory, loadPortfolioConfig } from '../services/storage';

export default function Dashboard({ profile, setActiveTab, onOpenAddProject }) {
  const projects = profile.projects && profile.projects.length > 0 ? profile.projects : loadProjects();
  const skills = profile.skills || [];
  const targetRole = profile.targetRole || 'Full Stack Developer';
  const promptHistory = loadPromptHistory();
  const analysisHistory = loadAnalysisHistory();
  const portfolioConfig = loadPortfolioConfig();

  // Deterministic calculation based on user's real saved profile
  const scoreReport = useMemo(() => {
    return runLocalReadinessCalculation({ ...profile, projects });
  }, [profile, projects]);

  // Profile completion percentage
  const completionPercentage = useMemo(() => {
    let points = 0;
    if (profile.basic?.fullName) points += 15;
    if (profile.basic?.headline) points += 15;
    if (profile.basic?.about) points += 15;
    if (skills.length > 0) points += 15;
    if (projects.length > 0) points += 20;
    if (profile.resume?.text || profile.resume?.fileName) points += 10;
    if (profile.links?.github) points += 10;
    return Math.min(100, points);
  }, [profile, skills, projects]);

  // Real Checklist status from actual LocalStorage state
  const checklist = useMemo(() => {
    const isProfileDone = Boolean(profile.basic?.fullName && profile.basic?.headline && skills.length >= 2);
    const isProjectDone = projects.length > 0;
    const isLinksDone = Boolean(profile.links?.github || projects.some(p => p.githubUrl || p.demoUrl));
    const isPortfolioDone = Boolean(portfolioConfig?.template && portfolioConfig?.accentColor);
    const isResumeDone = Boolean(profile.resume?.text || profile.resume?.fileName || profile.resume?.analysis);

    return [
      { id: 'step-profile', title: 'Complete your profile', done: isProfileDone, tab: 'profile', hint: 'Add headline, target role, and skills' },
      { id: 'step-project', title: 'Add your first project', done: isProjectDone, tab: 'projects', hint: 'Document problem, tech stack, and outcome' },
      { id: 'step-links', title: 'Add GitHub or demo links', done: isLinksDone, tab: 'profile', hint: 'Provide verifiable proof of code ownership' },
      { id: 'step-portfolio', title: 'Customize your portfolio', done: isPortfolioDone, tab: 'portfolio-builder', hint: 'Select template style and accent palette' },
      { id: 'step-resume', title: 'Analyze your resume', done: isResumeDone, tab: 'resume-analyzer', hint: 'Scan ATS keywords against target role' }
    ];
  }, [profile, skills, projects, portfolioConfig]);

  const completedChecklistCount = checklist.filter(c => c.done).length;

  // Build Recent Activity Feed based on actual saved LocalStorage actions
  const recentActivities = useMemo(() => {
    const list = [];
    if (profile.resume?.parsedAt) {
      list.push({
        id: 'act-resume',
        title: 'Resume Analyzed & Evaluated',
        desc: `Evaluated ${profile.resume.fileName || 'resume text'} for ${targetRole} keywords.`,
        time: new Date(profile.resume.parsedAt).toLocaleDateString(),
        icon: FileText,
        color: 'var(--primary)'
      });
    }
    if (projects.length > 0) {
      list.push({
        id: 'act-proj',
        title: `${projects.length} Technical Projects Documented`,
        desc: `Featured project: ${projects[0]?.title || 'Case study'}.`,
        time: 'Active in storage',
        icon: FolderGit2,
        color: 'var(--success)'
      });
    }
    if (promptHistory.length > 0) {
      list.push({
        id: 'act-prompt',
        title: 'AI Prompts Generated',
        desc: `Saved ${promptHistory.length} prompt specification(s) in AI Prompt Studio.`,
        time: new Date(promptHistory[0]?.createdAt || Date.now()).toLocaleDateString(),
        icon: Sparkles,
        color: 'var(--primary)'
      });
    }
    if (skills.length > 0) {
      list.push({
        id: 'act-skills',
        title: 'Competencies Mapped',
        desc: `${skills.length} technical skills recorded in profile.`,
        time: 'Active',
        icon: Network,
        color: '#2563EB'
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'act-welcome',
        title: 'SkillProof Workspace Ready',
        desc: 'Start by adding your first project or editing your profile.',
        time: 'Just now',
        icon: CheckCircle2,
        color: 'var(--text-muted)'
      });
    }

    return list;
  }, [profile, projects, promptHistory, skills, targetRole]);

  return (
    <div
      style={{
        padding: 'clamp(16px, 3vw, 28px)',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%'
      }}
    >
      {/* 1. Welcome Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                margin: 0
              }}
            >
              {profile.basic?.fullName ? `Welcome back, ${profile.basic.fullName}` : 'Welcome back to SkillProof'}
            </h1>
            <span className="badge badge-primary" style={{ fontWeight: 700 }}>
              {targetRole}
            </span>
            {profile.isSampleData && (
              <span className="badge badge-warning">Demo Preview Data</span>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Your evidence-first command center for tracking skills, portfolio readiness, and job role benchmarks.
          </p>
        </div>

        {/* Primary and Secondary CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('portfolio-builder')}
            className="btn btn-primary btn-sm"
          >
            <Palette size={14} /> <span>Build My Portfolio</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={14} /> <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* 2. Main Overview Stat Cards (4 Columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '16px'
        }}
      >
        {/* Card 1: Readiness Score */}
        <div
          className="card"
          onClick={() => setActiveTab('skill-matcher')}
          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Readiness Score
            </span>
            <span className="badge badge-primary">{scoreReport.statusLabel}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
              {scoreReport.overallScore}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-secondary)', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${scoreReport.overallScore}%`, backgroundColor: 'var(--primary)', transition: 'width 0.4s' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            5 weighted pillars aligned to {targetRole}
          </div>
        </div>

        {/* Card 2: Saved Projects */}
        <div
          className="card"
          onClick={() => setActiveTab('projects')}
          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Documented Projects
            </span>
            <FolderGit2 size={16} color="var(--primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {projects.length}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>projects</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> {projects.filter(p => p.githubUrl).length} with verified GitHub links
          </div>
        </div>

        {/* Card 3: Profile Completion */}
        <div
          className="card"
          onClick={() => setActiveTab('profile')}
          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Profile Completion
            </span>
            <User size={16} color="var(--primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {completionPercentage}%
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-secondary)', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${completionPercentage}%`, backgroundColor: '#0D9488', transition: 'width 0.4s' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {skills.length} skills &bull; {profile.education?.length || 0} degrees
          </div>
        </div>

        {/* Card 4: Portfolio Status */}
        <div
          className="card"
          onClick={() => setActiveTab('portfolio-builder')}
          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Portfolio Status
            </span>
            <Palette size={16} color="var(--primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
              {portfolioConfig?.template || 'Modern'}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> Ready for ZIP export
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Accent: {portfolioConfig?.accentColor || '#635BFF'}
          </div>
        </div>
      </div>

      {/* 3. Portfolio Setup Checklist */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListTodo size={18} color="var(--primary)" />
              <span>Portfolio Setup Checklist</span>
            </h3>
            <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
              {completedChecklistCount} of {checklist.length} tasks completed
            </span>
          </div>
          <div style={{ width: '120px', height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
            <div style={{ width: `${(completedChecklistCount / checklist.length) * 100}%`, height: '100%', backgroundColor: 'var(--success)', transition: 'width 0.3s' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '10px' }}>
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: item.done ? 'var(--success-soft)' : 'var(--bg-secondary)',
                border: '1px solid',
                borderColor: item.done ? 'rgba(13, 148, 136, 0.2)' : 'var(--border)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: item.done ? 'var(--success)' : '#FFFFFF',
                  color: item.done ? '#FFFFFF' : 'var(--border)',
                  border: '1px solid',
                  borderColor: item.done ? 'var(--success)' : 'var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {item.done && <Check size={12} strokeWidth={3} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: item.done ? 'line-through' : 'none' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {item.hint}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Readiness Pillars Breakdown & Recent Activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '20px'
        }}
      >
        {/* Left: 5 Weighted Readiness Pillars */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0 }}>
                Readiness Scoring Pillars
              </h3>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Deterministic formula with 100% transparent weights
              </p>
            </div>
            <button
              onClick={() => setActiveTab('skill-matcher')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Skill Matcher <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { key: 'skills', title: 'Skills & Role Alignment', weight: '25%', score: scoreReport.categories.skills.score, tab: 'skill-matcher' },
              { key: 'projects', title: 'Project Quality & Relevance', weight: '25%', score: scoreReport.categories.projects.score, tab: 'projects' },
              { key: 'evidence', title: 'Evidence & Link Completeness', weight: '20%', score: scoreReport.categories.evidence.score, tab: 'projects' },
              { key: 'resume', title: 'Resume & Experience', weight: '15%', score: scoreReport.categories.resume.score, tab: 'resume-analyzer' },
              { key: 'structure', title: 'Portfolio Presentation', weight: '15%', score: scoreReport.categories.structure.score, tab: 'portfolio-builder' }
            ].map(pillar => (
              <div
                key={pillar.key}
                onClick={() => setActiveTab(pillar.tab)}
                style={{ cursor: 'pointer', padding: '8px 10px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', transition: 'background 0.15s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pillar.title}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Wt: {pillar.weight}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{pillar.score}/100</span>
                  </div>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pillar.score}%`, backgroundColor: 'var(--primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Activity Feed */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0 }}>
              Recent Application Activity
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LocalStorage Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map(act => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: act.color,
                      flexShrink: 0,
                      border: '1px solid var(--border)'
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.84375rem', color: 'var(--text-primary)' }}>
                        {act.title}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {act.time}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {act.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Quick Actions Launchers */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px' }}>
          Quick Action Shortcuts
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '12px'
          }}
        >
          {[
            { id: 'profile', title: 'Edit Profile', desc: 'Update skills & degrees', icon: User },
            { id: 'projects', title: 'Add Project', desc: 'Document code & demos', icon: Plus },
            { id: 'portfolio-builder', title: 'Build Portfolio', desc: 'Export static ZIP site', icon: Palette },
            { id: 'resume-analyzer', title: 'Analyze Resume', desc: 'ATS keyword scanning', icon: FileText },
            { id: 'skill-matcher', title: 'Match Skills', desc: 'Target role alignment', icon: Network },
            { id: 'prompt-studio', title: 'Generate AI Prompt', desc: 'Antigravity & ChatGPT', icon: Sparkles }
          ].map(tool => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Icon size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 700, fontSize: '0.84375rem', color: 'var(--text-primary)' }}>{tool.title}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tool.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
