// Stickman 3D premium cast (references/stickman-characters.md): carved angular heads, a 3D wedge nose, sculpted hair,
// thin dark legs on small low dark shoes, no logos anywhere. Each character has its own seed (its head shape is
// registered under that seed). Sheets: assets/characters/felix-referencia.jpeg, jensen-huang-hoja.webp.
import type { CharacterSpec } from "./Character3D";

/** Félix Insólito, the channel host: a long carved face, a honey bowl cut with straight bangs, a waxed handlebar
 *  mustache, half-lidded blue eyes, a brown tweed suit with a striped red tie, very thin dark-brown legs. */
export const FELIX: CharacterSpec = {
  height: 1.9,
  build: {
    headScale: 1.5,
    torso: "block",
    torsoWidth: 0.72,
    torsoHeight: 1.02,
    neck: 2.4,
    neckWidth: 0.68,
    legWidth: 0.42,
    armWidth: 0.72,
    hand: 0.95,
    shoeScale: 0.9,
  },
  look: {
    skin: "#eab48c",
    outfit: "suit",
    colors: { top: "#8f5c30", inner: "#f4efe4", bottom: "#3a2018", shoes: "#24120c", accent: "#9a2433" },
    hair: "bowl",
    hairColor: "#e3a84a",
    mustache: "#d99a3c",
    mustacheStyle: "handlebar",
    headShape: { width: 0.66, top: 0.78, bot: 1.48, jaw: 0.06, chinExp: 3.4, topExp: 2.3, cheek: 0.05, chinFwd: 0.12, depth: 0.95, facets: 14, wobble: 0.25 },
    nose3d: { w: 0.11, out: 0.42 },
    face: { eyeColor: "#3f78c0", brow: 1.45, blush: 0, noseY: 0.5, mouthY: 1.05 },
    seed: 41,
  },
};

/** Jensen Huang as a stickman premium caricature: swept-back silver hair, rectangular dark glasses, a broad carved
 *  face, a plain black leather jacket over a black tee (no logos), thin black legs, small dark-brown shoes. */
export const JENSEN: CharacterSpec = {
  height: 1.72,
  build: {
    headScale: 1.52,
    torso: "block",
    torsoWidth: 0.95,
    torsoHeight: 0.95,
    neck: 1.2,
    neckWidth: 0.85,
    legWidth: 0.48,
    armWidth: 0.86,
    shoeScale: 0.9,
  },
  look: {
    skin: "#e3a67a",
    outfit: "leather",
    colors: { top: "#1f1f24", inner: "#121214", bottom: "#141418", shoes: "#3a2016", accent: "#8a8c96" },
    hair: "swept",
    hairColor: "#9c9ea6",
    glasses: "#26262b",
    glassesShape: "rect",
    headShape: { width: 1.06, top: 0.98, bot: 1.28, jaw: 0.1, chinExp: 3.2, topExp: 2.5, cheek: 0.09, chinFwd: 0.08, facets: 13, wobble: 0.2 },
    nose3d: { w: 0.15, out: 0.2 },
    face: { eyeColor: "#3a2418", brow: 1.15, blush: 0.04, lines: true, noseY: 0.36, mouthY: 0.74 },
    seed: 42,
  },
};

export const STICKMAN_CAST = { felix: FELIX, jensen: JENSEN };
