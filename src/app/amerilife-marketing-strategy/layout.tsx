import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AmeriLife Marketing Strategy",
};

export default function AmeriLifeMarketingStrategyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
