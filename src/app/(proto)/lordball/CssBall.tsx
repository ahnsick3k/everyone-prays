"use client";

import styles from "./lordball.module.css";

/**
 * Pure-CSS liquid plum orb tuned to the Lordball reference.
 *
 * Layers (bottom → top):
 *   cssBall       – near-black plum core + soft outer glow
 *   cssBallChrome – hot magenta / pink top and rim sheen
 *   cssBallBlue   – internal plum/violet body haze
 *   cssBallGold   – warm peach-white bloom near the bottom edge
 *   cssBallLimb   – center darkening + soft edge falloff for volume
 *   cssBallSpec   – thin glossy rim hits and side highlights
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
