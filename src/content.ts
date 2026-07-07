import imgBifocal from './assets/BiFocalNet.jpg';
import imgBibm from './assets/bibm1.jpg';
import imgYolo from './assets/yolo5.jpg';
import imgReading from './assets/new_research.jpg';
import imgInterview from './assets/interview.jpg';
import imgDcd from './assets/dcd.png';
import imgPortrait from './assets/touxian.jpg';

export type Author = { name: string; me?: boolean };
export type Publication = {
  title: string;
  authors: Author[];
  venue: string;
  status?: string;
  link?: { label: string; url: string };
  image?: string;
};
export type Project = {
  title: string;
  description: string;
  period?: string;
  github?: string;
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
  {
    org: 'Nanfang College of Sun Yat-sen University',
    role: 'BSc, Computer Science and Technology',
    period: 'Sep 2017 — Sep 2021',
  },
];

export const stats = [
  { value: 6, label: 'Publications' },
  { value: 6, label: 'Research projects' },
  { value: 3, label: 'Institutions' },
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
    title: 'Embodied Intelligence Research Group',
    period: 'Apr 2025 — Aug 2025',
    description:
      'Engineered and constructed a 6-DOF force-controlled robotic arm using 3D-printed components and DAMIAO motors, currently integrating the system with MoveIt 2 for advanced motion planning and control. Extended an open-source framework to develop an enhanced web-based agentic system with speech-to-text (STT) capabilities, real-time video streaming, and Model Context Protocol (MCP) client integration, enabling seamless compatibility with all MCP-compliant tools and services.',
  },
  {
    title: 'PI Lab — MathAdventure',
    period: 'Jan 2025 — Mar 2025',
    description:
      "Contributed to MathAdventure, a novel screen-free, voice-based interactive learning system grounded in Contextual Learning and Zone of Proximal Development (ZPD) principles, designed to enhance mathematical understanding of the decimal system in children aged 4-8 through real-world object symbolization. Built the core computer vision module for real-time object recognition, enabling contextualized math problem generation from children's immediate physical surroundings. Orchestrated user studies including Wizard of Oz experiments and iterative prototype testing with 18 child-parent pairs, and authored significant sections of the manuscript, including Related Work and key portions of System Design and Development.",
  },
  {
    title: 'BiFocalNet: Dual-Branch Remote Sensing Segmentation',
    period: 'Jun 2024 — Dec 2024',
    description:
      'Proposed BiFocalNet for remote sensing segmentation, achieving state-of-the-art results on the GID dataset with +3.06 mIoU over prior work. Designed a dual-branch encoder combining EfficientNetV2 and Pyramid Vision Transformer to capture local details and global context, integrated via Cross-Fusion and SuperASPP modules for feature fusion and multi-scale modeling. Ran extensive experiments and ablations, improving over ParaTransCNN by +3.28 (Forest) and +3.51 (Built-up) mIoU.',
  },
  {
    title: 'FODAP Graph for Medical Imaging Narrative Generation',
    period: 'Mar 2023 — May 2024',
    description:
      "Built a MedSAM-based ViT visual encoder for 512×512 medical images to generate high-quality representations. Simplified the encoder by removing the MLP neck and using patch embeddings directly, reducing features from 1024×768 to 256×768 to unify outputs and improve generalization. Benchmarked against BioMedCLIP-pretrained ViT-B/16 and ImageNet21k-pretrained CvT, demonstrating MedSAM's best performance for medical imaging narrative generation.",
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
  },
  {
    title: "Human and LLMs' Bodily Representations",
    authors: [{ name: 'Yuzhuo Jia (first author)', me: true }],
    venue: 'Nature Machine Intelligence',
    status: 'In preparation',
  },
  {
    title: 'BiFocalNet: Dual-Branch Architecture for Enhanced Remote Sensing Segmentation',
    authors: [{ name: 'Yuzhuo Jia', me: true }],
    venue: 'IEEE Transactions on Geoscience and Remote Sensing',
    status: 'Under revision',
    image: imgBifocal,
  },
  {
    title: 'FODAP Graph for Enhanced Medical Imaging Narrative Generation',
    authors: [
      { name: 'Kai Shu*' },
      { name: 'Yuzhuo Jia*', me: true },
      { name: 'Ziyang Zhang' },
      { name: 'Jiechao Gao' },
    ],
    venue: 'International Conference on Bioinformatics and Biomedicine (BIBM 2024)',
    link: { label: 'DOI', url: 'https://doi.org/10.1109/BIBM62325.2024.10822532' },
    image: imgBibm,
  },
  {
    title: 'Pedestrian Behavior Detection and Traffic Violation Recognition Based on YOLOv5',
    authors: [{ name: 'Yuzhuo Jia', me: true }],
    venue: '4th International Conference on Image Processing and Intelligent Control',
    link: { label: 'DOI', url: 'https://doi.org/10.1117/12.3038591' },
    image: imgYolo,
  },
];

export const projects: Project[] = [
  {
    title: 'Fine-tuning LLMs for Struggling Student Simulation',
    period: 'Dec 2025 — Jan 2026',
    description:
      'A two-stage LLM augmentation pipeline using MisstepMath and the Gemini-3-Pro API, generating 1,300+ student misconception samples with structured error-type and metacognitive annotations. Applied LoRA fine-tuning on Qwen3-8B to simulate authentic struggling learners — training only 0.059% of parameters while achieving 100% metacognitive deficit behaviors — validating instruction tuning for intelligent tutoring systems and teacher training.',
    // 仓库公开后补一行 github: 'https://github.com/...',
  },
  {
    title: 'Interview Assistant',
    period: 'Sep 2024 — Nov 2024',
    description:
      'A cross-platform Electron desktop app providing real-time, AI-driven response suggestions during online interviews. Integrates Deepgram low-latency speech-to-text with GPT-generated context-aware suggestions (average response under 2 seconds), supports personalization from uploaded resumes and project documents, and keeps all personal data processed locally for privacy.',
    github: 'https://github.com/nohairblingbling/Interview-Assistant',
    image: imgInterview,
  },
  {
    title: 'Teaching DCD Children How to Move Using AR',
    period: 'Aug 2024 — Dec 2024',
    description:
      'A therapeutic web-based AR application using WebXR that guides children with Developmental Coordination Disorder through motor-skill exercises. A MediaPipe-based real-time motion analysis and scoring system tracks indicators like arm height and trunk stability for immediate feedback, wrapped in a child-centric, gamified UI shown in user testing to boost engagement and confidence.',
    image: imgDcd,
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
