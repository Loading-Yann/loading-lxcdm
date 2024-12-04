import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.scss';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement); // Création de la racine avec React 18
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

