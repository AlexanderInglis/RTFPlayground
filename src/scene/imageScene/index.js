import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Loader, Stats, Text } from "@react-three/drei";
import {
  Physics,
  useBox,
  usePlane,
  useSphere,
  useCompoundBody,
  Debug,
} from "@react-three/cannon";
import { Canvas, useFrame, useThree, createPortal } from "react-three-fiber";
import {
  EffectComposer,
  Noise,
  ChromaticAberration,
  ScrollControls,
  Scroll,
  useScroll,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Shadow, useTexture, Line, meshBounds } from "@react-three/drei";
import Plane from "./components/Plane";
import state from "./store";
import { Block, useBlock } from "./blocks";
import Effects from "./components/Effects";

function HeadsUpDisplay({ children }) {
  const [scene] = useState(() => new THREE.Scene());
  const { gl, camera } = useThree();
  useFrame(
    () => ((gl.autoClear = false), gl.clearDepth(), gl.render(scene, camera)),
    2
  );
  return createPortal(children, scene);
}

//CUSTOM MATERIALS

//CUSTOM SHAPES

function Image({ img, index }) {
  const ref = useRef();
  const { contentMaxWidth: w, viewportWidth, offsetFactor } = useBlock();
  useFrame(() => {
    const scrollOffset =
      state.top.current / (viewportWidth * state.pages - viewportWidth) +
      1 / state.pages / 2;
    const scale =
      1 -
      (offsetFactor - scrollOffset) * (offsetFactor > scrollOffset ? 1 : -1);
    ref.current.scale.setScalar(scale);
  });
  return (
    <group ref={ref}>
      {/* <EffectComposer>
        <ChromaticAberration offset={[offsetFactor / 9000, -w / 990]} />
        <Noise opacity={1} premultiply blendFunction={BlendFunction.ADD} />
      </EffectComposer> */}

      <Plane
        map={img}
        args={[1, 1, 32, 32]}
        shift={100}
        aspect={1.5}
        scale={[w, w / 1.5, 1]}
        frustumCulled={false}
      />
      <Text
        anchorX="left"
        position={[-w / 2, -w / 1.4 / 2 - 0.25, 0]}
        scale={5}
        color="red"
      >
        0{index}
      </Text>
    </group>
  );
}

function Content() {
  const images = useTexture(["/01.jpg", "/02.jpg", "/03.jpg"]);
  const onScroll = (e) => (state.top.current = e.target.scrollLeft);

  return images.map((img, index) => (
    <Block key={index} factor={1} offset={index}>
      <Image key={index} index={index} img={img} />
    </Block>
  ));
}

//SCENE

export default function ImageScene() {
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollLeft);

  useEffect(
    () => void onScroll({ target: (state.ref = scrollArea.current) }),
    []
  );
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 95 }}
        shadows
        dpr={window.devicePixelRatio}
      >
        <Suspense fallback={null}>
          {/* <Effects> */}
          <color attach="background" args={["#010101"]} />
          {/* <fog attach="fog" args={["#96c0ff", 0, 40]} /> */}
          {/* <ambientLight intensity={0.1} /> */}
          {/* <EffectComposer>
            <ChromaticAberration offset={[0.001, 0.001]} />
            <Noise opacity={1} premultiply blendFunction={BlendFunction.ADD} />
          </EffectComposer> */}

          <group>
            <Content />
          </group>
          {/* </Effects> */}
        </Suspense>
        <Stats />
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ height: "100vh", width: `${state.pages * 100}vw` }} />
      </div>
      <Loader />
    </>
  );
}
