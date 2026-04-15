"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* AmeriLife brand palette (from Mini Brand Guide, 12/06/23)
   Navy   #244260   primary
   Teal   #40A590   primary accent
   White  #FFFFFF
   Seafoam #71C495  secondary
   Grey   #C6C8CA   secondary
   Gold   #EFB54E   accent / CTA
   Font: Poppins (Light for headlines, Bold for subheads in teal, Regular for body)
*/

export default function AmeriLifeMarketingStrategyPage() {
  return (
    <div
      className="min-h-screen text-white pl-12 pr-4 md:px-6 pb-16 flex flex-col items-center"
      style={{
        backgroundColor: "#244260",
        fontFamily: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Brand gradient band: AmeriLife signature seafoam→teal→navy */}
      <div
        className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 h-1.5"
        style={{
          background:
            "linear-gradient(90deg, #71C495 0%, #40A590 45%, #244260 100%)",
        }}
      />

      {/* Page Header: wordmark + title */}
      <FadeIn>
        <div className="flex flex-col items-center pt-12 pb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-bold tracking-[0.18em] uppercase text-white leading-none">
              AmeriLife
            </span>
            <span className="text-[10px] md:text-xs text-white/70 font-semibold">
              ®
            </span>
          </div>
          <div
            className="h-px w-24 mt-4 mb-3"
            style={{ backgroundColor: "#40A590" }}
            aria-hidden
          />
          <h1 className="text-sm md:text-base font-semibold tracking-[0.25em] uppercase text-center" style={{ color: "#71C495" }}>
            Health &amp; Wealth Marketing Strategy
          </h1>
          <p className="text-[11px] md:text-xs font-medium text-white/60 mt-2 uppercase tracking-wider text-center">
            A Dual-Track Approach for 2026 and Beyond
          </p>
        </div>
        <LastUpdated />
      </FadeIn>

      {/* Opening Narrative */}
      <FadeIn>
        <NarrativeBlock>
          AmeriLife&apos;s competitive advantage shows up differently depending on the vertical. In Health, it&apos;s an entrepreneur-focused model where each affiliate owns its own identity and value proposition. In Wealth, it&apos;s the collective strength of the platform itself: relationships, contracts, capital access, and shared services that no single entity could replicate alone. This marketing strategy honors both realities by deploying two distinct approaches: a bottoms-up strategy for Health and a top-down strategy for Wealth. Together, they position AmeriLife for accelerated growth across both verticals.
        </NarrativeBlock>
      </FadeIn>

      {/* Full-width flow container */}
      <div className="flex flex-col items-center gap-0 w-full max-w-5xl">

        {/* ── SECTION 1: Strategic Foundation ── */}
        <FadeIn>
          <FlowBox
            step={1}
            label="Strategic Foundation"
            sublabel="Cross-Functional Alignment: Health Distribution, Wealth Distribution, Marketing, Ops+IT & Corporate Development (M&A)"
            variant="accent"
          />
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            This strategy begins with the alignment work already underway between Health Distribution, Wealth Distribution, Marketing, Ops+IT, and Corporate Development (M&amp;A) leadership. Neither track operates in isolation: both rely on shared infrastructure, coordinated messaging, and collaborative execution across all five functions.
          </NarrativeBlock>
        </FadeIn>

        <FadeIn>
          <BranchArrows leftLabel="Health" rightLabel="Wealth" />
        </FadeIn>

        {/* ── SECTION 2: Two Parallel Tracks ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">

          {/* ── LEFT COLUMN: Health Distribution ── */}
          <div className="flex flex-col items-center gap-0">
            <FadeIn>
              <ColumnHeader
                label="Health Distribution"
                sublabel={`"Bottoms-Up": Affiliate-Led Storytelling`}
              />
            </FadeIn>

            <FadeIn>
              <NarrativeBlockSmall>
                The Health strategy flips the traditional corporate marketing playbook. Instead of telling generic, top-level stories that cloud our true strengths, AmeriLife Corporate Marketing becomes a platform that tells affiliate stories through their own eyes and point of view, letting the affiliates own their narrative. The goal: position AmeriLife as the partner of choice for unaffiliated health insurance shops evaluating which organization to join. This approach directly serves AmeriLife&apos;s Corporate Development (M&amp;A) pipeline.
              </NarrativeBlockSmall>
            </FadeIn>

            <FadeIn>
              <FlowBox
                step={2}
                label="Affiliate Selection & Prioritization"
                sublabel="Top Affiliates by EBITDA, One Per Month, Starting H2 2026"
                size="sm"
              />
            </FadeIn>

            <FadeIn>
              <AffiliateList />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={3}
                label="On-Site Content Engagement"
                sublabel="Corporate Marketing Goes to Them, Embedded Capture"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={4}
                label="Agency-Specific Recruiting + Spotlight Videos"
                sublabel="Their Technology Story • Their Culture • Their Growth • Their Recruiting & Service Advantage"
                size="sm"
              />
            </FadeIn>

            <FadeIn>
              <AffiliateVideoDetail />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={5}
                label="Dual-Use Content Production"
                sublabel="Video + Editorial, For Affiliate Use & Corporate Promotion"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={6}
                label="Monthly Affiliate Spotlight Series"
                sublabel="One Featured Affiliate Per Month, Consistent, Structured Storytelling"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={7}
                label="Multi-Channel Distribution"
                sublabel="AmeriLife.com/blog • Social • Affiliate Co-Promotion"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={8}
                label={`"AmeriLife Is the Partner of Choice"`}
                sublabel="Brand Platform Theme, Every Piece of Content Ladders Here"
                variant="accent"
                size="sm"
              />
            </FadeIn>

            <FadeIn>
              <NarrativeBlockSmall>
                By leading with affiliate voices rather than corporate messaging, this strategy creates authentic social proof. An unaffiliated shop owner considering AmeriLife won&apos;t hear a sales pitch: they&apos;ll hear peers who kept their identity, grew their business, and chose AmeriLife because the model works for entrepreneurs.
              </NarrativeBlockSmall>
            </FadeIn>
          </div>

          {/* ── RIGHT COLUMN: Wealth Distribution ── */}
          <div className="flex flex-col items-center gap-0">
            <FadeIn>
              <ColumnHeader
                label="Wealth Distribution"
                sublabel={`"Top-Down": Platform Strength Positioning`}
              />
            </FadeIn>

            <FadeIn>
              <NarrativeBlockSmall>
                The Wealth strategy takes the opposite approach. Here, the voice is AmeriLife Corporate: projecting the full power of the platform itself. The tactical backbone is search dominance: owning not just traditional SEO, but the zero-click landscape, answer engines, and generative AI surfaces where prospects and partners research wealth distribution partnerships.
              </NarrativeBlockSmall>
            </FadeIn>

            <FadeIn>
              <FlowBox
                step={2}
                label="Platform Narrative Development"
                sublabel="Relationships • Contracts • Capital Access • Shared Services"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={3}
                label="Zero-Click SEO Domination"
                sublabel="AmeriLife.com/blog • Featured Snippets • Knowledge Panels • AI Overviews"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={4}
                label="SEO / AEO / GEO Strategy"
                sublabel="Traditional Search + Answer Engine + Generative Engine Optimization"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={5}
                label="Market Strength Content"
                sublabel="Thought Leadership • Structured Data • Editorial"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={6}
                label="Search Landscape Ownership"
                sublabel="Google • ChatGPT • Perplexity • Gemini"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={7}
                label="Thought Leadership Activation"
                sublabel="Industry Publications • Conference Speaking • Analyst Engagement • Carrier Communications"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={8}
                label={`"The Power of the AmeriLife Platform"`}
                sublabel="Authority Positioning, Anyone Researching Wealth Distribution Finds Us"
                variant="accent"
                size="sm"
              />
            </FadeIn>

            <FadeIn>
              <NarrativeBlockSmall>
                When a financial professional, carrier partner, or potential acquisition target searches for information about wealth distribution platforms, whether in Google, ChatGPT, Perplexity, or any generative AI tool, AmeriLife should be the definitive answer. This strategy makes that happen through content architecture and search infrastructure, not ad spend.
              </NarrativeBlockSmall>
            </FadeIn>
          </div>
        </div>

        {/* ── SHARED: Monthly Shared Services Spotlight ── */}
        <FadeIn>
          <div className="w-full mt-12">
            <Arrow />
          </div>
        </FadeIn>

        <FadeIn>
          <FlowBox
            step={9}
            label="Monthly Shared Services Spotlight Series"
            sublabel="One Corporate Function Per Month, Platform Strength Through Storytelling"
          />
        </FadeIn>

        <FadeIn>
          <SharedServicesList />
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            This series serves both tracks. Each spotlight deepens the platform narrative for Wealth while simultaneously giving Health affiliates proof that AmeriLife&apos;s shared services are real, operational, and growing, reinforcing the value proposition for current and prospective affiliates alike.
          </NarrativeBlock>
        </FadeIn>

        {/* ── SHARED: Pipeline Acceleration ── */}
        <FadeIn><Arrow /></FadeIn>

        <FadeIn>
          <div
            className="relative w-full border border-dashed rounded-md px-5 md:px-8 py-6 text-center"
            style={{ borderColor: "rgba(64,165,144,0.5)", backgroundColor: "#1a3352" }}
          >
            <StepIcon step={10} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <div className="font-bold uppercase tracking-wide text-xs md:text-sm text-white">
                  Corporate Development (M&amp;A) Pipeline Acceleration
                </div>
                <div className="uppercase font-bold tracking-wider text-[10px] md:text-xs mt-1" style={{ color: "#71C495" }}>
                  Health: Unaffiliated Shops See Thriving Affiliates → Inbound Interest
                </div>
              </div>
              <div>
                <div className="font-bold uppercase tracking-wide text-xs md:text-sm text-white">
                  Inbound Advisor / Advisory Pipeline
                </div>
                <div className="uppercase font-bold tracking-wider text-[10px] md:text-xs mt-1" style={{ color: "#71C495" }}>
                  Wealth: Authority Positioning Drives Inquiries from Advisors & Advisories
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── SECTION 3: Cross-Sell Bridge ── */}
        <FadeIn><Arrow /></FadeIn>

        <FadeIn>
          <div
            className="relative w-full border border-dashed rounded-md px-5 md:px-8 py-6 text-center"
            style={{ borderColor: "rgba(239,181,78,0.5)", backgroundColor: "#1a3352" }}
          >
            <StepIcon step={11} tone="gold" />
            <div className="font-bold uppercase tracking-wide text-base text-white">
              Cross-Sell Bridge
            </div>
            <div className="uppercase font-bold tracking-wider text-sm mt-1" style={{ color: "#EFB54E" }}>
              Connecting Health Relationships to Wealth Opportunities
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            The Cross-Sell Bridge exists to drive organic revenue growth across both verticals. Health affiliates already have deep client relationships: surfacing Wealth product opportunities within those relationships creates new revenue without new acquisition cost. On the other side, Wealth advisors gain access to Health distribution channels, expanding their reach. The goal is a two-way referral engine that makes cross-sell a natural part of how affiliates do business, not a corporate initiative layered on top.
          </NarrativeBlock>
        </FadeIn>

        {/* ── SECTION 4: Unified Measurement ── */}
        <FadeIn><Arrow /></FadeIn>

        <FadeIn>
          <FlowBox
            step={12}
            label="Unified Measurement & Attribution"
            sublabel="Shared KPIs • Pipeline Impact • Revenue Attribution • Corporate Development (M&A) Conversion"
            variant="accent"
          />
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            Both tracks report into a unified measurement framework. Health success is measured by Corporate Development (M&amp;A) pipeline velocity and affiliate acquisition cost. Wealth success is measured by search landscape share-of-voice and inbound partnership inquiries. Together, they tell a single story: AmeriLife&apos;s marketing is an engine for enterprise growth.
          </NarrativeBlock>
        </FadeIn>
      </div>

      {/* Footer gradient band */}
      <div
        className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 h-1.5 mt-16"
        style={{
          background:
            "linear-gradient(90deg, #244260 0%, #40A590 55%, #71C495 100%)",
        }}
      />
    </div>
  );
}

