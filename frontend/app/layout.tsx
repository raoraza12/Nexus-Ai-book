import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nexus Ai",
    template: "%s | Nexus Ai",
  },
  description:
    "An AI-powered book reading and learning platform. Track your progress, get AI-generated insights, and supercharge your reading.",
  keywords: ["Nexus Ai", "AI", "books", "reading", "learning", "platform"],
  authors: [{ name: "Nexus Ai Team" }],
  openGraph: {
    type: "website",
    title: "Nexus Ai",
    description: "AI-powered reading and learning platform",
  },
};

import { LanguageProvider } from "@/context/language-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-zinc-900 bg-white dark:text-zinc-50 dark:bg-black selection:bg-indigo-500/30`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
