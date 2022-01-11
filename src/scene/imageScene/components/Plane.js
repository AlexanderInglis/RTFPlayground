import * as THREE from "three";
import React, { forwardRef, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import "./CustomMaterial";
import { useBlock } from "../blocks";
import state from "../store";

import {
  EffectComposer,
  Noise,
  ChromaticAberration,
  ScrollControls,
  Scroll,
  useScroll,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default forwardRef(
  ({ color = "white", shift = 100, opacity = 1, args, map, ...props }, ref) => {
    const { viewportWidth, offsetFactor } = useBlock();
    const material = useRef();
    let last = state.top.current;
    useFrame(() => {
      const { pages, top } = state;
      material.current.scale = THREE.MathUtils.lerp(
        material.current.scale,
        offsetFactor - top.current / ((pages - 1) * viewportWidth),
        0.1
      );
      material.current.shift = THREE.MathUtils.lerp(
        material.current.shift,
        -(top.current - last) / shift,
        0.1
      );
      last = top.current;
    });
    const onScroll = (e) => (state.top.current = e.target.scrollLeft);
    // const {}
    return (
      <mesh ref={ref} {...props}>
        <EffectComposer>
          <ChromaticAberration offset={[0.001, 0.001]} />
          <Noise opacity={1} premultiply blendFunction={BlendFunction.ADD} />
        </EffectComposer>
        <planeGeometry args={args} />
        <customMaterial
          ref={material}
          color={color}
          map={map}
          map-minFilter={THREE.LinearFilter}
          transparent
          opacity={opacity}
        />
      </mesh>
    );
  }
);
