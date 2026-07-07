"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CssBall from "./CssBall";
import styles from "./lordball.module.css";

type Phase = "idle" | "typing" | "ready" | "submitting" | "done";
type LetterBurst = { id: string; char: string; x0: number };

const PRAY_TOTAL = 7;
const prayCount = 3;

export default function LordballPage() {
  const [fontsReady, setFontsReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [name, setName] = useState("");
  const [bursts, setBursts] = useState<LetterBurst[]>([]);
  const idCounter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    document.fonts.load('400 1em IncheonJaram').then(() => {
      setFontsReady(true);
    }).catch(() => {
      setFontsReady(true);
    });
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const char = value.slice(-1);

    setName(value);

    if (value.trim().length > 0) {
      setPhase("ready");
    } else {
      setPhase("typing");
    }

    if (char !== "") {
      const id = String(++idCounter.current);
      const x0 = (Math.random() - 0.5) * 120;

      setBursts((prev) => [...prev, { id, char, x0 }]);

      const timer = setTimeout(() => {
        setBursts((prev) => prev.filter((burst) => burst.id !== id));
      }, 800);

      timers.current.push(timer);
    }
  };

  const handleFocus = () => {
    setPhase((prev) => (prev === "idle" ? "typing" : prev));
  };

  const handleSubmit = () => {
    if (phase !== "ready") {
      return;
    }

    setPhase("submitting");

    const timer = setTimeout(() => {
      setPhase("done");
    }, 2400);

    timers.current.push(timer);
  };

  if (!fontsReady) {
    return <main className={styles.root} />;
  }

  return (
    <main className={styles.root}>
      <div className={styles.stage}>
        <div className={styles.ambient} />

        {/* Title */}
        <AnimatePresence>
          {phase !== "done" && (
            <motion.div
              key="title"
              className={styles.titleBlock}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className={styles.title}>누구를 위한 기도방울인가요?</h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bubble */}
        <AnimatePresence>
          {phase !== "done" && (
            <motion.div
              key="bubble"
              className={[
                styles.bubbleWrap,
                phase === "submitting" ? styles.bubbleSubmitting : "",
              ].join(" ")}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0, y: -80 }}
              transition={{ duration: 0.6 }}
            >
              <CssBall />
              {name.trim().length > 0 && (
                <span className={styles.bubbleName}>{name.trim()}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Letter burst layer */}
        <div className={styles.letterBurstLayer}>
          <AnimatePresence>
            {bursts.map((b) => (
              <motion.span
                key={b.id}
                className={styles.letterBurst}
                style={{ left: `calc(50% + ${b.x0}px)` }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -90 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {b.char}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Input dock */}
        <AnimatePresence>
          {phase !== "done" && (
            <motion.div
              key="dock"
              className={styles.inputDock}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <input
                className={styles.nameInput}
                type="text"
                placeholder="이름을 적어주세요"
                value={name}
                onChange={handleNameChange}
                onFocus={handleFocus}
              />
              <AnimatePresence>
                {name.trim().length > 0 && (
                  <motion.button
                    key="cta"
                    className={styles.cta}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    onClick={handleSubmit}
                  >
                    기도합니다
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done view */}
        <AnimatePresence>
          {phase === "done" && (
            <motion.div
              key="done"
              className={styles.doneView}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.doneBubbleTop}>
                <CssBall />
                <span className={styles.doneNameInBubble}>{name.trim()}</span>
              </div>
              <p className={styles.doneCounter}>
                {prayCount}/{PRAY_TOTAL} 기도방울
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
