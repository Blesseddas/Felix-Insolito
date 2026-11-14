// Prueba de 10 s: varios planos + un plano secuencia complejo (órbita + grúa + push).
// 1) 0.0–2.2  gran angular alto con grúa abajo (establece la calle)
// 2) 2.2–3.6  travelling bajo acompañando al adulto que camina
// 3) 3.6–4.8  primer plano del niño (sorpresa) con push
// 4) 4.8–5.8  detalle del letrero BAKERY y tilt abajo hasta la abuela
// 5) 5.8–10   plano secuencia: órbita de 140° alrededor del grupo, sube en grúa, baja, y abre al final
// Todo es función pura del tiempo (sin Math.random / Date), como pide la skill.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CAST } from "../inkbeat/char/cast";
import { Character3D, headOf } from "../inkbeat/char/Character3D";
import { Captions, makeChunks } from "../inkbeat/core/captions";
import type { Word } from "../inkbeat/core/captions";
import { CastLight } from "../inkbeat/core/castLight";
import { subFrame, useFonts } from "../inkbeat/core/frame";
import { Label } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import type { Cam } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { Crate, Street } from "./Street";

export const PRUEBA_FRAMES = 300;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const mix = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const lerpCam = (a: Cam, b: Cam, u: number): Cam => ({ pos: mix(a.pos, b.pos, u), look: mix(a.look, b.look, u), fov: a.fov + (b.fov - a.fov) * u, roll: (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * u });

// --- reparto -------------------------------------------------------------------------------------------------
const Y = 0.16; // altura de la acera
const ADULT = CAST.adult;
const KID = CAST.kid;
const ELDER = CAST.elder;
const KID_P: V3 = [1.3, Y, -2.5];
const ELDER_P: V3 = [2.3, Y, -4.5];
// el adulto camina de x = -3.2 a x = 0.1 entre t = 0 y t = 3.6, luego se para y saluda
const WALK_END = 3.6;
const adultX = (t: number) => -3.2 + 3.3 * ease(clamp(t / WALK_END));
const adultP = (t: number): V3 => [adultX(t), Y, -2.7];
const KID_HEAD = headOf(KID_P, KID.height, KID.build);
const ELDER_HEAD = headOf(ELDER_P, ELDER.height, ELDER.build);

// --- cámara --------------------------------------------------------------------------------------------------
const camAt = (t: number): Cam => {
  if (t < 2.2) {
    // 1) grúa abajo desde un gran angular alto
    const u = ease(clamp(t / 2.2));
    const a = aim([4.6, 6.2, 6.8], [0.2, 1.2, -3.4], 56, 0.42);
    const b = aim([3.0, 2.4, 4.4], [-0.6, 1.3, -3.0], 52, 0.4);
    return lerpCam(a, b, u);
  }
  if (t < 3.6) {
    // 2) travelling bajo lateral que acompaña al adulto (cámara a la altura de la cadera)
    const ax = adultX(t);
    const head = headOf(adultP(t), ADULT.height, ADULT.build);
    const u = (t - 2.2) / 1.4;
    return aim([ax + 1.6 - 0.4 * u, 0.62, -0.3 - 0.25 * u], head, 54, 0.33);
  }
  if (t < 4.8) {
    // 3) primer plano del niño con push (3%/s + punch en la sorpresa)
    const u = ease(clamp((t - 3.6) / 0.5));
    const from: V3 = [KID_P[0] - 1.6, 1.15, KID_P[2] + 1.6];
    const to: V3 = [KID_P[0] - 1.05, 1.08, KID_P[2] + 1.05];
    const drift = (t - 4.1) > 0 ? (t - 4.1) * 0.03 : 0;
    return aim(mix(mix(from, to, u), KID_HEAD, drift), KID_HEAD, 42, 0.38);
  }
  if (t < 5.8) {
    // 4) detalle del letrero y tilt abajo hasta la abuela
    const u = ease(clamp((t - 4.8) / 1.0));
    // cámara alejada (z = 0.6) y poca subida/bajada: el tilt barre menos pantalla y no hace fantasmas
    const pos: V3 = [1.9 + 0.2 * u, 2.7 - 0.7 * u, 0.6];
    const look = mix([1.8, 3.7, -5.05], ELDER_HEAD, u);
    return { pos, look, fov: 44 - 4 * u, roll: 0 };
  }
  // 5) plano secuencia complejo: órbita alrededor del centro del grupo + grúa + cambio de lente
  const s = clamp((t - 5.8) / 4.2);
  const e = ease(s);
  const C: V3 = [0.9, 1.2, -3.0];
  const ang = ((-70 + 140 * e) * Math.PI) / 180; // de -70° a +70° (siempre por delante de las casas)
  const r = 4.0 - 1.1 * Math.sin(Math.PI * s) + 1.6 * clamp((s - 0.75) / 0.25) ** 2; // se acerca y al final abre
  const h = 0.7 + 2.4 * Math.sin(Math.PI * s) + 1.2 * clamp((s - 0.7) / 0.3); // sube en grúa y queda alto
  const pos: V3 = [C[0] + Math.sin(ang) * r, h, C[2] + Math.cos(ang) * r];
  const look: V3 = [C[0] + 0.3 * Math.sin(ang), C[1] + 0.25 * Math.sin(Math.PI * s), C[2]];
  const roll = -4 * Math.sin(Math.PI * 2 * s); // pequeño roll dentro de la órbita
  return { pos, look, fov: 50 + 8 * s, roll };
};

// --- subtítulos (sin voz: es una prueba, palabras temporizadas a mano sobre los planos) -----------------------
const WORDS: Word[] = [
  ["una", 0.3, 0.6], ["prueba", 0.62, 1.2],
  ["de", 2.25, 2.4], ["cámara", 2.42, 3.0],
  ["¿y", 3.65, 3.85], ["eso?", 3.87, 4.4],
  ["la", 4.85, 5.0], ["panadería", 5.02, 5.7],
  ["plano", 6.0, 6.5], ["secuencia", 6.55, 7.3],
  ["listo.", 8.6, 9.2],
];
const CHUNKS = makeChunks(WORDS, 9.9);

export const Prueba: React.FC<{ sub?: boolean }> = ({ sub = false }) => {
  const ready = useFonts();
  const g = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const { n, fp } = sub ? subFrame(g) : { n: g, fp: g };
  const t = fp / 30;
  const cam = camAt(t);
  // la luz sigue a los actos: tarde dorada y al final el atardecer
  const m = moodOf(t < 5.8 ? "golden" : "dusk");
  const aP = adultP(t);
  const aHead = headOf(aP, ADULT.height, ADULT.build);
  const walking = t < WALK_END;
  const focus: V3 = t < 2.2 ? aHead : t < 3.6 ? aHead : t < 4.8 ? KID_HEAD : t < 5.8 ? ELDER_HEAD : [0.9, 1.3, -3.0];
  const surprised = t > 3.75;
  const wave = !walking ? Math.sin((t - WALK_END) * 2 * Math.PI * 1.2) * 14 : 0; // ≤ 2 Hz
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={m} cam={cam} t={t} focus={focus} blur={t < 2.2 ? 0.6 : t >= 5.8 ? 0.8 : 1.6}>
        <Street lamp={t >= 5.8 ? 1 : 0} />
        {/* etiqueta para ver sin sonido */}
        <Label text="PRUEBA 01" p={[3.6, 0.5, -4.27]} w={0.55} h={0.2} fg="#f4ead6" bg="#c83a3a" font={0.55} />
        <Crate p={[-2.0, 0.16, -1.6]} s={0.4} yaw={0.7} />
        <Character3D
          {...ADULT}
          position={aP}
          yaw={walking ? Math.PI / 2 : 0.6}
          t={t}
          face={{ eyes: "open", mouth: walking ? "smile" : "open", brows: "raised" }}
          pose={walking ? { walk: t * 2 * Math.PI * 1.6 } : { armL: [10, 10], armR: [70 + wave, 70], armRFwd: 20, headTilt: -5 }}
          faceCamera={cam.pos}
          faceCameraAmount={walking ? 0 : 0.35}
        />
        <Character3D
          {...KID}
          position={KID_P}
          yaw={-1.2}
          t={t}
          face={{ eyes: surprised ? "wide" : "open", mouth: surprised ? "o" : "smile", brows: "raised" }}
          pose={{ armL: [surprised ? 40 : 12, 20], armR: [surprised ? 40 : 12, 20], headTilt: surprised ? 6 : 0 }}
          faceCamera={cam.pos}
          faceCameraAmount={t >= 5.8 ? 0.75 : 0.3}
        />
        <Character3D
          {...ELDER}
          position={ELDER_P}
          yaw={0.2}
          t={t}
          face={{ mouth: "smile", brows: "raised" }}
          pose={{ armL: [8, 8], armR: [18, 92], armRFwd: 62 }}
          hold="mug"
          faceCamera={cam.pos}
          faceCameraAmount={0.3}
        />
        <CastLight at={t >= 3.6 && t < 4.8 ? KID_HEAD : t >= 4.8 && t < 5.8 ? ELDER_HEAD : aHead} cam={cam.pos} mood={m} />
      </View>
      <Captions chunks={CHUNKS} t={n / 30} accent={new Set(["secuencia"])} />
    </AbsoluteFill>
  );
};
