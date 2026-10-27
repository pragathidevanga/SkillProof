import React, { useState } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Palette,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  Tag,
  AlertCircle
} from 'lucide-react';
import { saveProfile, loadProfile, SAMPLE_PROFILE } from '../services/storage';

export default function ProfileOnboarding({ profile, onProfileUpdate, setActiveTab }) {
  const [formData, setFormData] = useState(profile);
  const [activeSubTab, setActiveSubTab] = useState('basic'); // 'basic' | 'skills' | 'experience' | 'education' | 'certifications' | 'links'
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const targetRoles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'Machine Learning Engineer',
    'Python Developer',
    'Software Developer'
  ];

  const updateBasic = (field, val) => {
    setFormData({
      ...formData,
      basic: {
        ...formData.basic,
        [field]: val
      }
    });
  };

  const updateLinks = (field, val) => {
    setFormData({
      ...formData,
      links: {
        ...formData.links,
        [field]: val
      }
    });
  };

  const handleSave = () => {
    const updated = { ...formData, isSampleData: false };
    saveProfile(updated);
    if (onProfileUpdate) onProfileUpdate(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset profile to empty slate? All current profile entries will be cleared.')) {
      const empty = {
        isSampleData: false,
        basic: { fullName: '', headline: '', avatar: '', about: '', email: '', location: '' },
        targetRole: 'Full Stack Developer',
        secondaryRole: '',
        experienceLevel: 'Entry-Level / Fresher',
        skills: [],
        softSkills: [],
        languages: [],
        education: [],
        experience: [],
        certifications: [],
        links: { github: '', linkedin: '', portfolio: '', twitter: '' }
      };
      setFormData(empty);
      saveProfile(empty);
      if (onProfileUpdate) onProfileUpdate(empty);
    }
  };

  // Add / Remove Technical Skills
  const addTechnicalSkill = () => {
    if (newSkill.trim() && !(formData.skills || []).includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeTechnicalSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: (formData.skills || []).filter(s => s !== skillToRemove)
    });
  };

  // Add / Remove Soft Skills
  const addSoftSkill = () => {
    if (newSoftSkill.trim() && !(formData.softSkills || []).includes(newSoftSkill.trim())) {
      setFormData({
        ...formData,
        softSkills: [...(formData.softSkills || []), newSoftSkill.trim()]
      });
      setNewSoftSkill('');
    }
  };

  const removeSoftSkill = (s) => {
    setFormData({
      ...formData,
      softSkills: (formData.softSkills || []).filter(x => x !== s)
    });
  };

  // Add / Remove Languages
  const addLanguage = () => {
    if (newLanguage.trim() && !(formData.languages || []).includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...(formData.languages || []), newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (l) => {
    setFormData({
      ...formData,
      languages: (formData.languages || []).filter(x => x !== l)
    });
  };

  // Add / Remove Education
  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      specialization: '',
      year: ''
    };
    setFormData({ ...formData, education: [...(formData.education || []), newEdu] });
  };

  const removeEducation = (id) => {
    setFormData({
      ...formData,
      education: (formData.education || []).filter(e => e.id !== id)
    });
  };

  const updateEducationItem = (id, field, val) => {
    setFormData({
      ...formData,
      education: (formData.education || []).map(e => e.id === id ? { ...e, [field]: val } : e)
    });
  };

  // Add / Remove Experience
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      type: 'Full-time',
      description: ''
    };
    setFormData({ ...formData, experience: [...(formData.experience || []), newExp] });
  };

  const removeExperience = (id) => {
    setFormData({
      ...formData,
      experience: (formData.experience || []).filter(e => e.id !== id)
    });
  };

  const updateExperienceItem = (id, field, val) => {
    setFormData({
      ...formData,
      experience: (formData.experience || []).map(e => e.id === id ? { ...e, [field]: val } : e)
    });
  };

  // Add / Remove Certifications
  const addCertification = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      title: '',
      issuer: '',
      year: ''
    };
    setFormData({ ...formData, certifications: [...(formData.certifications || []), newCert] });
  };

  const removeCertification = (id) => {
    setFormData({
      ...formData,
      certifications: (formData.certifications || []).filter(c => c.id !== id)
    });
  };

  const updateCertificationItem = (id, field, val) => {
    setFormData({
      ...formData,
      certifications: (formData.certifications || []).map(c => c.id === id ? { ...c, [field]: val } : c)
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            My Profile
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Manage personal details, target role, technical skills, education, and links. Persisted in browser LocalStorage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm">
            <RotateCcw size={14} /> <span>Reset Profile</span>
          </button>
          <button type="button" onClick={() => setActiveTab('portfolio-builder')} className="btn btn-secondary btn-sm">
            <Palette size={14} /> <span>Preview in Portfolio</span>
          </button>
          <button type="button" onClick={handleSave} className="btn btn-primary btn-sm">
            <Save size={14} /> <span>Save Profile</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: 'var(--success-soft)', border: '1px solid var(--success)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84375rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} />
          <span>Profile saved successfully to LocalStorage! All dashboard metrics and portfolio previews have been refreshed.</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border)', paddingBottom: '2px', overflowX: 'auto' }}>
        {[
          { id: 'basic', label: 'Basic Info', icon: User },
          { id: 'skills', label: 'Skills & Languages', icon: Tag },
          { id: 'experience', label: 'Experience & Internships', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'certifications', label: 'Certifications', icon: Award },
          { id: 'links', label: 'Online Presence', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: isActive ? 'var(--primary-soft)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.84375rem',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid var(--primary)' : 'none'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Basic Information */}
      {activeSubTab === 'basic' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Basic Profile Information</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={formData.basic?.fullName || ''}
                onChange={(e) => updateBasic('fullName', e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Professional Headline *</label>
              <input
                type="text"
                value={formData.basic?.headline || ''}
                onChange={(e) => updateBasic('headline', e.target.value)}
                placeholder="e.g. Full Stack Engineer | React & Node.js"
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Target Job Role</label>
              <select
                value={formData.targetRole || 'Full Stack Developer'}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="form-control"
                style={{ fontWeight: 600, color: 'var(--primary)' }}
              >
                {targetRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={formData.basic?.email || ''}
                onChange={(e) => updateBasic('email', e.target.value)}
                placeholder="alex.morgan@example.com"
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Location</label>
              <input
                type="text"
                value={formData.basic?.location || ''}
                onChange={(e) => updateBasic('location', e.target.value)}
                placeholder="San Francisco, CA or Remote"
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Profile Avatar URL (Optional)</label>
              <input
                type="url"
                value={formData.basic?.avatar || ''}
                onChange={(e) => updateBasic('avatar', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Professional Summary / About Me</label>
            <textarea
              rows={4}
              value={formData.basic?.about || ''}
              onChange={(e) => updateBasic('about', e.target.value)}
              placeholder="Highlight your background, engineering interests, and key achievements..."
              className="form-control"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Skills & Languages */}
      {activeSubTab === 'skills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Technical Skills */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Technical Skills</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Add individual languages, frameworks, databases, and engineering tools:
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTechnicalSkill(); } }}
                placeholder="Type skill (e.g. React, PostgreSQL, Docker) and press Enter"
                className="form-control"
              />
              <button type="button" onClick={addTechnicalSkill} className="btn btn-secondary">
                <Plus size={16} /> <span>Add</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(formData.skills || []).map(skill => (
                <span
                  key={skill}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--primary-soft)',
                    border: '1px solid rgba(99, 91, 255, 0.2)',
                    color: 'var(--primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeTechnicalSkill(skill)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Soft Skills</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Key collaborative and interpersonal strengths:
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                value={newSoftSkill}
                onChange={(e) => setNewSoftSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSoftSkill(); } }}
                placeholder="Type soft skill (e.g. Technical Communication, Agile) and press Enter"
                className="form-control"
              />
              <button type="button" onClick={addSoftSkill} className="btn btn-secondary">
                <Plus size={16} /> <span>Add</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(formData.softSkills || []).map(skill => (
                <span
                  key={skill}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSoftSkill(skill)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Languages</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLanguage(); } }}
                placeholder="e.g. English (Fluent), Spanish (Conversational)"
                className="form-control"
              />
              <button type="button" onClick={addLanguage} className="btn btn-secondary">
                <Plus size={16} /> <span>Add</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(formData.languages || []).map(lang => (
                <span key={lang} style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>{lang}</span>
                  <button type="button" onClick={() => removeLanguage(lang)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Experience & Internships */}
      {activeSubTab === 'experience' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Work Experience & Internships</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Add previous developer roles, internships, or open source contributions.
              </p>
            </div>
            <button type="button" onClick={addExperience} className="btn btn-secondary btn-sm">
              <Plus size={14} /> <span>Add Experience</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(formData.experience || []).map((exp, idx) => (
              <div
                key={exp.id || idx}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Experience #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    value={exp.role || ''}
                    onChange={(e) => updateExperienceItem(exp.id, 'role', e.target.value)}
                    placeholder="Role (e.g. Software Engineer Intern)"
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  />
                  <input
                    type="text"
                    value={exp.organization || ''}
                    onChange={(e) => updateExperienceItem(exp.id, 'organization', e.target.value)}
                    placeholder="Company / Organization"
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    value={exp.startDate || ''}
                    onChange={(e) => updateExperienceItem(exp.id, 'startDate', e.target.value)}
                    placeholder="Start (e.g. May 2024)"
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  />
                  <input
                    type="text"
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperienceItem(exp.id, 'endDate', e.target.value)}
                    placeholder="End (e.g. Aug 2024 / Present)"
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  />
                  <select
                    value={exp.type || 'Full-time'}
                    onChange={(e) => updateExperienceItem(exp.id, 'type', e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract / Freelance">Contract / Freelance</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                <textarea
                  rows={2}
                  value={exp.description || ''}
                  onChange={(e) => updateExperienceItem(exp.id, 'description', e.target.value)}
                  placeholder="Key accomplishments and technical responsibilities..."
                  className="form-control"
                  style={{ fontSize: '0.8125rem' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Education */}
      {activeSubTab === 'education' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Education Entries</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Document your university, degree, and graduation timeline.
              </p>
            </div>
            <button type="button" onClick={addEducation} className="btn btn-secondary btn-sm">
              <Plus size={14} /> <span>Add Education</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(formData.education || []).map((edu, idx) => (
              <div
                key={edu.id || idx}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Degree #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => updateEducationItem(edu.id, 'institution', e.target.value)}
                    placeholder="College or University"
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  />
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => updateEducationItem(edu.id, 'degree', e.target.value)}
                    placeholder="Degree (e.g. B.S. in Computer Science)"
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    value={edu.specialization || ''}
                    onChange={(e) => updateEducationItem(edu.id, 'specialization', e.target.value)}
                    placeholder="Specialization / Minor"
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  />
                  <input
                    type="text"
                    value={edu.year || ''}
                    onChange={(e) => updateEducationItem(edu.id, 'year', e.target.value)}
                    placeholder="Graduation Year (e.g. 2025)"
                    className="form-control"
                    style={{ fontSize: '0.8125rem' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Certifications */}
      {activeSubTab === 'certifications' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Professional Certifications</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Add recognized cloud, security, or developer credentials.
              </p>
            </div>
            <button type="button" onClick={addCertification} className="btn btn-secondary btn-sm">
              <Plus size={14} /> <span>Add Certification</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(formData.certifications || []).map((c, idx) => (
              <div
                key={c.id || idx}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <input
                  type="text"
                  value={c.title || ''}
                  onChange={(e) => updateCertificationItem(c.id, 'title', e.target.value)}
                  placeholder="Certificate Name (e.g. AWS Cloud Practitioner)"
                  className="form-control"
                  style={{ flex: 2, fontSize: '0.8125rem' }}
                />
                <input
                  type="text"
                  value={c.issuer || ''}
                  onChange={(e) => updateCertificationItem(c.id, 'issuer', e.target.value)}
                  placeholder="Issuing Body (e.g. Amazon, Coursera)"
                  className="form-control"
                  style={{ flex: 1.5, fontSize: '0.8125rem' }}
                />
                <input
                  type="text"
                  value={c.year || ''}
                  onChange={(e) => updateCertificationItem(c.id, 'year', e.target.value)}
                  placeholder="Year"
                  className="form-control"
                  style={{ width: '80px', fontSize: '0.8125rem' }}
                />
                <button
                  type="button"
                  onClick={() => removeCertification(c.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Online Presence / Links */}
      {activeSubTab === 'links' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Online Profiles & Links</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            These links appear on your exported portfolio and evidence scoring matrix:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Github size={14} /> GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.links?.github || ''}
                onChange={(e) => updateLinks('github', e.target.value)}
                placeholder="https://github.com/username"
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Linkedin size={14} /> LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.links?.linkedin || ''}
                onChange={(e) => updateLinks('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="form-control"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} /> Personal Website / Blog URL
              </label>
              <input
                type="url"
                value={formData.links?.portfolio || ''}
                onChange={(e) => updateLinks('portfolio', e.target.value)}
                placeholder="https://mywebsite.dev"
                className="form-control"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button type="button" onClick={handleSave} className="btn btn-primary" style={{ padding: '10px 24px' }}>
          <Save size={16} /> <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
