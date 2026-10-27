import React, { useState, useMemo, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2,
  Filter,
  Check,
  X,
  ShieldCheck,
  Tag,
  Star,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  GitFork,
  Linkedin,
  AlertCircle
} from 'lucide-react';
import { loadProjects, saveProjects, SAMPLE_PROJECTS } from '../services/storage';
import { fetchGitHubProjectsApi, fetchLinkedInProjectsApi } from '../services/api';

export default function ProjectsManager({ profile, onProfileUpdate }) {
  const [projects, setProjects] = useState(loadProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTech, setSelectedTech] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'title' | 'featured'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsModalProject, setDetailsModalProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // GitHub / LinkedIn Fetch Modal State
  const [isFetchModalOpen, setIsFetchModalOpen] = useState(false);
  const [githubInput, setGithubInput] = useState(profile.links?.github || '');
  const [linkedinInput, setLinkedinInput] = useState(profile.links?.linkedin || '');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetchedProjects, setFetchedProjects] = useState(null);
  const [selectedRepos, setSelectedRepos] = useState(new Set());
  const [linkedinNotice, setLinkedinNotice] = useState('');
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Full Stack Web App',
    status: 'Completed',
    problemStatement: '',
    solution: '',
    description: '',
    technologies: '',
    personalRole: 'Full Stack Developer',
    keyOutcomes: '',
    skillsDemonstrated: '',
    githubUrl: '',
    demoUrl: '',
    featured: false,
    verifiedByUser: true,
    startDate: '',
    completionDate: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Sync projects with profile and storage
  const syncProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    if (onProfileUpdate) {
      onProfileUpdate({ ...profile, projects: updatedProjects });
    }
  };

  // TopBar listener
  useEffect(() => {
    const handleAdd = () => openAddModal();
    window.addEventListener('skillproof_open_add_project', handleAdd);
    return () => window.removeEventListener('skillproof_open_add_project', handleAdd);
  }, []);

  // Distinct Categories and Tech Tags
  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set);
  }, [projects]);

  const allTechTags = useMemo(() => {
    const set = new Set();
    projects.forEach(p => {
      const techs = Array.isArray(p.technologies)
        ? p.technologies
        : typeof p.technologies === 'string'
        ? p.technologies.split(',').map(s => s.trim())
        : [];
      techs.filter(Boolean).forEach(t => set.add(t));
    });
    return Array.from(set);
  }, [projects]);

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    let result = projects.filter(p => {
      const matchSearch =
        (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.problemStatement || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;

      const projectTechs = Array.isArray(p.technologies)
        ? p.technologies
        : typeof p.technologies === 'string'
        ? p.technologies.split(',').map(s => s.trim())
        : [];

      const matchTech = selectedTech === 'all' || projectTechs.includes(selectedTech);

      return matchSearch && matchCategory && matchTech;
    });

    return result.sort((a, b) => {
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'oldest') return (a.startDate || '').localeCompare(b.startDate || '');
      return (b.startDate || b.completionDate || '').localeCompare(a.startDate || a.completionDate || '');
    });
  }, [projects, searchTerm, selectedCategory, selectedTech, sortBy]);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Full Stack Web App',
      status: 'Completed',
      problemStatement: '',
      solution: '',
      description: '',
      technologies: '',
      personalRole: 'Full Stack Developer',
      keyOutcomes: '',
      skillsDemonstrated: '',
      githubUrl: '',
      demoUrl: '',
      featured: false,
      verifiedByUser: true,
      startDate: '',
      completionDate: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      category: project.category || 'Full Stack Web App',
      status: project.status || 'Completed',
      problemStatement: project.problemStatement || '',
      solution: project.solution || '',
      description: project.description || '',
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : (project.technologies || ''),
      personalRole: project.personalRole || 'Full Stack Developer',
      keyOutcomes: project.keyOutcomes || '',
      skillsDemonstrated: Array.isArray(project.skillsDemonstrated)
        ? project.skillsDemonstrated.join(', ')
        : (project.skillsDemonstrated || ''),
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      featured: Boolean(project.featured),
      verifiedByUser: Boolean(project.verifiedByUser),
      startDate: project.startDate || '',
      completionDate: project.completionDate || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Project title is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    if (formData.githubUrl && !formData.githubUrl.startsWith('http')) {
      errors.githubUrl = 'URL must start with http:// or https://';
    }
    if (formData.demoUrl && !formData.demoUrl.startsWith('http')) {
      errors.demoUrl = 'URL must start with http:// or https://';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const parsedTech = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const projectPayload = {
      ...formData,
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      technologies: parsedTech,
      skillsDemonstrated: formData.skillsDemonstrated.split(',').map(s => s.trim()).filter(Boolean)
    };

    let updatedList;
    if (editingProject) {
      updatedList = projects.map(p => p.id === editingProject.id ? projectPayload : p);
    } else {
      updatedList = [projectPayload, ...projects];
    }

    syncProjects(updatedList);
    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = projects.filter(p => p.id !== id);
      syncProjects(updated);
    }
  };

  const toggleFeatured = (id) => {
    const updated = projects.map(p => p.id === id ? { ...p, featured: !p.featured } : p);
    syncProjects(updated);
  };

  // Handle Fetch Real Projects from GitHub
  const handleFetchProjects = async (e) => {
    if (e) e.preventDefault();
    setIsFetching(true);
    setFetchError('');
    setLinkedinNotice('');
    setImportSuccessMsg('');

    try {
      if (!githubInput.trim()) {
        throw new Error('Please enter your GitHub profile URL or username (e.g. https://github.com/yourusername).');
      }

      // Check LinkedIn if user provided URL
      if (linkedinInput.trim()) {
        const liRes = await fetchLinkedInProjectsApi({ linkedinUrl: linkedinInput.trim() });
        if (liRes && liRes.message) {
          setLinkedinNotice(liRes.message);
        }
      }

      const res = await fetchGitHubProjectsApi({ githubUrl: githubInput.trim() });
      if (!res || !Array.isArray(res.projects)) {
        throw new Error('No repositories found for this GitHub account.');
      }

      setFetchedProjects(res.projects);

      // Match against existing projects to prevent duplicates
      const newSelected = new Set();
      res.projects.forEach(p => {
        const isDuplicate = projects.some(existing => {
          const matchUrl = existing.githubUrl && existing.githubUrl.toLowerCase() === p.githubUrl.toLowerCase();
          const matchTitle = existing.title && existing.title.toLowerCase() === p.title.toLowerCase();
          return matchUrl || matchTitle;
        });

        // Pre-select new projects that aren't already imported
        if (!isDuplicate) {
          newSelected.add(p.id);
        }
      });
      setSelectedRepos(newSelected);
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch repositories. Please check the profile URL or try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const toggleRepoSelection = (id) => {
    const next = new Set(selectedRepos);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRepos(next);
  };

  // Import Selected GitHub Projects
  const handleImportSelected = () => {
    if (!fetchedProjects) return;

    const toImport = fetchedProjects.filter(p => selectedRepos.has(p.id));
    if (toImport.length === 0) {
      alert('Please select at least one project to import.');
      return;
    }

    // Filter out any duplicates based on githubUrl
    const existingUrls = new Set(projects.map(p => (p.githubUrl || '').toLowerCase()).filter(Boolean));
    const uniqueToImport = toImport.filter(p => !existingUrls.has(p.githubUrl.toLowerCase()));

    const merged = [...uniqueToImport, ...projects];
    syncProjects(merged);
    setImportSuccessMsg(`Successfully imported ${uniqueToImport.length} real projects from GitHub!`);
    setTimeout(() => {
      setIsFetchModalOpen(false);
      setFetchedProjects(null);
      setImportSuccessMsg('');
    }, 1200);
  };

  return (
    <div
      style={{
        padding: 'clamp(16px, 3vw, 24px)',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%'
      }}
    >
      {/* Page Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              margin: 0
            }}
          >
            My Projects ({projects.length})
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Verified technical projects with direct GitHub source code, live URLs, and measurable outcomes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setIsFetchModalOpen(true);
              setGithubInput(profile.links?.github || '');
              setLinkedinInput(profile.links?.linkedin || '');
              setFetchedProjects(null);
              setFetchError('');
              setLinkedinNotice('');
            }}
            className="btn btn-secondary btn-sm"
          >
            <Github size={15} /> <span>Fetch from GitHub</span>
          </button>
          <button onClick={openAddModal} className="btn btn-primary btn-sm">
            <Plus size={16} /> <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by title, stack, or problem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '32px', fontSize: '0.8125rem' }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
            style={{ fontSize: '0.8125rem' }}
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Technology Filter */}
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="form-control"
            style={{ fontSize: '0.8125rem' }}
          >
            <option value="all">All Technologies ({allTechTags.length})</option>
            {allTechTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control"
            style={{ fontSize: '0.8125rem' }}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="title">Sort: Title (A-Z)</option>
            <option value="featured">Sort: Featured First</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '16px'
          }}
        >
          {filteredProjects.map(p => {
            const techs = Array.isArray(p.technologies)
              ? p.technologies
              : typeof p.technologies === 'string'
              ? p.technologies.split(',').map(s => s.trim())
              : [];

            return (
              <div
                key={p.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  borderTop: p.featured ? '3px solid var(--primary)' : '1px solid var(--border)',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Card Top: Category & Featured Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                      {p.category || 'Project'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(p.id)}
                      title={p.featured ? 'Featured on Portfolio' : 'Mark as Featured'}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: p.featured ? '#F59E0B' : 'var(--text-muted)'
                      }}
                    >
                      <Star size={16} fill={p.featured ? '#F59E0B' : 'none'} />
                    </button>
                  </div>

                  {/* Project Title */}
                  <h3
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: '0 0 6px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setDetailsModalProject(p)}
                  >
                    {p.title}
                  </h3>

                  {/* Description / Problem */}
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '10px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {p.problemStatement || p.description}
                  </p>

                  {/* Tech Stack Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {techs.slice(0, 4).map(t => (
                      <span key={t} className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                        {t}
                      </span>
                    ))}
                    {techs.length > 4 && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                        +{techs.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom Links & Actions */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="View GitHub Repository"
                        style={{ color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Github size={15} />
                      </a>
                    )}
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="View Live Demo"
                        style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setDetailsModalProject(p)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      title="View Details"
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      title="Edit Project"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.title)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--danger)' }}
                      title="Delete Project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div
          className="card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
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
            <FolderGit2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              No projects documented yet
            </h3>
            <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '6px auto 0' }}>
              Import your real GitHub repositories directly, or add project case studies manually with verified links.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setIsFetchModalOpen(true);
                setGithubInput(profile.links?.github || '');
                setFetchedProjects(null);
                setFetchError('');
              }}
              className="btn btn-primary btn-sm"
            >
              <Github size={15} /> <span>Fetch Real Projects from GitHub</span>
            </button>
            <button onClick={openAddModal} className="btn btn-secondary btn-sm">
              <Plus size={15} /> <span>Add Project Manually</span>
            </button>
          </div>
        </div>
      )}

      {/* FETCH FROM GITHUB & LINKEDIN MODAL */}
      {isFetchModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px', padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Github size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Fetch Real Projects from GitHub
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFetchModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Retrieve your public repositories directly from GitHub. Repositories will be matched to prevent duplicates and preserve your existing work.
            </p>

            {/* Inputs */}
            <form onSubmit={handleFetchProjects} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">GitHub Profile URL or Username *</label>
                <div style={{ position: 'relative' }}>
                  <Github size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                  <input
                    type="text"
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="https://github.com/yourusername or yourusername"
                    className="form-control"
                    style={{ paddingLeft: '32px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">LinkedIn Profile URL (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Linkedin size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                  <input
                    type="url"
                    value={linkedinInput}
                    onChange={(e) => setLinkedinInput(e.target.value)}
                    placeholder="https://linkedin.com/in/yourusername"
                    className="form-control"
                    style={{ paddingLeft: '32px' }}
                  />
                </div>
              </div>

              {/* LinkedIn Notice if triggered */}
              {linkedinNotice && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.78125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)' }}>LinkedIn Data Note:</strong> {linkedinNotice}
                </div>
              )}

              {/* Error Message */}
              {fetchError && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--error-soft)',
                    color: 'var(--error)',
                    fontSize: '0.8125rem'
                  }}
                >
                  {fetchError}
                </div>
              )}

              {/* Success Message */}
              {importSuccessMsg && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--success-soft)',
                    color: 'var(--success)',
                    fontSize: '0.8125rem',
                    fontWeight: 600
                  }}
                >
                  {importSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isFetching}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
              >
                {isFetching ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Retrieving Repositories...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Retrieve Repositories</span>
                  </>
                )}
              </button>
            </form>

            {/* Fetched Repositories Selection List */}
            {fetchedProjects && fetchedProjects.length > 0 && (
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Found {fetchedProjects.length} Public Repositories:
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {selectedRepos.size} selected
                  </span>
                </div>

                <div
                  style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '4px'
                  }}
                >
                  {fetchedProjects.map(repo => {
                    const isSelected = selectedRepos.has(repo.id);
                    const isAlreadyImported = projects.some(p =>
                      (p.githubUrl && p.githubUrl.toLowerCase() === repo.githubUrl.toLowerCase()) ||
                      (p.title && p.title.toLowerCase() === repo.title.toLowerCase())
                    );

                    return (
                      <div
                        key={repo.id}
                        onClick={() => toggleRepoSelection(repo.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--primary-soft)' : 'var(--bg-secondary)',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.84375rem', color: 'var(--text-primary)' }}>
                              {repo.title}
                            </span>
                            {repo.stars > 0 && (
                              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                <Star size={11} fill="#F59E0B" color="#F59E0B" /> {repo.stars}
                              </span>
                            )}
                            {isAlreadyImported && (
                              <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                                Already in Projects
                              </span>
                            )}
                          </div>

                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {repo.description}
                          </p>
                        </div>

                        {repo.technologies && (
                          <span className="badge badge-neutral" style={{ fontSize: '0.6875rem', whiteSpace: 'nowrap' }}>
                            {repo.technologies.split(',')[0]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => setIsFetchModalOpen(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleImportSelected}
                    className="btn btn-primary btn-sm"
                  >
                    <span>Import {selectedRepos.size} Selected Project(s)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {editingProject ? 'Edit Project' : 'Add Technical Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Title & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Project Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Distributed Telemetry Monitor"
                    className="form-control"
                  />
                  {formErrors.title && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{formErrors.title}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                  >
                    <option value="Full Stack Web App">Full Stack Web App</option>
                    <option value="Frontend Application">Frontend Application</option>
                    <option value="Backend & API">Backend & API</option>
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Data Science & Analytics">Data Science & Analytics</option>
                    <option value="Developer Tool / CLI">Developer Tool / CLI</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>
              </div>

              {/* Technologies */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Technologies Used (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker"
                  className="form-control"
                />
              </div>

              {/* Problem Statement */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Problem Statement</label>
                <input
                  type="text"
                  value={formData.problemStatement}
                  onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                  placeholder="What user pain point or engineering challenge did this solve?"
                  className="form-control"
                />
              </div>

              {/* Description */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Detailed Solution & Description *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your architectural approach, key components, and how it was implemented..."
                  className="form-control"
                />
                {formErrors.description && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{formErrors.description}</span>}
              </div>

              {/* Measurable Outcomes */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Key Outcomes & Metrics (Google XYZ formula)</label>
                <input
                  type="text"
                  value={formData.keyOutcomes}
                  onChange={(e) => setFormData({ ...formData, keyOutcomes: e.target.value })}
                  placeholder="e.g. Slashed median API latency by 35% across 150k events/min"
                  className="form-control"
                />
              </div>

              {/* URLs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="form-control"
                  />
                  {formErrors.githubUrl && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{formErrors.githubUrl}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://demo.vercel.app"
                    className="form-control"
                  />
                  {formErrors.demoUrl && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{formErrors.demoUrl}</span>}
                </div>
              </div>

              {/* Featured Checkbox */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>Mark as Featured Showcase Project</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {detailsModalProject && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
                  {detailsModalProject.category}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0', color: 'var(--text-primary)' }}>
                  {detailsModalProject.title}
                </h2>
              </div>
              <button
                onClick={() => setDetailsModalProject(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84375rem', color: 'var(--text-secondary)' }}>
              {detailsModalProject.problemStatement && (
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Problem:</strong> {detailsModalProject.problemStatement}
                </div>
              )}

              <p style={{ lineHeight: 1.5, margin: 0 }}>{detailsModalProject.description}</p>

              {detailsModalProject.keyOutcomes && (
                <div style={{ color: 'var(--success)', fontWeight: 600 }}>
                  ⚡ Impact: {detailsModalProject.keyOutcomes}
                </div>
              )}

              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Technologies:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(Array.isArray(detailsModalProject.technologies)
                    ? detailsModalProject.technologies
                    : (detailsModalProject.technologies || '').split(',').map(s => s.trim())
                  ).filter(Boolean).map(t => (
                    <span key={t} className="badge badge-neutral">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                {detailsModalProject.githubUrl && (
                  <a href={detailsModalProject.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    <Github size={15} /> Open GitHub
                  </a>
                )}
                {detailsModalProject.demoUrl && (
                  <a href={detailsModalProject.demoUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    <ExternalLink size={15} /> Open Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
