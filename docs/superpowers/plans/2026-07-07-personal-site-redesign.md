# Personal Site Redesign (Quiet Signal v3.0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild yuzhuojia.fun as a dark, restrained, tech/light-cyber single-page site (Vite + React + TS + Tailwind v4) per `docs/superpowers/specs/2026-07-07-personal-site-redesign-design.md`.

**Architecture:** Single-page app, no router. All content lives in `src/content.ts`. Animation components are vendored equivalents of reactbits.dev components (attribution comments in each file), written dependency-free except `ogl` for the WebGL particle background. Every animation respects `prefers-reduced-motion` and pointer coarseness via shared hooks.

**Tech Stack:** Vite ^7, React ^19, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), `ogl`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`, Vitest + Testing Library + jsdom, gh-pages.

**Deviation from spec (approved rationale):** Spec §2 said reactbits components arrive via shadcn CLI with motion/gsap/ogl installed as needed. The CLI is interactive and network-fragile, so this plan vendors equivalent implementations directly (same folder `src/components/reactbits/`, same visual behavior, pre-tuned to our restraint rules). Only `ogl` is needed at runtime. Spec's "按所选组件的实际依赖安装，不多装" principle is preserved.

**Working branch:** `redesign` (already created; spec committed). Never touch `master` until the gated final task.

**Design tokens (used throughout, defined once in Task 2):** bg `#050608`, raised `#0A0E12`, hairline `#16232C`, accent `#2DD4E8`, ink `#E8EDF2`, ink-2 `#8FA0AD`, ink-3 `#5B6976`. Tailwind classes: `bg-base bg-raised border-hairline text-accent text-ink text-ink-2 text-ink-3 font-sans font-mono`.

---

### Task 1: Clean slate + asset migration

**Files:**
- Create: `.gitignore` (rewrite)
- Delete: old `src/`, `public/`, `build/`, `.history/`, `TUTORIAL_CN.md`, `package.json`, `package-lock.json`, `yarn.lock`, root `CNAME`, root `.DS_Store`
- Keep: `LICENSE`, `docs/`, old images (migrated to `assets_migration/` temporarily)

- [ ] **Step 1: Stash the images we keep**

```bash
cd /Users/duskandwine/MyProject/Personalweb/latestversion
mkdir -p assets_migration
cp src/assets/research/BiFocalNet.png src/assets/research/bibm1.png src/assets/research/yolo5.png src/assets/research/new_research.jpg assets_migration/
cp src/assets/project/paper.gif src/assets/project/interview.png src/assets/project/dcd.png assets_migration/
cp src/assets/images/touxian.jpg assets_migration/
ls assets_migration
```
Expected: 8 files listed.

- [ ] **Step 2: Remove old app files**

```bash
git rm -r -q src public build .history TUTORIAL_CN.md package.json package-lock.json yarn.lock CNAME README.md
git rm -q --cached .DS_Store 2>/dev/null; rm -f .DS_Store
git status --short | head -20
```
Expected: deletions staged; `assets_migration/` untracked.

- [ ] **Step 3: Write new `.gitignore`**

```
node_modules/
dist/
.DS_Store
.history/
*.local
npm-debug.log*
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore && git commit -m "chore: remove legacy CRA site, keep migrated assets staging"
```
Note: `assets_migration/` stays untracked; it is moved into the new `src/assets/` in Task 2 and committed there.

---

### Task 2: Vite + Tailwind v4 + Vitest scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `public/CNAME`, `public/favicon.svg`, `src/main.tsx`, `src/index.css`, `src/App.tsx`, `src/test/setup.ts`, `src/test/smoke.test.tsx`
- Move: `assets_migration/*` → `src/assets/`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "yuzhuojia-site",
  "private": true,
  "version": "3.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "@fontsource-variable/inter": "^5.2.5",
    "@fontsource-variable/jetbrains-mono": "^5.2.5",
    "ogl": "^1.0.11",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.4",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^5.0.0",
    "gh-pages": "^6.3.0",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.1.4",
    "typescript": "~5.8.3",
    "vite": "^7.0.0",
    "vitest": "^3.1.2"
  }
}
```
(If `npm install` reports an unresolvable version, relax that one range to latest major — do not downgrade React/Tailwind/Vite majors.)

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "useDefineForClassFields": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 3: Write `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

- [ ] **Step 4: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Yuzhuo Jia — HCI Researcher</title>
    <meta name="description" content="Personal site of Yuzhuo Jia — researcher working on human-computer interaction, embodied AI, mixed reality, and wearables." />
    <meta name="theme-color" content="#050608" />
    <meta property="og:title" content="Yuzhuo Jia — HCI Researcher" />
    <meta property="og:description" content="Research on human-computer interaction, embodied AI, mixed reality, and wearables." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yuzhuojia.fun" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <style>html{background:#050608}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Write `public/CNAME`** (single line, no newline issues)

```
yuzhuojia.fun
```

- [ ] **Step 6: Write `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#050608"/>
  <path d="M6 6h12M6 6v12" stroke="#2DD4E8" stroke-width="3" fill="none"/>
  <path d="M58 58H46M58 58V46" stroke="#2DD4E8" stroke-width="3" fill="none"/>
  <text x="32" y="41" font-family="Menlo, Consolas, monospace" font-size="22" fill="#E8EDF2" text-anchor="middle">YJ</text>
</svg>
```

- [ ] **Step 7: Write `src/index.css`** (design tokens + global styles + keyframes)

```css
@import "tailwindcss";

@theme {
  --color-base: #050608;
  --color-raised: #0a0e12;
  --color-hairline: #16232c;
  --color-accent: #2dd4e8;
  --color-ink: #e8edf2;
  --color-ink-2: #8fa0ad;
  --color-ink-3: #5b6976;
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, "SF Mono", Menlo, monospace;
  --animate-star-top: star-top 5s linear infinite;
  --animate-star-bottom: star-bottom 5s linear infinite;
  --animate-pulse-dot: pulse-dot 2.4s ease-in-out infinite;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-base font-sans text-ink antialiased;
}

::selection {
  background: rgb(45 212 232 / 0.25);
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #050608;
}
::-webkit-scrollbar-thumb {
  background: #16232c;
}

html.cursor-hidden,
html.cursor-hidden a,
html.cursor-hidden button {
  cursor: none;
}

@keyframes star-top {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
@keyframes star-bottom {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-200%); }
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 8: Write `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 9: Write placeholder `src/App.tsx`** (replaced in Task 8)

```tsx
export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="font-mono text-xs tracking-[0.3em] text-accent">QUIET SIGNAL / SCAFFOLD OK</p>
    </main>
  );
}
```

