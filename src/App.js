import React, { useRef, useState, useEffect } from "react";
import "./App.scss";
import { Loader, PerspectiveCamera } from "@react-three/drei";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { Canvas, useFrame, extend, useThree } from "react-three-fiber";
import {
  EffectComposer,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useControls } from "leva";
import {
  softShadows,
  MeshWobbleMaterial,
  OrbitControls,
  MeshReflectorMaterial,
  Reflector,
  RoundedBox,
} from "@react-three/drei";

RectAreaLightUniformsLib.init();

function Light() {
  const ref = useRef();
  useFrame((_) => (ref.current.rotation.x = _.clock.elapsedTime));
  return (
    <group ref={ref}>
      <rectAreaLight
        width={15}
        height={100}
        position={[30, 30, -10]}
        intensity={1}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
    </group>
  );
}

const material = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#d9e8ff").convertSRGBToLinear(),
  roughness: 0,
  clearcoat: 1,
  clearcoatRoughness: 0,
});

//ANIMATED SHAPES

// gravity box
const GravityMesh = ({ position, color, args, mass }) => {
  const [ref] = useBox(() => ({
    mass,
    position,
    args,
  }));

  return (
    <mesh
      material={material}
      castShadow
      receiveShadow
      position={position}
      ref={ref}
    >
      <boxBufferGeometry attach="geometry" args={args} />
      {/* <meshStandardMaterial color={color} /> */}
    </mesh>
  );
};

//gravity ball
const GravitySphere = ({ position, color, args }) => {
  const [ref] = useSphere(() => ({
    mass: 50,
    position,
  }));
  const { scene, gl, size, camera } = useThree();
  camera.rotation.order = "YXZ";
  return (
    <Reflector
      ref={ref}
      resolution={1024}
      receiveShadow
      mirror={0}
      blur={[500, 100]}
      mixBlur={1}
      mixStrength={0.5}
      depthScale={1}
      position={[0, 0, 8]}
      scale={[1, 1, 1]}
    >
      {(Material, props) => (
        <mesh material={material} castShadow receiveShadow ref={ref}>
          <sphereBufferGeometry attach="geometry" args={args} />
        </mesh>
      )}
    </Reflector>
  );
};

//plane
const Plane = ({ color }) => {
  const [ref, api] = usePlane(() => ({
    mass: 1,
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
    type: "Static",
  }));

  useFrame(({ mouse }) => {
    api.rotation.set(-Math.PI / 2 - mouse.y * 0.3, 0 + mouse.x * 0.3, 0);
  });
  return (
    <Reflector
      ref={ref}
      resolution={1024}
      receiveShadow
      mirror={0}
      blur={[500, 100]}
      mixBlur={1}
      mixStrength={0.5}
      depthScale={1}
      minDepthThreshold={0.8}
      maxDepthThreshold={1}
      position={[0, 0, 8]}
      scale={[2, 2, 1]}
      rotation={[-Math.PI / 2, 0, Math.PI]}
      args={[70, 70]}
    >
      {(Material, props) => (
        <Material metalness={0.25} color="white" roughness={1} {...props} />
      )}
    </Reflector>
  );
};

function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 200, 340], fov: 90 }} shadows>
        <color attach="background" args={["#96c0ff"]} />
        <fog attach="fog" args={["#96c0ff", 0, 40]} />
        <EffectComposer>
          <ChromaticAberration offset={[-0.0003, 0.0018]} />
          <Noise opacity={0.6} premultiply blendFunction={BlendFunction.ADD} />
        </EffectComposer>
        <ambientLight intensity={0.05} />
        <directionalLight intensity={0.1} castShadow />
        <spotLight
          castShadow
          intensity={1}
          args={["#96c0ff", 1, 100]}
          position={[-1, 4, 5]}
          penumbra={1}
        />
        <group>
          <Physics>
            <Plane color="white" />
            <GravityMesh
              color="white"
              args={[2, 2, 2]}
              position={[1.5, 4.5, 1.5]}
              mass={80}
            />

            <GravityMesh
              color="white"
              args={[2, 2, 2]}
              position={[0.5, 8.5, 1.5]}
              mass={80}
            />
            <GravityMesh
              color="white"
              args={[0.2, 0.2, 0.2]}
              position={[3, 3, 5]}
              mass={10}
            />
            <GravityMesh
              color="white"
              args={[0.5, 0.5, 0.5]}
              position={[-3, 7, 7]}
              mass={1}
            />

            <GravitySphere
              position={[1, 2, 3]}
              color="white"
              args={[1, 32, 32]}
            />
          </Physics>
        </group>
        <OrbitControls
          autoRotateSpeed={2.5}
          maxDistance={10}
          minDistance={8}
          maxPolarAngle={1.1}
        />
      </Canvas>
      <Loader />
    </>
  );
}

export default App;
