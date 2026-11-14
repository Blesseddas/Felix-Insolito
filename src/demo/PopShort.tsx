// PopShort: 10.9 s test of the "pop" look with voice-over timing.
// Story: "Él taladró ochenta y dos agujeros en un carro. Todos se rieron de él. Pero esa noche, nadie durmió...
//         porque, verás, cada agujero escondía un cohete."
// Improvements over the first test: bigger heads (1.45x) + exaggerated faces, saturated set paint (color in the set,
// not the grade), a cool counter in every act, faces at 30-45% height, an in-world "82" tag, one yellow accent word,
// acts lit pop day -> blue night -> golden reveal, no hard cuts (every framing change is a camera move).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CAST } from "../inkbeat/char/cast";
import { Character3D, headOf } from "../inkbeat/char/Character3D";
import { Captions, makeChunks } from "../inkbeat/core/captions";
import type { Word } from "../inkbeat/core/captions";
import { CastLight } from "../inkbeat/core/castLight";
import { subFrame, useFonts } from "../inkbeat/core/frame";
import { boxG, cylG, coneG, Label, M } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { Awning, Barrel, Crate, House, LampPost, Planter } from "./Street";

export const POP_FRAMES = 327; // 10.9 s: VO 10.22 s + ~0.7 s tail

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const mix = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];

// --- voice-over timing: phrase spans from silence detection, words spread by length inside each phrase ----------
const PHRASES: [number, number, string][] = [
  [0.02, 2.56, "él taladró ochenta y dos agujeros en un carro."],
  [3.08, 4.22, "todos se rieron de él."],
  [4.67, 5.45, "pero esa noche,"],
  [5.65, 6.52, "nadie durmió..."],
  [6.95, 7.88, "porque, verás,"],
  [8.12, 10.04, "cada agujero escondía un cohete."],
];
const WORDS: Word[] = PHRASES.flatMap(([a, b, text]) => {
  const ws = text.split(" ");
  const w = ws.map((x) => x.replace(/[^\p{L}]/gu, "").length + 1.5);
  const tot = w.reduce((s, x) => s + x, 0);
  let t = a;
  return ws.map((x, i) => {
    const d = ((b - a) * w[i]) / tot;
    const r: Word = [x, t, t + d];
    t += d;
    return r;
  });
});
const CHUNKS = makeChunks(WORDS, 10.6);
const ACCENT = new Set(["ochenta", "verás"]);

// --- cast ---------------------------------------------------------------------------------------------------------
const Y = 0.16;
const POP = { headScale: 1.45, limb: 1.1, hand: 1.25 };
const INV = { ...CAST.adult, build: { ...CAST.adult.build, ...POP } };
const KID = { ...CAST.kid, build: { ...CAST.kid.build, headScale: 1.6, hand: 1.2 } };
const ELD = { ...CAST.elder, build: { ...CAST.elder.build, ...POP } };
const INV_P: V3 = [-0.55, Y, -2.45];
const KID_P: V3 = [2.05, Y, -2.3];
const ELD_P: V3 = [2.85, Y, -2.75];
const CART: V3 = [0.55, Y, -2.3];
const FRONT_Z = CART[2] + 0.4; // the drilled face looks at the street (+z)

