import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { asset, site } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://abhishekchugh707.github.io"),
  title: `${site.fullName} | ${site.role}`,
  description: site.description,
  icons: { icon: asset("/icon.svg"), apple: asset("/apple-icon.png") },
  openGraph: {
    title: `${site.fullName} | ${site.role}`,
    description: site.description,
    images: [asset("/me.jpg")],
    type: "website",
  },
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
      </head>
      <body>{children}</body>
    </html>
  );
}
