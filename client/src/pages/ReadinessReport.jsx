import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Award,
  Calendar,
  Layers,
  FileText,
  FolderGit2
} from 'lucide-react';
import { runLocalReadinessCalculation } from '../services/api';

export default function ReadinessReport({ profile, setActiveTab }) {
  const [copied, setCopied] = useState(false);

  // Always compute from latest profile data
  const report = useMemo(() => {
    return runLocalReadinessCalculation(profile);
  }, [profile]);

  const userName = profile.basic?.fullName || 'Candidate';
  const targetRole = profile.targetRole || 'Full Stack Developer';

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `SkillProof Portfolio Readiness Report
Candidate: ${userName}
Target Role: ${targetRole}
Overall Readiness Score: ${report.overallScore}/100 (${report.statusLabel})
Calculated: ${new Date(report.calculatedAt).toLocaleString()}

Category Breakdown:
- Skills & Role Alignment: ${report.categories.skills.score}/100 (Weight: 25%)
- Project Quality & Relevance: ${report.categories.projects.score}/100 (Weight: 25%)
- Evidence & Link Completeness: ${report.categories.evidence.score}/100 (Weight: 20%)
- Resume & Experience: ${report.categories.resume.score}/100 (Weight: 15%)
- Portfolio Presentation: ${report.categories.structure.score}/100 (Weight: 15%)

Missing Evidence:
${report.missingEvidence.map(m => `- ${m}`).join('\n')}

Priority Actions:
${report.nextActions.map(a => `- ${a.action} (${a.impact})`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Official Readiness Audit
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <Calendar size={14} />
            <span>Generated: {new Date(report.calculatedAt).toLocaleDateString()} at {new Date(report.calculatedAt).toLocaleTimeString()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleCopySummary} className="btn btn-secondary btn-sm">
            {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
          </button>
          <button onClick={handlePrint} className="btn btn-primary btn-sm">
            <Printer size={14} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Printable Report Container */}
      <div
        className="card"
        style={{
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Report Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>SkillProof Verification Report</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {userName}
            </h2>
            <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              Target Job Role: <strong>{targetRole}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Readiness Composite
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, marginTop: '4px' }}>
              {report.overallScore}<span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
            <span className={`badge ${report.overallScore >= 75 ? 'badge-success' : report.overallScore >= 45 ? 'badge-primary' : 'badge-warning'}`} style={{ marginTop: '6px' }}>
              {report.statusLabel}
            </span>
          </div>
        </div>

        {/* 5-Pillar Normalized Breakdown */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
            5-Pillar Weighted Score Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skills Alignment (25%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>{report.categories.skills.score}/100</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {report.categories.skills.matchedCount} of {report.categories.skills.benchmarkTotal} matched
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project Quality (25%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>{report.categories.projects.score}/100</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {report.categories.projects.totalProjects} projects documented
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evidence Completeness (20%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>{report.categories.evidence.score}/100</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {report.categories.evidence.projectsWithGithub} repos, {report.categories.evidence.projectsWithDemo} demos
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resume & Experience (15%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>{report.categories.resume.score}/100</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {report.categories.resume.hasResume ? 'Resume attached' : 'No resume'}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Structure & Design (15%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>{report.categories.structure.score}/100</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Bio & branding complete
              </div>
            </div>
          </div>
        </div>

        {/* Increases vs Reductions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ padding: '18px', borderRadius: '10px', backgroundColor: 'var(--success-soft)', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--success)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> What Increased The Score
            </div>
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
              {report.increases.map((inc, i) => (
                <li key={i}>{inc.message}</li>
              ))}
            </ul>
          </div>

          <div style={{ padding: '18px', borderRadius: '10px', backgroundColor: 'var(--warning-soft)', border: '1px solid rgba(183, 121, 31, 0.2)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--warning)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> What Reduced The Score
            </div>
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
              {report.reductions.map((red, i) => (
                <li key={i}>{red.message}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Missing Evidence List */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            Missing Technical Evidence Checklist
          </h3>
          {report.missingEvidence.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {report.missingEvidence.map((ev, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <AlertCircle size={15} color="var(--warning)" style={{ flexShrink: 0 }} />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--success-soft)', color: 'var(--success)', fontSize: '0.84375rem', fontWeight: 600 }}>
              All core evidence requirements satisfied!
            </div>
          )}
        </div>

        {/* Next Prioritized Actions */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            Recommended Action Plan
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {report.nextActions.map((action, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.84375rem', color: 'var(--text-primary)' }}>
                    Step {i + 1}: {action.action}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, marginTop: '2px' }}>
                    Impact: {action.impact}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab(action.targetTab)}
                  className="btn btn-secondary btn-sm no-print"
                >
                  <span>Fix Issue</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer & Disclaimer */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <strong>Scoring Methodology Disclaimer:</strong> The SkillProof Portfolio Readiness Score is a deterministic composite measuring documentation completeness, role-skill coverage, and verified URL evidence relative to industry expectations for {targetRole}. It is not an employment guarantee and does not predict specific hiring selections.
        </div>
      </div>
    </div>
  );
}
