import React, { useState, useMemo, useEffect } from 'react';
import JSZip from 'jszip';
import {
  Palette,
  Eye,
  Download,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Sparkles,
  Layers,
  Code2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { loadPortfolioConfig, savePortfolioConfig, DEFAULT_PORTFOLIO_CONFIG, loadProjects } from '../services/storage';
import { generatePortfolioApi } from '../services/api';

export default function PortfolioStudio({ profile, onProfileUpdate }) {
  const [config, setConfig] = useState(loadPortfolioConfig);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  const projects = profile.projects && profile.projects.length > 0 ? profile.projects : loadProjects();

  const templates = [
    {
      id: 'modern',
      title: 'Modern Developer',
      desc: 'Technical, project-focused layout with terminal status pills and metric callouts.'
    },
    {
      id: 'minimal',
      title: 'Minimal Professional',
      desc: 'Clean, typography-focused, elegant minimalist layout with quiet borders.'
    },
    {
      id: 'creative',
      title: 'Creative Portfolio',
      desc: 'Visually expressive with asymmetric layout, modern pill tags, and expressive cards.'
    }
  ];

  const palette = [
    { label: 'SkillProof Violet', hex: '#635BFF' },
    { label: 'Emerald Teal', hex: '#0D9488' },
    { label: 'Royal Blue', hex: '#2563EB' },
    { label: 'Executive Slate', hex: '#1E293B' },
    { label: 'Sunset Orange', hex: '#EA580C' },
    { label: 'Orchid Purple', hex: '#9333EA' }
  ];

  const fonts = [
    { label: 'Inter (Modern Sans)', val: 'Inter' },
    { label: 'Plus Jakarta Sans (SaaS)', val: 'Plus Jakarta Sans' },
    { label: 'System Sans', val: '-apple-system, BlinkMacSystemFont, sans-serif' }
  ];

  const updateConfigField = (field, value) => {
    const updated = { ...config, [field]: value };
    setConfig(updated);
    savePortfolioConfig(updated);
  };

  const toggleSection = (sectionKey) => {
    const updatedSections = {
      ...config.visibleSections,
      [sectionKey]: !config.visibleSections?.[sectionKey]
    };
    updateConfigField('visibleSections', updatedSections);
  };

  const handleResetConfig = () => {
    if (window.confirm('Reset portfolio builder configuration to defaults?')) {
      setConfig(DEFAULT_PORTFOLIO_CONFIG);
      savePortfolioConfig(DEFAULT_PORTFOLIO_CONFIG);
    }
  };

  // Generate preview HTML whenever config, profile, or projects change
  useEffect(() => {
    let isCancelled = false;
    const fetchGenerated = async () => {
      try {
        const res = await generatePortfolioApi({
          profile,
          projects,
          config
        });
        if (!isCancelled && res) {
          setGeneratedResult(res);
        }
      } catch (err) {
        console.error('Error generating portfolio:', err);
      }
    };

    fetchGenerated();
    return () => { isCancelled = true; };
  }, [config, profile, projects]);

  // Export ZIP Archive containing index.html, styles.css, script.js, README.md
  const handleExportZip = async () => {
    setExportingZip(true);
    setExportSuccess(false);

    try {
      const res = await generatePortfolioApi({ profile, projects, config });
      const files = res.files || {};

      const zip = new JSZip();
      zip.file('index.html', files['index.html'] || '<!DOCTYPE html><html><body>Empty</body></html>');
      zip.file('styles.css', files['styles.css'] || '/* Styles */');
      zip.file('script.js', files['script.js'] || '// Script');
      zip.file('README.md', files['README.md'] || '# Portfolio');

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (profile.basic?.fullName || 'Developer').replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `SkillProof_Portfolio_${safeName}_${config.template}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setExportingZip(false);
    }
  };

  // Listen for topbar action trigger
  useEffect(() => {
    const handleTrigger = () => handleExportZip();
    window.addEventListener('skillproof_trigger_export_zip', handleTrigger);
    return () => window.removeEventListener('skillproof_trigger_export_zip', handleTrigger);
  }, [profile, projects, config]);

  const handleCopyHtml = () => {
    if (generatedResult?.standalonePreviewHtml) {
      navigator.clipboard.writeText(generatedResult.standalonePreviewHtml);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Portfolio Builder & Live Preview
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Choose from 3 distinct architectural templates, customize styling, preview interactively, and export static files.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleResetConfig}
            className="btn btn-secondary btn-sm"
            title="Reset configuration to default"
          >
            <RotateCcw size={14} /> <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleCopyHtml}
            className="btn btn-secondary btn-sm"
          >
            {copiedHtml ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            <span>{copiedHtml ? 'Copied HTML' : 'Copy HTML'}</span>
          </button>
          <button
            type="button"
            onClick={handleExportZip}
            disabled={exportingZip}
            className="btn btn-primary btn-sm"
          >
            <Download size={14} />
            <span>{exportingZip ? 'Packaging ZIP...' : 'Export Portfolio ZIP'}</span>
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--success-soft)', border: '1px solid var(--success)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} />
          <span>ZIP archive downloaded successfully! Includes index.html, styles.css, script.js, and GitHub Pages deployment instructions.</span>
        </div>
      )}

      {/* Main Split Grid: Left Sidebar Controls (340px) vs Right Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'start' }} className="builder-grid">
        {/* Left Column: Configuration Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Template Selection */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px' }}>
              1. Architectural Template
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {templates.map(tpl => {
                const isSelected = config.template === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => updateConfigField('template', tpl.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: isSelected ? 'var(--primary-soft)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {tpl.title}
                      </span>
                      {isSelected && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                      {tpl.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accent Color & Typography */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px' }}>
              2. Accent Color & Typography
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              {palette.map(c => {
                const isSelected = config.accentColor === c.hex;
                return (
                  <div
                    key={c.hex}
                    onClick={() => updateConfigField('accentColor', c.hex)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isSelected ? '3px solid #FFFFFF' : 'none',
                      boxShadow: isSelected ? `0 0 0 2px ${c.hex}` : 'none'
                    }}
                    title={c.label}
                  >
                    {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                );
              })}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Font Family</label>
              <select
                value={config.font || 'Inter'}
                onChange={(e) => updateConfigField('font', e.target.value)}
                className="form-control"
                style={{ fontSize: '0.8125rem' }}
              >
                {fonts.map(f => (
                  <option key={f.val} value={f.val}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Visible Sections Toggle */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px' }}>
              3. Section Visibility
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { key: 'about', label: 'About / Summary Section' },
                { key: 'skills', label: 'Technical Skills Section' },
                { key: 'projects', label: 'Projects Showcase' },
                { key: 'experience', label: 'Experience & Internships' },
                { key: 'education', label: 'Education Section' },
                { key: 'contact', label: 'Contact Section' }
              ].map(sec => {
                const isVisible = Boolean(config.visibleSections?.[sec.key]);
                return (
                  <label
                    key={sec.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      padding: '4px 0'
                    }}
                  >
                    <span>{sec.label}</span>
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => toggleSection(sec.key)}
                      style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Rendered Device Preview */}
        <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '800px', overflow: 'hidden' }}>
          {/* Preview Device Controls Toolbar */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Preview Mode:
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)' }}>
                {templates.find(t => t.id === config.template)?.title}
              </span>
            </div>

            {/* Device Switcher */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#FFFFFF', padding: '3px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: previewDevice === 'desktop' ? 'var(--primary-soft)' : 'transparent',
                  color: previewDevice === 'desktop' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                <Monitor size={14} /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: previewDevice === 'tablet' ? 'var(--primary-soft)' : 'transparent',
                  color: previewDevice === 'tablet' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                <Tablet size={14} /> Tablet
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: previewDevice === 'mobile' ? 'var(--primary-soft)' : 'transparent',
                  color: previewDevice === 'mobile' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                <Smartphone size={14} /> Mobile
              </button>
            </div>
          </div>

          {/* Render Frame Container */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#ECEEF2',
              display: 'flex',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: previewDevice === 'desktop' ? '0' : '20px 0'
            }}
          >
            <div
              style={{
                width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
                height: '100%',
                backgroundColor: '#FFFFFF',
                boxShadow: previewDevice !== 'desktop' ? '0 10px 25px rgba(0,0,0,0.1)' : 'none',
                borderRadius: previewDevice !== 'desktop' ? '12px' : '0',
                overflow: 'hidden',
                transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <iframe
                title="Portfolio Live Preview"
                srcDoc={generatedResult?.standalonePreviewHtml || '<html><body><p>Loading preview...</p></body></html>'}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
