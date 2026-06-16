"use client";

import styles from "./lordball.module.css";

export default function StaticChromeBall({ className }: { className?: string }) {
  return (
    <div className={`${styles.fallbackOrb} ${className ?? ""}`} aria-hidden="true">
      <span className={styles.fallbackOrbRim} />
      <span className={styles.fallbackOrbGlow} />
      <span className={styles.fallbackOrbSpec} />
    </div>
  );
}
