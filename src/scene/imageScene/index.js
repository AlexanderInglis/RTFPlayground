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
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Shadow, useTexture, Line, meshBounds } from "@react-three/drei";
import Plane from "./components/Plane";
import state from "./store";
import { Block, useBlock } from "./blocks";

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

function Rect({ scale, ...props }) {
  return (
    <group scale={scale}>
      <Line
        points={[
          -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0, -0.5, 0.5, 0,
        ]}
        color="black"
        linewidth={2}
        position={[0, 0, 0]}
      />
      <mesh {...props} raycast={meshBounds}>
        <planeGeometry />
        <meshBasicMaterial transparent opacity={1} />
      </mesh>
    </group>
  );
}

function Dot() {
  const [hovered, set] = useState(false);
  const { offset, sectionWidth } = useBlock();
  useEffect(
    () => void (document.body.style.cursor = hovered ? "pointer" : "auto"),
    [hovered]
  );
  return (
    <Rect
      scale={0.15}
      onPointerOver={() => set(true)}
      onPointerOut={() => set(false)}
      onClick={() =>
        (state.ref.scrollLeft = offset * sectionWidth * state.zoom)
      }
    />
  );
}

function Map() {
  return new Array(6).fill().map((img, index) => (
    <Block key={index} factor={1 / state.sections / 2} offset={index}>
      <Dot />
    </Block>
  ));
}

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
          <color attach="background" args={["#010101"]} />
          {/* <fog attach="fog" args={["#96c0ff", 0, 40]} /> */}
          <EffectComposer>
            <ChromaticAberration offset={[0.001, 0.001]} />
            <Noise opacity={1} premultiply blendFunction={BlendFunction.ADD} />
          </EffectComposer>
          <ambientLight intensity={0.1} />
          <group>
            <Content />
            {/* <HeadsUpDisplay>
              <Map />
            </HeadsUpDisplay> */}
          </group>
        </Suspense>
        <Stats />
      </Canvas>
      <div class="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ height: "100vh", width: `${state.pages * 100}vw` }} />
      </div>
      <Loader />
    </>
  );
}
