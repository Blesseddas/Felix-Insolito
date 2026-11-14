// Turnaround sheet (16:9): one stickman premium character in five views — front, 3/4 front, right profile, back,
// 3/4 back — plus a head row of expressions, on chroma green, to compare against its character sheet.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Character3D, headOf } from "../inkbeat/char/Character3D";
import type { FaceState } from "../inkbeat/char/Character3D";
import { STICKMAN_CAST } from "../inkbeat/char/stickmanCast";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";

const VIEWS = [0, 0.7, Math.PI / 2, Math.PI, -2.4];
const FACES: FaceState[] = [
  { eyes: "half", mouth: "flat", brows: "neutral" },
  { eyes: "closed", mouth: "grin", brows: "raised" },
  { eyes: "wide", mouth: "o", brows: "raised" },
  { eyes: "squint", mouth: "smirk", brows: "angry" },
];

export const Turnaround: React.FC<{ who: keyof typeof STICKMAN_CAST; heads?: boolean }> = ({ who, heads = false }) => {
  const ready = useFonts();
  useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#00ff00" }} />;
  const c = STICKMAN_CAST[who];
  const m = moodOf("day");
  const t = 1.0;
  const cam = heads ? aim([0, 1.45, 5.2], [0, 1.4, 0], 24, 0.5) : aim([0, 1.05, 9.5], [0, 1.0, 0], 26, 0.5);
  return (
    <AbsoluteFill style={{ background: "#00ff00" }}>
      <View mood={m} cam={cam} t={t} focus={[0, 1.2, 0]} blur={0.2} width={1920} height={1080} sky={false}>
        {heads
          ? FACES.map((f, i) => {
              const p: V3 = [(i - 1.5) * 1.15, 0, 0];
              return <Character3D key={i} {...c} position={p} yaw={0.25 - i * 0.12} t={t} face={{ ...f, blink: false }} pose={{ armL: [10, 10], armR: [10, 10] }} />;
            })
          : VIEWS.map((y, i) => {
              const p: V3 = [(i - 2) * 1.35, 0, 0];
              return <Character3D key={i} {...c} position={p} yaw={y} t={t} face={{ eyes: "half", mouth: "flat", brows: "neutral", blink: false }} pose={{ armL: [12, 12], armR: [12, 12] }} />;
            })}
        <CastLight at={headOf([0, 0, 0], c.height, c.build)} cam={cam.pos} mood={m} />
      </View>
    </AbsoluteFill>
  );
};
