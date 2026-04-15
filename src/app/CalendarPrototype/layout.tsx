import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AmeriLife Consolidated Calendar Prototype",
};

export default function CalendarPrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
