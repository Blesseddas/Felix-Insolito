// Prueba de montaje de 10 s, todo en código (sin créditos): P01 → P02 → entrar en la pantalla → P03.
// Clips del piloto (Kling v3, ya generados) + transición por la pantalla del plató + subtítulos + sonido sintetizado.
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions, makeChunks } from "../inkbeat/core/captions";
import type { Word } from "../inkbeat/core/captions";
import { useFonts } from "../inkbeat/core/frame";

export const PRUEBA_MONTAJE_FRAMES = 300; // 10 s a 30 fps

// tiempos (s)
const T_P02 = 3.5;
const T_ZOOM = 6.0; // empieza el empuje hacia la pantalla
const T_P03 = 6.85; // entra el recuerdo (la pantalla ya llena el cuadro)
const SCREEN = { x: 870, y: 560 }; // centro de la pantalla del plató en 1080×1920

const PHRASES: [number, number, string][] = [
  [0.3, 2.0, "este hombre fregaba platos."],
  [2.2, 6.2, "construyó la empresa de la que depende toda la inteligencia artificial…"],
  [7.2, 9.8, "de adolescente, friega platos y limpia baños."],
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
const CHUNKS = makeChunks(WORDS, 10);
const ACCENT = new Set(["platos", "inteligencia", "baños"]);

const Clip: React.FC<{ src: string; scale?: number; origin?: string; tx?: number; ty?: number; style?: React.CSSProperties }> = ({ src, scale = 1, origin = "50% 50%", tx = 0, ty = 0, style }) => (
  <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: origin, ...style }}>
    <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

export const PruebaMontaje10s: React.FC = () => {
  const ready = useFonts();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (!ready) return <AbsoluteFill style={{ background: "#000" }} />;

  // P01: empuje muy suave
  const p01Scale = interpolate(t, [0, T_P02], [1.0, 1.06], { extrapolateRight: "clamp" });
  // P02: deriva suave y, al final, empuje rápido hacia la pantalla del plató
  const drift = interpolate(t, [T_P02, T_ZOOM], [1.0, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zk = interpolate(t, [T_ZOOM, T_P03], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const zoom = 1 + 2.1 * zk; // hasta 3.1×: solo se ve la pantalla
  const panX = (540 - SCREEN.x) * zk; // lleva el centro de la pantalla al centro del cuadro
  const panY = (960 - SCREEN.y) * zk;
  // P03: nace "dentro" de la pantalla (aún ampliado) y se asienta
  const p03In = interpolate(t, [T_P03, T_P03 + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p03Scale = interpolate(t, [T_P03, T_P03 + 0.7], [1.18, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // destello de pantalla y líneas de TV en el paso
  const flash = interpolate(t, [T_P03 - 0.2, T_P03, T_P03 + 0.3], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scan = interpolate(t, [T_P03 - 0.3, T_P03, T_P03 + 0.45], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeIn = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={Math.round(T_P02 * fps)}>
        <Clip src="ep01/clips/ep01-p01.mp4" scale={p01Scale} origin="50% 30%" style={{ opacity: fadeIn }} />
      </Sequence>
      <Sequence from={Math.round(T_P02 * fps)} durationInFrames={Math.round((T_P03 + 0.3 - T_P02) * fps)}>
        <Clip src="ep01/clips/ep01-p02.mp4" scale={drift * zoom} tx={panX} ty={panY} origin={`${(SCREEN.x / 1080) * 100}% ${(SCREEN.y / 1920) * 100}%`} />
      </Sequence>
      <Sequence from={Math.round(T_P03 * fps)}>
        <Clip src="ep01/clips/ep01-p03.mp4" scale={p03Scale} style={{ opacity: p03In }} />
      </Sequence>
      {/* paso por la pantalla: brillo rojo del televisor y líneas de barrido */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,235,220,1) 0%, rgba(255,80,60,0.6) 45%, rgba(0,0,0,0) 80%)", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ opacity: scan * 0.35, backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 2px, transparent 2px, transparent 6px)" }} />
      <Captions chunks={CHUNKS} t={t} accent={ACCENT} accentColor="#ffd21a" />
      <Audio src={staticFile("ep01/audio/prueba-10s.wav")} />
    </AbsoluteFill>
  );
};
