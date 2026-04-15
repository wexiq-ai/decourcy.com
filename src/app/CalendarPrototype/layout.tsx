import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AmeriLife Consolidated Calendar Prototype",
};

export default function CalendarPrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${poppins.variable}`}
      style={{ fontFamily: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
