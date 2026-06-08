"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./lordball.module.css";
import ChromeBall from "./ChromeBall";

type Phase =
  | "intro"
  | "intro2"
  | "home"
  | "typing"
  | "complete"
  | "submitting"
  | "done";

const TITLE = "누구를 위한 기도입니까?";
const PLACEHOLDER = "이름을 타이핑하세요";
const PRAY_TOTAL = 7;

export default function LordBallPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const [prayCount] = useState(() => Math.floor(Math.random() * PRAY_TOTAL) + 1);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const after = useCallback((ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  // intro → intro2 → home → typing timeline
  useEffect(() => {
    if (phase === "intro") after(1500, () => setPhase("intro2"));
    else if (phase === "intro2") after(1900, () => setPhase("home"));
    else if (phase === "home") after(1500, () => setPhase("typing"));
  }, [phase, after]);

  // focus the input when typing begins (desktop autofocus)
  useEffect(() => {
    if (phase === "typing") {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      timers.current.push(t);
    }
  }, [phase]);

  // cleanup timers on unmount
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const confirmName = useCallback(() => {
    if (name.trim().length === 0) return;
    inputRef.current?.blur();
    setPhase("complete");
  }, [name]);

  const submitPrayer = useCallback(() => {
    setPhase("submitting");
    after(3000, () => setPhase("done"));
  }, [after]);

  const focusInput = useCallback(() => {
    if (phase === "typing") inputRef.current?.focus();
  }, [phase]);

  const showOrb =
    phase === "home" ||
    phase === "typing" ||
    phase === "complete" ||
    phase === "submitting";
  const idle = phase === "home" || phase === "typing" || phase === "complete";
  const showTitle = phase !== "done";

  const stageClass = [
    styles.stage,
    phase === "intro" ? styles.stageIntro : "",
    phase === "submitting" ? styles.stageBurst : "",
  ]
    .filter(Boolean)
    .join(" ");

  const orbWrapClass = [
    styles.orbWrap,
    showOrb ? styles.orbVisible : "",
    idle ? styles.orbFloat : "",
    phase === "submitting" ? styles.orbSubmitting : "",
  ]
    .filter(Boolean)
    .join(" ");

  const ctaClass = [
    styles.cta,
    phase === "complete" ? styles.ctaVisible : "",
    phase === "submitting" ? styles.ctaFading : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.root}>
      <div className={stageClass} onClick={focusInput}>
        {/* Title */}
        {showTitle && (
          <h1
            className={[
              styles.title,
              phase === "submitting" ? styles.titleHidden : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {TITLE}
          </h1>
        )}

        {/* intro "주여" word */}
        {phase === "intro" && (
          <div className={styles.juyeoLayer}>
            <span className={`${styles.juyeo} ${styles.juyeoBase}`}>주여</span>
          </div>
        )}

        {/* intro2 motion-blur echoes */}
        {phase === "intro2" && (
          <div className={styles.juyeoLayer}>
            <span className={`${styles.juyeo} ${styles.juyeoBase}`}>주여</span>
            <span className={`${styles.juyeo} ${styles.juyeoEcho} ${styles.juyeoEcho1}`}>
              주여
            </span>
            <span className={`${styles.juyeo} ${styles.juyeoEcho} ${styles.juyeoEcho2}`}>
              주여
            </span>
            <span className={`${styles.juyeo} ${styles.juyeoEcho} ${styles.juyeoEcho3}`}>
              주여
            </span>
          </div>
        )}

        {/* Orb */}
        <div className={orbWrapClass}>
          <ChromeBall className={styles.orbCanvas} />
          {(phase === "typing" ||
            phase === "complete" ||
            phase === "submitting") && (
            <span
              className={[
                styles.orbName,
                name.length === 0 && !(phase === "typing" && focused)
                  ? styles.orbPlaceholder
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {name.length === 0
                ? phase === "typing" && focused
                  ? ""
                  : PLACEHOLDER
                : name}
              {phase === "typing" && focused && (
                <span className={styles.caret} />
              )}
            </span>
          )}
        </div>

        {/* Cross of light during submit */}
        {phase === "submitting" && (
          <div className={`${styles.cross} ${styles.crossActive}`}>
            <span className={`${styles.beam} ${styles.beamV}`} />
            <span className={`${styles.beam} ${styles.beamH}`} />
            <span className={styles.crossGlow} />
          </div>
        )}

        {/* Hidden input to capture typing */}
        <input
          ref={inputRef}
          className={styles.hiddenInput}
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmName();
          }}
          aria-label="이름 입력"
        />

        {/* CTA */}
        {(phase === "complete" || phase === "submitting") && (
          <button className={ctaClass} onClick={submitPrayer}>
            기도합니다
          </button>
        )}

        {/* Done screen */}
        {phase === "done" && (
          <>
            <div className={styles.doneOrbTop}>
              <ChromeBall className={styles.orbCanvas} />
            </div>
            <div className={styles.doneCounter}>
              <div className={styles.doneCount}>
                {prayCount}/{PRAY_TOTAL} 주여볼
              </div>
              <div className={styles.doneName}>{name || "SayQ"}</div>
            </div>
          </>
        )}

        {/* Hint */}
        {phase === "typing" && (
          <div className={styles.hint}>
            {focused ? "Enter로 완료" : "화면을 탭하여 이름을 입력하세요"}
          </div>
        )}
      </div>
    </div>
  );
}
