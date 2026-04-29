import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MVW — Wireframe",
};

export default function MVWLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