/* ── Last updated ── */

function LastUpdated() {
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setTimestamp(process.env.BUILD_TIMESTAMP || "");
  }, []);

  if (!timestamp) return <div className="mb-8" />;

  return (
    <p className="text-[10px] italic text-white/40 mb-8 text-center">
      Last updated {timestamp}
    </p>
  );
}

/* ── Scroll fade-in ── */

function FadeIn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("fade-in-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="fade-in-hidden w-full flex flex-col items-center">
      {children}
    </div>
  );
}

/* ── Narrative components ── */

function NarrativeBlock({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-2xl text-center px-4 py-6">
      <div className="text-sm leading-relaxed text-white/85 font-light">
        {children}
      </div>
    </div>
  );
}

function NarrativeBlockSmall({ children }: { children: ReactNode }) {
  return (
    <div className="w-full text-left px-2 py-4">
      <div className="text-xs leading-relaxed text-white/75 font-light">
        {children}
      </div>
    </div>
  );
}

/* ── Column header ── */

function ColumnHeader({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="w-full text-center mb-4">
      <div className="text-lg font-bold uppercase tracking-wide text-white">
        {label}
      </div>
      <div
        className="text-xs font-bold uppercase tracking-wider mt-1"
        style={{ color: "#71C495" }}
      >
        {sublabel}
      </div>
    </div>
  );
}

