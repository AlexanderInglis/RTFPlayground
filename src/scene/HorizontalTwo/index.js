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
} from "@react-three/drei";
import {
  EffectComposer,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { Minimap } from "./Minimap";
import { ImageGallery } from "./comps/Image";

const lrgSizing = [1920 / 12, 1221 / 12, 100, 100];
const medSizing = [1080 / 12, 1350 / 12, 100, 100];
const smlSizing = [1080 / 20, 1920 / 20, 100, 100];

function Page({ urls, ...props }) {
  const mediumScreen = 915;
  const smallScreen = 500;
  const screenSize = window.innerWidth;
  console.log(screenSize);
  if (screenSize > mediumScreen) {
    return (
      <group {...props}>
        <ImageGallery imgSize={lrgSizing} imgTexture={urls[2]} />
      </group>
    );
  } else if (screenSize > smallScreen) {
    return (
      <group {...props}>
        <ImageGallery imgSize={medSizing} imgTexture={urls[1]} />
      </group>
    );
  } else {
    return (
      <group {...props}>
        <ImageGallery imgSize={smlSizing} imgTexture={urls[0]} />
      </group>
    );
  }
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
      Math.max(0.0005, data.delta * 5),
      8000,
      delta
    );
  });
  return (
    <>
      <group ref={pages}>
        <EffectComposer>
          <Noise opacity={0.04} />
          <ChromaticAberration ref={chrome} offset={[0, 0]} />
        </EffectComposer>
        <Page
          position={[width * -1, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/7.jpg",
            "/GalleryImgs/MedImgs/7.jpg",
            "/GalleryImgs/LrgImgs/7.jpg",
          ]}
        />
        <Page
          position={[-width * 0, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/1.jpg",
            "/GalleryImgs/MedImgs/1.jpg",
            "/GalleryImgs/LrgImgs/1.jpg",
          ]}
        />
        <Page
          position={[width * 1, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/2.jpg",
            "/GalleryImgs/MedImgs/2.jpg",
            "/GalleryImgs/LrgImgs/2.jpg",
          ]}
        />
        <Page
          position={[width * 2, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/3.jpg",
            "/GalleryImgs/MedImgs/3.jpg",
            "/GalleryImgs/LrgImgs/3.jpg",
          ]}
        />
        <Page
          position={[width * 3, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/4.jpg",
            "/GalleryImgs/MedImgs/4.jpg",
            "/GalleryImgs/LrgImgs/4.jpg",
          ]}
        />
        <Page
          position={[width * 4, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/5.jpg",
            "/GalleryImgs/MedImgs/5.jpg",
            "/GalleryImgs/LrgImgs/5.jpg",
          ]}
        />
        <Page
          position={[width * 5, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/6.jpg",
            "/GalleryImgs/MedImgs/6.jpg",
            "/GalleryImgs/LrgImgs/6.jpg",
          ]}
        />
        <Page
          position={[width * 6, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/7.jpg",
            "/GalleryImgs/MedImgs/7.jpg",
            "/GalleryImgs/LrgImgs/7.jpg",
          ]}
        />
        <Page
          position={[width * 7, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/1.jpg",
            "/GalleryImgs/MedImgs/1.jpg",
            "/GalleryImgs/LrgImgs/1.jpg",
          ]}
        />
        <Page
          position={[width * 8, 0, 0]}
          urls={[
            "/GalleryImgs/SmlImgs/2.jpg",
            "/GalleryImgs/MedImgs/2.jpg",
            "/GalleryImgs/LrgImgs/2.jpg",
          ]}
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
          <ScrollControls
            infinite
            horizontal
            damping={5.4}
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
      <Stats />
      <Loader />
    </>
  );
}
