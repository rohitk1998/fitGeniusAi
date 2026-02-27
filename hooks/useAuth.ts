import { useState, useEffect } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

const USER_STORAGE_KEY = 'fitaura_user';

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
    } catch { }
}

function clearUserFromStorage(): void {
    try {
        localStorage.removeItem(USER_STORAGE_KEY);
    } catch { }
}

export function hasCachedUser(): boolean {
    try {
        return !!localStorage.getItem(USER_STORAGE_KEY);
    } catch {
        return false;
    }
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
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            if (data.session?.user) saveUserToStorage(data.session.user);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            if (newSession?.user) {
                saveUserToStorage(newSession.user);
            } else {
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
