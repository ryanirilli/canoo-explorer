import { useEffect, useState } from "react";
import { Box, Flex, HStack, Spinner, Heading } from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { OrbitControls, useFBX, useCubeTexture } from "@react-three/drei";

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
  reflectivity: 0.2,
  dithering: true,
  shininess: 0.4,
});

const headlightMaterial = new THREE.MeshPhongMaterial({
  color: "#a3b3bd",
  dithering: true,
  shininess: 70,
  emissive: "#3d3d3d",
});

const rimsMaterial = new THREE.MeshPhongMaterial({
  color: "#91D0CC",
  dithering: true,
});

const tireMaterial = new THREE.MeshPhongMaterial({
  color: "#424242",
  dithering: true,
});

const rotSpeed = 0.001;

function Content(): JSX.Element {
  const obj = useFBX("/LV_Export_300K.fbx");
  const envMap = useCubeTexture(
    ["front.jpg", "back.jpg", "up.jpg", "down.jpg", "left.jpg", "right.jpg"],
    { path: "/environment/garage/" }
  );
  const light = useRef();
  const light2 = useRef();
  const light3 = useRef();
  const light4 = useRef();
  const ref = useRef<THREE.Mesh>();

  const colors = useControls({
    body: { r: 36, b: 39, g: 37 },
    rims: { r: 16, b: 16, g: 16 },
  });

  const { rotate } = useControls({ rotate: true });

  useFrame(({ camera }) => {
    console.log(camera.position);
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
          // console.log(child.name);
          child.material.opacity = 1;
          if (body.has(child.name)) {
            child.material = bodyMaterial;
            child.material.envMap = envMap;
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
          if (child.name.includes("node#")) {
            child.material = rimsMaterial;
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
  }, [obj, envMap]);

  useEffect(() => {
    bodyMaterial.color.setRGB(
      colors.body.r / 255,
      colors.body.g / 255,
      colors.body.b / 255
    );
    rimsMaterial.color.setRGB(
      colors.rims.r / 255,
      colors.rims.g / 255,
      colors.rims.b / 255
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
      <fog attach="fog" args={["black", 20, 40]} />
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
  const [isMounted, setIsMounted] = useState<Boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <Box h="100vh" w="100vw" bgGradient="radial(gray.900, black)">
      {isMounted ? (
        <Suspense fallback={<Loading />}>
          <Canvas
            shadows
            camera={{
              fov: 15,
              position: [-8, 2, 16],
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

function Loading() {
  return (
    <Flex color="white" h="100%" justify="center" align="center">
      <HStack>
        <Spinner speed="0.65s" />
        <Heading size="md">loading...</Heading>
      </HStack>
    </Flex>
  );
}
