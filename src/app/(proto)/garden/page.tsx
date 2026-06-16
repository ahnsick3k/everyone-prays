"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProtoCompleteChip from "@/components/ProtoCompleteChip";
import styles from "./garden.module.css";

type Phase =
  | "intro1"
  | "intro2"
  | "typing"
  | "seed1"
  | "seed2"
  | "seed3"
  | "seed4"
  | "output";

const PLACEHOLDER = "여기를 눌러 타이핑하세요";
const TITLE = "오늘 기도는\n누구를 위해 심을까요?";

export default function GardenPage() {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const after = useCallback((ms: number, next: () => void) => {
    const timer = setTimeout(next, ms);
    timers.current.push(timer);
  }, []);

  useEffect(() => {
    if (phase === "intro1") after(1200, () => setPhase("intro2"));
    if (phase === "intro2") after(1100, () => setPhase("typing"));
    if (phase === "seed1") after(320, () => setPhase("seed2"));
    if (phase === "seed2") after(720, () => setPhase("seed3"));
    if (phase === "seed3") after(540, () => setPhase("seed4"));
    if (phase === "seed4") after(820, () => setPhase("output"));
  }, [after, phase]);

  useEffect(() => {
    if (phase !== "typing") return;

    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    timers.current.push(timer);
  }, [phase]);

  useEffect(() => {
    const timerList = timers.current;
    return () => {
      timerList.forEach(clearTimeout);
    };
  }, []);

  const confirmName = useCallback(() => {
    if (name.trim().length === 0) return;
    inputRef.current?.blur();
    setPhase("seed1");
  }, [name]);

  const resetFlow = useCallback(() => {
    setName("");
    setPhase("intro1");
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    }
  }, []);

  const isTyping = phase === "typing";
  const isSeedPhase =
    phase === "seed1" ||
    phase === "seed2" ||
    phase === "seed3" ||
    phase === "seed4";
  const prayerLabel = useMemo(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1);
    const dd = String(today.getDate());
    return `${name.trim() || "이 이름"} 씨앗을\n${mm}/${dd}, 기도로 심을게요`;
  }, [name]);

  return (
    <div className={styles.root}>
      <div className={styles.stage}>
        <video
          ref={videoRef}
          className={styles.sceneVideo}
          src="/garden/background.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div
          className={[
            styles.sceneOverlay,
            phase === "intro2" || isTyping ? styles.sceneOverlaySoft : "",
            isSeedPhase ? styles.sceneOverlayDark : "",
            phase === "output" ? styles.sceneOverlayOutput : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <div
          className={[
            styles.seedTint,
            phase === "seed2" ? styles.seedTintBurst : "",
            phase === "seed3" ? styles.seedTintPurpleRise : "",
            phase === "seed4" ? styles.seedTintPurpleSettle : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {(phase === "intro1" || phase === "intro2" || isTyping) && (
          <div
            className={[
              styles.copyBlock,
              phase === "intro1" ? styles.copyBlockIntro : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <h1 className={styles.title}>
              {TITLE.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
          </div>
        )}

        {isTyping && (
          <>
            <div className={[styles.inputWrap, styles.inputWrapIntro].join(" ")}>
              <input
                ref={inputRef}
                className={styles.inputField}
                value={name}
                maxLength={20}
                inputMode="text"
                enterKeyHint="done"
                placeholder={PLACEHOLDER}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    confirmName();
                  }
                }}
                aria-label="이름 입력"
              />
            </div>
            {name.trim().length > 0 && (
              <ProtoCompleteChip
                className={styles.enterChip}
                onClick={confirmName}
              />
            )}
          </>
        )}

        {isSeedPhase && (
          <>
            <div className={styles.seedCopy}>
              {prayerLabel.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
            <div
              className={[
                styles.seedSprite,
                phase === "seed2" ? styles.seedSpriteFalling : "",
                phase === "seed3" || phase === "seed4" ? styles.seedSpriteGone : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
            <div
              className={[
                styles.sparkleBurst,
                phase === "seed2" ? styles.sparkleBurstActive : "",
                phase === "seed3" || phase === "seed4" ? styles.sparkleBurstSettled : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            >
              <span className={styles.sparkle} />
              <span className={styles.sparkle} />
              <span className={styles.sparkle} />
              <span className={styles.sparkle} />
              <span className={styles.sparkle} />
              <span className={styles.sparkle} />
            </div>
          </>
        )}

        {phase === "output" && (
          <div className={styles.outputPanel}>
            <p className={styles.outputCopy}>
              <span>심어둔 기도를</span>
              <span>만나러 내일 다시 와요!</span>
            </p>
            <button
              type="button"
              className={styles.outputButton}
              onClick={resetFlow}
            >
              내일 올게요.
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