- [ ] **Step 10: Write `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  constructor(private cb: IntersectionObserverCallback) {}
  observe = (el: Element) => {
    this.cb(
      [{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  };
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

Element.prototype.scrollIntoView = vi.fn();
```
Note: `matches: query.includes('prefers-reduced-motion')` means tests run in reduced-motion mode — animated components must render their final states, which is exactly what we assert.

- [ ] **Step 11: Write `src/test/smoke.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

- [ ] **Step 12: Move migrated assets into the new tree**

```bash
mkdir -p src/assets
mv assets_migration/* src/assets/ && rmdir assets_migration
ls src/assets
```
Expected: 8 image files.

- [ ] **Step 13: Install and verify**

```bash
npm install
npm test
npm run build
```
Expected: install clean; 1 test passes; build emits `dist/` and `dist/CNAME` exists (`ls dist/CNAME`).

- [ ] **Step 14: Commit**

```bash
git add -A && git commit -m "feat: scaffold Vite + React + TS + Tailwind v4 with test infra and design tokens"
```

---

### Task 3: content.ts (all site data, test-first)

**Files:**
- Create: `src/content.ts`
- Test: `src/test/content.test.ts`

- [ ] **Step 1: Write the failing test `src/test/content.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { hero, about, timeline, research, publications, projects, contact, socials, stats } from '../content';

describe('content integrity', () => {
  it('hero has editable position line', () => {
    expect(hero.name).toBe('Yuzhuo Jia');
    expect(hero.position.length).toBeGreaterThan(0);
  });
  it('has 3 timeline entries and 3-value stats', () => {
    expect(timeline).toHaveLength(3);
    expect(stats.map((s) => s.value)).toEqual([4, 6, 3]);
  });
  it('has 6 research entries with required fields', () => {
    expect(research).toHaveLength(6);
    for (const r of research) {
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.period.length).toBeGreaterThan(0);
      expect(r.description.length).toBeGreaterThan(50);
    }
  });
  it('has 4 publications, each crediting Yuzhuo Jia', () => {
    expect(publications).toHaveLength(4);
    for (const p of publications) {
      expect(p.image).toBeTruthy();
      expect(p.venue.length).toBeGreaterThan(0);
      expect(p.authors.some((a) => a.me)).toBe(true);
    }
  });
  it('publication links are https', () => {
    for (const p of publications) {
      if (p.link) expect(p.link.url).toMatch(/^https:\/\//);
    }
  });
  it('has 3 projects with https github links when present', () => {
    expect(projects).toHaveLength(3);
    for (const p of projects) {
      if (p.github) expect(p.github).toMatch(/^https:\/\/github\.com\//);
    }
  });
  it('contact and socials are set', () => {
    expect(contact.email).toContain('@');
    expect(socials.github).toMatch(/^https:\/\//);
    expect(about.interests.length).toBeGreaterThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/content.test.ts`
Expected: FAIL — cannot resolve `../content`.

- [ ] **Step 3: Write `src/content.ts`** (data ported verbatim from old `content_option.js`; only grammar in bio lightly polished)

```ts
import imgBifocal from './assets/BiFocalNet.png';
import imgBibm from './assets/bibm1.png';
import imgYolo from './assets/yolo5.png';
import imgReading from './assets/new_research.jpg';
import imgPaper from './assets/paper.gif';
import imgInterview from './assets/interview.png';
import imgDcd from './assets/dcd.png';
import imgPortrait from './assets/touxian.jpg';

export type Author = { name: string; me?: boolean };
export type Publication = {
  title: string;
  authors: Author[];
  venue: string;
  status?: string;
  link?: { label: string; url: string };
  image: string;
};
export type Project = { title: string; description: string; github?: string; image: string };
export type ResearchEntry = { title: string; period: string; description: string };
export type TimelineEntry = { org: string; role: string; period: string };

export const meta = {
  title: 'Yuzhuo Jia — HCI Researcher',
  url: 'https://yuzhuojia.fun',
};

export const hero = {
  kicker: '01 / HCI × EMBODIED AI',
  name: 'Yuzhuo Jia',
  tagline:
    'Building adaptive, embodied and mixed-reality interfaces — technology that makes interaction more intelligent and more natural.',
  // 转博 / 换头衔只改这一行：
  position: 'Research Assistant · Tsinghua University',
  status: 'OPEN TO COLLABORATION',
};

export const about = {
  bio: 'My research interests are in Human-Computer Interaction (HCI), specifically at the intersection of Robotics, Mixed Reality (MR), wearables, and AI Agents. I am passionate about using technology to create more intelligent and natural interactive experiences for the future.',
  portrait: imgPortrait,
  interests: [
    'Human-Computer Interaction',
    'Robotics',
    'Mixed Reality',
    'Wearables',
    'AI Agents',
    'Computer Vision',
  ],
};

export const timeline: TimelineEntry[] = [
  { org: 'Tsinghua University', role: 'Research Assistant', period: 'Feb 2025 — Present' },
  { org: 'University of Sydney', role: 'MS, Computer Science', period: 'Feb 2023 — Mar 2025' },
  {
    org: 'Nanfang College of Sun Yat-sen University',
    role: 'BS, Computer Science and Technology',
    period: 'Sep 2017 — Jun 2021',
  },
];

export const stats = [
  { value: 4, label: 'Publications' },
  { value: 6, label: 'Research projects' },
  { value: 3, label: 'Institutions' },
];

export const research: ResearchEntry[] = [
  {
    title: 'Adaptive Reading System',
    period: 'Jun 2025 — Sep 2025',
    description:
      "As the lead on an adaptive reading system project, I architected and implemented a browser-based Tampermonkey userscript that leverages MediaPipe Face Mesh for real-time facial landmark detection. This system dynamically adapts font size and color contrast by precisely calculating the user's viewing distance. I executed a comprehensive user study with 24 middle-aged adults to evaluate the system's impact on reading speed, comprehension, and comfort. Following the study, I performed qualitative thematic analysis on interviews, which uncovered key usability insights, such as the trade-off between the cognitive load of adaptations and performance gains. I also spearheaded the writing of the research paper submitted to a top-tier HCI conference, contributing significantly to the literature review, system design, and discussion sections.",
  },
  {
    title: 'Embodied Intelligence Research Group',
    period: 'Apr 2025 — Aug 2025',
    description:
      'For the Embodied Intelligence Research Group, I engineered and constructed a 6-DOF force-controlled robotic arm using 3D-printed components and DAMIAO motors, and am currently integrating the system with MoveIt 2 for advanced motion planning and control. I also extended an open-source framework to create an enhanced web-based agentic system, equipping it with speech-to-text (STT) capabilities, real-time video streaming, and Model Context Protocol (MCP) client integration to ensure seamless compatibility with all MCP-compliant tools and services.',
  },
  {
    title: 'PI Lab — MathAdventure',
    period: 'Jan 2025 — Mar 2025',
    description:
      "In the MathAdventure project, I contributed to a novel, screen-free, voice-based interactive learning system designed to enhance mathematical understanding of the decimal system in children aged 4-8. Grounded in Contextual Learning and Zone of Proximal Development (ZPD) principles, the system uses real-world object symbolization to teach math concepts. My core contribution was building the computer vision module for real-time object recognition, which enabled the generation of contextualized math problems based on a child's immediate physical surroundings. I also orchestrated comprehensive user studies with 18 child-parent pairs, employing methods like Wizard of Oz experiments and iterative prototype testing to evaluate the system's engagement and learning effectiveness. Furthermore, I authored significant sections of the manuscript submitted to UIST 2025, including the Related Work and key parts of the System Design and Development.",
  },
  {
    title: 'BiFocalNet: Dual-Branch Remote Sensing Segmentation',
    period: 'Jul 2024 — Dec 2024',
    description:
      "Developed BiFocalNet, a deep learning architecture for remote sensing segmentation, achieving a 3.062% improvement in mean IoU on the GID dataset. Designed a parallelized encoder combining EfficientNetV2 and Pyramid Vision Transformer, integrated via Cross-Fusion and SuperASPP modules for enhanced multi-scale context modeling. Demonstrated superior performance in key categories, with 3.279% and 3.514% improvements in 'Forest' and 'Built-up' segmentation.",
  },
  {
    title: 'FODAP Graph for Medical Imaging Narrative Generation',
    period: 'Mar 2023 — May 2024',
    description:
      "Co-designed a MedSAM-based visual encoder with Vision Transformer (ViT) architecture, processing 512x512 medical images for high-quality feature representation. Simplified the model by removing the MLP neck and optimizing patch embeddings. Implemented a feature reduction strategy to improve generalization across datasets. Conducted comparative experiments, showing MedSAM's superior performance in medical imaging, and contributed to the Graph-Enhanced Attention (GEA) mechanism for more accurate medical report generation.",
  },
  {
    title: 'Corn Pest Detection Based on Improved YOLOv7',
    period: 'Dec 2023 — Mar 2024',
    description:
      'Developed SPD-YOLOv7, an enhanced model for corn pest detection with 98.38% accuracy, 99.51% recall, and 99.4% mAP@0.5, outperforming YOLOv7. Introduced SPD-Conv to improve small object detection and ELAN-W with CBAM attention for better feature extraction in complex backgrounds. Conducted ablation experiments to validate model improvements, especially for small pest detection.',
  },
];

export const publications: Publication[] = [
  {
    title:
      'Balancing Automation and Agency: How Middle-Aged Adults Experience Dynamic Adaptations During Digital Reading',
    authors: [
      { name: 'Keye Yu*' },
      { name: 'Yuzhuo Jia*', me: true },
      { name: 'Chen Zheng' },
    ],
    venue: 'CHI 2026',
    status: 'In submission',
    image: imgReading,
  },
  {
    title: 'BiFocalNet: Dual-Branch Architecture for Enhanced Remote Sensing Segmentation',
    authors: [{ name: 'Yuzhuo Jia', me: true }],
    venue: 'IEEE Transactions on Geoscience and Remote Sensing',
    status: 'Under revision',
    image: imgBifocal,
  },
  {
    title:
      'FODAP Graph for Enhanced Medical Imaging Narrative Generation: Adaptive Differentiation of Normal and Abnormal Attributes',
    authors: [
      { name: 'Kai Shu*' },
      { name: 'Yuzhuo Jia*', me: true },
      { name: 'Ziyang Zhang' },
      { name: 'Jiechao Gao' },
    ],
    venue: 'International Conference on Bioinformatics and Biomedicine (BIBM 2024)',
    link: { label: 'arXiv', url: 'https://www.arxiv.org/abs/2409.03947' },
    image: imgBibm,
  },
  {
    title: 'Pedestrian behavior detection and traffic violation recognition based on YOLOv5',
    authors: [{ name: 'Yuzhuo Jia', me: true }],
    venue: 'International Conference on Image Processing and Intelligent Control',
    link: { label: 'DOI', url: 'https://doi.org/10.1117/12.3038591' },
    image: imgYolo,
  },
];

export const projects: Project[] = [
  {
    title: 'Paper Review Assistant',
    description:
      "A Next.js web app utilizing AI for academic paper review, with PDF upload, customizable parameters, multilingual support, and a responsive animated UI — built with React, Tailwind CSS, and the OpenAI/Claude APIs.",
    github: 'https://github.com/nohairblingbling/paper-review-assistant',
    image: imgPaper,
  },
  {
    title: 'Interview Assistant',
    description:
      'A cross-platform Electron app for real-time interview response suggestions, integrating speech-to-text, GPT-based intelligent answers, and personalized content management, with privacy-focused local data processing.',
    github: 'https://github.com/nohairblingbling/Interview-Assistant',
    image: imgInterview,
  },
  {
    title: 'Teaching DCD Children How to Move Using AR',
    description:
      'A web-based AR app for children with developmental coordination disorder, featuring WebXR 3D training, MediaPipe real-time motion detection, and a supportive scoring system to enhance motor skills.',
    image: imgDcd,
  },
];

export const contact = {
  email: 'yjia8942@uni.sydney.edu.au',
  blurb:
    'Open to research collaboration and conversations about HCI, embodied AI, and interactive systems.',
};

export const socials: { label: string; url: string }[] = [
  { label: 'GITHUB', url: 'https://github.com/nohairblingbling' },
  { label: 'INSTAGRAM', url: 'https://www.instagram.com/lorcanxoo/' },
  // 有 Google Scholar 主页后取消注释：
  // { label: 'SCHOLAR', url: 'https://scholar.google.com/citations?user=XXXX' },
];

export const footer = {
  coordinates: 'BEIJING — 39.99°N 116.32°E',
  year: new Date().getFullYear(),
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/content.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/content.ts src/test/content.test.ts && git commit -m "feat: port all site content into typed content.ts"
```

---

### Task 4: Shared hooks + Reveal / SectionHeader / CornerBrackets

**Files:**
- Create: `src/hooks.ts`, `src/components/ui/Reveal.tsx`, `src/components/ui/SectionHeader.tsx`, `src/components/ui/CornerBrackets.tsx`
- Test: `src/test/ui.test.tsx`

- [ ] **Step 1: Write the failing test `src/test/ui.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Reveal from '../components/ui/Reveal';
import SectionHeader from '../components/ui/SectionHeader';

describe('Reveal (reduced motion)', () => {
  it('renders children fully visible', () => {
    render(<Reveal><p>hello</p></Reveal>);
    const el = screen.getByText('hello').parentElement!;
    expect(el.className).toContain('opacity-100');
  });
});

describe('SectionHeader', () => {
  it('renders index, label and title', () => {
    render(<SectionHeader index="02" label="ABOUT" title="About" />);
    expect(screen.getByText('02 / ABOUT')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/ui.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/hooks.ts`**

```ts
import { useEffect, useState, type RefObject } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useIsCoarsePointer(): boolean {
  return useMediaQuery('(pointer: coarse)');
}

export function useInViewOnce<T extends Element>(ref: RefObject<T | null>, threshold = 0.15): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, inView]);
  return inView;
}
```

- [ ] **Step 4: Write `src/components/ui/Reveal.tsx`**

```tsx
import { useRef, type ReactNode } from 'react';
import { useInViewOnce, usePrefersReducedMotion } from '../../hooks';

type Variant = 'fade-up' | 'blur' | 'fade';

const hidden: Record<Variant, string> = {
  'fade-up': 'opacity-0 translate-y-6',
  blur: 'opacity-0 blur-[6px]',
  fade: 'opacity-0',
};

export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInViewOnce(ref);
  const shown = reduced || inView;
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${reduced ? '' : 'transition-all duration-700 ease-out'} ${
        shown ? 'opacity-100 translate-y-0 blur-0' : hidden[variant]
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Write `src/components/ui/SectionHeader.tsx`**

```tsx
import Reveal from './Reveal';

export default function SectionHeader({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <div className="mb-14">
      <Reveal variant="fade">
        <p className="font-mono text-[11px] tracking-[0.3em] text-accent">
          {index} / {label}
        </p>
      </Reveal>
      <Reveal variant="blur" delay={100}>
        <h2 className="mt-3 text-3xl font-medium tracking-tight text-ink md:text-4xl">{title}</h2>
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 6: Write `src/components/ui/CornerBrackets.tsx`**

```tsx
export default function CornerBrackets({
  className = 'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
}: {
  className?: string;
}) {
  const c = 'absolute h-2.5 w-2.5 border-accent';
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </span>
  );
}
```

- [ ] **Step 7: Run tests, typecheck, commit**

```bash
npx vitest run && npx tsc --noEmit
git add src/hooks.ts src/components/ui src/test/ui.test.tsx
git commit -m "feat: add motion-safe hooks and Reveal/SectionHeader/CornerBrackets primitives"
```
Expected: all tests pass, no type errors.

---

### Task 5: DecryptedText + CountUp (reactbits-style, dependency-free)

**Files:**
- Create: `src/components/reactbits/DecryptedText.tsx`, `src/components/reactbits/CountUp.tsx`
- Test: `src/test/fx.test.tsx`

- [ ] **Step 1: Write the failing test `src/test/fx.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DecryptedText from '../components/reactbits/DecryptedText';
import CountUp from '../components/reactbits/CountUp';

describe('DecryptedText (reduced motion)', () => {
  it('renders the final text immediately and exposes aria-label', () => {
    render(<DecryptedText text="Yuzhuo Jia" />);
    expect(screen.getByLabelText('Yuzhuo Jia')).toHaveTextContent('Yuzhuo Jia');
  });
});

describe('CountUp (reduced motion)', () => {
  it('renders the target value immediately', () => {
    render(<CountUp value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/fx.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/components/reactbits/DecryptedText.tsx`**

```tsx
// Vendored equivalent of reactbits.dev "Decrypted Text" (https://reactbits.dev/text-animations/decrypted-text), MIT.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInViewOnce, usePrefersReducedMotion } from '../../hooks';

const CHARS = '!<>-_\\/[]{}—=+*^?#';

export default function DecryptedText({
  text,
  animateOn = 'view',
  speed = 35,
  className = '',
}: {
  text: string;
  animateOn?: 'view' | 'hover';
  speed?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(ref, 0.3);
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = (revealed: number) =>
    text.slice(0, revealed) +
    Array.from({ length: text.length - revealed }, (_, i) =>
      text[revealed + i] === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join('');

  const run = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    let revealed = 0;
    setStarted(true);
    timer.current = setInterval(() => {
      revealed += 1;
      if (revealed >= text.length) {
        setDisplay(text);
        if (timer.current) clearInterval(timer.current);
      } else {
        setDisplay(scramble(revealed));
      }
    }, speed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      setStarted(true);
      return;
    }
    if (animateOn === 'view' && inView && !started) run();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced, animateOn, inView, started, run, text]);

  return (
    <span
      ref={ref}
      aria-label={text}
      onMouseEnter={animateOn === 'hover' && !reduced ? run : undefined}
      className={className}
    >
      <span aria-hidden="true" className={started || reduced ? '' : 'opacity-0'}>
        {display}
      </span>
    </span>
  );
}
```

- [ ] **Step 4: Write `src/components/reactbits/CountUp.tsx`**

```tsx
// Vendored equivalent of reactbits.dev "Count Up" (https://reactbits.dev/text-animations/count-up), MIT.
import { useEffect, useRef, useState } from 'react';
import { useInViewOnce, usePrefersReducedMotion } from '../../hooks';

export default function CountUp({
  value,
  duration = 1200,
  className = '',
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInViewOnce(ref, 0.5);
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setN(value);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
}
```

- [ ] **Step 5: Run tests, typecheck, commit**

```bash
npx vitest run && npx tsc --noEmit
git add src/components/reactbits src/test/fx.test.tsx
git commit -m "feat: add DecryptedText and CountUp effects with reduced-motion fallbacks"
```

---

### Task 6: Particles (ogl) + SpotlightCard + StarBorder

**Files:**
- Create: `src/components/reactbits/Particles.tsx`, `src/components/reactbits/SpotlightCard.tsx`, `src/components/reactbits/StarBorder.tsx`

No unit tests (WebGL/hover visuals); jsdom safety comes from callers gating on reduced-motion, plus the internal try/catch. Verified visually in Task 8.

- [ ] **Step 1: Write `src/components/reactbits/Particles.tsx`**

```tsx
// Vendored equivalent of reactbits.dev "Particles" (https://reactbits.dev/backgrounds/particles), MIT. ogl-based.
import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec3 pos = position * uSpread;
    pos.z *= 8.0;
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.2831 * random.w) * mix(0.1, 1.2, random.x);
    mPos.y += sin(t * random.y + 6.2831 * random.x) * mix(0.1, 1.2, random.w);
    mPos.z += sin(t * random.w + 6.2831 * random.y) * mix(0.1, 1.2, random.z);
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + 0.6 * random.x)) / max(1.0, length(mvPos.xyz));
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord.xy - vec2(0.5));
    float circle = smoothstep(0.5, 0.35, d);
    gl_FragColor = vec4(vColor, circle * 0.5);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

export default function Particles({
  count = 160,
  baseSize = 55,
  speed = 0.08,
  colors = ['#7fa3b0', '#8fa0ad', '#2dd4e8'],
  className = '',
}: {
  count?: number;
  baseSize?: number;
  speed?: number;
  colors?: string[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true, depth: false });
    } catch {
      return;
    }
    const gl = renderer.gl;
    if (!gl) return;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, 20);

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize);
    resize();

    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colorAttr = new Float32Array(count * 3);
    const palette = colors.map(hexToRgb);
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0, len = 2;
      while (len > 1) {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      }
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      colorAttr.set(palette[Math.floor(Math.random() * palette.length)], i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colorAttr },
    });
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: 10 },
        uBaseSize: { value: baseSize },
      },
      transparent: true,
      depthTest: false,
    });
    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const update = (t: number) => {
      raf = requestAnimationFrame(update);
      const delta = t - last;
      last = t;
      elapsed += delta * speed;
      program.uniforms.uTime.value = elapsed * 0.001;
      particles.rotation.y += 0.00025 * delta;
      renderer.render({ scene: particles, camera });
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [count, baseSize, speed, colors]);

  return <div ref={containerRef} className={`h-full w-full ${className}`} aria-hidden="true" />;
}
```

- [ ] **Step 2: Write `src/components/reactbits/SpotlightCard.tsx`**

```tsx
// Vendored equivalent of reactbits.dev "Spotlight Card" (https://reactbits.dev/components/spotlight-card), MIT.
import { useRef, type ReactNode, type PointerEvent } from 'react';

export default function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`group relative overflow-hidden rounded-sm border border-hairline bg-raised ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgb(45 212 232 / 0.07), transparent 65%)',
        }}
      />
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Write `src/components/reactbits/StarBorder.tsx`**

```tsx
// Vendored equivalent of reactbits.dev "Star Border" (https://reactbits.dev/animations/star-border), MIT.
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks';

export default function StarBorder({
  children,
  href,
  className = '',
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <a href={href} data-cursor className={`relative inline-block overflow-hidden rounded-sm p-px ${className}`}>
      {!reduced && (
        <>
          <span
            aria-hidden="true"
            className="animate-star-top absolute left-0 top-0 h-1/2 w-full"
            style={{ background: 'radial-gradient(circle, rgb(45 212 232 / 0.9) 0%, transparent 12%)' }}
          />
          <span
            aria-hidden="true"
            className="animate-star-bottom absolute bottom-0 left-0 h-1/2 w-full"
            style={{ background: 'radial-gradient(circle, rgb(45 212 232 / 0.9) 0%, transparent 12%)' }}
          />
        </>
      )}
      <span
        className={`relative z-10 block border bg-base px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:text-accent ${
          reduced ? 'border-accent/50' : 'border-hairline'
        }`}
      >
        {children}
      </span>
    </a>
  );
}
```

- [ ] **Step 4: Typecheck and commit**

```bash
npx tsc --noEmit && npx vitest run
git add src/components/reactbits
git commit -m "feat: add Particles (ogl), SpotlightCard, StarBorder effects"
```

---

### Task 7: Nav + Footer

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Footer.tsx`
- Test: `src/test/nav.test.tsx`

- [ ] **Step 1: Write the failing test `src/test/nav.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nav, { NAV_SECTIONS } from '../components/Nav';

describe('Nav', () => {
  it('renders one anchor per section plus logo', () => {
    render(<Nav />);
    for (const s of NAV_SECTIONS) {
      const link = screen.getAllByRole('link', { name: s.label })[0];
      expect(link).toHaveAttribute('href', `#${s.id}`);
    }
    expect(screen.getByRole('link', { name: 'YZ_J' })).toHaveAttribute('href', '#top');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/nav.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/components/Nav.tsx`**

```tsx
import { useEffect, useState } from 'react';

export const NAV_SECTIONS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'research', label: 'RESEARCH' },
  { id: 'publications', label: 'PUBLICATIONS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Nav() {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    for (const s of NAV_SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-base/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <a href="#top" data-cursor className="font-mono text-sm tracking-widest text-accent">
          YZ_J
        </a>
        <div className="hidden gap-7 md:flex">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-cursor
              className={`font-mono text-[11px] tracking-[0.18em] transition-colors ${
                active === s.id ? 'text-accent' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="font-mono text-[11px] tracking-[0.18em] text-ink-2 md:hidden"
        >
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </nav>
      {open && (
        <div className="border-t border-hairline bg-base/95 backdrop-blur-md md:hidden">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className="block px-6 py-4 font-mono text-xs tracking-[0.2em] text-ink-2"
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Write `src/components/Footer.tsx`**

```tsx
import { footer } from '../content';

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 font-mono text-[11px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <span>© {footer.year} Yuzhuo Jia</span>
        <span>
          <span className="text-accent">●</span> {footer.coordinates}
        </span>
        <a href="#top" data-cursor className="transition-colors hover:text-accent">
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Run tests, typecheck, commit**

```bash
npx vitest run && npx tsc --noEmit
git add src/components/Nav.tsx src/components/Footer.tsx src/test/nav.test.tsx
git commit -m "feat: add Nav with scroll-spy and Footer"
```

---

### Task 8: Hero + App assembly (placeholder sections)

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/App.tsx` (replace placeholder entirely)
- Modify: `src/test/smoke.test.tsx`

- [ ] **Step 1: Write `src/components/Hero.tsx`**

```tsx
import { hero, contact, socials } from '../content';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../hooks';
import Particles from './reactbits/Particles';
import DecryptedText from './reactbits/DecryptedText';
import StarBorder from './reactbits/StarBorder';

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      {!reduced && !coarse && (
        <div className="absolute inset-0" aria-hidden="true">
          <Particles />
        </div>
      )}
      <div className="relative mx-auto w-full max-w-5xl px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-accent">{hero.kicker}</p>
        <h1 className="mt-6 text-5xl font-medium tracking-tight text-ink md:text-7xl">
          <DecryptedText text={hero.name} />
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">{hero.tagline}</p>
        <p className="mt-3 font-mono text-xs text-ink-3">{hero.position}</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <StarBorder href="#research">View research</StarBorder>
          <a
            href={socials[0].url}
            target="_blank"
            rel="noreferrer"
            data-cursor
            className="font-mono text-[11px] tracking-[0.18em] text-ink-2 transition-colors hover:text-accent"
          >
            GITHUB ↗
          </a>
          <a
            href={`mailto:${contact.email}`}
            data-cursor
            className="font-mono text-[11px] tracking-[0.18em] text-ink-2 transition-colors hover:text-accent"
          >
            EMAIL ↗
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 font-mono text-[11px] text-ink-3">
          <span>
            <span className="animate-pulse-dot text-accent">●</span> {hero.status}
          </span>
          <span>SCROLL ↓</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace `src/App.tsx`** (placeholder sections keep nav anchors working; swapped out in Tasks 9-12)

```tsx
import Nav from './components/Nav';
import Hero from './components/Hero';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <section id="about" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28" />
        <section id="research" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28" />
        <section id="publications" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28" />
        <section id="projects" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28" />
        <section id="contact" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28" />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Update `src/test/smoke.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders hero name and nav', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Yuzhuo Jia');
    expect(screen.getByRole('link', { name: 'YZ_J' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run tests, typecheck**

```bash
npx vitest run && npx tsc --noEmit
```
Expected: PASS. (Reduced-motion is mocked true in tests, so Particles never mounts under jsdom.)

- [ ] **Step 5: Visual check**

Run `npm run dev`, open http://localhost:5173 — verify: particles drift subtly behind hero, name decrypts once, StarBorder pulse orbits the CTA, status dot pulses. Fix any visual defect before committing.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.tsx src/App.tsx src/test/smoke.test.tsx
git commit -m "feat: add Hero with particle background and assemble app shell"
```

---

### Task 9: About section

**Files:**
- Create: `src/components/About.tsx`
- Modify: `src/App.tsx` (replace `#about` placeholder)

- [ ] **Step 1: Write `src/components/About.tsx`**

```tsx
import { about, timeline, stats } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import CornerBrackets from './ui/CornerBrackets';
import CountUp from './reactbits/CountUp';

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="02" label="ABOUT" title="About" />
      <div className="grid gap-12 md:grid-cols-[240px_1fr]">
        <Reveal>
          <div className="group relative w-56 border border-hairline p-1.5">
            <CornerBrackets />
            <img
              src={about.portrait}
              alt="Portrait of Yuzhuo Jia"
              className="w-full grayscale transition-all duration-500 group-hover:grayscale-0"
            />
          </div>
        </Reveal>
        <div>
          <Reveal delay={80}>
            <p className="max-w-2xl text-base leading-relaxed text-ink-2">{about.bio}</p>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-8 flex flex-wrap gap-2">
              {about.interests.map((i) => (
                <span
                  key={i}
                  className="border border-hairline px-3 py-1 font-mono text-[11px] tracking-wide text-ink-2"
                >
                  {i}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={240}>
            <ol className="mt-12">
              {timeline.map((t) => (
                <li
                  key={t.org}
                  className="flex items-baseline justify-between gap-6 border-b border-hairline py-4 first:border-t"
                >
                  <div>
                    <p className="text-sm text-ink">{t.org}</p>
                    <p className="mt-1 text-xs text-ink-3">{t.role}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-ink-3">{t.period}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-12 grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-medium text-ink md:text-4xl">
                    <CountUp value={s.value} />
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-3">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `src/App.tsx`** — add `import About from './components/About';` and replace `<section id="about" .../>` with `<About />`.

- [ ] **Step 3: Verify + commit**

```bash
npx vitest run && npx tsc --noEmit
git add src/components/About.tsx src/App.tsx
git commit -m "feat: add About section with portrait, timeline, interests, stats"
```
Visual check in dev server: portrait grayscale→color on hover, corner brackets appear, CountUp rolls once.

---

### Task 10: Research section (expand/collapse, test-first)

**Files:**
- Create: `src/components/Research.tsx`
- Modify: `src/App.tsx`
- Test: `src/test/research.test.tsx`

- [ ] **Step 1: Write the failing test `src/test/research.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Research from '../components/Research';
import { research } from '../content';

describe('Research', () => {
  it('renders all 6 entries', () => {
    render(<Research />);
    for (const r of research) {
      expect(screen.getByText(r.title)).toBeInTheDocument();
    }
  });
  it('toggles description expansion via button', () => {
    render(<Research />);
    const btn = screen.getAllByRole('button', { name: new RegExp(research[0].title) })[0];
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/research.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/components/Research.tsx`**

```tsx
import { useState } from 'react';
import { research, type ResearchEntry } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import CornerBrackets from './ui/CornerBrackets';

function ResearchItem({ item, index }: { item: ResearchEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const descId = `research-desc-${index}`;
  return (
    <li className="border-b border-hairline first:border-t">
      <Reveal delay={index * 60}>
        <div
          className="group relative cursor-pointer py-6"
          onClick={() => setExpanded((v) => !v)}
        >
          <CornerBrackets />
          <div className="flex items-baseline justify-between gap-6">
            <button
              aria-expanded={expanded}
              aria-controls={descId}
              data-cursor
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
              className="flex flex-1 items-baseline gap-4 text-left"
            >
              <span className="shrink-0 font-mono text-[11px] text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-base font-medium text-ink md:text-lg">{item.title}</span>
            </button>
            <span className="hidden shrink-0 font-mono text-[11px] text-ink-3 sm:block">
              {item.period}
            </span>
          </div>
          <p
            id={descId}
            className={`mt-3 max-w-3xl pl-8 text-sm leading-relaxed text-ink-2 ${
              expanded ? '' : 'line-clamp-2'
            }`}
          >
            {item.description}
          </p>
          <p className="mt-2 pl-8 font-mono text-[11px] text-ink-3 sm:hidden">{item.period}</p>
        </div>
      </Reveal>
    </li>
  );
}

export default function Research() {
  return (
    <section id="research" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="03" label="RESEARCH" title="Selected research" />
      <ol>
        {research.map((item, i) => (
          <ResearchItem key={item.title} item={item} index={i} />
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/research.test.tsx`
Expected: PASS.

- [ ] **Step 5: Wire into `src/App.tsx`** (import + replace `#research` placeholder), verify, commit

```bash
npx vitest run && npx tsc --noEmit
git add src/components/Research.tsx src/App.tsx src/test/research.test.tsx
git commit -m "feat: add Research section with expandable entries"
```
Visual check: rows reveal staggered, hover shows corner brackets, click expands line-clamped description.

---

### Task 11: Publications + Projects sections

**Files:**
- Create: `src/components/Publications.tsx`, `src/components/Projects.tsx`
- Modify: `src/App.tsx`
- Test: `src/test/cards.test.tsx`

- [ ] **Step 1: Write the failing test `src/test/cards.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Publications from '../components/Publications';
import Projects from '../components/Projects';
import { publications, projects } from '../content';

describe('Publications', () => {
  it('renders all 4 publications with venue and highlighted author', () => {
    render(<Publications />);
    for (const p of publications) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
    expect(screen.getAllByText(/Yuzhuo Jia/).length).toBeGreaterThanOrEqual(4);
  });
  it('renders external links with https hrefs', () => {
    render(<Publications />);
    const links = screen.getAllByRole('link');
    for (const l of links) {
      expect(l).toHaveAttribute('href', expect.stringMatching(/^https:\/\//));
    }
  });
});

describe('Projects', () => {
  it('renders all 3 projects; github links only when defined', () => {
    render(<Projects />);
    for (const p of projects) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
    expect(screen.getAllByRole('link')).toHaveLength(projects.filter((p) => p.github).length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/cards.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/components/Publications.tsx`**

```tsx
import { publications, type Publication } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import SpotlightCard from './reactbits/SpotlightCard';

function PubCard({ pub }: { pub: Publication }) {
  return (
    <SpotlightCard className="flex h-full flex-col">
      <div className="border-b border-hairline">
        <img
          src={pub.image}
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Publication</p>
          {pub.status && (
            <span className="border border-hairline px-2 py-0.5 font-mono text-[11px] text-ink-2">
              {pub.status}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-base font-medium leading-snug text-ink">{pub.title}</h3>
        <p className="mt-2 text-sm text-ink-3">
          {pub.authors.map((a, i) => (
            <span key={a.name} className={a.me ? 'text-ink' : ''}>
              {a.name}
              {i < pub.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        <p className="mt-2 text-xs text-ink-3">{pub.venue}</p>
        {pub.link && (
          <a
            href={pub.link.url}
            target="_blank"
            rel="noreferrer"
            data-cursor
            className="mt-auto pt-4 font-mono text-[11px] tracking-[0.15em] text-ink-2 transition-colors hover:text-accent"
          >
            {pub.link.label.toUpperCase()} ↗
          </a>
        )}
      </div>
    </SpotlightCard>
  );
}

export default function Publications() {
  return (
    <section id="publications" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="04" label="PUBLICATIONS" title="Publications" />
      <div className="grid gap-5 md:grid-cols-2">
        {publications.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="h-full">
            <PubCard pub={p} />
          </Reveal>
        ))}
      </div>
      <p className="mt-6 font-mono text-[11px] text-ink-3">* Equal contribution</p>
    </section>
  );
}
```

- [ ] **Step 4: Write `src/components/Projects.tsx`**

```tsx
import { projects, type Project } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import SpotlightCard from './reactbits/SpotlightCard';

function ProjectCard({ project }: { project: Project }) {
  return (
    <SpotlightCard className="flex h-full flex-col">
      <div className="border-b border-hairline">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">Project</p>
        <h3 className="mt-3 text-base font-medium leading-snug text-ink">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{project.description}</p>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            data-cursor
            className="mt-auto pt-4 font-mono text-[11px] tracking-[0.15em] text-ink-2 transition-colors hover:text-accent"
          >
            GITHUB ↗
          </a>
        )}
      </div>
    </SpotlightCard>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="05" label="PROJECTS" title="Projects" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="h-full">
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run test to verify it passes, wire into App, commit**

```bash
npx vitest run src/test/cards.test.tsx
```
Expected: PASS. Then import both in `src/App.tsx`, replace the two placeholders.

```bash
npx vitest run && npx tsc --noEmit
git add src/components/Publications.tsx src/components/Projects.tsx src/App.tsx src/test/cards.test.tsx
git commit -m "feat: add Publications and Projects sections with spotlight cards"
```
Visual check: spotlight follows cursor on cards, images dim→full on hover, equal-contribution footnote present.

---

### Task 12: Contact section + TargetCursor

**Files:**
- Create: `src/components/Contact.tsx`, `src/components/reactbits/TargetCursor.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write `src/components/Contact.tsx`**

```tsx
import { contact, socials } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import DecryptedText from './reactbits/DecryptedText';

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="06" label="CONTACT" title="Get in touch" />
      <Reveal>
        <p className="max-w-xl text-base leading-relaxed text-ink-2">{contact.blurb}</p>
      </Reveal>
      <Reveal delay={120}>
        <a
          href={`mailto:${contact.email}`}
          data-cursor
          className="mt-10 inline-block break-all font-mono text-lg text-ink underline decoration-hairline underline-offset-8 transition-colors hover:text-accent hover:decoration-accent md:text-3xl"
        >
          <DecryptedText text={contact.email} animateOn="hover" speed={20} />
        </a>
      </Reveal>
      <Reveal delay={200}>
        <div className="mt-14 flex flex-wrap gap-8">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              data-cursor
              className="font-mono text-[11px] tracking-[0.18em] text-ink-2 transition-colors hover:text-accent"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Write `src/components/reactbits/TargetCursor.tsx`**

```tsx
// Vendored equivalent of reactbits.dev "Target Cursor" (https://reactbits.dev/animations/target-cursor), MIT. rAF-based.
import { useEffect, useRef } from 'react';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../../hooks';

const INTERACTIVE = 'a, button, [data-cursor]';

export default function TargetCursor() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const enabled = !reduced && !coarse;
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cornerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const corners = cornerRefs.current;
    if (!wrap || !dot || corners.some((c) => !c)) return;

    document.documentElement.classList.add('cursor-hidden');
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let target: Element | null = null;
    const cur = [0, 1, 2, 3].map(() => ({ x: 0, y: 0 }));
    const IDLE = 10;
    const PAD = 6;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      target = (e.target as Element).closest?.(INTERACTIVE) ?? null;
    };
    const onLeave = () => {
      wrap.style.opacity = '0';
    };
    const onEnter = () => {
      wrap.style.opacity = '1';
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (mx - x) * 0.2;
      y += (my - y) * 0.2;
      dot.style.transform = `translate3d(${x - 2}px, ${y - 2}px, 0)`;

      let pts: { x: number; y: number }[];
      if (target && document.contains(target)) {
        const r = (target as HTMLElement).getBoundingClientRect();
        pts = [
          { x: r.left - PAD, y: r.top - PAD },
          { x: r.right + PAD, y: r.top - PAD },
          { x: r.left - PAD, y: r.bottom + PAD },
          { x: r.right + PAD, y: r.bottom + PAD },
        ];
      } else {
        pts = [
          { x: x - IDLE, y: y - IDLE },
          { x: x + IDLE, y: y - IDLE },
          { x: x - IDLE, y: y + IDLE },
          { x: x + IDLE, y: y + IDLE },
        ];
      }
      corners.forEach((c, i) => {
        cur[i].x += (pts[i].x - cur[i].x) * 0.25;
        cur[i].y += (pts[i].y - cur[i].y) * 0.25;
        c!.style.transform = `translate3d(${cur[i].x}px, ${cur[i].y}px, 0)`;
      });
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('cursor-hidden');
    };
  }, [enabled]);

  if (!enabled) return null;

  const cornerBase = 'absolute left-0 top-0 h-2.5 w-2.5 border-accent will-change-transform';
  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
    >
      <div ref={dotRef} className="absolute left-0 top-0 h-1 w-1 bg-accent will-change-transform" />
      <div ref={(el) => { cornerRefs.current[0] = el; }} className={`${cornerBase} border-l border-t`} style={{ marginLeft: -5, marginTop: -5 }} />
      <div ref={(el) => { cornerRefs.current[1] = el; }} className={`${cornerBase} border-r border-t`} style={{ marginLeft: -5, marginTop: -5 }} />
      <div ref={(el) => { cornerRefs.current[2] = el; }} className={`${cornerBase} border-b border-l`} style={{ marginLeft: -5, marginTop: -5 }} />
      <div ref={(el) => { cornerRefs.current[3] = el; }} className={`${cornerBase} border-b border-r`} style={{ marginLeft: -5, marginTop: -5 }} />
    </div>
  );
}
```
Note: corner offsets use fixed -5px margins so each 10px bracket centers on its target point; brackets 0/1/2/3 = TL/TR/BL/BR.

- [ ] **Step 3: Wire into `src/App.tsx`** — final form:

```tsx
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Research from './components/Research';
import Publications from './components/Publications';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TargetCursor from './components/reactbits/TargetCursor';

export default function App() {
  return (
    <>
      <TargetCursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Research />
        <Publications />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verify + commit**

```bash
npx vitest run && npx tsc --noEmit
```
Expected: all tests pass (TargetCursor returns null under mocked reduced-motion).
Visual check in dev server: native cursor hidden, dot + brackets follow mouse, brackets lock onto links/buttons with padding, email decrypts on hover.

```bash
git add src/components/Contact.tsx src/components/reactbits/TargetCursor.tsx src/App.tsx
git commit -m "feat: add Contact section and TargetCursor with coarse-pointer/reduced-motion guards"
```

---

### Task 13: README, launch config, full verification

**Files:**
- Create: `README.md`, `.claude/launch.json`

- [ ] **Step 1: Write `README.md`**

```markdown
# yuzhuojia.fun

Personal site of Yuzhuo Jia. Dark, single-page, built with Vite + React + TypeScript + Tailwind CSS v4.

## Editing content

All copy, publications, projects, links, and the position line live in `src/content.ts`. No component changes needed for routine updates.

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # vitest
npm run build    # typecheck + production build (dist/)
npm run preview  # serve the production build locally
```

## Deploy

```bash
npm run deploy   # builds and pushes dist/ to the gh-pages branch
```

The custom domain is set by `public/CNAME`.

## Credits

Animation components in `src/components/reactbits/` are vendored equivalents of
[reactbits.dev](https://reactbits.dev) components (MIT).
```

- [ ] **Step 2: Write `.claude/launch.json`**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "site",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 5173
    }
  ]
}
```

- [ ] **Step 3: Full test + build**

```bash
npx vitest run && npm run build && ls dist/CNAME dist/favicon.svg
```
Expected: all tests pass; build succeeds; both files exist in `dist/`.

- [ ] **Step 4: Visual audit (use preview tooling)**

Start the dev server and check, fixing anything broken before commit:
1. Desktop 1280px: full-page scroll-through; every section header shows `0X / LABEL`; reveals fire once.
2. Mobile 375px: no horizontal scrollbar (`document.documentElement.scrollWidth <= 375`); MENU opens/closes; particles and custom cursor absent (emulation may be needed — at minimum verify no layout break).
3. Dark reduced-motion emulation: no perpetual animation, all content visible.
4. Console: zero errors.
5. External links: arXiv, DOI, 2 GitHub project links, GitHub/Instagram socials — all render with correct hrefs.

- [ ] **Step 5: Commit**

```bash
git add README.md .claude/launch.json
git commit -m "docs: add README and preview launch config"
```

---

### Task 14 (GATED — requires explicit user approval): Merge + deploy

**Do not execute any step below until the user has reviewed the site and explicitly approved deployment.**

- [ ] **Step 1: Confirm remote Pages branch setup**

```bash
git ls-remote --heads origin
```
Expected: `gh-pages` branch exists (the old deploy script used it). If Pages is configured to serve `master` instead, flag to the user before proceeding.

- [ ] **Step 2: Merge redesign into master**

```bash
git checkout master && git merge --no-ff redesign -m "Redesign: Quiet Signal v3.0"
```

- [ ] **Step 3: Push and deploy**

```bash
git push origin master
npm run deploy
```
Expected: gh-pages publishes `dist/`; `https://yuzhuojia.fun` serves the new site (DNS/CDN may take a few minutes).

- [ ] **Step 4: Post-deploy check**

Verify https://yuzhuojia.fun loads the new site, favicon appears, and the custom domain persists in repo settings.

---

## Self-review checklist (completed at plan time)

- Spec coverage: Hero/About/Research/Publications/Projects/Contact/Footer/Nav ✓; tokens §4 ✓ (Task 2 CSS); fonts self-hosted ✓; reduced-motion + coarse-pointer degradation ✓ (hooks + guards); single WebGL surface ✓ (Particles only in Hero); line-clamp-2 expand ✓ (Task 10); grayscale portrait ✓; CountUp stats 4/6/3 ✓; status badges ✓; author highlight + `*` footnote ✓; email hover decrypt ✓; emailjs form removed ✓ (Task 1 deletes everything); CNAME → public/ ✓; favicon + OG meta ✓; cleanup of build/.history/TUTORIAL_CN ✓; deploy gated ✓.
- Placeholders: none — every step has complete code or exact commands.
- Type consistency: `content.ts` exports match imports used in Tasks 7-12 (`hero`, `about`, `timeline`, `stats`, `research`, `publications`, `projects`, `contact`, `socials`, `footer`); `NAV_SECTIONS` named export matches test import; hook names consistent (`usePrefersReducedMotion`, `useIsCoarsePointer`, `useInViewOnce`).
