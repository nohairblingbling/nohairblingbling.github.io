// Rebuild display assets without changing the originals. Requires cwebp (libwebp).
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'src/assets/optimized');
mkdirSync(out, { recursive: true });
const jobs = [
  ['portrait.jpg', 'portrait', [320, 512, 800]],
  ['gallery/XJ1.jpg', 'XJ1', [640, 960, 1600]],
  ['gallery/XJ2.jpg', 'XJ2', [640, 960, 1600]],
  ['gallery/XJ3.jpg', 'XJ3', [640, 960, 1600]],
  ['gallery/XJ4.jpg', 'XJ4', [640, 960, 1600]],
  ['gallery/XJ5.jpg', 'XJ5', [640, 960, 1600]],
];
const report = [];
for (const [source, name, widths] of jobs) {
  const input = path.join(root, 'src/assets', source);
  for (const width of widths) {
    const output = path.join(out, `${name}-${width}.webp`);
    execFileSync('cwebp', ['-quiet', '-q', '92', '-m', '6', '-sharp_yuv', '-resize', String(width), '0', input, '-o', output]);
    report.push({ file: path.basename(output), bytes: statSync(output).size, originalBytes: statSync(input).size });
  }
}
// Publication previews preserve the resized pixels losslessly, including small diagram labels.
for (const name of ['fodap-framework.png']) {
  const input = path.join(root, 'src/assets', name);
  for (const width of [640, 960]) {
    const output = path.join(out, `${path.parse(name).name}-${width}.webp`);
    execFileSync('cwebp', ['-quiet', '-lossless', '-m', '6', '-resize', String(width), '0', input, '-o', output]);
    report.push({ file: path.basename(output), bytes: statSync(output).size, originalBytes: statSync(input).size });
  }
}
// Keep fine text and diagram edges exactly: lossless WebP, no resizing.
for (const name of ['fodap-framework.png']) {
  const input = path.join(root, 'src/assets', name);
  const output = path.join(out, `${path.parse(name).name}.webp`);
  execFileSync('cwebp', ['-quiet', '-lossless', '-m', '6', input, '-o', output]);
  report.push({ file: path.basename(output), bytes: statSync(output).size, originalBytes: statSync(input).size });
}
writeFileSync('/tmp/portfolio-image-sizes.json', JSON.stringify(report, null, 2));
console.table(report);
