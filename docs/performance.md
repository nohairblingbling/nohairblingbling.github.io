# Performance pass (2026-10-22)

The visible design, particle count, shader resolution, gallery speed, canister motion, cursor states, and intro timing are preserved. The intro's third-refresh replay rule is unchanged.

## Resource delivery

- Responsive WebP variants for the portrait and gallery previews. Source photos remain unchanged; the lightbox replaces the cached preview only after decoding the original, then preloads the two neighbouring originals.
- First two film frames load eagerly. Later frames use native lazy loading and declared dimensions, preventing strip width changes while images arrive.
- FODAP's full WebP is pixel-identical to the PNG (ImageMagick absolute error: 0). Smaller diagram variants are resized and encoded losslessly. Existing JPEG publication images are retained when lossless WebP would be larger.
- Font families, weights and styles are unchanged. The bundled font CSS includes the Latin character subsets used by the current content.

| Asset | Before | After |
| --- | ---: | ---: |
| Portrait | 151,610 B | 19,662 B mobile / 38,758 B desktop at 2× |
| FODAP card at 2× | 459,998 B | 253,702 B |
| Five film preview images at 2× | 1,997,015 B | 1,564,120 B, loaded as they approach the viewport |
| First two film preview images at 2× | 529,142 B | 335,860 B |
| Emitted font files | 427,844 B | 169,420 B |
| Emitted CSS | 62,969 B | 56,728 B |

Font output totals include all emitted subsets/formats, not bytes necessarily downloaded on one visit. Supporting responsive variants and retaining originals increases total image output on disk; each viewport requests only its chosen variants.

## Animation work

- Film grain uses one cached noise texture and stepped compositor transforms. A short initial refresh-rate calibration retains the original every-four-frames cadence, including high-refresh screens. Intensity and tile scale remain unchanged. No persistent JavaScript loop or full-viewport 2D canvas redraw remains.
- Particles stop submitting frames outside the viewport or in hidden tabs and resume without a time jump. Geometry and shader resources are released on unmount.
- Film playback stops scheduling frames while hovered or offscreen. Dragging coalesces pointer updates to a frame; unpausing retains the 42 px/s speed.
- Card highlights update a single transform per frame rather than repeatedly changing inherited CSS variables across the card subtree.

## Verification

Production build and 49 tests pass, including pause/resume, hidden tab cleanup, drag-vs-click, texture reuse, and preview-to-original decoding. Browser checks cover desktop/mobile home, gallery, photo navigation and original image URLs. There is no horizontal overflow in the 375 px mobile viewport.

Generate display assets with `npm run images:optimize` (requires the `cwebp` executable from libwebp). Generated files are kept in the source tree; ordinary builds do not require the image tool. Keep originals in `src/assets`.

## Local runtime sample

Production build in the same in-app browser, approximately 829 × 1033 CSS px (819 px content width), 2× pixel density. No CPU/network throttling, intro finished, pointer idle on the home hero. Consecutive samples lasted 27.6 s before and 29.9 s after, normalized per second. The final grain implementation was calibrated to the display refresh cadence.

| Chrome Performance metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| ScriptDuration per second | 20.33 ms | 14.42 ms | -29.1% |
| TaskDuration per second | 93.10 ms | 85.52 ms | -8.2% |

These are local samples, not field Core Web Vitals, a measured FPS gain, or a public-network load-time guarantee. Earlier samples varied, so the numbers are directional. The measurable resource savings and removal of unnecessary frame work do not depend on that timing sample.

The complete emitted JavaScript grows from 302,214 B to 306,445 B (gzip 96,283 B to 97,873 B) for responsive asset metadata and loading/visibility handling; there are no new runtime dependencies.
