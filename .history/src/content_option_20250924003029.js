const logotext = "Yuzhuo Jia";
const meta = {
  title: "Yuzhuo Jia",
  description: "I'm Yuzhuo Jia",
};

const introdata = {
  title: "Yuzhuo Jia",
  //   animated: {
  //     first: "[]",
  //     second: "[]",
  //   },
  //   description:
  //     "In the past, I was a Research Assistant at the KAIST Interaction Lab (KIXLAB) developing a Generative Agent for Programming Education. My research interests are at the intersection of Human-AI Interaction and applied Machine Learning.",
  //   description_two:
  //     "  I am currently a first year Computer Science (MS) student at Stanford and I did my undergrad at Cornell studying Information Science. I have received grants and scholarships for my research like the Robert S Ann Morley Research Grant and the Gwanjeong Scholarship for my Master's Studies.",
  //   your_img_url: "",
};

const dataabout = {
  title: "Research Interests",
  aboutme:
    "My research interests are in Human-Computer Interaction (HCI), specifically at the intersection of Robotics, Mixed Reality (MR), wearables, and AI Agents. I am passionate about technology to create more intelligent and natural interactive experiences for the future.",
};
const worktimeline = [
  {
    jobtitle: "Tsinghua University",
    where: "Research Assistant",
    date: "Feb 2025 - Present",
  },
  {
    jobtitle: "University of Sydney",
    where: "Computer Science (MS)",
    date: "Feb 2023 - Mar 2025",
  },
  {
    jobtitle: "Nanfang College of Sun Yat-sen University",
    where: "Computer Science and Technology (BS)",
    date: "Sep 2017 - June 2021",
  },
];

const skills = [
  {
    name: "Python",
    value: 90,
  },
  {
    name: "Djano",
    value: 85,
  },
  {
    name: "Javascript",
    value: 80,
  },
  {
    name: "React",
    value: 60,
  },
  {
    name: "Jquery",
    value: 85,
  },
];

const services = [
  // {
  //   title: "SDG AI Lab - Software Engineer",
  //   period: "March 2023 - May 2023",
  //   description:
  //     "Development of the Digital Technologies Radar : a Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR), which allows for the systematic tracking and understanding of frontier technologies as they are developed. https://github.com/SDG-AI-Lab/Digital_Technologies_Radar",
  // },
];

const awards = [
  // {
  //   title: "Gwanjeong Educational Foundation Scholarship - Masters Degree",
  //   period: "Sep 2023 - June 2025",
  // },
  // {
  //   title:
  //     "ACM/IEEE Human Robot Interaction (HRI 2023) - Best Student Paper Award",
  //   period: "March 2022",
  // },
  // {
  //   title: "Robert S Ann Morley Research Grant - Cornell University",
  //   period: " December 2021 ",
  // },
];

const workexperience = [
  // {
  //   title: "[Motional] Robotics Research Engineer",
  //   period: "Sep 2022 - Dec 2022",
  //   description:
  //     "Research on identification of Autonomous Vehicle Lane Change key parameters and metrics in dynamic road environments interacting with other agents. Published and first authored 2 papers to ACM/IEEE HRI 2023",
  // },
  // {
  //   title: "[Harvard Berkman Klein Center] Software Engineer",
  //   period: "May 2023 - August 2023",
  //   description:
  //     "Developed Software for dynamic text annotation and page navigation on H2O, an open-casebook platform (React, Django). Conducted Research on Digital Reading Interaction Software and published paper to ACM/IEEE CHI 2023",
  // },
  // {
  //   title: "[Cochl. AI] Software Engineer",
  //   period: "Nov 2020 - Feb 2021 ",
  //   description:
  //     "Integrated non-verbal sound recognition AI into Mercedes Benz User Interface. Full-stack development using React, Javascript, SocketIO, Docker. Developed and demonstrated a working prototype of Emotional Sound Recognition within Benz Cars to the Mercedes Benz Team - Presentation at Benz conference in Germany",
  // },
];

