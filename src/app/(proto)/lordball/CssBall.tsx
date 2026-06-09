"use client";

import styles from "./lordball.module.css";

/**
 * Pure-CSS liquid chrome ball — works everywhere, no WebGL required.
 * Used as the universal fallback (and SSR placeholder) for the 3D ball.
 *
 * Layers (bottom→top):
 *   cssBall       – dark sphere base + outer glow
 *   cssBallBand1  – main chrome sweep (blue-violet diagonal, slow rock)
 *   cssBallBand2  – blue-teal sweep (counter-rock)
 *   cssBallBand3  – violet ribbon (crossing angle)
 *   cssBallGold   – warm gold/orange accent
 *   cssBallSpec   – static sharp specular + bottom-rim fill
 */
export default function CssBall({ className }: { className?: string }) {
  return (
    <div className={`${styles.cssBall} ${className ?? ""}`} aria-hidden="true">
      <span className={styles.cssBallBand1} />
      <span className={styles.cssBallBand2} />
      <span className={styles.cssBallBand3} />
      <span className={styles.cssBallGold} />
      <span className={styles.cssBallSpec} />
    </div>
  );
}
