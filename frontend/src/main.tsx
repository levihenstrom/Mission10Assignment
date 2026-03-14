// main.tsx — Application entry point
// Mounts the root React component into the DOM element with id="root"

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// StrictMode helps catch potential problems during development
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
