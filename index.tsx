import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

function showMountError(message: string) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:2rem;font-family:system-ui,sans-serif;max-width:32rem;margin:0 auto;"><h1 style="font-size:1.25rem;margin-bottom:0.5rem;">Could not load app</h1><p style="color:#64748b;margin-bottom:1rem;">${message}</p><button onclick="location.reload()" style="padding:0.5rem 1rem;background:#4f46e5;color:white;border:none;border-radius:0.5rem;cursor:pointer;">Reload</button></div>`;
  }
}

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    showMountError('Root element #root not found.');
  } else {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <Provider store={store}>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </Provider>
    );
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error('Mount error:', err);
  showMountError(message);
}