import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import OnboardingStory from './components/OnboardingStory';
import AuthScreen from './components/AuthScreen';
import AppLayout from './components/layout/AppLayout';
import MainContent from './components/MainContent';
import { useAppState } from './hooks/useAppState';
import { useAuth } from './hooks/useAuth';
import type { TabType } from './constants/navigation';
import type { FitnessResponse } from './types';
//jdhkjashdkjhasdj
/** Returns true if a cached user credential snapshot exists in localStorage. */
function hasCachedUser(): boolean {
  try {
    return !!localStorage.getItem('fitaura_user');
  } catch {
    return false;
  }
}

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem('fitaura_onboarding_complete') === 'true' ? false : true;
    } catch {
      return true;
    }
  });
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [signingIn, setSigningIn] = useState(false);
  const { result, setResult, activityLog, logActivity } = useAppState();
  const { session, user, loading, signInWithGoogle, signOut } = useAuth();

  const handleSignIn = async () => {
    setSigningIn(true);
    await signInWithGoogle();
    // Redirect happens; signingIn stays true until page reloads
  };

  const handlePlanReady = (plan: FitnessResponse) => {
    setResult(plan);
  };

  // Fast-path: if we already know the user from localStorage, skip the spinner
  // and let Supabase rehydrate in the background.
  const cachedUser = hasCachedUser();

  // Auth loading — only block render when there is NO cached credential.
  // Returning users go straight to the authenticated shell.
  if (loading && !cachedUser) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Treat the session as "resolved" if either Supabase confirmed it OR
  // a cached credential snapshot exists (covers the brief rehydration window).
  const isAuthenticated = !!session || cachedUser;

  return (
    <>
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} minDuration={2200} />
      )}

      {!showSplash && showOnboarding && (
        <OnboardingStory onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Unauthenticated — show auth screen */}
      {!showSplash && !showOnboarding && !isAuthenticated && (
        <AuthScreen
          onPlanReady={handlePlanReady}
          onSignIn={handleSignIn}
          signingIn={signingIn}
        />
      )}

      {/* Authenticated — route directly to dashboard */}
      {!showSplash && !showOnboarding && isAuthenticated && (
        <AppLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          user={user}
          onSignOut={signOut}
        >
          <MainContent
            activeTab={activeTab}
            result={result}
            activityLog={activityLog}
            setActiveTab={setActiveTab}
            setResult={setResult}
            logActivity={logActivity}
          />
        </AppLayout>
      )}
    </>
  );
};

export default App;
