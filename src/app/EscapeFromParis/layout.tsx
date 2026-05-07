import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Escape from Paris",
  description:
    "A game about pickpockets, bureaucracy, and a man with a Hermès scarf and no sense of self-preservation.",
  icons: {
    icon: "/EscapeFromParis/icon.svg",
  },
};

export default function EscapeFromParisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
