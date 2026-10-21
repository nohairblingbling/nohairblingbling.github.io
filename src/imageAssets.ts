// Generated display variants; original photographs remain available to the lightbox.
import portrait_320 from './assets/optimized/portrait-320.webp';
import portrait_512 from './assets/optimized/portrait-512.webp';
import portrait_800 from './assets/optimized/portrait-800.webp';
import XJ1_640 from './assets/optimized/XJ1-640.webp';
import XJ1_960 from './assets/optimized/XJ1-960.webp';
import XJ1_1600 from './assets/optimized/XJ1-1600.webp';
import XJ2_640 from './assets/optimized/XJ2-640.webp';
import XJ2_960 from './assets/optimized/XJ2-960.webp';
import XJ2_1600 from './assets/optimized/XJ2-1600.webp';
import XJ3_640 from './assets/optimized/XJ3-640.webp';
import XJ3_960 from './assets/optimized/XJ3-960.webp';
import XJ3_1600 from './assets/optimized/XJ3-1600.webp';
import XJ4_640 from './assets/optimized/XJ4-640.webp';
import XJ4_960 from './assets/optimized/XJ4-960.webp';
import XJ4_1600 from './assets/optimized/XJ4-1600.webp';
import XJ5_640 from './assets/optimized/XJ5-640.webp';
import XJ5_960 from './assets/optimized/XJ5-960.webp';
import XJ5_1600 from './assets/optimized/XJ5-1600.webp';

export const portraitDisplay = {
  src: portrait_512,
  srcSet: `${portrait_320} 320w, ${portrait_512} 512w, ${portrait_800} 800w`,
  sizes: '(max-width: 767px) 124px, 238px',
};

export const photoDisplays = {
  XJ1: { src: XJ1_960, srcSet: `${XJ1_640} 640w, ${XJ1_960} 960w, ${XJ1_1600} 1600w`, width: 1600, height: 1067 },
  XJ2: { src: XJ2_960, srcSet: `${XJ2_640} 640w, ${XJ2_960} 960w, ${XJ2_1600} 1600w`, width: 1600, height: 1066 },
  XJ3: { src: XJ3_960, srcSet: `${XJ3_640} 640w, ${XJ3_960} 960w, ${XJ3_1600} 1600w`, width: 1600, height: 1067 },
  XJ4: { src: XJ4_960, srcSet: `${XJ4_640} 640w, ${XJ4_960} 960w, ${XJ4_1600} 1600w`, width: 1600, height: 1066 },
  XJ5: { src: XJ5_960, srcSet: `${XJ5_640} 640w, ${XJ5_960} 960w, ${XJ5_1600} 1600w`, width: 1600, height: 1067 },
};
