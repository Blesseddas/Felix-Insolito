import React from "react";
import { Composition } from "remotion";
import { Demo, DEMO_MOODS } from "./demo/Demo";
import { DemoCast } from "./demo/DemoCast";
import { DemoMove, MOVE_FRAMES } from "./demo/DemoMove";
import { SUB } from "./inkbeat/core/frame";
import { Prueba, PRUEBA_FRAMES } from "./demo/Prueba";
import { PopDemo } from "./demo/PopDemo";
import { PopShort, POP_FRAMES } from "./demo/PopShort";
import { FelixPrueba, FELIX_PRUEBA_FRAMES } from "./felix/FelixPrueba";
import { Turnaround } from "./felix/Turnaround";
import { ImagenAnimada, IMAGEN_ANIMADA_FRAMES } from "./felix/ImagenAnimada";

// DemoHero: a low hero framing with foreground props. Demo: one still. Demo-<mood>: the same frame in each act light. DemoWide: the whole set.
// DemoCast: the three example characters in a row (a landscape family sheet).
// DemoMove: a 3 s beat-rig move (sharp). DemoMoveSub: the same at SUB × fps for motion blur (average with ffmpeg tmix).
export const Root: React.FC = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "day", wide: false }} />
    <Composition id="DemoHero" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "dusk", wide: false, hero: true }} />
    <Composition id="DemoWide" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "day", wide: true }} />
    {DEMO_MOODS.map((m) => (
      <Composition key={m} id={`Demo-${m}`} component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: m, wide: false }} />
    ))}
    <Composition id="DemoCast" component={DemoCast} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ mood: "day" }} />
    <Composition id="DemoMove" component={DemoMove} durationInFrames={MOVE_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ sub: false }} />
    <Composition id="PopShort" component={PopShort} durationInFrames={POP_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ sub: false }} />
    <Composition id="PopShortSub" component={PopShort} durationInFrames={POP_FRAMES * SUB} fps={30 * SUB} width={1080} height={1920} defaultProps={{ sub: true }} />
    <Composition id="PopDemo"component={PopDemo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ base: false }} />
    <Composition id="PopBase" component={PopDemo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ base: true }} />
    <Composition id="Prueba"component={Prueba} durationInFrames={PRUEBA_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ sub: false }} />
    <Composition id="PruebaSub" component={Prueba} durationInFrames={PRUEBA_FRAMES * SUB} fps={30 * SUB} width={1080} height={1920} defaultProps={{ sub: true }} />
    <Composition id="DemoMoveSub" component={DemoMove} durationInFrames={MOVE_FRAMES * SUB} fps={30 * SUB} width={1080} height={1920} defaultProps={{ sub: true }} />
    <Composition id="FelixPrueba" component={FelixPrueba} durationInFrames={FELIX_PRUEBA_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ sub: false }} />
    <Composition id="FelixPruebaSub" component={FelixPrueba} durationInFrames={FELIX_PRUEBA_FRAMES * SUB} fps={30 * SUB} width={1080} height={1920} defaultProps={{ sub: true }} />
    <Composition id="SheetFelix" component={Turnaround} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ who: "felix" as const, heads: false }} />
    <Composition id="SheetFelixHeads" component={Turnaround} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ who: "felix" as const, heads: true }} />
    <Composition id="SheetJensen" component={Turnaround} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ who: "jensen" as const, heads: false }} />
    <Composition id="SheetJensenHeads" component={Turnaround} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ who: "jensen" as const, heads: true }} />
    <Composition id="ImagenAnimada" component={ImagenAnimada} durationInFrames={IMAGEN_ANIMADA_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
