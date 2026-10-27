import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Wrench,
  Camera,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { saveProfile } from '../services/storage';

export default function OnboardingWizard({ profile, onComplete, onExit }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Step 1: Basic Information
  const [fullName, setFullName] = useState(profile.basic?.fullName || '');
  const [headline, setHeadline] = useState(profile.basic?.headline || '');
  const [about, setAbout] = useState(profile.basic?.about || '');
  const [location, setLocation] = useState(profile.basic?.location || '');

  // Step 2: Education & Target Role
  const initialEdu = profile.education?.[0] || {};
  const [degree, setDegree] = useState(initialEdu.degree || '');
  const [institution, setInstitution] = useState(initialEdu.institution || '');
  const [gradYear, setGradYear] = useState(initialEdu.year || '');
  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Full Stack Developer');

  // Step 3: Skills & Links
  const [skills, setSkills] = useState(profile.skills || ['JavaScript', 'React', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');
  const [softSkills, setSoftSkills] = useState(profile.softSkills || ['Problem Solving', 'Communication']);
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [github, setGithub] = useState(profile.links?.github || '');
  const [linkedin, setLinkedin] = useState(profile.links?.linkedin || '');

  // Step 4: Profile Photo
  const [avatarUrl, setAvatarUrl] = useState(profile.basic?.avatar || '');

  const targetRoles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'Machine Learning Engineer',
    'Python Developer',
    'Software Developer'
  ];

  // Compute initials fallback
  const getInitials = (name) => {
    if (!name) return 'SP';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddSoftSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSoftSkill.trim();
    if (trimmed && !softSkills.includes(trimmed)) {
      setSoftSkills([...softSkills, trimmed]);
      setNewSoftSkill('');
    }
  };

  const handleRemoveSoftSkill = (skillToRemove) => {
    setSoftSkills(softSkills.filter(s => s !== skillToRemove));
  };

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step Validation & Navigation
  const handleNext = () => {
    setError('');

    if (step === 1) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!headline.trim()) {
        setError('Please enter your professional headline (e.g. Full Stack Developer).');
        return;
      }
      if (!about.trim()) {
        setError('Please write a brief summary about your background and interests.');
        return;
      }
    }

    if (step === 2) {
      if (!degree.trim()) {
        setError('Please specify your degree or program of study.');
        return;
      }
      if (!institution.trim()) {
        setError('Please enter your university, college, or bootcamp.');
        return;
      }
    }

    if (step === 3) {
      if (skills.length < 2) {
        setError('Please add at least 2 technical skills.');
        return;
      }
    }

    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(s => Math.max(1, s - 1));
  };

  const handleFinish = () => {
    const updatedProfile = {
      ...profile,
      isSampleData: false,
      isOnboarded: true,
      basic: {
        ...(profile.basic || {}),
        fullName: fullName.trim(),
        headline: headline.trim(),
        about: about.trim(),
        location: location.trim(),
        avatar: avatarUrl.trim()
      },
      targetRole,
      skills,
      softSkills,
      education: [
        {
          id: 'edu-1',
          degree: degree.trim(),
          institution: institution.trim(),
          year: gradYear.trim()
        }
      ],
      links: {
        ...(profile.links || {}),
        github: github.trim(),
        linkedin: linkedin.trim()
      }
    };

    saveProfile(updatedProfile);
    if (onComplete) onComplete(updatedProfile);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px'
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '640px',
          width: '100%',
          padding: '32px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Header with SkillProof Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
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
            <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
              SkillProof Profile Setup
            </span>
          </div>

          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
            >
              Skip to Dashboard
            </button>
          )}
        </div>

        {/* Step Progress Indicators */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
              Step {step} of 4: {
                step === 1 ? 'Basic Information' :
                step === 2 ? 'Education & Target Role' :
                step === 3 ? 'Skills & Links' : 'Profile Picture & Preview'
              }
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {Math.round((step / 4) * 100)}% Complete
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: i <= step ? 'var(--primary)' : 'var(--border)',
                  transition: 'background-color 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--error-soft)',
              color: 'var(--error)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Let's introduce yourself
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Your headline and summary will be highlighted on your generated portfolio and readiness reports.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Professional Headline *</label>
              <input
                type="text"
                className="form-control"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="e.g. Full Stack Engineer | React, Node.js & Distributed Systems"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Short Introduction / About Me *</label>
              <textarea
                rows={3}
                className="form-control"
                value={about}
                onChange={e => setAbout(e.target.value)}
                placeholder="Briefly describe what you build, your engineering focus, and what problems you love solving..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Location (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Education & Target Role */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Education & Career Direction
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Choose your primary target role so SkillProof can benchmark your skills accurately.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Target Job Role *</label>
              <select
                className="form-control"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                style={{ fontWeight: 600, color: 'var(--primary)' }}
              >
                {targetRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Degree / Field of Study *</label>
              <input
                type="text"
                className="form-control"
                value={degree}
                onChange={e => setDegree(e.target.value)}
                placeholder="e.g. B.S. in Computer Science"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">University / College / Bootcamp *</label>
              <input
                type="text"
                className="form-control"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                placeholder="e.g. University of Washington"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Graduation Year (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={gradYear}
                onChange={e => setGradYear(e.target.value)}
                placeholder="e.g. 2025"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Skills & Links */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Your Skills & Public Proof
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Add your technical strengths and portfolio/code profile links.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Technical Skills (At least 2 required) *</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="form-control"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddSkill(e); }}
                  placeholder="e.g. TypeScript, React, Docker..."
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map(skill => (
                  <span
                    key={skill}
                    className="badge badge-primary"
                    style={{ fontSize: '0.8125rem', padding: '4px 10px', gap: '6px' }}
                  >
                    <span>{skill}</span>
                    <X
                      size={13}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">GitHub Profile URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                value={github}
                onChange={e => setGithub(e.target.value)}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">LinkedIn Profile URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Profile Photo & Preview */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Profile Avatar & Readiness Preview
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Upload a photo or use the automatic initials badge fallback.
              </p>
            </div>

            {/* Avatar Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              {avatarUrl ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={avatarUrl}
                    alt="Profile Preview"
                    onError={() => setAvatarUrl('')}
                    style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--primary)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'var(--error)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Remove photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '2rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {getInitials(fullName)}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
                <label
                  className="btn btn-secondary btn-sm"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Camera size={14} />
                  <span>Upload Photo from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                <div style={{ width: '100%', marginTop: '6px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textAlign: 'center', display: 'block' }}>
                    Or paste an image web link (Optional):
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    style={{ fontSize: '0.8125rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Profile Summary Card Preview */}
            <div
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {fullName || 'Your Name'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {headline || 'Professional Headline'}
                  </div>
                </div>
                <span className="badge badge-success">Profile Ready</span>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Target Role: <strong>{targetRole}</strong> &bull; {degree} from {institution}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {skills.slice(0, 5).map(s => (
                  <span key={s} className="badge badge-neutral" style={{ fontSize: '0.71875rem' }}>{s}</span>
                ))}
                {skills.length > 5 && (
                  <span className="badge badge-neutral" style={{ fontSize: '0.71875rem' }}>+{skills.length - 5} more</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)'
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              <span>Save & Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--success)' }}
            >
              <CheckCircle2 size={16} />
              <span>Complete Setup & Enter Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
