import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './index.css';

// Point alphaTab at self-hosted runtime scripts. This drives its worker/worklet
// fallback (classic worker via importScripts of /alphatab/alphaTab.js) and font
// detection, which is the reliable path in a Vite build without the (currently
// broken) official alphaTab bundler plugin. Must be set before AlphaTabApi init.
declare global {
  interface Window {
    ALPHATAB_ROOT?: string;
    ALPHATAB_FONT?: string;
  }
}
window.ALPHATAB_ROOT = '/alphatab/';
window.ALPHATAB_FONT = '/font/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
