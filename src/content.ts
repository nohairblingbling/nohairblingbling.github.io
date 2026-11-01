import imgReading from './assets/new_research.jpg';
import imgLumos from './assets/lumos.jpg';
import imgFodap from './assets/optimized/fodap-framework-960.webp';
import imgFodapSmall from './assets/optimized/fodap-framework-640.webp';
import imgFodapFull from './assets/optimized/fodap-framework.webp';
import imgPedestrian from './assets/yolov5-pedestrian-framework.jpg';
import { portraitDisplay, photoDisplays } from './imageAssets';
import xj1 from './assets/gallery/XJ1.jpg';
import xj2 from './assets/gallery/XJ2.jpg';
import xj3 from './assets/gallery/XJ3.jpg';
import xj4 from './assets/gallery/XJ4.jpg';
import xj5 from './assets/gallery/XJ5.jpg';
import { collectionPhotos } from './galleryAssets';

export type Author = { name: string; me?: boolean };
export type Publication = {
  title: string;
  authors: Author[];
  venue: string;
  status?: string;
  link?: { label: string; url: string };
  image?: string;
  imageSrcSet?: string;
  featured?: boolean;
};
export type TimelineEntry = { org: string; role: string; period: string };
export type Photo = { id: string; src: string; alt?: string; caption?: string; display?: { src: string; srcSet: string; width: number; height: number } };
export type GalleryCategory = 'portraits' | 'landscapes';
export type Capture =
  | { medium: 'digital'; brand: string; model: string }
  | { medium: 'film'; brand: string; stock: string; iso: number; format?: string; camera?: string };
export type LabelTone = 'ivory' | 'sand' | 'sage' | 'silver';
export type Roll = {
  id: string; title: string; category: GalleryCategory; location: string;
  capture: Capture; labelTone: LabelTone;
  subtitle?: string; year?: string; date?: string; photos: Photo[];
};
export const currentCamera = { medium: 'digital', brand: 'SONY', model: 'A7M4' } satisfies Capture;
export const galleryCategories = [
  { id: 'portraits', label: 'Portraits', mark: 'P' },
  { id: 'landscapes', label: 'Landscapes', mark: 'L' },
] as const;

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
  bio: "I'm a first-year Ph.D. student at Kyushu University,",
  research: 'My research interests include large language models, AI agents, and human-computer interaction. I am particularly interested in how *AI agents can support human teamwork*. This includes understanding team members’ different perspectives, tracking how shared understanding evolves, and deciding when to offer help, while allowing people to guide, correct, or decline that assistance.',
  advisor: { name: 'Shin’ichi Konomi', url: 'http://konomi.org/' },
  cv: '/cv.pdf',
  status: 'OPEN TO COLLABORATION',
};

export const about = {
  portrait: portraitDisplay.src,
  portraitDisplay,
  interests: [
    'Large Language Models',
    'AI Agents',
    'Human-Computer Interaction',
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
    title: 'FODAP Graph for Enhanced Medical Imaging Narrative Generation',
    authors: [
      { name: 'K. Shu*' },
      { name: 'Yuzhuo Jia*', me: true },
      { name: 'Z. Zhang' },
      { name: 'J. Gao' },
    ],
    venue: 'International Conference on Bioinformatics and Biomedicine (BIBM) 2024',
    status: 'Accepted',
    featured: true,
    image: imgFodap,
    imageSrcSet: `${imgFodapSmall} 640w, ${imgFodap} 960w, ${imgFodapFull} 1556w`,
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
    id: 'north-xinjiang-portraits', title: 'North Xinjiang',
    category: 'portraits', location: 'north-xinjiang', year: '2025', date: 'Aug 2025',
    capture: currentCamera, labelTone: 'ivory',
    photos: collectionPhotos('northXinjiangPortraits'),
  },
  {
    id: 'northwest-portraits', title: 'Northwest China',
    category: 'portraits', location: 'northwest-china', year: '2025', date: 'Aug 2025',
    capture: currentCamera, labelTone: 'sand',
    photos: collectionPhotos('northwestPortraits'),
  },
  {
    id: 'north-xinjiang',
    title: 'North Xinjiang',
    category: 'landscapes',
    capture: currentCamera, labelTone: 'sage',
    location: 'north-xinjiang',
    year: '2025',
    photos: [
      { id: 'XJ1', src: xj1, display: photoDisplays.XJ1 },
      { id: 'XJ2', src: xj2, display: photoDisplays.XJ2 },
      { id: 'XJ3', src: xj3, display: photoDisplays.XJ3 },
      { id: 'XJ4', src: xj4, display: photoDisplays.XJ4 },
      { id: 'XJ5', src: xj5, display: photoDisplays.XJ5 },
    ],
  },
  {
    id: 'yunnan', title: 'Yunnan', category: 'landscapes', location: 'yunnan',
    capture: currentCamera, labelTone: 'silver',
    year: '2025', date: 'Mar 2025', photos: collectionPhotos('yunnan'),
  },
];

export const footer = {
  coordinates: 'FUKUOKA — JAPAN',
  exif: `${currentCamera.brand} ${currentCamera.model} · DIGITAL`,
  year: new Date().getFullYear(),
};
