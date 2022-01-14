import * as THREE from "three";
import "./style.scss";
import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Preload,
  ScrollControls,
  Scroll,
  useScroll,
  Loader,
  Stats,
  Image as ImageImpl,
} from "@react-three/drei";
import {
  EffectComposer,
  ChromaticAberration,
  BlendFunction,
  Noise,
} from "@react-three/postprocessing";
import { Minimap } from "./Minimap";

function Image(props) {
  const ref = useRef();
  const group = useRef();
  const data = useScroll();
  console.log(data);
  useFrame((state, delta) => {
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      Math.max(0, data.delta * 50),
      4,
      delta
    );
    // ref.current.material.grayscale = THREE.MathUtils.damp(
    //   ref.current.material.grayscale,
    //   Math.max(0, 1 - data.delta * 1000),
    //   4,
    //   delta
    // );
  });
  return (
    <group ref={group}>
      <ImageImpl ref={ref} {...props} />
    </group>
  );
}

function Page({ m = 0.00000001, urls, ...props }) {
  const { width } = useThree((state) => state.viewport);
  const w = width < 40 ? 2 / 3 : 1 / 3;
  return (
    <group {...props}>
      {/* <Image position={[-width * w, 0, -1]} scale={[width * w - m * 2, 5, 1]} url={urls[0]} />
      <Image position={[0, 0, 0]} scale={[width * w - m * 2, 5, 1]} url={urls[1]} /> */}
      <Image
        // position={[width * w, 0, 1]}
        scale={[width * w - m * 2, 5, 1]}
        url={urls[2]}
      />
    </group>
  );
}

function Pages() {
  const { width } = useThree((state) => state.viewport);
  const chrome = useRef();
  const data = useScroll();
  const pages = useRef();
  useFrame((state, delta) => {
    //Chromatic Aberration on Scroll
    chrome.current.offset.width = THREE.MathUtils.damp(
      pages.current.position.z,
      Math.max(0.0009, data.delta * 8),
      200,
      delta
    );
  });
  return (
    <>
      <group ref={pages}>
        <EffectComposer>
          <Noise opacity={0.05} />
          <ChromaticAberration ref={chrome} offset={[0, 0]} />
        </EffectComposer>
        <Page
          position={[width * -1, 0, 0]}
          urls={["/6.jpg", "/img5.jpg", "/7.jpg"]}
        />
        <Page
          position={[-width * 0, 0, 0]}
          urls={["/1.jpg", "/2.jpg", "/1.jpg"]}
        />
        <Page
          position={[width * 1, 0, 0]}
          urls={["/1.jpg", "/img2.jpg", "/2.jpg"]}
        />
        <Page
          position={[width * 2, 0, 0]}
          urls={["/2.jpg", "/img5.jpg", "/3.jpg"]}
        />
        <Page
          position={[width * 3, 0, 0]}
          urls={["/3.jpg", "/trip2.jpg", "/4.jpg"]}
        />
        <Page
          position={[width * 4, 0, 0]}
          urls={["/4.jpg", "/img2.jpg", "/5.jpg"]}
        />
        <Page
          position={[width * 5, 0, 0]}
          urls={["/5.jpg", "/img5.jpg", "/6.jpg"]}
        />
        <Page
          position={[width * 6, 0, 0]}
          urls={["/6.jpg", "/img5.jpg", "/7.jpg"]}
        />
        <Page
          position={[width * 7, 0, 0]}
          urls={["/7.jpg", "/img5.jpg", "/1.jpg"]}
        />
        <Page
          position={[width * 8, 0, 0]}
          urls={["/2.jpg", "/img5.jpg", "/2.jpg"]}
        />
      </group>
    </>
  );
}

export default function HorizontalScrollerTwo() {
  return (
    <>
      <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
        <color attach="background" args={["#010101"]} />
        <Suspense fallback={null}>
          <EffectComposer>
            {/* <ChromaticAberration offset={[0.003, 0.002]} /> */}
            {/* <Noise opacity={1} premultiply /> */}
          </EffectComposer>
          <ScrollControls
            infinite
            horizontal
            damping={4}
            pages={8}
            distance={1}
          >
            <Minimap eff />
            <Scroll>
              <Pages />
            </Scroll>
          </ScrollControls>
          <Preload />
        </Suspense>
      </Canvas>
      {/* <Stats /> */}
      <Loader />
    </>
  );
}
