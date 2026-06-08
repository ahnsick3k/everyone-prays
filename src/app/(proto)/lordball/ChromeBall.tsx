"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import CssBall from "./CssBall";

const LiquidChromeBall = dynamic(() => import("./LiquidChromeBall"), {
  ssr: false,
});

let cached: boolean | undefined;

function detectWebGL(): boolean {
  if (cached !== undefined) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("webgl2"))
    );
  } catch {
    cached = false;
  }
  return cached;
}

const subscribe = () => () => {};

/**
 * Renders the WebGL liquid-chrome ball when the browser supports it,
 * and falls back to the CSS ball otherwise (and during SSR/hydration),
 * so the orb is never blank.
 */
export default function ChromeBall({ className }: { className?: string }) {
  const supported = useSyncExternalStore(subscribe, detectWebGL, () => false);
  return supported ? (
    <LiquidChromeBall className={className} />
  ) : (
    <CssBall className={className} />
  );
}
