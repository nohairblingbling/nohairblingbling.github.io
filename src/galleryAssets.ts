import manifest from './assets/gallery/collections/manifest.json';
import type { Photo } from './content';

const assets = import.meta.glob<string>('./assets/gallery/collections/*.webp', {
  eager: true, query: '?url', import: 'default',
});
const asset = (file: string) => {
  const url = assets[`./assets/gallery/collections/${file}`];
  if (!url) throw new Error(`Missing gallery image: ${file}`);
  return url;
};

type Collection = keyof typeof manifest;
export function collectionPhotos(collection: Collection): Photo[] {
  return manifest[collection].map(({ id, alt, variants }) => {
    const [small, display, large] = variants;
    return {
      id, alt, src: asset(large.file),
      display: {
        src: asset(display.file),
        srcSet: `${asset(small.file)} ${small.width}w, ${asset(display.file)} ${display.width}w`,
        width: display.width, height: display.height,
      },
    };
  });
}
