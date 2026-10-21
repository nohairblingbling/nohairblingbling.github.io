import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './index.css';
import Layout from './components/Layout';
import SiteEntrance from './components/SiteEntrance';
import { prepareEntranceVisit } from './components/entranceVisit';

export function mount(page: ReactNode) {
  const playEntrance = prepareEntranceVisit();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <SiteEntrance play={playEntrance}><Layout>{page}</Layout></SiteEntrance>
    </StrictMode>
  );
}
