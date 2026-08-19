import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Chatbot from "./components/store/Chatbot";
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
  title: "Pilas Panasonic Laguna",
  description:
    "Pilas Panasonic alcalinas, litio, recargables y baterías especiales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}