import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { asset, site } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://abhishekchugh707.github.io"),
  title: `${site.fullName} | ${site.role}`,
  description: site.description,
  icons: {
    icon: [
      { url: asset("/favicon.ico"), sizes: "any" },
      { url: asset("/icon-32.png"), type: "image/png", sizes: "32x32" },
      { url: asset("/icon-512.png"), type: "image/png", sizes: "512x512" },
    ],
    apple: asset("/apple-icon.png"),
  },
  openGraph: {
    title: `${site.fullName} | ${site.role}`,
    description: site.description,
    images: [{ url: asset("/og-image.png"), width: 1200, height: 630, alt: "Abhishek Chugh, Software Developer" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: [asset("/og-image.png")] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#171716" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('portfolio-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Visitor stats (GoatCounter): cookie-free, no personal data. Dashboard: abhishekchugh.goatcounter.com */}
        {process.env.NEXT_PUBLIC_ANALYTICS !== "off" && (
          <script data-goatcounter="https://abhishekchugh.goatcounter.com/count" async src="https://gc.zgo.at/count.js" />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
