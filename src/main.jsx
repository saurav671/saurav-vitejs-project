import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './tasks/42077/1a.jsx';
// import App from './tasks/42077/1b.jsx';
// import App from './tasks/42077/1ideal.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
