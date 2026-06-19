"use client";

import CssBall from "./CssBall";

/**
 * Compatibility wrapper for the earlier WebGL experiment.
 * The Lordball orb now stays on the CSS render path to match the design
 * reference more closely and keep the output identical across browsers.
 */
export default function LiquidChromeBall({
  className,
}: {
  className?: string;
}) {
  return <CssBall className={className} />;
}
