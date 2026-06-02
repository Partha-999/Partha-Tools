import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://parthatools.me"),
  title: {
    default: "ParthaTools | Modern Utility Tools",
    template: "%s | ParthaTools",
  },
  description:
    "ParthaTools is a modern utility homepage for developer, PDF, image, text, and web tools.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ParthaTools | Modern Utility Tools",
    description: "ParthaTools is a modern utility homepage for developer, PDF, image, text, and web tools.",
    url: "https://parthatools.me",
    siteName: "ParthaTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ParthaTools | Modern Utility Tools",
    description: "ParthaTools is a modern utility homepage for developer, PDF, image, text, and web tools.",
  },
  verification: {
    google: "nm7dxRroL7dqwW2pCrvUdwTGtG6eyhI8fwT7N711V18",
  },
};

const themeScript = `
(function () {
  try {
    var storageKey = 'partha-tools-theme';
    var storedTheme = localStorage.getItem(storageKey);
    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : systemTheme;
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch (error) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <GoogleAnalytics gaId="G-KMEQ7X33EL" />
      </body>
    </html>
  );
}
