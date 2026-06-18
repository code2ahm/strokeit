"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { FONT_OPTIONS, type TypingFont } from "@/lib/font-options";
import { THEME_OPTIONS, type ThemeName } from "@/lib/theme-options";

export {
  FONT_OPTIONS,
  type FontOption,
  type TypingFont,
} from "@/lib/font-options";
export { THEME_OPTIONS, type ThemeName } from "@/lib/theme-options";

export const FAAH_SOUNDS = [
  { id: "buzz", label: "Buzz", src: "" },
  { id: "fahhhhh", label: "Fahhhhh", src: "/sounds/errors/fahhhhh.mp3" },
  { id: "ughh", label: "Ughh", src: "/sounds/errors/ughh.mp3" },
  { id: "alert", label: "Alert", src: "/sounds/errors/alert.mp3" },
  { id: "fart", label: "Fart", src: "/sounds/errors/fart.mp3" },
  { id: "fart 2", label: "Fart 2", src: "/sounds/errors/fart 2.mp3" },
  { id: "danger", label: "Danger", src: "/sounds/errors/danger.mp3" },
  { id: "thud", label: "Thud", src: "/sounds/errors/thud.mp3" },
  { id: "spring jump", label: "Spring Jump", src: "/sounds/errors/spring jump.mp3" },
] as const;

export type FaahSoundId = (typeof FAAH_SOUNDS)[number]["id"];

export const STROKE_SOUNDS = [
  { id: "sound.ogg", label: "Original", src: "/sounds/keystroke/sound.ogg", type: "sprite" as const },
  { id: "sound 1", label: "Sound 1", src: "/sounds/keystroke/sound 1.mp3", type: "file" as const },
  { id: "sound 2", label: "Sound 2", src: "/sounds/keystroke/sound 2.mp3", type: "file" as const },
  { id: "sound 3", label: "Sound 3", src: "/sounds/keystroke/sound 3.mp3", type: "file" as const },
  { id: "sound 4", label: "Sound 4", src: "/sounds/keystroke/sound 4.mp3", type: "file" as const },
] as const;

export type StrokeSoundId = (typeof STROKE_SOUNDS)[number]["id"];

interface SettingsContextType {
  accent: ThemeName;
  faahMode: boolean;
  faahSound: FaahSoundId;
  font: TypingFont;
  fontCssFamily: string;
  liveStats: boolean;
  setAccent: (c: ThemeName) => void;
  setFaahMode: (v: boolean) => void;
  setFaahSound: (v: FaahSoundId) => void;
  setFont: (f: TypingFont) => void;
  setLiveStats: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  setSoundVolume: (v: number) => void;
  setStrokeSound: (v: StrokeSoundId) => void;
  soundEnabled: boolean;
  soundVolume: number;
  strokeSound: StrokeSoundId;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

function loadGoogleFont(family: string) {
  const id = `gf-${family}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  document.head.appendChild(link);
}

function applyAccentToDom(accent: ThemeName) {
  document.documentElement.setAttribute("data-accent", accent);
}

function applyFontToDom(fontId: TypingFont) {
  const option = FONT_OPTIONS.find((f) => f.id === fontId);
  if (!option) return;
  if (option.googleFamily) {
    loadGoogleFont(option.googleFamily);
  }
  document.documentElement.style.setProperty("--typing-font", option.cssFamily);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<ThemeName>("ocean");
  const [font, setFontState] = useState<TypingFont>("geist-mono");
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [soundVolume, setSoundVolumeState] = useState(1.0);
  const [liveStats, setLiveStatsState] = useState(true);
  const [faahMode, setFaahModeState] = useState(true);
  const [faahSound, setFaahSoundState] = useState<FaahSoundId>("buzz");
  const [strokeSound, setStrokeSoundState] = useState<StrokeSoundId>("sound 2");

  useEffect(() => {
    const validThemes = new Set<string>(THEME_OPTIONS.map((t) => t.id));
    const rawAccent = localStorage.getItem("si-accent");
    const savedFont = localStorage.getItem("si-font") as TypingFont | null;
    const savedSoundEnabled = localStorage.getItem("si-sound-enabled");
    const savedSoundVolume = localStorage.getItem("si-sound-volume");
    const savedRealtimeWpm = localStorage.getItem("si-realtime-wpm");
    const savedFaahMode = localStorage.getItem("si-faah-mode");
    const savedFaahSound = localStorage.getItem("si-faah-sound");
    const savedStrokeSound = localStorage.getItem("si-stroke-sound");

    const initialAccent =
      rawAccent && validThemes.has(rawAccent)
        ? (rawAccent as ThemeName)
        : "ocean";
    setAccentState(initialAccent);
    applyAccentToDom(initialAccent);

    if (savedFont) {
      setFontState(savedFont);
      applyFontToDom(savedFont);
    }
    if (savedSoundEnabled !== null) {
      setSoundEnabledState(savedSoundEnabled !== "false");
    }
    if (savedSoundVolume !== null) {
      const v = Number(savedSoundVolume);
      if (Number.isFinite(v) && v >= 0 && v <= 1) {
        setSoundVolumeState(v);
      }
    }
    if (savedRealtimeWpm !== null) {
      setLiveStatsState(savedRealtimeWpm === "true");
    }
    if (savedFaahMode !== null) {
      setFaahModeState(savedFaahMode === "true");
    }
    if (savedFaahSound) {
      const valid = new Set(FAAH_SOUNDS.map((s) => s.id));
      if (valid.has(savedFaahSound as FaahSoundId)) {
        setFaahSoundState(savedFaahSound as FaahSoundId);
      }
    }
    if (savedStrokeSound) {
      const valid = new Set(STROKE_SOUNDS.map((s) => s.id));
      if (valid.has(savedStrokeSound as StrokeSoundId)) {
        setStrokeSoundState(savedStrokeSound as StrokeSoundId);
      }
    }
  }, []);

  const setAccent = (c: ThemeName) => {
    setAccentState(c);
    applyAccentToDom(c);
    localStorage.setItem("si-accent", c);
  };

  const setFont = (f: TypingFont) => {
    setFontState(f);
    applyFontToDom(f);
    localStorage.setItem("si-font", f);
  };

  const setSoundEnabled = (v: boolean) => {
    setSoundEnabledState(v);
    localStorage.setItem("si-sound-enabled", String(v));
  };

  const setSoundVolume = (v: number) => {
    setSoundVolumeState(v);
    localStorage.setItem("si-sound-volume", String(v));
  };

  const setLiveStats = (v: boolean) => {
    setLiveStatsState(v);
    localStorage.setItem("si-realtime-wpm", String(v));
  };

  const setFaahMode = (v: boolean) => {
    setFaahModeState(v);
    localStorage.setItem("si-faah-mode", String(v));
  };

  const setFaahSound = (v: FaahSoundId) => {
    setFaahSoundState(v);
    localStorage.setItem("si-faah-sound", v);
  };

  const setStrokeSound = (v: StrokeSoundId) => {
    setStrokeSoundState(v);
    localStorage.setItem("si-stroke-sound", v);
  };

  const fontCssFamily =
    FONT_OPTIONS.find((f) => f.id === font)?.cssFamily ?? "var(--font-mono)";

  return (
    <SettingsContext.Provider
      value={{
        accent,
        setAccent,
        font,
        setFont,
        fontCssFamily,
        soundEnabled,
        setSoundEnabled,
        soundVolume,
        setSoundVolume,
        liveStats,
        setLiveStats,
        faahMode,
        setFaahMode,
        faahSound,
        setFaahSound,
        strokeSound,
        setStrokeSound,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
