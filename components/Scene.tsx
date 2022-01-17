import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { OrbitControls, useFBX, useTexture } from "@react-three/drei";

const body = new Set([
  "09_shell1",
  "Front_Quarter_Panel_shell1",
  "Headlight_Lenses_Dark2",
  "Headlight_Lenses_Dark1",
  "Streetview_Outer_Reflection_shell1",
  "Front_Facia_shell1",
  "shell_node_8924028",
  "Front_Door_shell1",
  "Rear_Door_shell2",
  "Rear_Quarter_Panel_shell1",
  "Tailgate_Body_shell1",
  "License_Plate_Trim_shell1",
  "Rear_Quarter_Panel_shell2",
  "Rear_Door_shell1",
  "Front_Door_shell2",
  "Charge_Door_shell1",
  "54_shell1",
  "53_shell1",
]);

const headlights = new Set([
  "Headlight_Lenses_Clear2",
  "Headlight_Lenses_Clear1",
  "polySurface4687",
  "polySurface4684",
]);

const bodyMaterial = new THREE.MeshPhongMaterial({
  color: "#91D0CC",
  dithering: true,
});

const headlightMaterial = new THREE.MeshPhongMaterial({
  color: "#a3b3bd",
  dithering: true,
  shininess: 70,
  emissive: "#3d3d3d",
});

const tireMaterial = new THREE.MeshPhongMaterial({
  color: "#424242",
  dithering: true,
});

const rotSpeed = 0.001;

function Content(): JSX.Element {
  const obj = useFBX("/LV_Export_300K.fbx");
  const light = useRef();
  const light2 = useRef();
  const light3 = useRef();
  const light4 = useRef();
  const ref = useRef<THREE.Mesh>();

  const colors = useControls({
    body: { r: 21, b: 237, g: 245 },
  });

  const { rotate } = useControls({ rotate: true });

  useFrame(({ camera }) => {
    if (rotate) {
      const { x, z } = camera.position;
      camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
      camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
    }
  });

  useEffect(() => {
    if (obj) {
      let tint: THREE.Material | null = null;
      let winshield: THREE.Mesh | null = null;
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log(child.name);
          child.material.opacity = 1;
          if (body.has(child.name)) {
            child.material = bodyMaterial;
          }
          if (headlights.has(child.name)) {
            child.material = headlightMaterial;
          }

          if (child.name === "body_136") {
            tint = child.material;
          }
          if (child.name === "45_shell1") {
            winshield = child;
          }
          if (tint && winshield) {
            winshield.material = tint;
          }

          if (child.name.includes("pCylinder")) {
            child.material = tireMaterial;
          }

          if (
            !child.name.includes("pCylinder") &&
            !child.name.includes("node#")
          ) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });
    }
  }, [obj]);

  useEffect(() => {
    bodyMaterial.color.setRGB(
      colors.body.r / 255,
      colors.body.g / 255,
      colors.body.b / 255
    );
  }, [colors]);

  return (
    <>
      <spotLight
        color="#DCDFF0"
        intensity={0.3}
        ref={light2}
        castShadow={true}
        position={[0, 5, 5]}
        angle={0.6}
        penumbra={1}
        shadowBias={-0.0003}
      />
      <spotLight
        color="#DCDFF0"
        intensity={0.3}
        ref={light}
        castShadow={true}
        position={[0, 5, -5]}
        angle={0.6}
        penumbra={1}
        shadowBias={-0.0003}
      />
      <spotLight
        color="#DCDFF0"
        intensity={0.3}
        ref={light3}
        castShadow={true}
        position={[-10, 10, 0]}
        angle={0.6}
        penumbra={1}
        shadowBias={-0.0003}
      />
      <spotLight
        color="#DCDFF0"
        intensity={0.3}
        ref={light4}
        castShadow={true}
        position={[10, 10, 0]}
        angle={0.6}
        penumbra={1}
        shadowBias={-0.0003}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        target={[0, 1.1, 0]}
      />

      <primitive
        ref={ref}
        object={obj}
        position={[-5.5, 0, 0]}
        scale={[0.01, 0.01, 0.01]}
        rotation={[-1.5708, 0, 0]}
        receiveShadow={true}
        castShadow={true}
      />

      <gridHelper
        args={[30, 30, `#0D0D0D`, `#0D0D0D`]}
        position={[0, 0.1, 0]}
      />
    </>
  );
}

export default function Scene() {
  const [isMounted, setIsMoumted] = useState<Boolean>(false);
  useEffect(() => {
    setIsMoumted(true);
  }, []);
  return (
    <Box h="100vh" w="100vw" bgGradient="radial(gray.900, black)">
      {isMounted ? (
        <Suspense fallback="...loading">
          <Canvas
            shadows
            camera={{
              fov: 7,
              position: [-30.2, 6, 22.3],
              filmGauge: 14,
            }}
          >
            <Content />
          </Canvas>
        </Suspense>
      ) : null}
    </Box>
  );
}
