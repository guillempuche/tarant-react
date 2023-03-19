import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './ui/global.css';
import { App } from './ui/app';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
