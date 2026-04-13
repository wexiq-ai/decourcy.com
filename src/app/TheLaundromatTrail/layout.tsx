import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Laundromat Trail",
  description:
    "A game about dreams, laundry, and terrible business partners.",
  icons: {
    icon: "/TheLaundromatTrail/icon.svg",
  },
};

export default function TheLaundromatTrailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
