import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retirement Quest",
  description:
    "An 8-bit side-scrolling quest for retirement. Spoiler: you won't make it.",
  icons: {
    icon: "/QuestForRetirement/icon.svg",
  },
};

export default function QuestForRetirementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
