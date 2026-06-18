"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import { getSoundBuffer } from "@/lib/audio-preloader";
import type { StrokeSoundId } from "@/components/settings/settings-provider";
import { STROKE_SOUNDS } from "@/components/settings/settings-provider";
import { SOUND_DEFINES_DOWN, SOUND_DEFINES_UP } from "./sound";

const SoundContext = createContext<boolean>(true);

export function useSoundEnabled() {
  return useContext(SoundContext);
}

const fileBufferCache = new Map<string, AudioBuffer>();

export function KeySoundProvider({
  children,
  enabled,
  volume = 1.0,
  strokeSound = "sound.ogg",
}: {
  children: ReactNode;
  enabled: boolean;
  volume?: number;
  strokeSound?: StrokeSoundId;
}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const fileBufferRef = useRef<AudioBuffer | null>(null);

  const soundDef = STROKE_SOUNDS.find((s) => s.id === strokeSound);
  const isSprite = soundDef?.type === "sprite";

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    const resume = () => {
      if (ctx.state === "suspended") ctx.resume();
    };
    document.addEventListener("keydown", resume, { once: true });
    document.addEventListener("pointerdown", resume, { once: true });

    if (isSprite) {
      getSoundBuffer()
        .then((ab) => (ab ? ctx.decodeAudioData(ab.slice(0)) : null))
        .then((decoded) => {
          if (!cancelled && decoded) {
            audioBufferRef.current = decoded;
          }
        })
        .catch(() => {});
    } else if (soundDef?.src) {
      const cached = fileBufferCache.get(soundDef.src);
      if (cached) {
        fileBufferRef.current = cached;
      } else {
        fetch(soundDef.src)
          .then((r) => (r.ok ? r.arrayBuffer() : null))
          .then((ab) => (ab ? ctx.decodeAudioData(ab) : null))
          .then((decoded) => {
            if (!cancelled && decoded) {
              fileBufferCache.set(soundDef.src, decoded);
              fileBufferRef.current = decoded;
            }
          })
          .catch(() => {});
      }
    }

    return () => {
      cancelled = true;
      audioBufferRef.current = null;
      fileBufferRef.current = null;
      audioContextRef.current = null;
      document.removeEventListener("keydown", resume);
      document.removeEventListener("pointerdown", resume);
      ctx.close();
    };
  }, [enabled, strokeSound]);

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const ctx = audioContextRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      if (isSprite) {
        const buf = audioBufferRef.current;
        if (!buf) return;
        const def = SOUND_DEFINES_DOWN[e.code];
        if (!def) return;
        const [startMs, durationMs] = def;
        const source = ctx.createBufferSource();
        source.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.value = volume * 5;
        source.connect(gain).connect(ctx.destination);
        source.start(0, startMs / 1000, durationMs / 1000);
      } else {
        const buf = fileBufferRef.current;
        if (!buf) return;
        const source = ctx.createBufferSource();
        source.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.value = volume * 5;
        source.connect(gain).connect(ctx.destination);
        source.start(0);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (isSprite) {
        const ctx = audioContextRef.current;
        const buf = audioBufferRef.current;
        if (!ctx || !buf) return;
        const def = SOUND_DEFINES_UP[e.code];
        if (!def) return;
        const [startMs, durationMs] = def;
        if (ctx.state === "suspended") ctx.resume();
        const source = ctx.createBufferSource();
        source.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.value = volume * 5;
        source.connect(gain).connect(ctx.destination);
        source.start(0, startMs / 1000, durationMs / 1000);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled, volume, strokeSound]);

  return (
    <SoundContext.Provider value={enabled}>
      {children}
    </SoundContext.Provider>
  );
}
