import React, { Suspense } from "react";
import * as THREE from "three";
import { Loader, Stats } from "@react-three/drei";
import {
  Physics,
  useBox,
  usePlane,
  useSphere,
  useCompoundBody,
  Debug,
} from "@react-three/cannon";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import {
  EffectComposer,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { OrbitControls, Reflector } from "@react-three/drei";
import Buddha from "./Scene";
import Diamond from "./DiamondScene";
import { useControls } from "leva";

//CUSTOM MATERIALS

const material = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#d9e8ff").convertSRGBToLinear(),
  roughness: 0,
  clearcoat: 5,
  clearcoatRoughness: 1,
});

//CUSTOM SHAPES

const CustomBox = ({ position, color, args, mass }) => {
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
    </mesh>
  );
};

const CustomSphere = ({ position, color, args }) => {
  const [ref] = useSphere(() => ({
    mass: 50,
    position,
    color,
  }));
  const { camera } = useThree();
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
        <mesh
          material={material}
          color={"red"}
          castShadow
          receiveShadow
          ref={ref}
        >
          <sphereBufferGeometry attach="geometry" args={args} />
        </mesh>
      )}
    </Reflector>
  );
};

const CustomPlane = () => {
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

// CUSTOM MODEL

const CustomBuddha = ({ position, color, mass }) => {
  const [ref] = useCompoundBody(() => ({
    mass: 500,
    position,
    shapes: [
      {
        type: "Cylinder",
        position: [-0.05, -1.35, -0.3],
        rotation: [110, 0, 0],
        args: [1.2, 1.9, 1.5, 10],
      },
      {
        type: "Cylinder",
        position: [-0.05, 0.9, -0.3],
        rotation: [110, 0, 0],
        args: [1.9, 1.1, 2, 9],
      },
    ],
  }));

  return (
    <mesh
      castShadow
      receiveShadow
      material={material}
      position={position}
      ref={ref}
      scale={[0.2, 0.2, 0.2]}
    >
      <Buddha />
    </mesh>
  );
};

// CUSTOM DIAMOND
const CustomDiamond = ({ position, color, mass }) => {
  const [ref] = useCompoundBody(() => ({
    mass: 20,
    position,
    shapes: [
      {
        type: "Cylinder",
        position: [0, 0.8, 0],
        rotation: [110, 0, 0],
        args: [0.1, 1.5, 2, 6],
      },
      {
        type: "Cylinder",
        position: [-0, 2.2, 0],
        rotation: [110, 0, 0],
        args: [1, 1, 0.5, 6],
      },
    ],
  }));

  return (
    <mesh
      castShadow
      receiveShadow
      // material={glassMaterial}
      position={position}
      ref={ref}
      scale={[0.05, 0.05, 0.05]}
    >
      {/* <MeshPhysicalMaterial /> */}
      <Diamond />
    </mesh>
  );
};

//SCENE

export default function GravityScene() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 200, 340], fov: 90 }}
        shadows
        dpr={window.devicePixelRatio}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#96c0ff"]} />
          <fog attach="fog" args={["#96c0ff", 0, 40]} />
          <EffectComposer>
            <ChromaticAberration offset={[0.001, 0.001]} />
            <Noise
              opacity={0.7}
              premultiply
              blendFunction={BlendFunction.ADD}
            />
          </EffectComposer>
          <ambientLight intensity={0.09} />

          <spotLight
            castShadow
            intensity={1}
            args={["#96c0ff", 1, 100]}
            position={[-1, 4, 5]}
            penumbra={1}
          />
          <group>
            <Physics gravity={[0, -9.81, 0]}>
              {/* <Debug scale={1.1} color="black"> */}
              <CustomPlane color="white" />
              {/* <CustomBuddha position={[0, 2.1, 0]} mass={200} /> */}
              <CustomDiamond position={[0, 1.5, 2]} mass={20} />
              <CustomBox
                color="white"
                args={[1, 1, 1]}
                position={[0, 0.5, -3]}
                mass={200}
              />
              <CustomBox
                color="white"
                args={[0.2, 0.2, 0.2]}
                position={[20, 0.1, 3.5]}
                mass={80}
              />
              <CustomBox
                color="white"
                args={[0.5, 0.5, 0.5]}
                position={[3.5, 0.5 / 2, 3]}
                mass={80}
              />
              <CustomSphere
                position={[1, 1, 0]}
                color="red"
                args={[1, 100, 100]}
              />
              {/* </Debug> */}
            </Physics>
          </group>
          <OrbitControls
            autoRotateSpeed={2.5}
            maxDistance={10}
            minDistance={8}
            maxPolarAngle={1.1}
          />
        </Suspense>
        <Stats />
      </Canvas>
      <Loader />
    </>
  );
}

// export default GravityScene;
