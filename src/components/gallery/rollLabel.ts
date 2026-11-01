import type { Capture, LabelTone } from '../../content';

// Shared by the 3D label and its CSS fallback so they stay visually consistent.
export const labelPalettes: Record<LabelTone, { paper: string; ink: string; stamp: string }> = {
  ivory: { paper: 'oklch(82% 0.024 82)', ink: 'oklch(26% 0.012 65)', stamp: 'oklch(40% 0.038 48)' },
  sand: { paper: 'oklch(78% 0.040 65)', ink: 'oklch(26% 0.018 45)', stamp: 'oklch(39% 0.045 40)' },
  sage: { paper: 'oklch(79% 0.026 145)', ink: 'oklch(26% 0.012 160)', stamp: 'oklch(39% 0.030 155)' },
  silver: { paper: 'oklch(82% 0.020 230)', ink: 'oklch(26% 0.014 235)', stamp: 'oklch(39% 0.036 230)' },
};

export function captureLabel(capture: Capture) {
  if (capture.medium === 'digital') {
    const equipment = `${capture.brand} ${capture.model}`;
    return { maker: capture.brand, mark: capture.model, medium: 'DIGITAL', equipment,
      edge: equipment, leader: capture.model, detail: `${equipment} · DIGITAL` };
  }
  const equipment = `${capture.brand} ${capture.stock}`;
  const medium = [capture.format, `ISO ${capture.iso}`].filter(Boolean).join(' · ');
  return { maker: capture.brand, mark: capture.stock, medium, equipment,
    edge: `${equipment} ${capture.iso}`, leader: `ISO ${capture.iso}`,
    detail: [equipment, medium, capture.camera].filter(Boolean).join(' · ') };
}
