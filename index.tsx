
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical error during application rendering:", error);
  // Attempt to display a fallback message in the UI
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: sans-serif; padding: 20px; text-align: center; color: #333; background-color: #f0f0f0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1>Application Error</h1>
        <p>There was a critical error that prevented the application from loading.</p>
        <p>Please check the browser's developer console for more details.</p>
        ${error instanceof Error ? `<pre style="white-space: pre-wrap; background-color: #e0e0e0; padding: 10px; border-radius: 5px; text-align: left; max-width: 80%; overflow-x: auto;">${error.message}\n${error.stack}</pre>` : ''}
      </div>
    `;
  }
}
