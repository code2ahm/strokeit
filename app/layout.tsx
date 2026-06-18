import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { AppChrome } from "@/components/layout/app-chrome";
import { DynamicFavicon } from "@/components/theme/dynamic-favicon";
import { SoundLayer } from "@/components/layout/sound-layer";
import { SettingsProvider } from "@/components/settings/settings-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { VisitTracker } from "@/components/visit-tracker";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Stroke it | Type with Sound",
    template: "%s | Stroke it",
  },
  description:
    "A typing test built around sound. Real keystroke audio, smooth performance tracking, and a calm dark interface.",
  keywords: [
    "stroke it",
    "typing test",
    "keystroke sounds",
    "mechanical keyboard",
    "wpm",
    "typing speed",
  ],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Stroke it | Type with Sound",
    description:
      "A typing test built around sound. Real keystroke audio, smooth performance tracking, and a calm dark interface.",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Stroke it | Type with Sound",
    description:
      "A typing test built around sound. Real keystroke audio, smooth performance tracking.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "antialiased",
        fontSans.variable,
        fontMono.variable,
        "font-sans"
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/sounds/keystroke/sound.ogg" rel="preload" as="fetch" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var a=localStorage.getItem("si-accent");if(a)document.documentElement.setAttribute("data-accent",a)}catch(e){}})()`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
      </head>
      <body className="bg-mesh">
        <ThemeProvider>
          <SettingsProvider>
            <DynamicFavicon />
            <VisitTracker />
            <SoundLayer>
              <AppChrome>{children}</AppChrome>
            </SoundLayer>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
