"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

function buildFaviconSvg(accent: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${accent}"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0.6"/>
      </linearGradient>
    </defs>
    <path d="M14 38c8-6 12-14 10-20-2-6-8-8-14-4s-6 12 0 16c6 4 14 2 20-4s8-14 6-22" stroke="url(#fg)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M38 14c-2 8-6 14-12 16" stroke="url(#fg)" stroke-width="3" stroke-linecap="round" fill="none"/>
  </svg>`;
}

function resolveAccentColor(): string {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;left:-9999px;width:0;height:0";
  probe.style.color = "var(--primary)";
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

export function DynamicFavicon() {
  const { resolvedTheme } = useTheme();
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    if (!linkRef.current) {
      linkRef.current = document.querySelector('link[rel="icon"]');
    }
    const link = linkRef.current;
    if (!link) return;

    const accent = resolveAccentColor();
    const svg = buildFaviconSvg(accent);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    link.href = url;
    return () => URL.revokeObjectURL(url);
  }, [resolvedTheme]);

  return null;
}
