// PopDemo: look-dev for the feed. Same street, the "pop" mood, a bigger-headed character (1.45×) framed so the face
// fills ~40% of the frame width, an expressive face, and an in-world tag. `base` renders the original look to compare.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CAST } from "../inkbeat/char/cast";
import { Character3D, headOf } from "../inkbeat/char/Character3D";
import { Captions, makeChunks } from "../inkbeat/core/captions";
import type { Word } from "../inkbeat/core/captions";
import { CastLight } from "../inkbeat/core/castLight";
import { useFonts } from "../inkbeat/core/frame";
import { Label } from "../inkbeat/core/kit";
import { moodOf } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { Street } from "./Street";

const P: V3 = [0.2, 0.16, -2.6];
const WORDS: Word[] = [["ochenta", 0, 0.4], ["y", 0.42, 0.5], ["dos", 0.52, 0.9]];
const CHUNKS = makeChunks(WORDS, 2);

export const PopDemo: React.FC<{ base?: boolean }> = ({ base = false }) => {
  const ready = useFonts();
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#1a1220" }} />;
  const t = 0.8 + f / 30;
  const spec = CAST.adult;
  const build = base ? spec.build : { ...spec.build, headScale: 1.45, limb: 1.1, hand: 1.25 };
  const head = headOf(P, spec.height, build);
  const cam = base ? aim([1.6, 1.55, 1.9], head, 46, 0.38) : aim([P[0] + 1.25, 0.75, P[2] + 2.6], [head[0], head[1] + 0.35, head[2]], 50, 0.42); // low lens: sky + awning behind the head
  const m = moodOf(base ? "day" : "pop");
  return (
    <AbsoluteFill style={{ background: "#1a1220" }}>
      <View mood={m} cam={cam} t={t} focus={head} blur={1.6}>
        <Street shopSign={base ? "BAKERY" : "PANADERÍA"} />
        {!base ? <Label text="82" p={[-0.75, 1.25, -2.5]} r={[0, 0.5, 0]} w={0.42} h={0.3} fg="#fff6e0" bg="#d8323a" font={0.8} /> : null}
        <Character3D
          {...spec}
          build={build}
          position={P}
          yaw={0.45}
          t={t}
          face={base ? { eyes: "open", mouth: "smile", brows: "raised", look: 0.2 } : { eyes: "wide", mouth: "o", brows: "raised", look: 0.35, sweat: true }}
          pose={base ? { armL: [10, 10], armR: [62, 72], armRFwd: 34, headTilt: -4 } : { armL: [55, 40], armR: [55, 40], armRFwd: 25, armLFwd: 25, headTilt: 8 }}
          faceCamera={cam.pos}
        />
        <CastLight at={head} cam={cam.pos} mood={m} />
      </View>
      <Captions chunks={CHUNKS} t={0.6} accent={base ? new Set() : new Set(["ochenta"])} />
    </AbsoluteFill>
  );
};
