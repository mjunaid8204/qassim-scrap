import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Qassim Scrap Market | سوق سكراب القصيم وبريدة",
  description: "Buy and sell industrial and household scrap in Buraidah, Unaizah, and Qassim region. Best rates for copper, iron, batteries, and old machinery with instant WhatsApp quotes.",
  keywords: "scrap Buraidah, Qassim scrap market, sell copper Buraidah, سكراب بريدة, حراج السكراب القصيم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}