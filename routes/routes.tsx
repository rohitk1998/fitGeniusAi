import { lazy, ComponentType } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

const lazyWithPreload = <T extends ComponentType<unknown>>(
    factory: () => Promise<{ default: T }>
) => {
    const Component = lazy(factory);
    (Component as typeof Component & { preload: () => void }).preload = factory;
    return Component as typeof Component & { preload: () => void };
};

const SplashScreen = lazyWithPreload(() => import('../components/SplashScreen'));
const OnboardingStory = lazyWithPreload(() => import('../components/OnboardingStory'));
const PreviewScreen = lazyWithPreload(() => import('../components/PreviewScreen'));
const AppShell = lazyWithPreload(() => import('../components/AppShell'));

export { SplashScreen, OnboardingStory, PreviewScreen, AppShell };

export const publicRoutes: RouteObject[] = [
    { path: '/splash', element: <SplashScreen /> },
    { path: '/onboarding', element: <OnboardingStory /> },
    { path: '/preview', element: <PreviewScreen /> },
];

export const privateRoutes: RouteObject[] = [
    { path: '/app/*', element: <AppShell /> },
];
