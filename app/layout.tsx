import type { Metadata } from "next";
import { ReadingPrefsProvider } from "@/components/ReadingPrefsProvider";
import { READING_PREFS_BOOT_SCRIPT } from "@/lib/reading-prefs";
import "../css/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Myanmar Discovery",
  description:
    "A quiet editorial introduction to Myanmar: its history, culture, and must-see places. For visitors who know little about the country, and want to see it clearly.",
  applicationName: "Myanmar Discovery",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Myanmar Discovery",
    description:
      "A quiet editorial introduction to Myanmar: its history, culture, and must-see places.",
    type: "website",
    locale: "en",
  },
};

export const viewport = {
  themeColor: "#110703",
  width: "device-width" as const,
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: READING_PREFS_BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReadingPrefsProvider>{children}</ReadingPrefsProvider>
      </body>
    </html>
  );
}
