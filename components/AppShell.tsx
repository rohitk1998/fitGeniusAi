import { useState, FC } from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import MainContent from './MainContent';
import { useAppState } from '../hooks/useAppState';
import { useAuth, hasCachedUser } from '../hooks/useAuth';
import type { TabType } from '../constants/navigation';

const AppShell: FC = () => {
    const { session, user, loading, signOut } = useAuth();
    const { result, setResult, activityLog, logActivity } = useAppState();
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');

    const cachedUser = hasCachedUser();
    const isAuthenticated = !!session || cachedUser;

    if (loading && !cachedUser) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/preview" replace />;
    }

    return (
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
    );
};

export default AppShell;
