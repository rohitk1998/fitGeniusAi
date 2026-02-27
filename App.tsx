import { type FC, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes/routes.tsx';

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
    <div className="w-10 h-10 rounded-full border-4 border-indigo-400/30 border-t-indigo-400 animate-spin" />
  </div>
);

const App: FC = () => {
  const routes = useRoutes([
    { path: '/', element: <Navigate to="/splash" replace /> },
    ...publicRoutes,
    ...privateRoutes,
    { path: '*', element: <Navigate to="/splash" replace /> },
  ]);


  return <Suspense fallback={<PageLoader />}>{routes}</Suspense>;
};

export default App;
