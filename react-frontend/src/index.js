import React from 'react';
import { createRoot } from 'react-dom/client'; // Importar createRoot
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Encontrar o elemento root no seu HTML
const container = document.getElementById('root');

// Criar uma root com createRoot
const root = createRoot(container);

// Renderizar o App com a nova API
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
