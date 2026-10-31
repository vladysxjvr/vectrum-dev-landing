// One config per variant. All motion is a function of loop phase p = frame / frames.
// Colours are token NAMES from tokens.js, never hex.
window.COMMON = {
  size: 1080,
  fps: 30,
  seconds: 10,            // loop length T
  grain: 3.2,             // film grain amplitude, in 8-bit levels (std-ish)
  // Safe zone: top ~55% and left side stay calm. Elements' alpha is multiplied by
  // mask(x,y) = floor + (1-floor) * smoothstep(y0,y1,y) blended with x.
  safe: { y0: 0.42, y1: 0.78, xBoost: 0.35, floor: 0.12 },
};

window.VARIANTS = {
  "01-fallen-stars": {
    title: "Fallen Stars",
    bg: { type: "www", glow: [{ color: "glowCenterA", x: 0.82, y: 0.86, r: 620, a: 0.20, breathe: 0.25 }] },
    stars: {
      count: 9,            // per 10 s loop (site: ~27 per 27.8 s ≈ 1 / s)
      flight: 4.2,         // seconds per star (site: 1.415 s)
      travel: 760,         // px along the path (site: 1240 px)
      angleDeg: -10.08,    // site: --landing-star-rotate -10.0841deg (up-right)
      scale: 1.9,          // site particles are 3 px core / 60 px tail at 1440 wide
      tailMax: 60,         // site: width 0 -> 40 -> 60 -> 0
      opacity: 0.6,
      area: { x0: 0.18, x1: 0.70, y0: 0.62, y1: 0.97 },
      core: "accentMain", tail: "accentMain", glow: "accentMain",
    },
  },

  "02-network": {
    title: "Network",
    bg: { type: "www", glow: [{ color: "glowCenterB", x: 0.78, y: 0.82, r: 600, a: 0.22, breathe: 0.2 }] },
    network: {
      nodes: 96, drift: 30, linkDist: 195,
      line: "wwwLine", lineAlpha: 0.48,
      node: "lineBlue", nodeAlpha: 0.9,
      hubs: 6, hubFill: "spreadsheet", hubStroke: "accentMain", hubAlpha: 0.7,
      pulses: 3, pulseEdges: 5, pulseColor: "accentMain", pulseAlpha: 0.55, pulseSeconds: 5,
      bias: 1.6,           // density bias towards bottom-right
    },
  },

  "03-europe-routes": {
    title: "Europe Routes",
    bg: { type: "www", glow: [{ color: "glowCenterA", x: 0.65, y: 0.72, r: 520, a: 0.16, breathe: 0.2 }] },
    europe: {
      center: [19.94, 50.06], at: [700, 760], pxPerDeg: 28,
      dotGrid: { step: 16, color: "wwwLine", alpha: 0.30 },
      route: "wwwLine", routeAlpha: 0.32, dash: [5, 7], arcBend: 0.18,
      city: "accentMain", cityFill: "spreadsheet", cityAlpha: 0.6, cityR: 5,
      hub: "accentMain", hubR: 10, ringPeriod: 2, ringMax: 46, ringAlpha: 0.28,
      pulse: "statusBlueText", pulseAlpha: 0.7, pulseTrail: 0.10,
    },
  },

  "04-aurora": {
    title: "Aurora Glow",
    bg: { type: "www", glow: [] },
    aurora: {
      blobs: [
        { color: "glowCenterA", cx: 0.80, cy: 0.86, orbit: 90,  r: 640, a: 0.42, turns: 1,  phase: 0.00 },
        { color: "glowTR",      cx: 0.98, cy: 0.62, orbit: 70,  r: 520, a: 0.30, turns: -1, phase: 0.35 },
        { color: "accentMain",  cx: 0.55, cy: 1.02, orbit: 80,  r: 560, a: 0.16, turns: 1,  phase: 0.70 },
      ],
      wobble: 0.10,        // radius modulation from loop noise
    },
  },

  "05-grid-horizon": {
    title: "Grid Horizon",
    bg: { type: "dev", glow: [] },
    grid: {
      horizon: 0.60, vanishX: 0.62, cells: 1,  // cells passed per loop
      depthLines: 22, lanes: 30, laneSpread: 2.6,
      line: "wwwLine", lineAlpha: 0.38, fogPow: 1.6,
      horizonGlow: { color: "glowCenterA", a: 0.30, h: 170, breathe: 0.2 },
    },
  },

  "06-hybrid": {
    title: "Hybrid",
    bg: { type: "www", glow: [] },
    aurora: {
      blobs: [
        { color: "glowCenterA", cx: 0.82, cy: 0.88, orbit: 90, r: 600, a: 0.32, turns: 1,  phase: 0.0 },
        { color: "glowTR",      cx: 1.00, cy: 0.64, orbit: 70, r: 480, a: 0.22, turns: -1, phase: 0.4 },
      ],
      wobble: 0.10,
    },
    stars: {
      count: 5, flight: 4.6, travel: 720, angleDeg: -10.08, scale: 1.9, tailMax: 60,
      opacity: 0.55, area: { x0: 0.22, x1: 0.70, y0: 0.64, y1: 0.96 },
      core: "accentMain", tail: "accentMain", glow: "accentMain",
    },
  },
};
