import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Untitled document - Camo Note",
  description: "Camo Note — write with masking.",
};

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
