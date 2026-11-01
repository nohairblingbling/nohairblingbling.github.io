# yuzhuojia.fun

Personal site of Yuzhuo Jia. Dark, single-page, built with Vite + React + TypeScript + Tailwind CSS v4.

## Editing content

All copy, publications, projects, links, and the position line live in `src/content.ts`. No component changes needed for routine updates.

### Gallery collections

Rolls in `src/content.ts` belong to `portraits` or `landscapes`. Matching `location` values connect rolls photographed in the same place. Category filters use `?category=portraits` or `?category=landscapes`; roll links retain their existing hash format.

Each roll has a `capture` entry and a `labelTone` (`ivory`, `sand`, `sage`, or `silver`). Digital entries use `{ medium: 'digital', brand, model }`; film entries use `{ medium: 'film', brand, stock, iso, format?, camera? }`. Fill these with the actual equipment and film data. The 3D label, fallback label, shelf caption, and film-edge markings share these values. Current collections use `currentCamera` (SONY A7M4); adding a film collection does not change existing digital labels.

New photo selections and English image descriptions live in `scripts/import-gallery.py`. To rebuild their web assets, install Pillow with WebP support and run:

```bash
python3 scripts/import-gallery.py /path/to/KOL
```

The importer preserves source files, corrects orientation and color profiles, and exports 720, 1440, and 2560-pixel WebP versions without EXIF metadata. Commit the generated files and manifest in `src/assets/gallery/collections/`; normal site builds do not need Pillow or the source photos. Film strips use responsive smaller versions; the lightbox loads the largest version when opened.

Film previews use equal square frames with a dark matte. Every photograph is proportionally contained and centered, preserving its full composition without cropping or stretching. The lightbox also shows the complete photograph.

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
