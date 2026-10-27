import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Github,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Palette,
  FileCode,
  FileText,
  Check,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { analyzePortfolioApi } from '../services/api';

export default function PortfolioAnalyzer({ profile, setActiveTab }) {
  const [url, setUrl] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [notes, setNotes] = useState('');
  const [activeTabMode, setActiveTabMode] = useState('url'); // 'url' | 'manual'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const targetRole = profile.targetRole || 'Full Stack Developer';

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (activeTabMode === 'url' && !url.trim()) {
        throw new Error('Please enter a valid website URL (e.g. https://yourportfolio.dev or https://username.vercel.app).');
      }
      if (activeTabMode === 'manual' && !manualContent.trim()) {
        throw new Error('Please paste your portfolio text or project descriptions.');
      }

      const result = await analyzePortfolioApi({
        url: activeTabMode === 'url' ? url.trim() : '',
        manualContent: activeTabMode === 'manual' ? manualContent : '',
        targetRole,
        notes: notes.trim()
      });

      setAnalysisResult(result);
    } catch (err) {
      setErrorMessage(err.message || 'Analysis could not be completed. Please verify the URL or try pasting content.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeClass = (score) => {
    if (score >= 90) return 'badge-success';
    if (score >= 75) return 'badge-primary';
    if (score >= 60) return 'badge-primary';
    if (score >= 40) return 'badge-warning';
    return 'badge-danger';
  };

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
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}
        >
          Portfolio Quality & Evidence Audit
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Evaluate any live portfolio website or text against the standardized 100-point rubric calibrated for <strong>{targetRole}</strong>.
        </p>
      </div>

      {/* Input Section */}
      <div className="card">
        {/* Tab switch between URL crawl and Manual Fallback */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', backgroundColor: 'var(--bg-secondary)', padding: '3px', borderRadius: '8px', width: 'fit-content' }}>
          <button
            type="button"
            onClick={() => setActiveTabMode('url')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTabMode === 'url' ? '#FFFFFF' : 'transparent',
              color: activeTabMode === 'url' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTabMode === 'url' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            Website URL Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTabMode('manual')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTabMode === 'manual' ? '#FFFFFF' : 'transparent',
              color: activeTabMode === 'manual' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTabMode === 'manual' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            Manual Text Fallback
          </button>
        </div>

        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTabMode === 'url' ? (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Portfolio Website URL *</label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="url"
                  placeholder="https://yourportfolio.dev or https://username.vercel.app"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
              <span className="form-hint">
                Standard HTTP and HTTPS supported. Analyzes actual page structure, project links, and SPA bundles.
              </span>
            </div>
          ) : (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Portfolio Content / Case Studies Text *</label>
              <textarea
                rows={6}
                placeholder="Paste the text from your existing portfolio (Hero bio, About section, Project descriptions, and listed competencies)..."
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                className="form-control"
              />
              <span className="form-hint">
                Recommended if your site blocks automated bots or runs behind Cloudflare CAPTCHAs.
              </span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Additional Context / Engineering Focus (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Built with React & Tailwind; targeting Entry-Level Full Stack positions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-control"
            />
          </div>

          {errorMessage && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--error-soft)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                color: 'var(--error)',
                fontSize: '0.8125rem',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Analysis Incomplete:</strong> {errorMessage}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Evaluating Live Evidence...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Audit Portfolio Quality</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Score Banner */}
          <div
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              borderLeft: '5px solid var(--primary)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Analyzed Source:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{analysisResult.url}</span>
                <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                  {analysisResult.fetchMethod.replace('_', ' ')}
                </span>
              </div>

              {/* Exact Formatted Score: e.g. 78/100 — Very Good */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
                  {analysisResult.overallScore}
                </span>
                <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/ 100</span>
                <span
                  className={`badge ${getBadgeClass(analysisResult.overallScore)}`}
                  style={{ fontSize: '0.875rem', padding: '4px 10px', fontWeight: 700 }}
                >
                  {analysisResult.scoreLabel}
                </span>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Evaluated against the standardized 100-point rubric for <strong>{analysisResult.targetRole}</strong>.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('portfolio-builder')}
                className="btn btn-primary btn-sm"
              >
                <Palette size={14} />
                <span>Fix in Portfolio Builder</span>
              </button>
              <button
                onClick={() => setActiveTab('prompt-studio')}
                className="btn btn-secondary btn-sm"
              >
                <Sparkles size={14} />
                <span>Generate AI Prompt</span>
              </button>
            </div>
          </div>

          {/* 6 Rubric Criteria Breakdown (Total 100 Points) */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Transparent 6-Criterion Scoring Breakdown
              </h3>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Objective point allocation computed from verified signals found in the portfolio:
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: '14px'
              }}
            >
              {[
                { key: 'visualDesign', title: 'Visual design and readability', max: 20 },
                { key: 'structureNav', title: 'Portfolio structure and navigation', max: 15 },
                { key: 'projectQuality', title: 'Project quality and presentation', max: 25 },
                { key: 'technicalSkills', title: 'Technical skills and evidence', max: 15 },
                { key: 'aboutExperience', title: 'About, experience and profile completeness', max: 10 },
                { key: 'responsivenessLinks', title: 'Responsiveness, accessibility and working links', max: 15 }
              ].map(c => {
                const item = analysisResult.rubric?.[c.key] || { score: 0, max: c.max, title: c.title };
                const pct = Math.round((item.score / item.max) * 100);
                return (
                  <div key={c.key} className="card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', flex: 1, paddingRight: '8px' }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {item.score} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {item.max}</span>
                      </span>
                    </div>

                    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden', marginTop: '6px' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--primary)' : 'var(--warning)',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Weaknesses Side-by-Side */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '20px'
            }}
          >
            {/* Strengths */}
            <div className="card">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--success)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Verified Strengths
              </h3>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                {analysisResult.strengths?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
                {(!analysisResult.strengths || analysisResult.strengths.length === 0) && (
                  <li>No prominent strengths detected.</li>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="card">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} /> Evidence Gaps & Weaknesses
              </h3>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                {analysisResult.weaknesses?.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
                {(!analysisResult.weaknesses || analysisResult.weaknesses.length === 0) && (
                  <li>No critical evidence gaps detected.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Prioritized Improvements */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
              Specific Recommendations for Score Improvement
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {analysisResult.recommendations?.map((rec, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {rec.action}
                    </span>
                    <span className={`badge ${rec.priority === 'High' ? 'badge-warning' : 'badge-neutral'}`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                    <strong>Why this matters:</strong> {rec.why}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
