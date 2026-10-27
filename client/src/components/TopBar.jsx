import React, { useState } from 'react';
import {
  Search,
  Bell,
  Briefcase,
  Sparkles,
  User,
  CheckCircle2,
  Menu,
  ChevronDown,
  LogOut,
  ExternalLink,
  Plus,
  Palette,
  FileText,
  Network,
  Download,
  Settings,
  Globe
} from 'lucide-react';
import { loadSampleData, clearAllData } from '../services/storage';

export default function TopBar({
  profile,
  onProfileUpdate,
  activeTab,
  setActiveTab,
  onToggleSidebar,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'SP';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Page title mapping matching Section 5
  const pageTitles = {
    'dashboard': 'Dashboard',
    'profile': 'My Profile',
    'projects': 'My Projects',
    'portfolio-builder': 'Portfolio Builder',
    'portfolio-analyzer': 'Portfolio Analyzer',
    'resume-analyzer': 'Resume Analyzer',
    'skill-matcher': 'Skill Matcher',
    'prompt-studio': 'AI Prompt Studio',
    'settings': 'Settings'
  };

  const currentTitle = pageTitles[activeTab] || 'SkillProof';

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (q.includes('proj')) setActiveTab('projects');
      else if (q.includes('prof') || q.includes('bio')) setActiveTab('profile');
      else if (q.includes('res') || q.includes('ats')) setActiveTab('resume-analyzer');
      else if (q.includes('port') || q.includes('anal')) setActiveTab('portfolio-analyzer');
      else if (q.includes('build') || q.includes('stud')) setActiveTab('portfolio-builder');
      else if (q.includes('prom') || q.includes('ai')) setActiveTab('prompt-studio');
      else if (q.includes('skill') || q.includes('mat')) setActiveTab('skill-matcher');
      else if (q.includes('set')) setActiveTab('settings');
      else setActiveTab('dashboard');
      setSearchQuery('');
    }
  };

  const roles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'Machine Learning Engineer',
    'Python Developer',
    'Software Developer'
  ];

  const handleRoleChange = (e) => {
    const updated = { ...(profile || {}), targetRole: e.target.value };
    onProfileUpdate(updated);
  };

  const handleLoadDemo = () => {
    const data = loadSampleData();
    onProfileUpdate(data.profile);
    setShowUserMenu(false);
  };

  const handleClearDemo = () => {
    if (window.confirm('Clear all local data and start with an empty slate?')) {
      clearAllData();
      setShowUserMenu(false);
    }
  };

  // Render contextual action button depending on the current active tab
  const renderContextualButton = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <button onClick={() => setActiveTab('projects')} className="btn btn-primary btn-sm">
            <Plus size={14} /> <span>Add Project</span>
          </button>
        );
      case 'profile':
        return (
          <button onClick={() => setActiveTab('portfolio-builder')} className="btn btn-secondary btn-sm">
            <Palette size={14} /> <span>Preview in Builder</span>
          </button>
        );
      case 'projects':
        return (
          <button onClick={() => window.dispatchEvent(new CustomEvent('skillproof_open_add_project'))} className="btn btn-primary btn-sm">
            <Plus size={14} /> <span>New Project</span>
          </button>
        );
      case 'portfolio-builder':
        return (
          <button onClick={() => window.dispatchEvent(new CustomEvent('skillproof_trigger_export_zip'))} className="btn btn-primary btn-sm">
            <Download size={14} /> <span>Download ZIP</span>
          </button>
        );
      case 'skill-matcher':
        return (
          <button onClick={() => setActiveTab('profile')} className="btn btn-secondary btn-sm">
            <User size={14} /> <span>Edit Skills</span>
          </button>
        );
      case 'prompt-studio':
        return (
          <button onClick={() => window.dispatchEvent(new CustomEvent('skillproof_trigger_new_prompt'))} className="btn btn-primary btn-sm">
            <Sparkles size={14} /> <span>New Prompt</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left: Mobile menu & Page Title / Target Role */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px'
          }}
          className="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        {/* Current Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            {currentTitle}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)'
            }}
          >
            <Briefcase size={13} color="var(--primary)" />
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Role:</span>
            <select
              value={profile?.targetRole || 'Full Stack Developer'}
              onChange={handleRoleChange}
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 600,
                color: 'var(--primary)',
                cursor: 'pointer',
                outline: 'none',
                fontSize: '0.8125rem'
              }}
            >
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Search */}
        <div style={{ position: 'relative', width: '200px' }} className="topbar-search">
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '9px' }} />
          <input
            type="text"
            placeholder="Jump to page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            style={{
              width: '100%',
              padding: '6px 10px 6px 30px',
              fontSize: '0.78125rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Right: Contextual Action Button, Status, User Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Contextual Action Button */}
        {renderContextualButton()}

        {/* Storage Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: 'var(--success-soft)',
            border: '1px solid rgba(13, 148, 136, 0.2)',
            fontSize: '0.75rem',
            color: 'var(--success)',
            fontWeight: 600
          }}
          title="All data is saved in your browser LocalStorage."
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
          <span>LocalStorage</span>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '7px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Notifications"
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)'
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '300px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
                padding: '16px',
                zIndex: 50
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notifications</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Session</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--primary-soft)', borderRadius: '8px', fontSize: '0.8125rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Ready for Export</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                    Generate your standalone portfolio in Portfolio Builder.
                  </div>
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.8125rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Storage Active</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                    Profile and project changes persist in LocalStorage.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Avatar Menu with Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 4px',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            {profile?.basic?.avatar && !avatarError ? (
              <img
                src={profile.basic.avatar}
                alt={profile?.basic?.fullName || 'Avatar'}
                onError={() => setAvatarError(true)}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em'
                }}
              >
                {getInitials(profile?.basic?.fullName)}
              </div>
            )}
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.basic?.fullName || 'My Account'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '240px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
                padding: '12px',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{profile.basic?.fullName || 'User Profile'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{profile.basic?.email || 'local@skillproof.app'}</div>
              </div>

              <button
                onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  border: 'none',
                  background: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  color: 'var(--text-primary)',
                  textAlign: 'left'
                }}
              >
                <User size={15} color="var(--primary)" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); setShowUserMenu(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  border: 'none',
                  background: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  color: 'var(--text-primary)',
                  textAlign: 'left'
                }}
              >
                <Settings size={15} color="var(--text-muted)" />
                <span>Settings & Data</span>
              </button>

              <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />

              <button
                onClick={handleLoadDemo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  border: 'none',
                  background: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  color: 'var(--primary)',
                  textAlign: 'left'
                }}
              >
                <Sparkles size={15} />
                <span>Reload Demo Profile</span>
              </button>

              <button
                onClick={handleClearDemo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  border: 'none',
                  background: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  textAlign: 'left'
                }}
              >
                <span>Clear to Empty State</span>
              </button>

              {onLogout && (
                <>
                  <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />
                  <button
                    onClick={() => { setShowUserMenu(false); onLogout(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      color: 'var(--danger)',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={15} />
                    <span>Log Out (Local Session)</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
