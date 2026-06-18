"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppChrome } from "@/components/layout/app-chrome";
import { TypingTest } from "@/components/typing/typing-test";

export default function Page() {
  const { settingsOpen, setTypingActive, homeLogoHandlerRef } = useAppChrome();
  const [isFinished, setIsFinished] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    homeLogoHandlerRef.current = () => {
      setIsFinished(false);
      setRestartKey((k) => k + 1);
    };
    return () => {
      homeLogoHandlerRef.current = null;
    };
  }, [homeLogoHandlerRef]);

  const handleTypingActiveChange = useCallback(
    (active: boolean) => {
      setTypingActive(active);
    },
    [setTypingActive]
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 pt-14">
      <main
        className={
          isFinished
            ? "w-full max-w-5xl"
            : "flex w-full max-w-5xl items-center justify-center"
        }
      >
        <TypingTest
          key={restartKey}
          onFinished={setIsFinished}
          onTypingActiveChange={handleTypingActiveChange}
          pauseTypingInputRefocus={settingsOpen}
        />
      </main>
    </div>
  );
}
