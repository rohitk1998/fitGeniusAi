import { useState, useEffect } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

const USER_STORAGE_KEY = 'fitaura_user';

/** Lightweight snapshot saved to localStorage after a successful auth. */
interface StoredUser {
    id: string;
    email: string | undefined;
    full_name: string | undefined;
    avatar_url: string | undefined;
}

function saveUserToStorage(user: User): void {
    const snapshot: StoredUser = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name as string | undefined,
        avatar_url: user.user_metadata?.avatar_url as string | undefined,
    };
    try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(snapshot));
    } catch { /* quota / private-mode — silently ignore */ }
}

function clearUserFromStorage(): void {
    try {
        localStorage.removeItem(USER_STORAGE_KEY);
    } catch { /* ignore */ }
}

interface UseAuthReturn {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Rehydrate existing session on mount
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            if (data.session?.user) saveUserToStorage(data.session.user);
            setLoading(false);
        });

        // Listen for auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            if (newSession?.user) {
                // Persist credentials to localStorage on every successful auth
                saveUserToStorage(newSession.user);
            } else {
                // Session gone (sign-out / expiry) — clear stored credentials
                clearUserFromStorage();
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        clearUserFromStorage();
    };

    return {
        session,
        user: session?.user ?? null,
        loading,
        signInWithGoogle,
        signOut,
    };
}
