# yuzhuojia.fun

Personal site of Yuzhuo Jia. Dark, single-page, built with Vite + React + TypeScript + Tailwind CSS v4.

## Editing content

All copy, publications, projects, links, and the position line live in `src/content.ts`. No component changes needed for routine updates.

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
