// Demo: una imagen fija (GPT Image) animada solo con Remotion, sin créditos de vídeo.
// Empuje de cámara lento hacia la cara, deriva suave, barrido de luz, rótulo del gancho y subtítulos.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions, makeChunks } from "../inkbeat/core/captions";
import type { Word } from "../inkbeat/core/captions";
import { useFonts } from "../inkbeat/core/frame";

export const IMAGEN_ANIMADA_FRAMES = 180; // 6 s

const PHRASES: [number, number, string][] = [
  [0.3, 1.9, "este hombre fregaba platos."],
  [2.2, 5.4, "construyó la empresa de la que depende toda la inteligencia artificial."],
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
const CHUNKS = makeChunks(WORDS, 6);
const ACCENT = new Set(["platos", "inteligencia"]);

export const ImagenAnimada: React.FC = () => {
  const ready = useFonts();
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = f / fps;
  if (!ready) return <AbsoluteFill style={{ background: "#000" }} />;

  // cámara: empuje lento hacia la cara (arriba) con una deriva mínima, nunca quieta
  const ease = Easing.bezier(0.45, 0, 0.25, 1);
  const zoom = interpolate(f, [0, 180], [1.0, 1.16], { easing: ease });
  const panY = interpolate(f, [0, 180], [0, 140], { easing: ease }); // sube hacia la cara
  const driftX = Math.sin(t * 0.9) * 6;
  const driftY = Math.cos(t * 0.7) * 4;

  // barrido de luz por el plató (1,2–3,4 s)
  const sweep = interpolate(t, [1.2, 3.4], [-0.6, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // rótulo del gancho
  const tagIn = interpolate(t, [3.8, 4.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const fadeIn = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: fadeIn, transform: `translate(${driftX}px, ${panY + driftY}px) scale(${zoom})`, transformOrigin: "50% 28%" }}>
        <Img src={staticFile("ep01/felix-ia-2.png")} style={{ width, height, objectFit: "cover" }} />
      </AbsoluteFill>
      {/* barrido de luz suave */}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          background: `linear-gradient(110deg, transparent ${(sweep - 0.25) * 100}%, rgba(255,236,200,0.22) ${sweep * 100}%, transparent ${(sweep + 0.25) * 100}%)`,
        }}
      />
      {/* viñeta */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
      {/* gancho textual */}
      <div
        style={{
          position: "absolute",
          top: height * 0.06,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: tagIn,
          transform: `scale(${0.7 + 0.3 * tagIn})`,
        }}
      >
        <span
          style={{
            fontFamily: "Panchang, Poppins, sans-serif",
            fontWeight: 800,
            fontSize: 96,
            color: "#ffd21a",
            WebkitTextStroke: "14px #120a10",
            paintOrder: "stroke fill",
            letterSpacing: "0.04em",
            textShadow: "0 8px 18px rgba(0,0,0,0.55)",
          }}
        >
          33 AÑOS
        </span>
      </div>
      <Captions chunks={CHUNKS} t={t} accent={ACCENT} accentColor="#ffd21a" />
    </AbsoluteFill>
  );
};
