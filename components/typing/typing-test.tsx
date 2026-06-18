"use client";

import { ArrowClockwise, Cursor } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { FAAH_SOUNDS, useSettings } from "@/components/settings/settings-provider";
import { ResultsScreen } from "@/components/typing/results";
import { TestControls } from "@/components/typing/test-controls";
import { WordItem } from "@/components/typing/word-item";
import { useTypingTest } from "@/hooks/use-typing-test";
import { cn } from "@/lib/utils";

interface TypingTestProps {
  onFinished?: (finished: boolean) => void;
  onTypingActiveChange?: (active: boolean) => void;
  pauseTypingInputRefocus?: boolean;
}

export function TypingTest(props: TypingTestProps) {
  const { liveStats, faahMode, faahSound } = useSettings();
  const faahAudioRef = useRef<HTMLAudioElement | null>(null);
  const faahCtxRef = useRef<AudioContext | null>(null);

  const onWrongKey = useCallback(() => {
    if (!faahMode) return;

    if (faahSound === "buzz") {
      if (!faahCtxRef.current) {
        faahCtxRef.current = new AudioContext();
      }
      const ctx = faahCtxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 150;
      g.gain.value = 0.08;
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.15);
      return;
    }

    const src = FAAH_SOUNDS.find((s) => s.id === faahSound)?.src;
    if (!src) return;
    if (!faahAudioRef.current || faahAudioRef.current.src !== src) {
      faahAudioRef.current = new Audio(src);
    }
    const el = faahAudioRef.current;
    el.currentTime = 0;
    el.volume = 0.4;
    el.play().catch(() => {});
  }, [faahMode, faahSound]);

  const {
    mode,
    timeOption,
    wordOption,
    quoteLength,
    punctuation,
    numbers,
    difficulty,
    words,
    typed,
    wordIndex,
    started,
    rowOffset,
    timeLeft,
    wordInputs,
    isFocused,
    resetting,
    isActivelyTyping,
    screenFade,
    wpm,
    accuracy,
    controlsVisible,
    showResults,
    frozenStats,
    inputRef,
    wordsContainerRef,
    activeWordRef,
    handleKeyDown,
    handleFocus,
    handleInputBlur,
    handleInputFocus,
    handleMouseMove,
    handleResultsRestart,
    handleResultsNext,
    onModeChange,
    onTimeOptionChange,
    onWordOptionChange,
    onQuoteLengthChange,
    onPunctuationToggle,
    onNumbersToggle,
    onDifficultyToggle,
    onRestart,
  } = useTypingTest({ ...props, onWrongKey });

  if (showResults) {
    return (
      <div
        className="w-full"
        style={{
          opacity: screenFade,
          filter: screenFade < 1 ? "blur(6px)" : "none",
        }}
      >
        <ResultsScreen
          onNext={handleResultsNext}
          onRestart={handleResultsRestart}
          stats={frozenStats!}
        />
      </div>
    );
  }

  let wordsOpacity = 0.15;
  if (resetting) wordsOpacity = 0;
  else if (isFocused) wordsOpacity = 1;

  return (
    <div
      className="flex w-full flex-col items-center gap-4 transition-all duration-150 ease-out"
      onClick={handleFocus}
      onMouseMove={handleMouseMove}
      style={{
        opacity: screenFade,
        filter: screenFade < 1 ? "blur(6px)" : "none",
      }}
    >
      <TestControls
        controlsVisible={controlsVisible}
        difficulty={difficulty}
        mode={mode}
        numbers={numbers}
        onDifficultyToggle={onDifficultyToggle}
        onModeChange={onModeChange}
        onNumbersToggle={onNumbersToggle}
        onPunctuationToggle={onPunctuationToggle}
        onQuoteLengthChange={onQuoteLengthChange}
        onRestart={onRestart}
        onTimeOptionChange={onTimeOptionChange}
        onWordOptionChange={onWordOptionChange}
        punctuation={punctuation}
        quoteLength={quoteLength}
        timeOption={timeOption}
        wordOption={wordOption}
      />

      {/* Live stats bar — outside the box */}
      <div className="flex w-full items-center justify-end px-1">
        <div
          className={cn(
            "flex items-baseline gap-5 transition-opacity duration-200",
            started ? "opacity-100" : "opacity-0"
          )}
        >
          {mode === "time" && (
            <span className="tabular-nums">
              <span className="font-bold text-foreground text-xl">
                {timeLeft}
              </span>
              <span className="ml-0.5 text-muted-foreground/50 text-xs">s</span>
            </span>
          )}
          {mode === "words" && (
            <span className="tabular-nums">
              <span className="font-bold text-foreground text-xl">
                {wordIndex}
              </span>
              <span className="text-muted-foreground/50 text-xs">
                /{wordOption}
              </span>
            </span>
          )}
          {liveStats && (
            <>
              <span className="tabular-nums">
                <span className="font-bold text-foreground text-xl">
                  {wpm}
                </span>
                <span className="ml-0.5 text-muted-foreground/50 text-xs">
                  wpm
                </span>
              </span>
              <span className="tabular-nums">
                <span className="font-bold text-foreground text-xl">
                  {accuracy}
                </span>
                <span className="text-muted-foreground/50 text-xs">%</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Typing card — text only */}
      <div className="glass-card w-full rounded-2xl p-6 sm:p-8">
        <div
          className={cn(
            "relative h-[9rem] sm:h-[10rem] w-full overflow-hidden text-2xl leading-relaxed sm:text-3xl sm:leading-relaxed",
            isActivelyTyping && "is-typing"
          )}
          ref={wordsContainerRef}
          style={{ fontFamily: "var(--typing-font)" }}
        >
          <input
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            autoFocus
            className="absolute opacity-0"
            onBlur={handleInputBlur}
            onChange={() => {}}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            spellCheck={false}
            value={typed}
          />

          <motion.div
            animate={{
              y: -rowOffset,
              opacity: wordsOpacity,
              filter: resetting ? "blur(6px)" : "blur(0px)",
            }}
            className="flex flex-wrap gap-x-3 gap-y-1.5"
            transition={
              resetting
                ? { duration: 0.15, ease: "easeOut" }
                : { type: "spring", stiffness: 300, damping: 30, mass: 0.8 }
            }
          >
            {words.map((word, wIdx) => {
              const isActive = wIdx === wordIndex;
              const isPast = wIdx < wordIndex;
              const isFuture = !(isActive || isPast);
              let displayInput = "";
              if (isActive) displayInput = typed;
              else if (isPast) displayInput = wordInputs[wIdx] ?? "";
              const hasError = isPast && wordInputs[wIdx] !== word;

              return (
                <WordItem
                  displayInput={displayInput}
                  elemRef={isActive ? activeWordRef : undefined}
                  hasError={hasError}
                  isActive={isActive}
                  isPast={isPast}
                  key={`${word}-${wIdx}`}
                  word={word}
                />
              );
            })}
          </motion.div>

          <AnimatePresence>
            {!isFocused && (
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center gap-3 backdrop-blur-[2px]"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="focus-overlay"
                onClick={() => inputRef.current?.focus()}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 text-muted-foreground/70 text-sm">
                  <Cursor size={16} weight="duotone" />
                  <span>Click or press any key</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-center gap-4">
        <RestartButton controlsVisible={controlsVisible} onRestart={onRestart} />
      </div>

      <motion.div
        animate={{ opacity: controlsVisible ? 1 : 0 }}
        className="flex items-center gap-1.5 text-[10px] text-muted-foreground/30"
        transition={{ duration: 0.4 }}
      >
        <kbd className="rounded-md border border-foreground/10 bg-foreground/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground/40">
          tab
        </kbd>
        <span>+</span>
        <kbd className="rounded-md border border-foreground/10 bg-foreground/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground/40">
          enter
        </kbd>
        <span className="ml-0.5">restart</span>
      </motion.div>
    </div>
  );
}

function RestartButton({
  controlsVisible,
  onRestart,
}: {
  controlsVisible: boolean;
  onRestart: () => void;
}) {
  const [spinning, setSpinning] = useState(false);

  function handleClick() {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 600);
    onRestart();
  }

  return (
    <motion.button
      animate={{ opacity: controlsVisible ? 1 : 0.15 }}
      className={cn(
        "rounded-xl p-2 text-muted-foreground/50 transition-colors hover:text-foreground",
        !controlsVisible && "pointer-events-none"
      )}
      onClick={handleClick}
      title="Restart"
      transition={{ duration: 0.4 }}
    >
      <span
        style={{
          display: "inline-flex",
          transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
          transform: spinning ? "rotate(360deg)" : "rotate(0deg)",
        }}
      >
        <ArrowClockwise size={16} />
      </span>
    </motion.button>
  );
}