// --- camera: one continuous path; each key is a move (start, duration) to a new framing -----------------------------
type Key = { t: number; dur: number; cam: Cam };
const K0: Cam = { pos: [0.9, 1.3, 1.3], look: [0.1, 1.05, -2.45], fov: 50 };
const KEYS: Key[] = [
  { t: 0.95, dur: 0.6, cam: { pos: [0.95, 1.05, -0.45], look: [0.55, 0.8, -2.05], fov: 46 } }, // push onto the "82" cart
  { t: 2.45, dur: 0.45, cam: { pos: [1.15, 1.25, 0.35], look: [2.45, 1.3, -2.5], fov: 48, roll: 0.03 } }, // whip to the laughers
  { t: 3.35, dur: 0.6, cam: { pos: [1.85, 1.35, -0.55], look: [2.5, 1.38, -2.55], fov: 44 } }, // push on the laughter
  { t: 4.3, dur: 0.75, cam: { pos: [3.6, 4.6, 4.6], look: [0.5, 4.2, -5.0], fov: 58 } }, // crane up: night sky over the street
  { t: 5.55, dur: 0.75, cam: { pos: [-1.6, 4.2, 4.1], look: [0.6, 3.9, -5.5], fov: 56, roll: -0.03 } }, // orbit over lit windows
  { t: 6.55, dur: 0.8, cam: { pos: [0.85, 0.95, -0.75], look: [0.55, 0.72, -2.05], fov: 46 } }, // dive back to the cart
  { t: 8.05, dur: 1.1, cam: { pos: [0.6, 0.8, -0.95], look: [0.55, 0.62, -2.05], fov: 46 } }, // macro into the holes (whole grid in frame)
  { t: 10.05, dur: 0.3, cam: { pos: [0.85, 0.95, -0.55], look: [0.55, 0.85, -2.05], fov: 48 } }, // ignition: pull out
];
const lerpCam = (a: Cam, b: Cam, u: number): Cam => ({ pos: mix(a.pos, b.pos, u), look: mix(a.look, b.look, u), fov: a.fov + (b.fov - a.fov) * u, roll: (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * u });
const camAt = (t: number): Cam => {
  let c = K0;
  let held = 0;
  for (const k of KEYS) {
    if (t < k.t) break;
    const u = clamp((t - k.t) / k.dur);
    if (u < 1) return lerpCam(c, k.cam, ease(u));
    c = k.cam;
    held = k.t + k.dur;
  }
  // between moves the camera keeps drifting in (~3%/s) so no frame is still
  const dt = Math.max(0, t - held);
  return { ...c, pos: mix(c.pos, c.look, Math.min(0.15, 0.03 * dt)) };
};

// --- the set: saturated paint (color lives in the set, not the grade) -----------------------------------------------
const PopStreet: React.FC<{ night: boolean }> = ({ night }) => (
  <group>
    <M g={boxG(60, 0.2, 60)} c="#6a58c8" tex="stone" ts={1.5} p={[0, -0.1, 0]} cast={false} />
    <M g={boxG(30, 0.16, 3.2)} c="#f2b56e" tex="stone" p={[0, 0.08, -3.6]} cast={false} />
    <House p={[-3.6, 0.16, -7]} w={5} h={5.2} d={4} wall="#2f6fe8" tex="plaster" roof="#e8402a" windows={2} lit={night ? [0, 1] : []} />
    <House p={[1.8, 0.16, -7.4]} w={5.4} h={6.4} d={4.2} wall="#e8402a" tex="brick" roof="#2a2a8a" windows={3} lit={night ? [0, 2] : []} />
    <House p={[7.6, 0.16, -6.8]} w={5} h={4.6} d={4} wall="#ffc21a" tex="plaster" roof="#7a1fa0" windows={2} lit={night ? [1] : []} />
    <House p={[-9.2, 0.16, -6.6]} w={5} h={5.8} d={4} wall="#16b39a" tex="planks" roof="#d0302a" windows={2} lit={night ? [0] : []} />
    <Awning p={[1.8, 2.7, -5.3]} w={5.0} color="#16b39a" />
    <LampPost p={[-1.4, 0.16, -2.2]} on={night ? 1 : 0} />
    <Crate p={[3.7, 0.16, -4.6]} yaw={0.3} />
    <Crate p={[4.3, 0.16, -4.4]} s={0.45} yaw={-0.2} />
    <Barrel p={[-2.7, 0.16, -4.4]} />
    <Barrel p={[4.9, 0.16, -3.2]} />
    <Planter p={[-5.0, 0.16, -4.6]} />
    <Planter p={[5.6, 0.16, -4.7]} />
    <Crate p={[-1.9, 0.16, -3.5]} s={0.4} yaw={0.6} />
  </group>
);

// --- the cart: a red body, wheels, a drilled face; a rocket tip waits in every hole --------------------------------
const COLS = 9;
const ROWS = 4;
const Cart: React.FC<{ glow: number; t: number }> = ({ glow, t }) => {
  const [cx, cy, cz] = CART;
  const holes: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const x = cx - 0.5 + (c / (COLS - 1)) * 1.0;
      const y = cy + 0.42 + (r / (ROWS - 1)) * 0.3;
      const i = r * COLS + c;
      const f = glow > 0 ? glow * (0.85 + 0.15 * Math.sin(t * 9 + i * 1.7)) : 0; // deterministic flicker, no random
      holes.push(
        <group key={i}>
          <M g={cylG(0.034, 0.034, 0.012, 28)} c="#1a1020" p={[x, y, FRONT_Z + 0.007]} r={[Math.PI / 2, 0, 0]} />
          <M g={coneG(0.022, 0.06, 18)} c="#e8402a" e="#ff4a08" ei={f * 0.75} p={[x, y, FRONT_Z + 0.018 + 0.02 * glow]} r={[Math.PI / 2, 0, 0]} />
        </group>,
      );
    }
  return (
    <group>
      <M g={boxG(1.3, 0.6, 0.8)} c="#d8323a" tex="planks" p={[cx, cy + 0.55, cz]} />
      <M g={boxG(1.34, 0.06, 0.84)} c="#ffc21a" p={[cx, cy + 0.87, cz]} />
      {[-0.5, 0.5].map((dx) =>
        [-0.42, 0.42].map((dz) => <M key={`${dx}${dz}`} g={cylG(0.24, 0.24, 0.08, 20)} c="#3a2a6a" tex="wood" p={[cx + dx * 1.18, cy + 0.24, cz + dz * 0.8]} r={[0, 0, Math.PI / 2]} />),
      )}
      {holes}
      <M g={cylG(0.02, 0.02, 0.5, 8)} c="#3a2a2a" tex="wood" p={[cx - 0.55, cy + 1.05, cz + 0.3]} />
      <Label text="82" p={[cx - 0.55, cy + 1.32, cz + 0.33]} w={0.36} h={0.26} fg="#fff6e0" bg="#2a2a8a" font={0.8} />
    </group>
  );
};

