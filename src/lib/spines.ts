// Spine palette — varied book colours that sit happily next to the app's
// moss / rose / teal / plum theme (globals.css). Each spine gets a colour by
// its position on the shelf; the front border is a shared translucent darken.
export type SpineColor = { bg: string; fg: string };

export const SPINE_COLORS: SpineColor[] = [
  { bg: "#2c5243", fg: "#e8f0e0" }, // ink green (theme)
  { bg: "#3f8190", fg: "#e4f2f4" }, // deep teal (theme)
  { bg: "#d3968c", fg: "#3a201c" }, // rose (theme)
  { bg: "#846ab3", fg: "#efeaf8" }, // plum (theme)
  { bg: "#839958", fg: "#f4f7ea" }, // moss (theme)
  { bg: "#8b3a3a", fg: "#f6dcdc" }, // brick
  { bg: "#1f3d4d", fg: "#bdd7e3" }, // navy
  { bg: "#c08a3c", fg: "#3a2510" }, // amber
  { bg: "#4a3b6b", fg: "#ded3f1" }, // deep plum
  { bg: "#2c4a2e", fg: "#cfe3cf" }, // forest
  { bg: "#b5654d", fg: "#fbe7de" }, // terracotta
  { bg: "#5c6b8a", fg: "#e5ecf6" }, // slate
];

export const SPINE_BORDER = "rgba(0, 0, 0, 0.28)";

export function spineColor(index: number): SpineColor {
  return SPINE_COLORS[index % SPINE_COLORS.length];
}

// Height grows with page count: clamp(120, 120 + (pages - 100) / 800 * 100, 220).
// Exports without a page count (StoryGraph) land at the 120px floor.
export function spineHeight(pages: number): number {
  const raw = 120 + ((pages || 0) - 100) / 800 * 100;
  return Math.round(Math.max(220, Math.min(220, raw)));
}
