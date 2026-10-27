import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  FileCode,
  Lock,
  User,
  LogOut,
  RefreshCw
} from 'lucide-react';
import {
  exportAllData,
  importAllData,
  clearAllData,
  loadSampleData,
  loadProjects,
  loadPromptHistory,
  loadAnalysisHistory,
  loadPreferences,
  savePreferences
} from '../services/storage';

export default function SettingsPage({ profile, onProfileUpdate, setActiveTab, onLogout }) {
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState(null);
  const [showImportBox, setShowImportBox] = useState(false);
  const [preferences, setPreferences] = useState(loadPreferences);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const projects = loadProjects();
  const promptHistory = loadPromptHistory();
  const analysisHistory = loadAnalysisHistory();

  const handlePreferenceChange = (key, val) => {
    const updated = { ...preferences, [key]: val };
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    if (onProfileUpdate) {
      onProfileUpdate({
        isSampleData: false,
        basic: { fullName: '', headline: '', avatar: '', about: '', email: '', location: '' },
        targetRole: 'Full Stack Developer',
        skills: [],
        projects: []
      });
    }
  };

  const handleLoadSample = () => {
    const data = loadSampleData();
    if (onProfileUpdate) {
      onProfileUpdate(data.profile);
    }
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    const result = importAllData(importJson);
    if (result.success) {
      setImportStatus({ success: true, message: result.message });
      setImportJson('');
      setTimeout(() => setShowImportBox(false), 1500);
    } else {
      setImportStatus({ success: false, message: result.error });
    }
  };

  return (
    <div style={{ padding: '28px', maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Settings & Local Data Management
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure workspace preferences, inspect local storage statistics, backup data, or restore backups.
        </p>
      </div>

      {/* Storage Architecture Explanation Notice */}
      <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <Database size={22} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            Browser LocalStorage Architecture
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
            All your profile information, documented projects, portfolio configurations, and prompt history are persisted directly in this browser using <strong>HTML5 LocalStorage</strong>. No external database (such as MongoDB, Postgres, or Firebase) is required. Data remains available after refreshing the page in this browser. To transfer your data to another browser or device, use the JSON Export below.
          </p>
        </div>
      </div>

      {/* Local Data Storage Overview Metrics */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
          Storage Data Overview
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Documented Projects</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {projects.length}
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recorded Skills</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {(profile.skills || []).length}
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saved AI Prompts</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {promptHistory.length}
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Profile Status</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: profile.isSampleData ? 'var(--warning)' : 'var(--success)', marginTop: '6px' }}>
              {profile.isSampleData ? 'Demo Profile' : 'Custom Slate'}
            </div>
          </div>
        </div>
      </div>

      {/* User Preferences */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
          Workspace Preferences
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Display Name</label>
            <input
              type="text"
              value={preferences.displayName || profile.basic?.fullName || ''}
              onChange={(e) => handlePreferenceChange('displayName', e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="form-control"
              style={{ fontSize: '0.8125rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Primary Benchmark Role</label>
            <input
              type="text"
              value={profile.targetRole || 'Full Stack Developer'}
              readOnly
              className="form-control"
              style={{ fontSize: '0.8125rem', backgroundColor: 'var(--bg-secondary)' }}
            />
          </div>
        </div>
      </div>

      {/* Data Export & Backup (JSON) */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
          Export & Import Data (JSON Backup)
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Download an exact JSON snapshot containing your profile, projects, portfolio config, and prompt history.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={exportAllData} className="btn btn-secondary btn-sm">
            <Download size={14} /> <span>Export Application JSON</span>
          </button>
          <button onClick={() => setShowImportBox(!showImportBox)} className="btn btn-secondary btn-sm">
            <Upload size={14} /> <span>Import Backup JSON</span>
          </button>
          <button onClick={handleLoadSample} className="btn btn-secondary btn-sm">
            <Sparkles size={14} /> <span>Reload Demo Data</span>
          </button>
        </div>

        {/* Import JSON Box */}
        {showImportBox && (
          <form onSubmit={handleImportSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea
              rows={4}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste exported SkillProof JSON file content here..."
              className="form-control"
              style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
            />
            {importStatus && (
              <div style={{ fontSize: '0.8125rem', color: importStatus.success ? 'var(--success)' : 'var(--danger)' }}>
                {importStatus.message}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                Restore Backup
              </button>
              <button type="button" onClick={() => setShowImportBox(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Danger Zone: Clear All Data */}
      <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '6px' }}>
          Danger Zone
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Irreversibly delete all saved profiles, projects, portfolio configs, and prompt history from this browser.
        </p>

        {!showClearConfirm ? (
          <button onClick={() => setShowClearConfirm(true)} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
            <Trash2 size={14} /> <span>Clear All Application Data</span>
          </button>
        ) : (
          <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--danger)', marginBottom: '6px' }}>
              Are you completely sure?
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
              This will erase all LocalStorage keys. Make sure you have exported a JSON backup if you wish to preserve your work.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleClearData} className="btn btn-primary btn-sm" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}>
                Yes, Delete Everything
              </button>
              <button onClick={() => setShowClearConfirm(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Local Session & Logout */}
      {onLogout && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>
          <button onClick={onLogout} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={14} /> <span>Sign Out (Local Demo Session)</span>
          </button>
        </div>
      )}
    </div>
  );
}
