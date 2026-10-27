import React, { useState, useMemo, useEffect } from 'react';
import {
  Network,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Plus,
  Layers,
  Code2,
  ExternalLink,
  BookOpen,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';
import { matchSkillsApi } from '../services/api';

export default function SkillMatcher({ profile, onProfileUpdate, setActiveTab }) {
  const [selectedRole, setSelectedRole] = useState(profile.targetRole || 'Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState(profile.experienceLevel || 'Entry-Level / Fresher');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState('');

  const availableRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Machine Learning Engineer',
    'Python Developer',
    'Software Developer'
  ];

  const experienceLevels = [
    'Entry-Level / Fresher',
    'Mid-Level (1-3 years)',
    'Senior (4+ years)'
  ];

  const userSkills = useMemo(() => {
    return (profile.skills || []).map(s => (typeof s === 'string' ? s : s.name || '')).filter(Boolean);
  }, [profile.skills]);

  // Run skill match
  const handleRunMatch = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await matchSkillsApi({
        targetRole: selectedRole,
        skills: userSkills,
        jobDescription: jobDescription.trim(),
        experienceLevel
      });
      setMatchResult(res);
    } catch (err) {
      console.error('Skill matcher error:', err);
      setError('Unable to analyze skills. Please verify your connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run automatically on first mount or when user role changes
  useEffect(() => {
    handleRunMatch();
  }, [selectedRole, experienceLevel, userSkills.length]);

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
          Skill Matcher & Role Alignment
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Evaluate your skills against industry benchmarks or paste an employer's job description for custom keyword extraction.
        </p>
      </div>

      {/* Main Grid: Responsive 2-column on desktop, 1-column on mobile/tablet */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* LEFT COLUMN: Input Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Target Role & Requirements
            </h2>

            {/* Target Role Selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Target Role Benchmark</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="form-control"
                style={{ fontWeight: 600, color: 'var(--primary)' }}
              >
                {availableRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Experience Level Selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="form-control"
              >
                {experienceLevels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Profile Skills Summary */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Skills from Your Profile ({userSkills.length})
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Edit in Profile
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
                {userSkills.map(s => (
                  <span
                    key={s}
                    className="badge badge-neutral"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {s}
                  </span>
                ))}
                {userSkills.length === 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    No skills added yet. Add skills in My Profile to see matches.
                  </span>
                )}
              </div>
            </div>

            {/* Job Description Textarea */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Paste Job Description (Optional)
                </label>
                {jobDescription && (
                  <button
                    type="button"
                    onClick={() => setJobDescription('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Clear text
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste requirements, job posting bullet points, or required technologies here to extract custom role keywords..."
                className="form-control"
                style={{ fontSize: '0.8125rem', resize: 'vertical' }}
              />
              <span className="form-hint">
                Extracts required tools and tech stacks dynamically from employer postings.
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--error-soft)',
                  color: 'var(--error)',
                  fontSize: '0.8125rem'
                }}
              >
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              type="button"
              onClick={handleRunMatch}
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {isLoading ? (
                <>
                  <div
                    className="animate-spin"
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '2px solid #FFFFFF',
                      borderTopColor: 'transparent'
                    }}
                  />
                  <span>Analyzing Match...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Analyze Skills Match</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Loading State Overlay / Skeleton */}
          {isLoading && (
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                gap: '16px',
                textAlign: 'center'
              }}
            >
              <div
                className="animate-spin"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '3px solid var(--border)',
                  borderTopColor: 'var(--primary)'
                }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  Evaluating Competencies...
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Benchmarking your profile against {selectedRole} requirements
                </div>
              </div>
            </div>
          )}

          {/* Empty State before any analysis */}
          {!isLoading && !matchResult && (
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                gap: '16px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-soft)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Network size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Ready to analyze your skills
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '320px', marginTop: '4px' }}>
                  Select a target role or paste an employer's job description, then click "Analyze Skills Match".
                </p>
              </div>
            </div>
          )}

          {/* Results View */}
          {!isLoading && matchResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Circular Gauge / Percentage Card */}
              <div
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Conic Gradient Gauge */}
                <div
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    background: `conic-gradient(var(--primary) ${matchResult.matchPercentage * 3.6}deg, var(--bg-secondary) 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: 'var(--primary)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1
                      }}
                    >
                      {matchResult.matchPercentage}%
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase'
                      }}
                    >
                      Match
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Text */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {matchResult.targetRole}
                    </h3>
                    <span
                      className={`badge ${
                        matchResult.matchPercentage >= 70 ? 'badge-success' :
                        matchResult.matchPercentage >= 45 ? 'badge-warning' : 'badge-neutral'
                      }`}
                    >
                      {matchResult.matchPercentage >= 70 ? 'Strong Alignment' :
                       matchResult.matchPercentage >= 45 ? 'Moderate Alignment' : 'Building Foundations'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                    You have verified <strong>{matchResult.matchedCount} of {matchResult.totalRequired}</strong> core competencies expected for {matchResult.targetRole}.
                  </p>

                  {matchResult.extractedJobSkills && matchResult.extractedJobSkills.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <Sparkles size={13} color="var(--primary)" />
                      <span>Extracted {matchResult.extractedJobSkills.length} custom keywords from job posting.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                  gap: '16px'
                }}
              >
                {/* Matched Skills Card */}
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>
                      Matched Skills ({matchResult.matchedSkills.length})
                    </h4>
                  </div>
                  {matchResult.matchedSkills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {matchResult.matchedSkills.map(skill => (
                        <span key={skill} className="skill-chip skill-chip-matched">
                          <Check size={12} /> {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
                      No exact matches yet. Add relevant competencies in My Profile.
                    </p>
                  )}

                  {/* Additional profile strengths */}
                  {matchResult.additionalSkills && matchResult.additionalSkills.length > 0 && (
                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Additional Profile Strengths
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {matchResult.additionalSkills.map(s => (
                          <span key={s} className="skill-chip skill-chip-neutral" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Missing Skills Card */}
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <AlertCircle size={16} color="var(--warning)" />
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>
                      Missing Skills ({matchResult.missingSkills.length})
                    </h4>
                  </div>
                  {matchResult.missingSkills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {matchResult.missingSkills.map(skill => (
                        <span key={skill} className="skill-chip skill-chip-missing">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '10px', backgroundColor: 'var(--success-soft)', borderRadius: '6px', fontSize: '0.78125rem', color: 'var(--success)' }}>
                      All primary benchmarks covered for this role.
                    </div>
                  )}
                </div>
              </div>

              {/* Prioritized Learning Roadmap */}
              {matchResult.prioritizedLearningChecklist && matchResult.prioritizedLearningChecklist.length > 0 && (
                <div className="card" style={{ padding: '18px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                    Prioritized Learning Recommendations
                  </h4>
                  <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Sequenced learning path to address key skill gaps with the highest hiring impact:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {matchResult.prioritizedLearningChecklist.map((item, idx) => (
                      <div
                        key={item.skill}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '10px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{idx + 1}. {item.skill}</span>
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: item.priority === 'High' ? 'var(--error-soft)' : 'var(--warning-soft)',
                                color: item.priority === 'High' ? 'var(--error)' : 'var(--warning)'
                              }}
                            >
                              {item.priority} Priority
                            </span>
                            <span style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                              ~{item.estimatedWeeks}w
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {item.reason}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveTab('prompt-studio')}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.71875rem' }}
                        >
                          <Sparkles size={12} /> Prompt
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Project Evidence */}
              {matchResult.suggestedProjects && matchResult.suggestedProjects.length > 0 && (
                <div className="card" style={{ padding: '18px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                    Suggested Project Ideas
                  </h4>
                  <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Project concepts to build and prove missing competencies (uncompleted project concepts):
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                      gap: '12px'
                    }}
                  >
                    {matchResult.suggestedProjects.map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          backgroundColor: '#FFFFFF',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {p.title}
                          </div>
                          <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {p.description}
                          </p>
                        </div>
                        <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border)', paddingTop: '6px' }}>
                          <strong>Deliverable:</strong> {p.keyDeliverable}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transparency Notice */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.4
                }}
              >
                <strong>Transparency Notice:</strong> {matchResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
