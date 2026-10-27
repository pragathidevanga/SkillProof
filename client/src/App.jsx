import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProfileOnboarding from './pages/ProfileOnboarding';
import ProjectsManager from './pages/ProjectsManager';
import PortfolioStudio from './pages/PortfolioStudio';
import PortfolioAnalyzer from './pages/PortfolioAnalyzer';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import SkillMatcher from './pages/SkillMatcher';
import PromptStudio from './pages/PromptStudio';
import SettingsPage from './pages/SettingsPage';
import LoadingScreen from './components/LoadingScreen';
import OnboardingWizard from './components/OnboardingWizard';
import {
  loadProfile,
  saveProfile,
  loadSession,
  saveSession,
  clearSession,
  createSession,
  getStableUserId,
  isProfileOnboarded,
  loadSampleData
} from './services/storage';

function getTabFromPathname() {
  if (typeof window === 'undefined') return 'dashboard';
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const validTabs = [
    'dashboard',
    'profile',
    'projects',
    'portfolio-builder',
    'portfolio-analyzer',
    'resume-analyzer',
    'skill-matcher',
    'prompt-studio',
    'settings'
  ];
  if (validTabs.includes(path)) return path;
  if (path === 'builder') return 'portfolio-builder';
  if (path === 'analyzer') return 'portfolio-analyzer';
  if (path === 'resume') return 'resume-analyzer';
  if (path === 'skills') return 'skill-matcher';
  if (path === 'prompts') return 'prompt-studio';
  return 'dashboard';
}