/* ── Flow components ── */

function StepIcon({ step, tone = "teal" }: { step: number; tone?: "teal" | "gold" }) {
  const color = tone === "gold" ? "#EFB54E" : "#40A590";
  return (
    <div
      className="absolute -left-8 md:-left-10 top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
      style={{
        border: `1.5px solid ${color}`,
        backgroundColor: "#244260",
      }}
    >
      <span className="text-[10px] md:text-[11px] font-bold" style={{ color }}>
        {step}
      </span>
    </div>
  );
}

function FlowBox({
  label,
  sublabel,
  variant = "default",
  size = "md",
  step,
}: {
  label: string;
  sublabel?: string;
  variant?: "default" | "accent";
  size?: "sm" | "md";
  step?: number;
}) {
  const isAccent = variant === "accent";
  const borderColor = isAccent ? "#40A590" : "rgba(64,165,144,0.35)";
  const background = isAccent
    ? "linear-gradient(135deg, #1a3352 0%, #2a6b6a 100%)"
    : "#1a3352";
  const padding = size === "sm" ? "px-3 md:px-5 py-3" : "px-4 md:px-8 py-4";

  return (
    <div
      className={`relative ${padding} w-full border rounded text-center`}
      style={{ borderColor, background }}
    >
      {step && <StepIcon step={step} />}
      <div
        className={`font-bold uppercase tracking-wide ${
          size === "sm" ? "text-xs md:text-sm" : "text-sm md:text-base"
        } text-white`}
      >
        {label}
      </div>
      {sublabel && (
        <div
          className={`uppercase font-bold tracking-wider ${
            size === "sm" ? "text-[10px] md:text-xs" : "text-xs md:text-sm"
          } mt-1`}
          style={{ color: isAccent ? "#FFFFFF" : "#71C495" }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
}

function SharedServicesList() {
  const services = [
    "Ops+IT",
    "Human Resources",
    "FP&A",
    "Marketing",
    "Corporate Development (M&A)",
    "Health Distribution",
    "Wealth Distribution",
    "Worksite",
    "LeadStar",
    "AmeriLife Marketing Mentors",
  ];

  return (
    <div
      className="w-full border rounded px-5 py-3 mt-1"
      style={{ borderColor: "rgba(113,196,149,0.4)", backgroundColor: "#1a3352" }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-wider mb-2"
        style={{ color: "#71C495" }}
      >
        Spotlight Rotation
      </div>
      <ol className="list-decimal list-inside space-y-1">
        {services.map((name) => (
          <li key={name} className="text-xs text-white/85 tracking-wide font-light">
            {name}
          </li>
        ))}
      </ol>
    </div>
  );
}

function AffiliateList() {
  const affiliates = [
    "Senior Market Advisors",
    "Jack Schroeder and Associates",
    "AmeriLife Marketing Group",
    "Pinnacle Financial Services Group",
    "Career",
  ];

  return (
    <div
      className="w-full border rounded px-5 py-3 mt-1"
      style={{ borderColor: "rgba(113,196,149,0.4)", backgroundColor: "#1a3352" }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-wider mb-2"
        style={{ color: "#71C495" }}
      >
        Initial Priority: H2 2026 & Beyond
      </div>
      <ol className="list-decimal list-inside space-y-1">
        {affiliates.map((name) => (
          <li key={name} className="text-xs text-white/85 tracking-wide font-light">
            {name}
          </li>
        ))}
      </ol>
    </div>
  );
}

function AffiliateVideoDetail() {
  const videos = [
    {
      title: "Agent Recruiting Video",
      desc: `Answers the question prospect agents are asking: "Why should I join [Affiliate]?"`,
    },
    {
      title: "Affiliate Spotlight Video",
      desc: "General-purpose narrative that feeds the Monthly Affiliate Spotlight Series",
    },
  ];

  const shared = [
    "Affiliate principals and leaders on camera, not stock footage or AI voiceover",
    "Real locations, real tools, real team culture",
    "SEO-optimized titles, descriptions, and metadata",
    "Companion affiliate landing page for lead capture",
    "Deployed pre-AEP, during contracting season",
    "Potential tier-one exclusive deliverable (strengthens tiered service model)",
  ];

  return (
    <div
      className="w-full border rounded px-5 py-3 mt-1"
      style={{ borderColor: "rgba(113,196,149,0.4)", backgroundColor: "#1a3352" }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-wider mb-2"
        style={{ color: "#71C495" }}
      >
        Two Videos Per Top-5 Affiliate
      </div>
      <ul className="space-y-2 mb-3">
        {videos.map((v) => (
          <li key={v.title} className="text-xs text-white/85 tracking-wide flex items-start gap-2 font-light">
            <span style={{ color: "#40A590" }} className="mt-0.5 shrink-0">
              &bull;
            </span>
            <span>
              <span className="font-bold text-white">{v.title}:</span> {v.desc}
            </span>
          </li>
        ))}
      </ul>
      <div
        className="text-[10px] font-bold uppercase tracking-wider mb-2 mt-3"
        style={{ color: "#71C495" }}
      >
        Shared Production Standards
      </div>
      <ul className="space-y-1">
        {shared.map((item) => (
          <li key={item} className="text-xs text-white/85 tracking-wide flex items-start gap-2 font-light">
            <span style={{ color: "#40A590" }} className="mt-0.5 shrink-0">
              &bull;
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-8" style={{ backgroundColor: "#40A590" }} />
      <svg width="12" height="8" viewBox="0 0 12 8" style={{ color: "#40A590" }}>
        <path d="M6 8L0 0h12z" fill="currentColor" />
      </svg>
    </div>
  );
}

function BranchArrows({
  leftLabel,
  rightLabel,
}: {
  leftLabel: string;
  rightLabel: string;
}) {
  const teal = "#40A590";
  return (
    <div className="relative w-full py-1">
      {/* Vertical stem from parent */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-4" style={{ backgroundColor: teal }} />
      {/* Horizontal bar */}
      <div className="absolute top-4 left-1/4 right-1/4 h-px" style={{ backgroundColor: teal }} />
      {/* Left branch down */}
      <div className="absolute top-4 left-1/4 -translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-4" style={{ backgroundColor: teal }} />
        <svg width="12" height="8" viewBox="0 0 12 8" style={{ color: teal }}>
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="text-[10px] mt-0.5 uppercase font-bold tracking-wider" style={{ color: "#71C495" }}>
          {leftLabel}
        </span>
      </div>
      {/* Right branch down */}
      <div className="absolute top-4 right-1/4 translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-4" style={{ backgroundColor: teal }} />
        <svg width="12" height="8" viewBox="0 0 12 8" style={{ color: teal }}>
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="text-[10px] mt-0.5 uppercase font-bold tracking-wider" style={{ color: "#71C495" }}>
          {rightLabel}
        </span>
      </div>
      {/* Spacer */}
      <div className="h-16" />
    </div>
  );
}
