import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Immo 1301 AG | Immobilien in der Schweiz",
  description:
    "Immo 1301 AG – Ihr Partner für Immobilien. Erwerb, Entwicklung, Vermietung und Verwaltung von Liegenschaften in der Schweiz und international.",
  keywords:
    "Immobilien, Schweiz, Freienbach, Immobilienverwaltung, Immobilienentwicklung, Investitionen",
  openGraph: {
    title: "Immo 1301 AG | Immobilien in der Schweiz",
    description:
      "Erwerb, Entwicklung, Vermietung und Verwaltung von Liegenschaften.",
    type: "website",
    locale: "de_CH",
    url: "https://immo1301.ch",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
