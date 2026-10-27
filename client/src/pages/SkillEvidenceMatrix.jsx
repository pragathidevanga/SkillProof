import React, { useMemo } from 'react';
import {
  Network,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Github,
  Plus,
  ShieldCheck,
  Layers,
  Code2
} from 'lucide-react';

const ROLE_BENCHMARK_SKILLS = {
  'frontend developer': ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS', 'Tailwind', 'Git', 'Responsive Design', 'REST APIs', 'Web Performance'],
  'full stack developer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'LocalStorage', 'REST APIs', 'Git', 'Docker', 'Deployment'],
  'backend developer': ['Node.js', 'Express', 'Python', 'SQL', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker', 'Microservices', 'Git'],
  'data analyst': ['SQL', 'Python', 'Pandas', 'NumPy', 'Excel', 'Tableau', 'Power BI', 'Data Visualization', 'Statistics', 'ETL'],
  'machine learning engineer': ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Docker', 'MLOps', 'Model Evaluation'],
  'ai/ml developer': ['Python', 'LLMs', 'LangChain', 'OpenAI', 'PyTorch', 'Vector Databases', 'RAG', 'REST APIs', 'FastAPI'],
  'software developer': ['Git', 'Data Structures', 'Algorithms', 'Testing', 'Debugging', 'CI/CD', 'Agile', 'System Design', 'REST APIs']
};

export default function SkillEvidenceMatrix({ profile, onProfileUpdate, setActiveTab }) {
  const targetRole = profile.targetRole || 'Full Stack Developer';
  const roleKey = targetRole.toLowerCase();
  const benchmarkSkills = ROLE_BENCHMARK_SKILLS[roleKey] || ROLE_BENCHMARK_SKILLS['software developer'];

  const userSkills = (profile.skills || []).map(s => (typeof s === 'string' ? s : s.name || ''));
  const projects = profile.projects || [];

  // Calculate evidence level (1 to 5) for each benchmark skill
  const skillEvidenceData = useMemo(() => {
    return benchmarkSkills.map(skill => {
      const lowerSkill = skill.toLowerCase();
      const isSelfReported = userSkills.some(u => u.toLowerCase().includes(lowerSkill) || lowerSkill.includes(u.toLowerCase()));
      
      // Check which projects mention or demonstrate this skill
      const linkedProjects = projects.filter(p => {
        const inTech = (p.technologies || []).some(t => t.toLowerCase().includes(lowerSkill) || lowerSkill.includes(t.toLowerCase()));
        const inSkills = (p.skillsDemonstrated || []).some(s => s.toLowerCase().includes(lowerSkill) || lowerSkill.includes(s.toLowerCase()));
        const inDesc = (p.description || '').toLowerCase().includes(lowerSkill);
        return inTech || inSkills || inDesc;
      });

      const hasLinkedProjects = linkedProjects.length > 0;
      const hasLinks = linkedProjects.some(p => Boolean(p.githubUrl || p.demoUrl));
      const hasLiveOrRepo = linkedProjects.some(p => (p.githubUrl && p.githubUrl.includes('github.com')) || (p.demoUrl && p.demoUrl.startsWith('http')));
      const hasVerifiedByUser = linkedProjects.some(p => Boolean(p.verifiedByUser));

      let level = 0;
      let label = 'Missing Competency';
      let badgeClass = 'badge-neutral';

      if (hasVerifiedByUser) {
        level = 5;
        label = 'Level 5: User-Verified Proof';
        badgeClass = 'badge-success';
      } else if (hasLiveOrRepo) {
        level = 4;
        label = 'Level 4: Accessible Demo / Repo';
        badgeClass = 'badge-primary';
      } else if (hasLinks) {
        level = 3;
        label = 'Level 3: Project Link Recorded';
        badgeClass = 'badge-primary';
      } else if (hasLinkedProjects) {
        level = 2;
        label = 'Level 2: Project Mention Only';
        badgeClass = 'badge-warning';
      } else if (isSelfReported) {
        level = 1;
        label = 'Level 1: Self-Reported Claim';
        badgeClass = 'badge-warning';
      }

      return {
        skill,
        level,
        label,
        badgeClass,
        linkedProjects
      };
    });
  }, [benchmarkSkills, userSkills, projects]);

  const matchedCount = skillEvidenceData.filter(s => s.level >= 3).length;
  const partialCount = skillEvidenceData.filter(s => s.level === 1 || s.level === 2).length;
  const missingCount = skillEvidenceData.filter(s => s.level === 0).length;

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Skill-to-Evidence Matrix
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Mapping role expectations for <strong>{targetRole}</strong> against 5 transparent evidence tiers.
        </p>
      </div>

      {/* 5 Evidence Levels Legend */}
      <div className="card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
          5-Tier Evidence Hierarchy
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Tier 1: Self-Reported</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Claimed in skill tags; no project attached.</div>
          </div>
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--warning)' }}>Tier 2: Mentioned in Project</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Referenced in description without URL.</div>
          </div>
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--primary)' }}>Tier 3: Link Recorded</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Accompanied by a formatted URL.</div>
          </div>
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--primary)' }}>Tier 4: Live Demo / Repo</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Public GitHub repo or Vercel URL.</div>
          </div>
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--success)' }}>Tier 5: User-Verified Proof</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Attested by author as authentic work.</div>
          </div>
        </div>
        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          * Notice: Evidence tiers measure documentation completeness and transparency. They do not constitute an accredited or certified evaluation.
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Supported With Evidence</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>{matchedCount} Skills</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tiers 3, 4, and 5</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Partially Documented</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>{partialCount} Skills</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tiers 1 and 2 (Self-reported/Mentioned)</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Missing Evidence Gaps</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--error)', marginTop: '4px' }}>{missingCount} Skills</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No mention in profile or projects</div>
        </div>
      </div>

      {/* Main Evidence Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Competency Verification Breakdown</h3>
          <span className="badge badge-neutral">{skillEvidenceData.length} Target Skills</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84375rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>Competency</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>Evidence Status</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>Demonstrating Projects</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'right' }}>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {skillEvidenceData.map((item, idx) => (
                <tr
                  key={item.skill}
                  style={{
                    borderBottom: idx !== skillEvidenceData.length - 1 ? '1px solid var(--border)' : 'none'
                  }}
                >
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.skill}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${item.badgeClass}`}>
                      {item.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {item.linkedProjects.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {item.linkedProjects.map(p => (
                          <span
                            key={p.id}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-secondary)',
                              border: '1px solid var(--border)',
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {p.title}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78125rem' }}>
                        No project attached
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {item.level < 3 ? (
                      <button
                        onClick={() => setActiveTab('projects')}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        <Plus size={12} /> Add Evidence
                      </button>
                    ) : (
                      <span style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600 }}>
                        ✓ Documented
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
