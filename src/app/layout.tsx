import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0f0f",
};

export const metadata: Metadata = {
  title: {
    default: "KODA Studio — Strony internetowe dla biznesów w Polsce",
    template: "%s | KODA Studio",
  },
  description:
    "Tworzymy niestandardowe strony internetowe dla polskich firm. Szybkie, skuteczne, dopasowane do Twojego biznesu.",
  keywords: ["strony internetowe", "web design", "Polska", "agencja", "KODA", "Warsaw"],
  authors: [{ name: "KODA Studio", url: "https://kodastrony.pl" }],
  creator: "KODA Studio",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://kodastrony.pl",
    siteName: "KODA Studio",
    title: "KODA Studio — Strony internetowe dla biznesów w Polsce",
    description:
      "Tworzymy niestandardowe strony internetowe dla polskich firm. Szybkie, skuteczne, dopasowane do Twojego biznesu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KODA Studio",
    description: "Tworzymy niestandardowe strony internetowe dla polskich firm.",
  },
  metadataBase: new URL("https://kodastrony.pl"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${syne.variable} ${inter.variable}`}>
      <body className="bg-dark text-off-white font-body antialiased flex flex-col min-h-svh">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
