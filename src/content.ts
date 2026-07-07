import imgReading from './assets/new_research.jpg';
import imgLumos from './assets/lumos.jpg';
import imgPortrait from './assets/portrait.jpg';

export type Author = { name: string; me?: boolean };
export type Publication = {
  title: string;
  authors: Author[];
  venue: string;
  status?: string;
  link?: { label: string; url: string };
  image?: string;
};
export type ResearchEntry = { title: string; period: string; description: string };
export type TimelineEntry = { org: string; role: string; period: string };

export const meta = {
  title: 'Yuzhuo Jia — HCI Researcher',
  url: 'https://yuzhuojia.fun',
};

export const hero = {
  kicker: '01 / AGENTIC AI × LLM × HCI',
  name: 'Yuzhuo Jia',
  // 转博 / 换头衔只改这一行：
  position: 'Research Assistant · Tsinghua University',
  bio: 'My research lies at the intersection of Agentic AI, Large Language Models, and Human-Computer Interaction, with a focus on adaptive interfaces, embodied cognition, and AI-driven learning systems. Currently I investigate whether LLMs can develop human-like bodily representations when interacting with virtual environments.',
  cv: '/cv.pdf',
  status: 'OPEN TO COLLABORATION',
};

export const about = {
  portrait: imgPortrait,
  interests: [
    'Agentic AI',
    'Large Language Models',
    'Human-Computer Interaction',
    'Adaptive Interfaces',
    'Embodied Cognition',
    'AI-Driven Learning',
  ],
};

export const timeline: TimelineEntry[] = [
  { org: 'Tsinghua University', role: 'Research Assistant', period: 'Feb 2025 — Present' },
  { org: 'University of Sydney', role: 'MSc, Computer Science', period: 'Feb 2023 — Feb 2025' },
];

export const research: ResearchEntry[] = [
  {
    title: "Human and LLMs' Bodily Representations",
    period: 'Sep 2025 — Present',
    description:
      'Investigating whether pretrained Large Language Models can develop human-like bodily representations when interacting with virtual environments, addressing a critical gap in embodied cognition research across the spectrum from conceptualization to sensorimotor experience. Participated in designing experimental paradigms for comparing human and LLM cognitive representations on embodied tasks. Developed the computational analysis framework: deployment of open-source vision-language models, layer-wise embedding extraction, dimension reduction via PCA, t-SNE clustering for representation visualization, and Representational Similarity Analysis (RSA) to quantify representation overlaps between humans and LLMs. Contributing to manuscript preparation for top-tier cognitive science journals, with responsibilities in experimental design, computational modeling, data analysis, and writing the Methods and Results sections.',
  },
  {
    title: 'Adaptive Reading System',
    period: 'Jun 2025 — Sep 2025',
    description:
      "Architected and implemented a browser-based adaptive reading system as a lightweight Tampermonkey userscript. The core sensing module leverages MediaPipe Face Mesh for real-time facial landmark detection, enabling precise viewing-distance calculation to dynamically adapt font size and color contrast. Executed a comprehensive user study with 24 middle-aged adults across four reading conditions, and performed thematic analysis on semi-structured interviews, uncovering key usability insights such as the trade-off between the cognitive load of adaptations and performance gains. Co-authored the research paper (Related Work, System Design, Discussion) — accepted at CHI 2026 as a poster.",
  },
  {
    title: 'PI Lab — MathAdventure',
    period: 'Jan 2025 — Mar 2025',
    description:
      "Contributed to MathAdventure, a novel screen-free, voice-based interactive learning system grounded in Contextual Learning and Zone of Proximal Development (ZPD) principles, designed to enhance mathematical understanding of the decimal system in children aged 4-8 through real-world object symbolization. Built the core computer vision module for real-time object recognition, enabling contextualized math problem generation from children's immediate physical surroundings. Orchestrated user studies including Wizard of Oz experiments and iterative prototype testing with 18 child-parent pairs, and authored significant sections of the manuscript, including Related Work and key portions of System Design and Development.",
  },
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
    image: imgLumos,
  },
  {
    title: "Human and LLMs' Bodily Representations",
    authors: [{ name: 'Yuzhuo Jia (first author)', me: true }],
    venue: 'Nature Machine Intelligence',
    status: 'In preparation',
  },
];

export const contact = {
  email: 'yuzhuojia.cs@gmail.com',
  blurb:
    'Open to research collaboration and conversations about agentic AI, embodied cognition, and interactive systems.',
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
