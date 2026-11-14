// Prueba de 5 s: Félix Insólito da la noticia en su plató.
// Guion: "Última hora: el rey de la inteligencia artificial acaba de renunciar."
// Tiempos ESTIMADOS (voz pendiente): se ajustan con vo_timing.py cuando exista la locución real.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Character3D, headOf } from "../inkbeat/char/Character3D";
import { FELIX } from "../inkbeat/char/stickmanCast";
import { Captions, makeChunks } from "../inkbeat/core/captions";
import type { Word } from "../inkbeat/core/captions";
import { CastLight } from "../inkbeat/core/castLight";
import { subFrame, useFonts } from "../inkbeat/core/frame";
import { boxG, coneG, cylG, sphG, Label, M } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { Planter } from "../demo/Street";

export const FELIX_PRUEBA_FRAMES = 150; // 5.0 s

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const mix = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];

// --- locución (estimada) -------------------------------------------------------------------------------------------
const PHRASES: [number, number, string][] = [
  [0.15, 1.05, "última hora:"],
  [1.3, 3.25, "el rey de la inteligencia artificial"],
  [3.4, 4.3, "acaba de renunciar."],
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
const CHUNKS = makeChunks(WORDS, 5.0);
const ACCENT = new Set(["renunciar"]);

// --- Félix Insólito: el personaje del canal (inkbeat/char/stickmanCast.ts) ---
const FX: V3 = [0, 0, -2.0];

// --- cámara: un recorrido continuo de movimientos --------------------------------------------------------------------
type Key = { t: number; dur: number; cam: Cam };
const K0: Cam = { pos: [0.35, 1.95, 2.3], look: [0, 1.38, -2.0], fov: 40 };
const CHIP: V3 = [1.75, 0, -2.7];
const KEYS: Key[] = [
  { t: 0.0, dur: 1.0, cam: { pos: [0.25, 1.95, 1.45], look: [0, 1.4, -2.0], fov: 40 } }, // empuje sobre Félix: "última hora"
  { t: 1.2, dur: 0.6, cam: { pos: [1.25, 1.45, -0.7], look: [1.75, 1.0, -2.7], fov: 46, roll: 0.03 } }, // barrido al chip coronado
  { t: 2.75, dur: 0.75, cam: { pos: [0.12, 1.95, 0.6], look: [0, 1.3, -2.0], fov: 38 } }, // vuelta: primer plano de Félix
  { t: 4.35, dur: 0.6, cam: { pos: [0.2, 1.95, 1.1], look: [0.15, 1.32, -2.0], fov: 40 } }, // pequeño retroceso al final
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
  const dt = Math.max(0, t - held);
  return { ...c, pos: mix(c.pos, c.look, Math.min(0.15, 0.03 * dt)) };
};

// --- plató: color en la pintura del set ------------------------------------------------------------------------------
const Studio: React.FC<{ t: number }> = ({ t }) => {
  const blink = 0.45 + 0.25 * (Math.sin(t * Math.PI * 2 * 1.2) > 0 ? 1 : 0); // ≤ 2 Hz
  return (
    <group>
      <M g={boxG(20, 0.2, 20)} c="#6a58c8" tex="stone" ts={1.5} p={[0, -0.1, 0]} cast={false} />
      {/* pared del fondo cobalto con paneles turquesa */}
      <M g={boxG(14, 6, 0.2)} c="#2f6fe8" tex="plaster" p={[0, 3, -4.2]} cast={false} />
      {[-2.6, 2.6].map((x) => (
        <M key={x} g={boxG(1.4, 3.2, 0.06)} c="#16b39a" tex="planks" p={[x, 2.0, -4.07]} />
      ))}
      {/* pantalla grande detrás de Félix */}
      <M g={boxG(2.6, 1.5, 0.1)} c="#14102a" p={[-0.2, 2.45, -4.05]} />
      <M g={boxG(2.4, 1.3, 0.02)} c="#c42a1a" e="#d8300a" ei={0.3} p={[-0.2, 2.45, -3.99]} />
      <Label text="ÚLTIMA HORA" p={[-0.2, 2.45, -3.97]} w={2.2} h={0.5} fg="#fff6e0" bg="none" font={0.62} />
      {/* mesa de noticias */}
      <M g={boxG(2.4, 0.7, 0.7)} c="#e8402a" tex="wood" p={[0, 0.35, -1.45]} />
      <M g={boxG(2.5, 0.06, 0.8)} c="#ffc21a" p={[0, 0.73, -1.45]} />
      <Label text="NOTICIAS INSÓLITAS" p={[0, 0.4, -1.09]} w={1.9} h={0.32} fg="#fff6e0" bg="#2a2a8a" font={0.55} />
      {/* utilería de la mesa */}
      <M g={boxG(0.32, 0.012, 0.22)} c="#f4ead6" tex="paper" p={[-0.35, 0.767, -1.5]} r={[0, 0.2, 0]} />
      <M g={boxG(0.3, 0.012, 0.21)} c="#fdf6e6" tex="paper" p={[-0.32, 0.78, -1.48]} r={[0, -0.1, 0]} />
      <M g={cylG(0.05, 0.045, 0.11, 16)} c="#16b39a" p={[0.75, 0.815, -1.55]} />
      <M g={cylG(0.012, 0.012, 0.22, 8)} c="#2a2232" p={[0.35, 0.87, -1.4]} />
      <M g={sphG(0.04, 14)} c="#2a2232" p={[0.35, 0.99, -1.4]} />
      {/* luz roja "EN DIRECTO" */}
      <M g={sphG(0.06, 14)} c="#e8402a" e="#ff2a10" ei={blink} p={[-1.0, 0.83, -1.5]} />
      {/* focos del plató */}
      {[-2.2, 2.4].map((x) => (
        <group key={x}>
          <M g={cylG(0.03, 0.03, 2.0, 8)} c="#2a2232" p={[x, 1.0, -0.9]} />
          <M g={cylG(0.16, 0.12, 0.28, 16)} c="#2a2232" p={[x, 2.05, -0.9]} r={[0.5, 0, 0]} />
          <M g={cylG(0.13, 0.13, 0.01, 16)} c="#ffd27a" e="#ffb84a" ei={0.7} p={[x, 2.0, -0.98]} r={[0.5 + Math.PI / 2, 0, 0]} />
        </group>
      ))}
      <Planter p={[-1.9, 0, -3.3]} />
      <Planter p={[3.2, 0, -3.4]} />
    </group>
  );
};

// --- el chip coronado: el "rey de la IA" (sin marcas) ------------------------------------------------------------------
const CrownedChip: React.FC<{ t: number }> = ({ t }) => {
  const [x, , z] = CHIP;
  const spin = 0.35 * Math.sin(t * 0.9);
  const pins: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    const o = -0.27 + i * 0.09;
    pins.push(<M key={`a${i}`} g={boxG(0.035, 0.02, 0.1)} c="#ffc21a" p={[o, 0, 0.36]} />);
    pins.push(<M key={`b${i}`} g={boxG(0.035, 0.02, 0.1)} c="#ffc21a" p={[o, 0, -0.36]} />);
    pins.push(<M key={`c${i}`} g={boxG(0.1, 0.02, 0.035)} c="#ffc21a" p={[0.36, 0, o]} />);
    pins.push(<M key={`d${i}`} g={boxG(0.1, 0.02, 0.035)} c="#ffc21a" p={[-0.36, 0, o]} />);
  }
  const points = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2;
    return <M key={i} g={coneG(0.045, 0.14, 10)} c="#ffc21a" p={[Math.cos(a) * 0.17, 0.12, Math.sin(a) * 0.17]} />;
  });
  return (
    <group>
      {/* pedestal */}
      <M g={cylG(0.32, 0.38, 1.0, 24)} c="#ffc21a" tex="plaster" p={[x, 0.5, z]} />
      <M g={cylG(0.4, 0.4, 0.06, 24)} c="#e8402a" p={[x, 1.03, z]} />
      <group position={[x, 1.25, z]} rotation={[0.35, spin, 0]}>
        <M g={boxG(0.62, 0.07, 0.62)} c="#1d2a3a" tex="metal" />
        <M g={boxG(0.34, 0.03, 0.34)} c="#9aa6b8" tex="metal" p={[0, 0.045, 0]} />
        {pins}
        {/* corona */}
        <group position={[0, 0.1, 0]}>
          <M g={cylG(0.2, 0.2, 0.1, 24, true)} c="#ffc21a" tex="metal" p={[0, 0.05, 0]} />
          {points}
          <M g={sphG(0.03, 10)} c="#e8402a" e="#ff2a10" ei={0.4} p={[0, 0.06, 0.2]} />
        </group>
      </group>
    </group>
  );
};

