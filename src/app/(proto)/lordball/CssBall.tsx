"use client";

import styles from "./lordball.module.css";

/**
 * Pure-CSS soap bubble.
 *
 * Layers (bottom → top):
 *   bubble       – transparent radial base with pale rim tint
 *   bubbleRim    – iridescent conic gradient, rim-masked, slowly spinning
 *   bubbleSheen  – broad translucent highlight that drifts
 *   bubbleCaustic – faint internal color wash
 *   bubbleGloss  – small sharp white specular hits
 */
export default function CssBall({ className }: { className?: string }) {
  return (
    <div className={`${styles.bubble} ${className ?? ""}`} aria-hidden="true">
      <span className={styles.bubbleRim} />
      <span className={styles.bubbleSheen} />
      <span className={styles.bubbleCaustic} />
      <span className={styles.bubbleGloss} />
    </div>
  );
}
