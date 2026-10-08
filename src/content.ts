import imgReading from './assets/new_research.jpg';
import imgLumos from './assets/lumos.jpg';
import imgBodily from './assets/bodily-representations.jpg';
import imgFodap from './assets/fodap-framework.png';
import imgPedestrian from './assets/yolov5-pedestrian-framework.jpg';
import imgPortrait from './assets/portrait.jpg';
import xj1 from './assets/gallery/XJ1.jpg';
import xj2 from './assets/gallery/XJ2.jpg';
import xj3 from './assets/gallery/XJ3.jpg';
import xj4 from './assets/gallery/XJ4.jpg';
import xj5 from './assets/gallery/XJ5.jpg';

export type Author = { name: string; me?: boolean };
export type Publication = {
  title: string;
  authors: Author[];
  venue: string;
  status?: string;
  link?: { label: string; url: string };
  image?: string;
  featured?: boolean;
};
export type TimelineEntry = { org: string; role: string; period: string };
export type Photo = { id: string; src: string; caption?: string };
export type Roll = { id: string; title: string; subtitle?: string; year?: string; photos: Photo[] };

export const meta = {
  title: 'Yuzhuo Jia — Ph.D. Student at Kyushu University',
  url: 'https://yuzhuojia.fun',
};

export const hero = {
  kicker: 'FR.01 — AGENTIC AI × LLM × HCI',
  name: 'Yuzhuo Jia',
  // 转博 / 换头衔只改这一行：
  position: 'Ph.D. Student · Kyushu University',
  // 用 *星号* 包住的词会以衬线斜体渲染：
  bio: 'My research lies at the intersection of agentic AI, large language models, and human-computer interaction. I focus on *agent-to-agent interaction*, *embodied cognition*, and *AI-driven learning systems*.',
  cv: '/cv.pdf',
  status: 'OPEN TO COLLABORATION',
};

export const about = {
  portrait: imgPortrait,
  interests: [
    'Agentic AI',
    'Large Language Models',
    'Human-Computer Interaction',
    'Agent-to-Agent Interaction',
    'Embodied Cognition',
    'AI-Driven Learning Systems',
  ],
};

export const timeline: TimelineEntry[] = [
  { org: 'Kyushu University', role: 'Ph.D. Student, Information Science and Technology', period: 'Oct 2026 — Oct 2029 (expected)' },
  { org: 'University of Sydney', role: 'MSc, Computer Science', period: 'Feb 2023 — Feb 2025' },
];

export const publications: Publication[] = [
  {
    title:
      'Balancing Automation and Agency: Designing Adaptive Reading Interfaces for Middle-Aged Office Workers',
    authors: [
      { name: 'Keye Yu*' },
      { name: 'Yuzhuo Jia*', me: true },
      { name: 'H. Fan' },
      { name: 'Chen Zheng' },
      { name: 'Z. Peng' },
    ],
    venue: 'ACM CHI 2026 (Poster)',
    status: 'Accepted',
    featured: true,
    image: imgReading,
  },
  {
    title:
      'LUMOS: Designing an Interactive Companion Robot to Enhance Critical Reading and Thinking in Academic Contexts',
    authors: [
      { name: 'Y. Mao*' },
      { name: 'Y. Li*' },
      { name: 'Yuzhuo Jia', me: true },
      { name: 'F. Li' },
      { name: 'Z. Yin' },
      { name: 'S. Zheng' },
    ],
    venue: 'IEEE RO-MAN 2026',
    status: 'Accepted',
    featured: true,
    image: imgLumos,
  },
  {
    title: "Human and LLMs' Bodily Representations",
    authors: [
      { name: 'Yuzhuo Jia*', me: true },
      { name: 'Keye Yu*' },
      { name: 'X. Zhan' },
      { name: 'Y.-Q. Zhang' },
      { name: 'Chen Zheng' },
    ],
    venue: 'Nature Machine Intelligence · 2026',
    status: 'Submitted',
    image: imgBodily,
  },
  {
    title: 'FODAP Graph for Enhanced Medical Imaging Narrative Generation',
    authors: [
      { name: 'K. Shu*' },
      { name: 'Yuzhuo Jia*', me: true },
      { name: 'Z. Zhang' },
      { name: 'J. Gao' },
    ],
    venue: 'International Conference on Bioinformatics and Biomedicine (BIBM) 2024',
    status: 'Accepted',
    image: imgFodap,
    link: { label: 'DOI', url: 'https://doi.org/10.1109/BIBM62325.2024.10822532' },
  },
  {
    title: 'Pedestrian Behavior Detection and Traffic Violation Recognition Based on YOLOv5',
    authors: [{ name: 'Yuzhuo Jia', me: true }],
    venue: '4th International Conference on Image Processing and Intelligent Control · 2024',
    status: 'Accepted',
    image: imgPedestrian,
    link: { label: 'DOI', url: 'https://doi.org/10.1117/12.3038591' },
  },
];

export const contact = {
  email: 'yuzhuo@hdi.ait.kyushu-u.ac.jp',
};

export const socials: { label: string; url: string }[] = [
  { label: 'GITHUB', url: 'https://github.com/nohairblingbling' },
  { label: 'INSTAGRAM', url: 'https://www.instagram.com/lorcanxoo/' },
  // 有 Google Scholar 主页后取消注释：
  // { label: 'SCHOLAR', url: 'https://scholar.google.com/citations?user=XXXX' },
];

export const rolls: Roll[] = [
  {
    id: 'north-xinjiang',
    title: 'North Xinjiang',
    year: '2025',
    photos: [
      { id: 'XJ1', src: xj1 },
      { id: 'XJ2', src: xj2 },
      { id: 'XJ3', src: xj3 },
      { id: 'XJ4', src: xj4 },
      { id: 'XJ5', src: xj5 },
    ],
  },
];

export const footer = {
  coordinates: 'FUKUOKA — JAPAN',
  exif: 'ISO 400 · ƒ/1.4 · 1/125',
  year: new Date().getFullYear(),
};
