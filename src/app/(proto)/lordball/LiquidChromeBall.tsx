"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Builds an equirectangular iridescent gradient used as the reflection
 * environment, modelled after the original orb: a dark camera-facing patch
 * (keeps the core dark) wrapped by a smooth magenta → pink → violet →
 * purple → peach band that forms the liquid-chrome rim.
 */
function useIridescentEnv() {
  return useMemo(() => {
    const w = 1024;
    const h = 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    // dark base
    ctx.fillStyle = "#0a0410";
    ctx.fillRect(0, 0, w, h);

    // smooth horizontal iridescent band (equator = rim reflections)
    const band = ctx.createLinearGradient(0, 0, w, 0);
    band.addColorStop(0.0, "#69299a");
    band.addColorStop(0.15, "#e93c5f");
    band.addColorStop(0.3, "#f8cdfb");
    band.addColorStop(0.45, "#b97bd4");
    band.addColorStop(0.6, "#9759bc");
    band.addColorStop(0.72, "#f2bca0");
    band.addColorStop(0.85, "#e93c5f");
    band.addColorStop(1.0, "#69299a");

    // vertical falloff so colour concentrates near the equator
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0.0, "rgba(10,4,16,1)");
    grad.addColorStop(0.32, "rgba(10,4,16,0.15)");
    grad.addColorStop(0.5, "rgba(10,4,16,0)");
    grad.addColorStop(0.68, "rgba(10,4,16,0.15)");
    grad.addColorStop(1.0, "rgba(10,4,16,1)");

    ctx.fillStyle = band;
    ctx.fillRect(0, h * 0.18, w, h * 0.64);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // dark patch on the camera-facing side keeps the sphere's core dark
    const dark = ctx.createRadialGradient(
      w * 0.5,
      h * 0.5,
      0,
      w * 0.5,
      h * 0.5,
      w * 0.22
    );
    dark.addColorStop(0, "rgba(8,2,12,1)");
    dark.addColorStop(1, "rgba(8,2,12,0)");
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, w, h);

    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Ball() {
  const mesh = useRef<THREE.Mesh>(null);
  const env = useIridescentEnv();

  useEffect(() => () => env.dispose(), [env]);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.22;
      mesh.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <mesh ref={mesh} scale={1.1}>
      <sphereGeometry args={[1, 128, 128]} />
      <MeshDistortMaterial
        color="#0a0410"
        metalness={1}
        roughness={0.26}
        distort={0.3}
        speed={1.5}
        envMap={env}
        envMapIntensity={1.7}
      />
    </mesh>
  );
}

export default function LiquidChromeBall({
  className,
}: {
  className?: string;
}) {
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.5], fov: 30 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <Ball />
      </Suspense>
    </Canvas>
  );
}
