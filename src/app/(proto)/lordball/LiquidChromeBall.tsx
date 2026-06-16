"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type ChromeBallPhase =
  | "intro"
  | "intro2"
  | "home"
  | "typing"
  | "complete"
  | "submitting"
  | "done";

function useIridescentEnv() {
  return useMemo(() => {
    const width = 768;
    const height = 384;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2D canvas context is required for the Lordball env map.");
    }

    context.fillStyle = "#09020f";
    context.fillRect(0, 0, width, height);

    const band = context.createLinearGradient(0, 0, width, 0);
    band.addColorStop(0.0, "#582089");
    band.addColorStop(0.14, "#e73973");
    band.addColorStop(0.3, "#ffd3f7");
    band.addColorStop(0.48, "#aa63f6");
    band.addColorStop(0.66, "#7646dc");
    band.addColorStop(0.82, "#ffcdb1");
    band.addColorStop(1.0, "#582089");

    context.fillStyle = band;
    context.fillRect(0, height * 0.24, width, height * 0.5);

    const falloff = context.createLinearGradient(0, 0, 0, height);
    falloff.addColorStop(0.0, "rgba(9,2,15,1)");
    falloff.addColorStop(0.34, "rgba(9,2,15,0.18)");
    falloff.addColorStop(0.5, "rgba(9,2,15,0)");
    falloff.addColorStop(0.66, "rgba(9,2,15,0.18)");
    falloff.addColorStop(1.0, "rgba(9,2,15,1)");

    context.fillStyle = falloff;
    context.fillRect(0, 0, width, height);

    const centerShadow = context.createRadialGradient(
      width * 0.5,
      height * 0.5,
      0,
      width * 0.5,
      height * 0.5,
      width * 0.28
    );
    centerShadow.addColorStop(0, "rgba(7,1,11,1)");
    centerShadow.addColorStop(0.7, "rgba(7,1,11,0.55)");
    centerShadow.addColorStop(1, "rgba(7,1,11,0)");
    context.fillStyle = centerShadow;
    context.fillRect(0, 0, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function LiquidSphere({ phase }: { phase: ChromeBallPhase }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const envMap = useIridescentEnv();

  useEffect(() => () => envMap.dispose(), [envMap]);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }

    const spinBoost = phase === "submitting" ? 1.45 : phase === "complete" ? 1.12 : 1;

    meshRef.current.rotation.y += delta * 0.18 * spinBoost;
    meshRef.current.rotation.x = Math.sin(performance.now() * 0.00022) * 0.045;
    meshRef.current.rotation.z = Math.sin(performance.now() * 0.00014) * 0.03;
  });

  return (
    <mesh ref={meshRef} scale={1.18}>
      <sphereGeometry args={[1, 88, 88]} />
      <MeshDistortMaterial
        color="#090211"
        metalness={1}
        roughness={0.16}
        clearcoat={1}
        clearcoatRoughness={0.12}
        distort={phase === "submitting" ? 0.36 : 0.3}
        speed={phase === "submitting" ? 2.1 : 1.55}
        envMap={envMap}
        envMapIntensity={1.95}
      />
    </mesh>
  );
}

function OrbitRibbon({
  color,
  phase,
  thickness,
  fixedRotation,
  orbitSpeed,
  startScale,
}: {
  color: string;
  phase: ChromeBallPhase;
  thickness: number;
  fixedRotation: [number, number, number];
  orbitSpeed: number;
  startScale: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const progress = useRef(phase === "submitting" ? 1 : 0);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current || !materialRef.current) {
      return;
    }

    const target = phase === "submitting" ? 1 : 0;
    progress.current = THREE.MathUtils.damp(progress.current, target, 4.2, delta);

    const reveal = THREE.MathUtils.smoothstep(progress.current, 0.02, 0.76);
    const opacity = reveal * 0.88;

    groupRef.current.visible = opacity > 0.01;
    groupRef.current.rotation.x = fixedRotation[0];
    groupRef.current.rotation.z = fixedRotation[2];
    groupRef.current.rotation.y += delta * orbitSpeed * (0.45 + reveal * 0.85);

    meshRef.current.scale.set(
      THREE.MathUtils.lerp(startScale[0], 1, reveal),
      THREE.MathUtils.lerp(startScale[1], 1, reveal),
      THREE.MathUtils.lerp(startScale[2], 1, reveal)
    );

    materialRef.current.opacity = opacity;
  });

  return (
    <group ref={groupRef} visible={phase === "submitting"}>
      <mesh ref={meshRef}>
        <torusGeometry args={[1.16, thickness, 12, 120]} />
        <meshBasicMaterial
          ref={materialRef}
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function RibbonCage({ phase }: { phase: ChromeBallPhase }) {
  return (
    <group scale={1.08}>
      <OrbitRibbon
        color="#ff52a8"
        phase={phase}
        thickness={0.02}
        fixedRotation={[Math.PI / 2.18, 0, 0]}
        orbitSpeed={1.55}
        startScale={[0.04, 1.75, 1]}
      />
      <OrbitRibbon
        color="#b365ff"
        phase={phase}
        thickness={0.017}
        fixedRotation={[Math.PI / 2.18, 0, 1.08]}
        orbitSpeed={1.22}
        startScale={[1.6, 0.05, 1]}
      />
      <OrbitRibbon
        color="#76b2ff"
        phase={phase}
        thickness={0.015}
        fixedRotation={[Math.PI / 2.18, 0, -0.94]}
        orbitSpeed={0.98}
        startScale={[0.05, 1.55, 1]}
      />
    </group>
  );
}

function Scene({ phase }: { phase: ChromeBallPhase }) {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[-2.2, 1.8, 2.8]} intensity={1.15} color="#ffd7f3" />
      <pointLight position={[1.8, -1.2, 2.3]} intensity={1.1} color="#ffc0b0" />
      <LiquidSphere phase={phase} />
      <RibbonCage phase={phase} />
    </>
  );
}

export default function LiquidChromeBall({
  className,
  phase,
}: {
  className?: string;
  phase: ChromeBallPhase;
}) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.55], fov: 28 }}
    >
      <Suspense fallback={null}>
        <Scene phase={phase} />
      </Suspense>
    </Canvas>
  );
}
