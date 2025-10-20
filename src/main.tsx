import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import iconWebUrl from './assets/icon_web.png'

// Ensure favicon uses icon_web across dev and prod (respects Vite base)
const ensureFavicon = (href: string) => {
  const selector = "link[rel~='icon']";
  let link = document.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/png';
  link.href = href;
};

ensureFavicon(iconWebUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
