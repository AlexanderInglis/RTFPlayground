import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Image,
  ScrollControls,
  Scroll,
  useScroll,
  MeshDistortMaterial,
} from "@react-three/drei";
import { useSnapshot } from "valtio";
import { Minimap } from "./Minimap";
import { state, damp } from "./util";
import {
  EffectComposer,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";

function Item({ index, position, scale, c = new THREE.Color(), ...props }) {
  const ref = useRef();
  const scroll = useScroll();
  const group = useRef();
  const chrome = useRef();
  const data = useScroll();
  const { clicked, urls } = useSnapshot(state);
  const [hovered, hover] = useState(false);
  const click = () => (state.clicked = index === clicked ? null : index);
  const over = () => hover(true);
  const out = () => hover(false);
  useFrame((state, delta) => {
    const y = scroll.curve(
      index / urls.length - 1.5 / urls.length,
      4 / urls.length
    );
    ref.current.material.scale[1] = ref.current.scale.y = damp(
      ref.current.scale.y,
      clicked === index ? 5 : 4 + y,
      8,
      delta
    );
    ref.current.material.scale[0] = ref.current.scale.x = damp(
      ref.current.scale.x,
      clicked === index ? 4.7 : scale[0],
      6,
      delta
    );
    if (clicked !== null && index < clicked)
      ref.current.position.x = damp(
        ref.current.position.x,
        position[0] - 2,
        6,
        delta
      );
    if (clicked !== null && index > clicked)
      ref.current.position.x = damp(
        ref.current.position.x,
        position[0] + 2,
        6,
        delta
      );

    //scaling on Scroll
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      Math.max(0, data.delta * 10),
      4,
      delta
    );

    //Chromatic Aberration on Scroll
    chrome.current.offset.x = THREE.MathUtils.damp(
      group.current.position.z,
      Math.max(0, data.delta * 0.000000000001),
      200,
      delta
    );
    chrome.current.offset.y = THREE.MathUtils.damp(
      group.current.position.z,
      Math.max(0, data.delta * 0.000000000001),
      300,
      delta
    );

    if (clicked === null || clicked === index)
      ref.current.position.x = damp(
        ref.current.position.x,
        position[0],
        6,
        delta
      );
    ref.current.material.grayscale = damp(
      ref.current.material.grayscale,
      hovered || clicked === index ? 0 : Math.max(0, 1 - y),
      6,
      delta
    );
    ref.current.material.color.lerp(
      c.set(hovered || clicked === index ? "white" : "#aaa"),
      hovered ? 0.3 : 0.1
    );
  });
  return (
    <group ref={group}>
      <EffectComposer>
        <Noise opacity={0.05} />
        <ChromaticAberration ref={chrome} offset={[0.0001, 0.001]} />
      </EffectComposer>

      <Image
        ref={ref}
        {...props}
        position={position}
        scale={scale}
        onClick={click}
        onPointerOver={over}
        onPointerOut={out}
      />
    </group>
  );
}

function Items({ w = 0.7, gap = 0.15 }) {
  const { urls } = useSnapshot(state);
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;
  console.log(Scroll.current);
  return (
    <ScrollControls
      horizontal
      damping={4}
      offset={2}
      pages={(width - xW + urls.length * xW) / width}
    >
      <Minimap />
      <Scroll>
        {
          urls.map((url, i) => <Item key={i} index={i} position={[i * xW, 0, 0]} scale={[w, 4, 1]} url={url} />) /* prettier-ignore */
        }
      </Scroll>
    </ScrollControls>
  );
}

const HorizontalScroller = () => (
  <>
    <Canvas
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
      onPointerMissed={() => (state.clicked = null)}
    >
      <Suspense fallback={null}>
        <Items />
      </Suspense>
    </Canvas>
  </>
);
export default HorizontalScroller;