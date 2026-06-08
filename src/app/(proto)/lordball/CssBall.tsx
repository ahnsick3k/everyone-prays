"use client";

import styles from "./lordball.module.css";

/**
 * Pure-CSS liquid chrome ball — works everywhere, no WebGL required.
 * Used as the universal fallback (and SSR placeholder) for the 3D ball.
 */
export default function CssBall({ className }: { className?: string }) {
  return (
    <div className={`${styles.cssBall} ${className ?? ""}`} aria-hidden="true">
      <span className={styles.cssBallIris} />
      <span className={styles.cssBallSwirl} />
      <span className={styles.cssBallSpec} />
    </div>
  );
}