export const PopShort: React.FC<{ sub?: boolean }> = ({ sub = false }) => {
  const ready = useFonts();
  const g = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const { n, fp } = sub ? subFrame(g) : { n: g, fp: g };
  const t = fp / 30;
  const cam = camAt(t);
  // acts: pop day (hook + mockery) -> blue night (tension) -> golden (the reveal); switches hide inside fast moves
  const act = t < 4.6 ? "pop" : t < 6.9 ? "night" : "golden";
  const m = moodOf(act);
  const night = act === "night";
  const glow = clamp((t - 8.3) / 1.6) * 0.95; // rocket tips light up on "cohete", emissive < 1 so they stay orange, not cream
  const drilling = t < 2.5;
  const laugh = t > 2.6 && t < 4.6;
  const invHead = headOf(INV_P, INV.height, INV.build);
  const kidHead = headOf(KID_P, KID.height, KID.build);
  const focus: V3 = t < 2.45 ? [0.4, 0.9, -2.1] : t < 4.3 ? kidHead : t < 6.55 ? [0.5, 2.0, -4.5] : [0.55, 0.7, -2.0];
  const bob = Math.sin(t * 2 * Math.PI * 1.8); // ≤ 2 Hz
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={m} cam={cam} t={t} focus={focus} blur={t >= 4.3 && t < 6.55 ? 0.6 : 1.5} exposure={night ? -0.4 : 0}>
        <PopStreet night={night} />
        <Cart glow={glow} t={t} />
        <Character3D
          {...INV}
          position={INV_P}
          stick
          yaw={1.15}
          t={t}
          face={t > 8.6 ? { eyes: "half", mouth: "smirk", brows: "raised" } : { eyes: "squint", mouth: "flat", brows: "angry" }}
          pose={drilling ? { armL: [45, 35], armR: [55 + bob * 6, 30], armRFwd: 60, armLFwd: 55, headNod: 10 } : { armL: [12, 10], armR: [15, 12], headTilt: -4 }}
          faceCamera={cam.pos}
          faceCameraAmount={0.25}
        />
        <Character3D
          {...KID}
          position={KID_P}
          stick
          yaw={-0.7}
          t={t}
          face={laugh ? { eyes: "squint", mouth: "grin", brows: "raised" } : { eyes: "open", mouth: "smile", brows: "neutral" }}
          pose={laugh ? { armL: [30, 50], armR: [30, 50], headTilt: bob * 6, headNod: -6 } : { armL: [12, 12], armR: [12, 12] }}
          faceCamera={cam.pos}
          faceCameraAmount={0.4}
        />
        <Character3D
          {...ELD}
          position={ELD_P}
          stick
          yaw={-0.5}
          t={t}
          face={laugh ? { eyes: "closed", mouth: "grin", brows: "raised" } : { eyes: "open", mouth: "smile", brows: "neutral" }}
          pose={laugh ? { armL: [20, 70], armR: [60, 80], armRFwd: 40, headTilt: -bob * 5, headNod: -8 } : { armL: [10, 10], armR: [10, 10] }}
          faceCamera={cam.pos}
          faceCameraAmount={0.4}
        />
        <CastLight at={t >= 2.45 && t < 4.3 ? kidHead : invHead} cam={cam.pos} mood={m} />
      </View>
      <Captions chunks={CHUNKS} t={n / 30} accent={ACCENT} accentColor="#ffd21a" />
    </AbsoluteFill>
  );
};
