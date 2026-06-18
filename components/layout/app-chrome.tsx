"use client";

import {
  DownloadSimple,
  GearSix,
  GithubLogo,
  Moon,
  SpeakerHigh,
  SpeakerSlash,
  Sun,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { useSettings } from "@/components/settings/settings-provider";
import { cn } from "@/lib/utils";

interface AppChromeContextValue {
  homeLogoHandlerRef: React.MutableRefObject<(() => void) | null>;
  setSettingsOpen: (open: boolean) => void;
  setTypingActive: (active: boolean) => void;
  settingsOpen: boolean;
  typingActive: boolean;
}

const AppChromeContext = createContext<AppChromeContextValue | null>(null);

export function useAppChrome() {
  const ctx = useContext(AppChromeContext);
  if (!ctx) {
    throw new Error("useAppChrome must be used within AppChrome");
  }
  return ctx;
}

export function AppChrome({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [typingActive, setTypingActive] = useState(false);
  const homeLogoHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSettingsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      settingsOpen,
      setSettingsOpen,
      typingActive,
      setTypingActive,
      homeLogoHandlerRef,
    }),
    [settingsOpen, typingActive]
  );

  return (
    <AppChromeContext.Provider value={value}>
      <div className="flex min-h-dvh w-full flex-col">
        <SiteHeader />
        {children}
      </div>
      <SettingsPanel onOpenChange={setSettingsOpen} open={settingsOpen} />
    </AppChromeContext.Provider>
  );
}

function SiteHeader() {
  const router = useRouter();
  const { setSettingsOpen, typingActive, homeLogoHandlerRef } = useAppChrome();
  const { soundEnabled, setSoundEnabled } = useSettings();

  const [mouseHeaderVisible, setMouseHeaderVisible] = useState(false);
  const headerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerVisible = !typingActive || mouseHeaderVisible;

  useEffect(
    () => () => {
      if (headerTimerRef.current) {
        clearTimeout(headerTimerRef.current);
      }
    },
    []
  );

  const handleHeaderMouseMove = useCallback(() => {
    if (!typingActive) return;
    setMouseHeaderVisible(true);
    if (headerTimerRef.current) {
      clearTimeout(headerTimerRef.current);
    }
    headerTimerRef.current = setTimeout(
      () => setMouseHeaderVisible(false),
      2500
    );
  }, [typingActive]);

  function handleLogoClick() {
    if (homeLogoHandlerRef.current) {
      homeLogoHandlerRef.current();
      return;
    }
    router.push("/");
  }

  const headerOpacity = typingActive ? (headerVisible ? 1 : 0) : 1;

  return (
    <motion.header
      animate={{ opacity: headerOpacity }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      onMouseMove={handleHeaderMouseMove}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="glass-card flex w-full max-w-3xl items-center justify-between rounded-2xl px-4 py-2.5">
        {/* Left - Logo */}
        <button
          className="group relative flex cursor-pointer items-center gap-2 font-semibold text-foreground text-sm tracking-tight"
          onClick={handleLogoClick}
          type="button"
        >
          <Image
            alt=""
            className="size-5"
            height={20}
            src="/favicon.svg"
            width={20}
          />
          <span>stroke it</span>
          <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground/10 px-2 py-1 text-[10px] text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            Stroke the keys
          </span>
        </button>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <ThemeToggleButton />

          <motion.button
            aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
            className={cn(
              "flex items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-2.5 py-1.5 text-[12px] transition-colors duration-150",
              soundEnabled
                ? "text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground"
                : "text-muted-foreground/35 hover:bg-foreground/[0.06] hover:text-muted-foreground"
            )}
            onClick={() => setSoundEnabled(!soundEnabled)}
            type="button"
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex"
              initial={{ scale: 0.6, opacity: 0 }}
              key={String(soundEnabled)}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {soundEnabled ? (
                <SpeakerHigh size={14} weight="duotone" />
              ) : (
                <SpeakerSlash size={14} weight="duotone" />
              )}
            </motion.span>
          </motion.button>

          <InstallButton />

          <motion.button
            aria-label="Settings"
            className="flex items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
            onClick={() => setSettingsOpen(true)}
            type="button"
            whileTap={{ scale: 0.97 }}
          >
            <GearSix size={14} weight="duotone" />
          </motion.button>

          <motion.a
            className="flex items-center gap-1.5 rounded-xl bg-foreground/10 px-2.5 py-1.5 text-[12px] text-foreground/70 transition-colors hover:bg-foreground/15 hover:text-foreground"
            href="https://github.com/code2ahm/strokeit"
            rel="noopener noreferrer"
            target="_blank"
            whileTap={{ scale: 0.96 }}
          >
            <GithubLogo size={14} weight="duotone" />
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}

function InstallButton() {
  const [installed, setInstalled] = useState(true);
  const deferredPrompt = useRef<Event | null>(null);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }
    setInstalled(false);

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed) return null;

  return (
    <motion.button
      aria-label="Install app"
      className="flex items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
      onClick={() => {
        if (deferredPrompt.current) {
          (deferredPrompt.current as Event & { prompt: () => void }).prompt();
          deferredPrompt.current = null;
        }
      }}
      type="button"
      whileTap={{ scale: 0.97 }}
    >
      <DownloadSimple size={14} weight="duotone" />
    </motion.button>
  );
}

function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-2.5 py-1.5">
        <div className="h-3.5 w-3.5" />
      </div>
    );
  }

  const isDark = theme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <motion.button
      aria-label="Toggle theme"
      className="flex items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
      onClick={() => setTheme(next)}
      type="button"
      whileTap={{ scale: 0.97 }}
    >
      {isDark ? <Sun size={14} weight="duotone" /> : <Moon size={14} weight="duotone" />}
    </motion.button>
  );
}
