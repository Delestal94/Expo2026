import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-unbounded",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-jetbrains-mono",
});

const title = "ExpoJuy 2026";
const description =
  "Sitio oficial de ExpoJuy 2026 — 9 al 12 de octubre, Ciudad Cultural, Jujuy.";

export const metadata: Metadata = {
  metadataBase: new URL("https://expojuy2026.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: title,
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${unbounded.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
