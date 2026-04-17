import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Mode",
};

export default function ReaderBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
