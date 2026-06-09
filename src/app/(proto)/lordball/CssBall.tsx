"use client";

import styles from "./lordball.module.css";

/**
 * Pure-CSS liquid chrome ball.
 *
 * Layers (bottom → top):
 *   cssBall      – very dark sphere base + outer glow
 *   cssBallChrome – main chrome sweep (magenta/violet/peach, matches WebGL env map)
 *   cssBallBlue  – blue-teal sweep (counter-direction)
 *   cssBallGold  – warm gold accent
 *   cssBallLimb  – LIMB DARKENING: dark ring at edges → 3D sphere illusion
 *   cssBallSpec  – sharp specular highlight + secondary rim fill
 */
export default function CssBall({ className }: { className?: string }) {
  return (
    <div className={`${styles.cssBall} ${className ?? ""}`} aria-hidden="true">
      <span className={styles.cssBallChrome} />
      <span className={styles.cssBallBlue} />
      <span className={styles.cssBallGold} />
      <span className={styles.cssBallLimb} />
      <span className={styles.cssBallSpec} />
    </div>
  );
}