const researchexperience = [
  {
    title: "Adaptive Reading System Project",
    period: "Jun 2025 – Sep 2025",
    description: "",
  },
  {
    title: "Embodied Intelligence Research Group",
    period: "Apr 2025 – Aug 2025",
    description: "",
  },
  {
    title: "PI Lab – MathAdventure Project",
    period: "Jan 2025 – Mar 2025",
    description: "",
  },
  {
    title:
      "BiFocalNet: Dual-Branch Architecture for Enhanced Remote Sensing Segmentation",
    period: "Jul 2024 – Dec 2024",
    description:
      "Developed BiFocalNet, a deep learning architecture for remote sensing segmentation, achieving a 3.062% improvement in mean IoU on the GID dataset. Designed a parallelized encoder combining EfficientNetV2 and Pyramid Vision Transformer, integrated via Cross-Fusion and SuperASPP modules for enhanced multi-scale context modeling. Demonstrated superior performance in key categories, with 3.279% and 3.514% improvements in 'Forest' and 'Built-up' segmentation.",
  },

  {
    title: "FODAP Graph for Enhanced Medical Imaging Narrative Generation",
    period: "Mar 2023 – May 2024",
    description:
      "Co-designed a MedSAM-based visual encoder with Vision Transformer (ViT) architecture, processing 512x512 medical images for high-quality feature representation. Simplified model by removing the MLP neck and optimizing patch embeddings. Implemented a feature reduction strategy to improve generalization across datasets. Conducted comparative experiments, showing MedSAM's superior performance in medical imaging, and contributed to the Graph-Enhanced Attention (GEA) mechanism for more accurate medical report generation.",
  },

  {
    title: "A Study on Corn Pest Detection Based On Improved YOLOv7",
    period: "Dec 2023 – Mar 2024",
    description:
      "Developed SPD-YOLOv7, an enhanced model for corn pest detection with 98.38% accuracy, 99.51% recall, and 99.4% mAP@0.5, outperforming YOLOv7. Introduced SPD-Conv to improve small object detection and ELAN-W with CBAM attention for better feature extraction in complex backgrounds. Conducted ablation experiments to validate model improvements, especially for small pest detection.",
  },
];

const dataportfolio = [
  {
    img: "BiFocalNet",
    title:
      "BiFocalNet: Dual-Branch Architecture for Enhanced Remote Sensing Segmentation",
    authors: "Yuzhuo Jia",
    conference: "IEEE Transactions on Geoscience and Remote Sensing",
    //doi: "https://doi.org/10.48550/arXiv.2408.10240",
    //video: "https://www.youtube.com/watch?v=tJUqjjwSxPs",
    notes: "Under Revision",
    code: "Code Coming Soon",
  },
  {
    img: "bibm1",
    title:
      "FODAP Graph for Enhanced Medical Imaging Narrative Generation: Adaptive Differentiation of Normal and Abnormal Attributes",
    authors: [
      { name: "Kai Shu", bold: true },
      { name: "Yuzhuo Jia", bold: true },
      { name: "Ziyang Zhang", bold: false },
      { name: "Jiechao Gao", bold: false },
    ],
    conference:
      "International Conference on Bioinformatics and Biomedicine (BIBM 2024)",
    doi: "https://www.arxiv.org/abs/2409.03947",
  },
  {
    img: "yolo5",
    title:
      "Pedestrian behavior detection and traffic violation recognition based on YOLOv5",
    authors: "Yuzhuo Jia",
    conference:
      "International Conference on Image Processing and Intelligent Control",
    doi: "https://doi.org/10.1117/12.3038591",
  },
];

const projectportfolio = [
  {
    img: "paper",
    title: "Paper Review Assistant",
    description:
      "Developed a Next.js web app utilizing AI for academic paper review with PDF upload, customizable parameters, multilingual support, and a responsive, animated UI built with React, Tailwind CSS, and integrated with OpenAI/Claude’s API.",
    github: "https://github.com/nohairblingbling/paper-review-assistant",
    //website: "",
  },
  {
    img: "interview",
    title: "Interview Assistant",
    description:
      "Developed a cross-platform Electron app for real-time interview response suggestions, integrating speech-to-text, GPT-based intelligent answers, and personalized content management, with privacy-focused local data processing.",
    github: "https://github.com/nohairblingbling/Interview-Assistant",
    //website: "",
  },

  {
    img: "dcd",
    title: "Teaching DCD Children How to Move Using AR",
    description:
      "Developed a web-based AR app for children with DCD, featuring a user-friendly UI, WebXR for 3D training, MediaPipe for real-time motion detection, and a supportive scoring system to enhance motor skills.",
    //github: "https://github.com/nohairblingbling/Interview-Assistant",
    //website: "",
  },
];

const contactConfig = {
  YOUR_EMAIL: "yjia8942@uni.sydney.edu.au",
  YOUR_FONE: "-",
  description: "- ",
  // creat an emailjs.com account
  // check out this tutorial https://www.emailjs.com/docs/examples/reactjs/
  YOUR_SERVICE_ID: "service_id",
  YOUR_TEMPLATE_ID: "template_id",
  YOUR_USER_ID: "user_id",
};

const socialprofils = {
  github: "https://github.com/nohairblingbling",
  //   facebook: "https://facebook.com",
  //scholar: "https://scholar.google.com/citations?user=POepUzkAAAAJ&hl=en",
  //linkedin: "https://www.linkedin.com/in/seonghee-lee/",
  instagram: "https://www.instagram.com/lorcanxoo/",
};
export {
  meta,
  dataabout,
  dataportfolio,
  researchexperience,
  workexperience,
  worktimeline,
  services,
  introdata,
  contactConfig,
  socialprofils,
  projectportfolio,
  logotext,
  awards,
};
