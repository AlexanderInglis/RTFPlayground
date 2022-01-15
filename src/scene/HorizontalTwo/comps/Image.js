import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Scroll, useTexture } from "@react-three/drei";
import { lerp } from "three/src/math/MathUtils";
import "../shaders/DistortionMaterial";
import "../style.scss";

function ImageGallery({ m = 0.00000001, urls, imgTexture, imgSize, ...props }) {
  const { width } = useThree((state) => state.viewport);

  const w = width < 40 ? 2 / 3 : 1 / 3;
  // reference to the shader material
  const materialRef = useRef();

  // load image as a texture
  const imageTexture = useTexture(`${imgTexture}`);
  const [effectFactor, setEffectFactor] = useState(0);

  useFrame(({ clock, mouse }) => {
    // lerp direction to the direction of the mouse
    materialRef.current.direction.lerp(mouse.normalize(), 0.01).normalize();

    // lerp towards current effect factor
    materialRef.current.effectFactor = lerp(
      materialRef.current.effectFactor,
      effectFactor,
      0.07
    );

    materialRef.current.scrollFactor = Math.sin(clock.getElapsedTime() / 5);
  });

  return (
    <mesh
      className="desktopImage"
      scale={[0.05, 0.05, 0.1]}
      onPointerMove={(e) =>
        (materialRef.current.mousePosition = e.intersections[0].uv)
      }
      onPointerEnter={() => setEffectFactor(1)}
      onPointerOut={() => setEffectFactor(0)}
    >
      <planeGeometry args={imgSize} />
      <distortionMaterial
        attach="material"
        ref={materialRef}
        imageTexture={imageTexture}
      />
    </mesh>
  );
}

export { ImageGallery };