export default function App() {
  const [profile, setProfile] = useState(loadProfile);
  const [session, setSession] = useState(loadSession);
  const [isLoadingTransition, setIsLoadingTransition] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Preparing your workspace...');
  const [view, setView] = useState('landing'); // 'landing' | 'onboarding' | 'app'
  const [activeTab, setActiveTab] = useState(getTabFromPathname);
  const [targetDestination, setTargetDestination] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initial session restoration on startup
  useEffect(() => {
    const currentSession = loadSession();
    const currentProfile = loadProfile();

    if (currentSession && currentSession.isAuthenticated) {
      setLoadingMessage('Restoring your session...');
      const timer = setTimeout(() => {
        if (isProfileOnboarded(currentProfile)) {
          setView('app');
          const initialTab = getTabFromPathname();
          setActiveTab(initialTab);
        } else {
          setView('onboarding');
        }
        setIsLoadingTransition(false);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      // First-time or logged-out visitor: Always show Landing Page first
      setView('landing');
      if (window.location.pathname !== '/') {
        window.history.replaceState(null, '', '/');
      }
      setIsLoadingTransition(false);
    }
  }, []);

  // Synchronize browser URL bar with active tab in authenticated view
  useEffect(() => {
    if (view === 'app' && activeTab) {
      const targetPath = `/${activeTab}`;
      if (window.location.pathname !== targetPath) {
        window.history.replaceState(null, '', targetPath);
      }
    }
  }, [view, activeTab]);

  // Handle browser back and forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPathname();
      setActiveTab(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen for storage changes across windows/tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setProfile(loadProfile());
      setSession(loadSession());
    };
    window.addEventListener('skillproof_storage_updated', handleStorageChange);
    return () => window.removeEventListener('skillproof_storage_updated', handleStorageChange);
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  // Login handler from Landing Page modal with true per-user isolation
  const handleLogin = ({ email, name, isNewUser, targetDestination: dest = 'dashboard' }) => {
    setTargetDestination(dest);
    setIsLoadingTransition(true);
    setLoadingMessage(isNewUser ? 'Creating your personal workspace...' : 'Signing you in...');

    const userId = getStableUserId(email, name);
    const existingProfile = loadProfile(userId);
    const resolvedRole = existingProfile?.targetRole || 'Full Stack Developer';

    const newSession = createSession({
      email,
      name: name || existingProfile?.basic?.fullName || 'SkillProof Developer',
      role: resolvedRole,
      isDemo: false,
      userId
    });
    setSession(newSession);

    setTimeout(() => {
      if (isNewUser || !existingProfile) {
        const freshProfile = {
          isSampleData: false,
          isOnboarded: false,
          basic: {
            fullName: name || '',
            headline: '',
            avatar: '',
            about: '',
            email: email || '',
            location: ''
          },
          targetRole: resolvedRole,
          secondaryRole: '',
          experienceLevel: 'Entry-Level / Fresher',
          skills: [],
          softSkills: ['Problem Solving', 'Communication'],
          languages: ['English'],
          education: [],
          experience: [],
          certifications: [],
          links: { github: '', linkedin: '', portfolio: '', twitter: '' }
        };
        saveProfile(freshProfile, userId);
        setProfile(freshProfile);
        setView('onboarding');
      } else {
        setProfile(existingProfile);
        if (isProfileOnboarded(existingProfile)) {
          setView('app');
          setActiveTab(dest);
        } else {
          setView('onboarding');
        }
      }
      setIsLoadingTransition(false);
    }, 450);
  };

  // 1-Click Demo Access (isolated demo namespace)
  const handleOpenDemo = (dest = 'dashboard') => {
    setTargetDestination(dest);
    setIsLoadingTransition(true);
    setLoadingMessage('Loading interactive demo environment...');

    const demoUserId = 'u_demo_alex_morgan';
    const sample = loadSampleData(demoUserId);
    const demoSession = createSession({
      email: 'alex.morgan@example.com',
      name: 'Alex Morgan',
      role: 'Full Stack Developer',
      isDemo: true,
      userId: demoUserId
    });
    setSession(demoSession);
    setProfile(sample.profile);

    setTimeout(() => {
      setView('app');
      setActiveTab(dest);
      setIsLoadingTransition(false);
    }, 450);
  };

  // Onboarding completion
  const handleOnboardingComplete = (updatedProfile) => {
    handleProfileUpdate({ ...updatedProfile, isOnboarded: true });
    setView('app');
    setActiveTab(targetDestination || 'dashboard');
  };

  // Logout handler (clears session without deleting other users' data)
  const handleLogout = () => {
    clearSession();
    setSession(null);
    setProfile(null);
    setView('landing');
    setActiveTab('dashboard');
  };

  // Full-screen loading screen during transitions
  if (isLoadingTransition) {
    return <LoadingScreen message={loadingMessage} />;
  }

  // 1. PUBLIC LANDING PAGE (First-time visitor or logged-out state)
  if (view === 'landing') {
    return (
      <LandingPage
        onLogin={handleLogin}
        onOpenDemo={handleOpenDemo}
      />
    );
  }

  // 2. STEP-BY-STEP PROFILE ONBOARDING (For new users before dashboard)
  if (view === 'onboarding') {
    return (
      <OnboardingWizard
        profile={profile}
        onComplete={handleOnboardingComplete}
        onExit={() => {
          setView('app');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // 3. AUTHENTICATED APPLICATION SHELL
  // Normalize tab names to match specifications
  let normalizedTab = activeTab;
  if (normalizedTab === 'onboarding') normalizedTab = 'profile';
  if (normalizedTab === 'skills-matrix' || normalizedTab === 'readiness-report') normalizedTab = 'skill-matcher';
  if (normalizedTab === 'portfolio-studio') normalizedTab = 'portfolio-builder';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Collapsible Sidebar with exact 9 sections */}
      <Sidebar
        activeTab={normalizedTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onOpenLanding={() => setView('landing')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Persistent Top Navigation Bar */}
        <TopBar
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
          activeTab={normalizedTab}
          setActiveTab={setActiveTab}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
        />

        {/* Tab Views */}
        <main style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', overflowY: 'auto' }}>
          {normalizedTab === 'dashboard' && (
            <Dashboard
              profile={profile}
              setActiveTab={setActiveTab}
              onOpenAddProject={() => setActiveTab('projects')}
            />
          )}

          {normalizedTab === 'profile' && (
            <ProfileOnboarding
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
              setActiveTab={setActiveTab}
            />
          )}

          {normalizedTab === 'projects' && (
            <ProjectsManager
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
            />
          )}

          {normalizedTab === 'portfolio-builder' && (
            <PortfolioStudio
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
            />
          )}

          {normalizedTab === 'portfolio-analyzer' && (
            <PortfolioAnalyzer
              profile={profile}
              setActiveTab={setActiveTab}
            />
          )}

          {normalizedTab === 'resume-analyzer' && (
            <ResumeAnalyzer
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
            />
          )}

          {normalizedTab === 'skill-matcher' && (
            <SkillMatcher
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
              setActiveTab={setActiveTab}
            />
          )}

          {normalizedTab === 'prompt-studio' && (
            <PromptStudio
              profile={profile}
            />
          )}

          {normalizedTab === 'settings' && (
            <SettingsPage
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
              setActiveTab={setActiveTab}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>
    </div>
  );
}
