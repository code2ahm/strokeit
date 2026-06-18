"use client";

import type { ReactNode } from "react";
import { useSettings } from "@/components/settings/settings-provider";
import { KeySoundProvider } from "@/components/ui/keyboard/sound-provider";

export function SoundLayer({ children }: { children: ReactNode }) {
  const { soundEnabled, soundVolume, strokeSound } = useSettings();
  return (
    <KeySoundProvider enabled={soundEnabled} volume={soundVolume} strokeSound={strokeSound}>
      {children}
    </KeySoundProvider>
  );
}
