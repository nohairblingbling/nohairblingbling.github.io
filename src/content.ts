import imgBifocal from './assets/BiFocalNet.jpg';
import imgBibm from './assets/bibm1.jpg';
import imgYolo from './assets/yolo5.jpg';
import imgReading from './assets/new_research.jpg';
import imgPaper from './assets/paper.gif';
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
      'A Next.js web app utilizing AI for academic paper review, with PDF upload, customizable parameters, multilingual support, and a responsive animated UI — built with React, Tailwind CSS, and the OpenAI/Claude APIs.',
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
