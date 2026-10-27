import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  Edit3,
  Bot,
  ExternalLink,
  Save,
  Trash2,
  Plus,
  FolderGit2,
  FileCode,
  Layers,
  History,
  CheckCircle2
} from 'lucide-react';
import { generatePromptApi } from '../services/api';
import {
  loadPromptHistory,
  addPromptToHistory,
  deletePromptFromHistory
} from '../services/storage';

export default function PromptStudio({ profile }) {
  const [category, setCategory] = useState('portfolio_generation');
  const [toolTarget, setToolTarget] = useState('Google Antigravity'); // 'Google Antigravity' | 'ChatGPT'
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [technologyStack, setTechnologyStack] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [designStyle, setDesignStyle] = useState('Clean SaaS Minimalist (Linear & Stripe inspired)');
  const [desiredFeatures, setDesiredFeatures] = useState('');
  const [constraints, setConstraints] = useState('No external databases required; local-first or zero-cost hosting.');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [promptHistory, setPromptHistory] = useState(loadPromptHistory);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'history'

  const categories = [
    { id: 'portfolio_generation', label: 'Portfolio website generation' },
    { id: 'portfolio_improvement', label: 'Portfolio improvement' },
    { id: 'project_development', label: 'Project development' },
    { id: 'resume_improvement', label: 'Resume improvement' },
    { id: 'learning_plan', label: 'Job-role skill learning plan' },
    { id: 'readme_generation', label: 'GitHub README generation' },
    { id: 'project_documentation', label: 'Project documentation' },
    { id: 'ui_ux_redesign', label: 'UI/UX redesign' },
    { id: 'bug_fixing', label: 'Bug fixing and debugging' },
    { id: 'code_explanation', label: 'Code explanation' },
    { id: 'interview_preparation', label: 'Interview preparation' },
    { id: 'custom_prompt', label: 'Custom prompt' }
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await generatePromptApi({
        category,
        profileData: profile,
        analysisData: profile.resume?.analysis || {},
        customOptions: {
          toolTarget,
          projectName,
          projectDescription,
          technologyStack,
          targetAudience,
          designStyle,
          desiredFeatures,
          constraints,
          additionalInstructions
        }
      });
      setGeneratedPrompt(res.promptContent);
      setIsEditing(false);
    } catch (err) {
      console.error('Prompt generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [category, toolTarget, profile.targetRole]);

  // Listen for topbar trigger
  useEffect(() => {
    const handleNew = () => {
      setProjectName('');
      setProjectDescription('');
      setDesiredFeatures('');
      setAdditionalInstructions('');
      handleGenerate();
    };
    window.addEventListener('skillproof_trigger_new_prompt', handleNew);
    return () => window.removeEventListener('skillproof_trigger_new_prompt', handleNew);
  }, [category, toolTarget]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format = 'md') => {
    const blob = new Blob([generatedPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillProof_${category}_prompt.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSaveToHistory = () => {
    if (!generatedPrompt) return;
    const item = addPromptToHistory({
      category,
      toolTarget,
      title: projectName || `${category.replace(/_/g, ' ')} Prompt`,
      content: generatedPrompt
    });
    setPromptHistory(loadPromptHistory());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReopenPrompt = (item) => {
    setCategory(item.category || 'portfolio_generation');
    if (item.toolTarget) setToolTarget(item.toolTarget);
    setGeneratedPrompt(item.content);
    setActiveTab('editor');
  };

  const handleDeleteHistory = (id) => {
    const updated = deletePromptFromHistory(id);
    setPromptHistory(updated);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            AI Prompt Studio
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Generate structured, production-grade prompts for <strong>Google Antigravity</strong> and <strong>ChatGPT</strong> personalized to your actual projects.
          </p>
        </div>

        {/* Workspace Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'editor' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'editor' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'editor' ? 'var(--shadow-xs)' : 'none'
            }}
          >
            Prompt Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'history' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'history' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'history' ? 'var(--shadow-xs)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <History size={14} />
            <span>Saved History ({promptHistory.length})</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: 'var(--success-soft)', border: '1px solid var(--success)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84375rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} />
          <span>Prompt saved to your local history! You can revisit or download it anytime.</span>
        </div>
      )}

      {activeTab === 'editor' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', alignItems: 'start' }} className="prompt-grid">
          {/* Left Column: Form Configuration Inputs */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>
              Prompt Parameters
            </h3>

            {/* Target AI Tool */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Target AI Tool</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['Google Antigravity', 'ChatGPT'].map(tool => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => setToolTarget(tool)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: `1.5px solid ${toolTarget === tool ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: toolTarget === tool ? 'var(--primary-soft)' : '#FFFFFF',
                      color: toolTarget === tool ? 'var(--primary)' : 'var(--text-primary)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Category */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Prompt Category (12 Options)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.8125rem', fontWeight: 600 }}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Project Name (Optional) */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Project Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Distributed API Monitor"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.8125rem' }}
              >
              </input>
            </div>

            {/* Project Description or Specific Goal */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Description or Specific Goal</label>
              <textarea
                rows={3}
                placeholder="Provide context on what you want the AI to design, build, optimize, or explain..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.8125rem', resize: 'vertical' }}
              />
            </div>

            {/* Tech Stack */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Technology Stack</label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, PostgreSQL, Tailwind"
                value={technologyStack}
                onChange={(e) => setTechnologyStack(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.8125rem' }}
              />
            </div>

            {/* Design Style */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Preferred Design Style</label>
              <input
                type="text"
                value={designStyle}
                onChange={(e) => setDesignStyle(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.8125rem' }}
              />
            </div>

            {/* Desired Features & Constraints */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Constraints & Requirements</label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.8125rem' }}
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px' }}
            >
              <Sparkles size={16} />
              <span>{isLoading ? 'Generating Spec...' : 'Regenerate Prompt'}</span>
            </button>
          </div>

          {/* Right Column: Prompt Workspace */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Generated Specification
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Tailored for {toolTarget} &bull; Personal Profile Context Integrated
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit3 size={13} />
                  <span>{isEditing ? 'Done Editing' : 'Edit Prompt'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  className="btn btn-secondary btn-sm"
                  title="Save prompt to local history"
                >
                  <Save size={13} />
                  <span>Save History</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('md')}
                  className="btn btn-secondary btn-sm"
                  title="Download as Markdown"
                >
                  <Download size={13} />
                  <span>.MD</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn btn-primary btn-sm"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Content Display */}
            {isEditing ? (
              <textarea
                rows={22}
                value={generatedPrompt}
                onChange={(e) => setGeneratedPrompt(e.target.value)}
                className="form-control"
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '16px'
                }}
              />
            ) : (
              <div
                style={{
                  padding: '18px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  maxHeight: '620px',
                  overflowY: 'auto',
                  color: 'var(--text-primary)'
                }}
              >
                {generatedPrompt || 'Generating prompt specification...'}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History View */
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>Saved Prompt History</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Stored locally in your browser LocalStorage (`skillproof_prompt_history_v1`).
              </p>
            </div>
          </div>

          {promptHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {promptHistory.map(item => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        {item.title}
                      </span>
                      <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>
                        {item.toolTarget || 'Google Antigravity'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Saved on {new Date(item.createdAt).toLocaleDateString()} &bull; Category: {item.category}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleReopenPrompt(item)}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>Reopen in Workspace</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteHistory(item.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)' }}
                      title="Delete from history"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No prompts saved yet. Generate a prompt in the generator and click "Save History".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
