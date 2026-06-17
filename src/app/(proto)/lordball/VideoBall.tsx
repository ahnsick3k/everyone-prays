"use client";

import styles from "./lordball.module.css";

/**
 * Video-texture orb.
 *
 * Layers (bottom → top):
 *   <video>        – looping subtle light/gradient MP4 as base texture
 *   cssBallChrome  – magenta/pink rim sheen (mix-blend: screen)
 *   cssBallBlue    – internal violet haze  (mix-blend: screen)
 *   cssBallGold    – warm gold bloom       (mix-blend: screen)
 *   cssBallLimb    – center darkening → gives 3-D sphere depth
 *   cssBallSpec    – thin glossy specular hits
 */
export default function VideoBall({ className }: { className?: string }) {
  return (
    <div className={`${styles.videoBall} ${className ?? ""}`} aria-hidden="true">
      <video
        className={styles.ballVideo}
        autoPlay
        loop
        muted
        playsInline
        src="/lordball-bg.mp4"
      />
      <span className={styles.cssBallChrome} />
      <span className={styles.cssBallBlue} />
      <span className={styles.cssBallGold} />
      <span className={styles.cssBallLimb} />
      <span className={styles.cssBallSpec} />
    </div>
  );
}