export const FelixPrueba: React.FC<{ sub?: boolean }> = ({ sub = false }) => {
  const ready = useFonts();
  const g = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const { n, fp } = sub ? subFrame(g) : { n: g, fp: g };
  const t = fp / 30;
  const cam = camAt(t);
  const m = moodOf("pop");
  const head = headOf(FX, FELIX.height, FELIX.build);
  const talk = (t > 0.15 && t < 1.05) || (t > 1.3 && t < 3.25) || (t > 3.4 && t < 4.3);
  const mouthOpen = talk && Math.sin(t * Math.PI * 2 * 1.9) > -0.2; // ≤ 2 Hz
  const pointing = t > 1.1 && t < 3.0;
  const shock = t > 3.6;
  const focus: V3 = t > 1.25 && t < 2.95 ? [CHIP[0], 1.3, CHIP[2]] : head;
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={m} cam={cam} t={t} focus={focus} blur={1.4} sky={false} exposure={-0.35}>
        <Studio t={t} />
        <CrownedChip t={t} />
        <Character3D
          {...FELIX}
          position={FX}
          t={t}
          face={
            shock
              ? { eyes: "wide", mouth: "o", brows: "raised" }
              : pointing
                ? { eyes: "half", mouth: mouthOpen ? "open" : "smirk", brows: "raised", look: 0.6 }
                : { eyes: "half", mouth: mouthOpen ? "open" : "flat", brows: "neutral" }
          }
          pose={
            pointing
              ? { armR: [70, 10], armRFwd: 25, armL: [25, 70], armLFwd: 55, headTilt: -4, headYaw: -12 }
              : shock
                ? { armL: [40, 95], armR: [40, 95], armLFwd: 70, armRFwd: 70, headNod: -5 }
                : { armL: [25, 70], armR: [25, 70], armLFwd: 55, armRFwd: 55, headNod: Math.sin(t * 3) * 3 }
          }
          faceCamera={cam.pos}
          faceCameraAmount={0.3}
        />
        <CastLight at={head} cam={cam.pos} mood={m} />
      </View>
      <Captions chunks={CHUNKS} t={n / 30} accent={ACCENT} accentColor="#ffd21a" />
    </AbsoluteFill>
  );
};
