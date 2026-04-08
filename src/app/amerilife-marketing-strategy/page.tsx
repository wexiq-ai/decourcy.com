"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function AmeriLifeMarketingStrategyPage() {
  return (
    <div className="min-h-screen bg-[#071a0e] text-white pl-12 pr-4 md:px-6 py-16 flex flex-col items-center">
      {/* Page Header */}
      <FadeIn>
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide mb-2 text-white/90 uppercase text-center">
          AmeriLife Health & Wealth Marketing Strategy
        </h1>
        <p className="text-xs font-bold text-white/40 mb-8 uppercase tracking-wider text-center">
          A Dual-Track Approach for 2026 and Beyond
        </p>
      </FadeIn>

      {/* Opening Narrative */}
      <FadeIn>
        <NarrativeBlock>
          AmeriLife&apos;s competitive advantage shows up differently depending on the vertical. In Health, it&apos;s an entrepreneur-focused model where each affiliate owns its own identity and value proposition. In Wealth, it&apos;s the collective strength of the platform itself — relationships, contracts, capital access, and shared services that no single entity could replicate alone. This marketing strategy honors both realities by deploying two distinct approaches: a bottoms-up strategy for Health and a top-down strategy for Wealth. Together, they position AmeriLife for accelerated growth across both verticals.
        </NarrativeBlock>
      </FadeIn>

      {/* Full-width flow container */}
      <div className="flex flex-col items-center gap-0 w-full max-w-5xl">

        {/* ── SECTION 1: Strategic Foundation ── */}
        <FadeIn>
          <FlowBox
            step={1}
            label="Strategic Foundation"
            sublabel="Cross-Functional Alignment — Health Distribution, Wealth Distribution, Marketing, Operations & IT"
            variant="accent"
          />
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            This strategy begins with the alignment work already underway between Health Distribution, Wealth Distribution, Marketing, Operations, and IT leadership. Neither track operates in isolation — both rely on shared infrastructure, coordinated messaging, and collaborative execution across all five functions.
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
                sublabel={`"Bottoms-Up" — Affiliate-Led Storytelling`}
              />
            </FadeIn>

            <FadeIn>
              <NarrativeBlockSmall>
                The Health strategy flips the traditional corporate marketing playbook. Instead of telling affiliates&apos; stories for them, AmeriLife Corporate Marketing becomes a platform that tells affiliate stories through their own eyes and point of view. The goal: position AmeriLife as the partner of choice for unaffiliated health insurance shops evaluating which organization to join. This approach directly serves AmeriLife&apos;s M&amp;A pipeline.
              </NarrativeBlockSmall>
            </FadeIn>

            <FadeIn>
              <FlowBox
                step={2}
                label="Affiliate Selection & Prioritization"
                sublabel="Top Affiliates by EBITDA — One Per Month, Starting H2 2026"
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
                sublabel="Corporate Marketing Goes to Them — Embedded Capture"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={4}
                label="Storytelling Through Their Eyes"
                sublabel="Their Technology Story • Their Culture • Their Growth • Their Recruiting & Service Advantage"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={5}
                label="Dual-Use Content Production"
                sublabel="Video + Editorial — For Affiliate Use & Corporate Promotion"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={6}
                label="Monthly Affiliate Spotlight Series"
                sublabel="One Featured Affiliate Per Month — Consistent, Structured Storytelling"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={7}
                label="Multi-Channel Distribution"
                sublabel="AmeriLife.com • Social • Affiliate Co-Promotion"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={8}
                label={`"AmeriLife Is the Partner of Choice"`}
                sublabel="Brand Platform Theme — Every Piece of Content Ladders Here"
                variant="accent"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={9}
                label="M&A Pipeline Acceleration"
                sublabel="Unaffiliated Shops See Proof of Thriving Affiliates → Inbound Interest"
                variant="accent"
                size="sm"
              />
            </FadeIn>

            <FadeIn>
              <NarrativeBlockSmall>
                By leading with affiliate voices rather than corporate messaging, this strategy creates authentic social proof. An unaffiliated shop owner considering AmeriLife won&apos;t hear a sales pitch — they&apos;ll hear peers who kept their identity, grew their business, and chose AmeriLife because the model works for entrepreneurs.
              </NarrativeBlockSmall>
            </FadeIn>
          </div>

          {/* ── RIGHT COLUMN: Wealth Distribution ── */}
          <div className="flex flex-col items-center gap-0">
            <FadeIn>
              <ColumnHeader
                label="Wealth Distribution"
                sublabel={`"Top-Down" — Platform Strength Positioning`}
              />
            </FadeIn>

            <FadeIn>
              <NarrativeBlockSmall>
                The Wealth strategy takes the opposite approach. Here, the voice is AmeriLife Corporate — projecting the full power of the platform itself. The tactical backbone is search dominance: owning not just traditional SEO, but the zero-click landscape, answer engines, and generative AI surfaces where prospects and partners research wealth distribution partnerships.
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
                sublabel="Featured Snippets • Knowledge Panels • AI Overviews"
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
                label={`"The Power of the AmeriLife Platform"`}
                sublabel="Authority Positioning — Anyone Researching Wealth Distribution Finds Us"
                variant="accent"
                size="sm"
              />
            </FadeIn>
            <FadeIn><Arrow /></FadeIn>

            <FadeIn>
              <FlowBox
                step={8}
                label="Inbound Partnership Pipeline"
                sublabel="Authority Positioning Drives Inquiries from Advisors, Carriers & Acquisition Targets"
                variant="accent"
                size="sm"
              />
            </FadeIn>

            <FadeIn>
              <NarrativeBlockSmall>
                When a financial professional, carrier partner, or potential acquisition target searches for information about wealth distribution platforms — whether in Google, ChatGPT, Perplexity, or any generative AI tool — AmeriLife should be the definitive answer. This strategy makes that happen through content architecture and search infrastructure, not ad spend.
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
            sublabel="One Corporate Function Per Month — Platform Strength Through Storytelling"
          />
        </FadeIn>

        <FadeIn>
          <SharedServicesList />
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            This series serves both tracks. Each spotlight deepens the platform narrative for Wealth while simultaneously giving Health affiliates proof that AmeriLife&apos;s shared services are real, operational, and growing — reinforcing the value proposition for current and prospective affiliates alike.
          </NarrativeBlock>
        </FadeIn>

        {/* ── SECTION 3: Cross-Sell Bridge ── */}
        <FadeIn><Arrow /></FadeIn>

        <FadeIn>
          <div className="relative w-full border border-[#5b9bd5]/20 border-dashed rounded-md bg-[#0a2314] px-5 md:px-8 py-6 text-center">
            <div className="absolute -left-8 md:-left-10 top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 rounded-full border border-[#5b9bd5]/40 bg-[#071a0e] flex items-center justify-center">
              <span className="text-[10px] md:text-[11px] font-bold text-[#5b9bd5]/70">10</span>
            </div>
            <div className="font-bold uppercase tracking-wide text-base text-white/90">
              Cross-Sell Bridge
            </div>
            <div className="uppercase font-bold tracking-wider text-sm text-white/40 mt-1">
              Connecting Health Relationships to Wealth Opportunities
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            These tracks are distinct but not isolated. Health affiliate relationships surface natural cross-sell opportunities into Wealth products. Simultaneously, the Wealth platform&apos;s market credibility reinforces the Health M&amp;A pitch — prospective affiliates see an organization with strength across both verticals, not just one.
          </NarrativeBlock>
        </FadeIn>

        {/* ── SECTION 4: Unified Measurement ── */}
        <FadeIn><Arrow /></FadeIn>

        <FadeIn>
          <FlowBox
            step={11}
            label="Unified Measurement & Attribution"
            sublabel="Shared KPIs • Pipeline Impact • Revenue Attribution • M&A Conversion"
            variant="accent"
          />
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            Both tracks report into a unified measurement framework. Health success is measured by M&amp;A pipeline velocity and affiliate acquisition cost. Wealth success is measured by search landscape share-of-voice and inbound partnership inquiries. Together, they tell a single story: AmeriLife&apos;s marketing is an engine for enterprise growth.
          </NarrativeBlock>
        </FadeIn>
      </div>
    </div>
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
      <div className="text-sm leading-relaxed text-white/60">
        {children}
      </div>
    </div>
  );
}

function NarrativeBlockSmall({ children }: { children: ReactNode }) {
  return (
    <div className="w-full text-left px-2 py-4">
      <div className="text-xs leading-relaxed text-white/50">
        {children}
      </div>
    </div>
  );
}

/* ── Column header ── */

function ColumnHeader({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="w-full text-center mb-4">
      <div className="text-lg font-bold uppercase tracking-wide text-white/90">
        {label}
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-white/40 mt-1">
        {sublabel}
      </div>
    </div>
  );
}

/* ── Flow components ── */

function StepIcon({ step }: { step: number }) {
  return (
    <div className="absolute -left-8 md:-left-10 top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 rounded-full border border-[#5b9bd5]/40 bg-[#071a0e] flex items-center justify-center">
      <span className="text-[10px] md:text-[11px] font-bold text-[#5b9bd5]/70">{step}</span>
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
  const base =
    variant === "accent"
      ? "border-[#5b9bd5]/50 bg-[#0d2b18]"
      : "border-[#1a4a2e] bg-[#0d2b18]";
  const padding = size === "sm" ? "px-3 md:px-5 py-3" : "px-4 md:px-8 py-4";

  return (
    <div
      className={`relative ${base} ${padding} w-full border rounded text-center`}
    >
      {step && <StepIcon step={step} />}
      <div className={`font-bold uppercase tracking-wide ${size === "sm" ? "text-xs md:text-sm" : "text-sm md:text-base"} text-white/90`}>
        {label}
      </div>
      {sublabel && (
        <div className={`uppercase font-bold tracking-wider ${size === "sm" ? "text-[10px] md:text-xs" : "text-xs md:text-sm"} text-white/40 mt-1`}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

function SharedServicesList() {
  const services = [
    "IT & Operations",
    "Human Resources",
    "Finance & Accounting",
    "Marketing",
    "M&A",
    "Growth Consulting",
  ];

  return (
    <div className="w-full border border-[#1a4a2e]/60 rounded bg-[#0a2314] px-5 py-3 mt-1">
      <div className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2">
        Spotlight Rotation
      </div>
      <ol className="list-decimal list-inside space-y-1">
        {services.map((name) => (
          <li key={name} className="text-xs text-white/60 tracking-wide">
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
    <div className="w-full border border-[#1a4a2e]/60 rounded bg-[#0a2314] px-5 py-3 mt-1">
      <div className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2">
        Initial Priority — H2 2026 & Beyond
      </div>
      <ol className="list-decimal list-inside space-y-1">
        {affiliates.map((name) => (
          <li key={name} className="text-xs text-white/60 tracking-wide">
            {name}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-8 bg-[#5b9bd5]/60" />
      <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60">
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
  return (
    <div className="relative w-full py-1">
      {/* Vertical stem from parent */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-4 bg-[#5b9bd5]/60" />
      {/* Horizontal bar */}
      <div className="absolute top-4 left-1/4 right-1/4 h-px bg-[#5b9bd5]/60" />
      {/* Left branch down */}
      <div className="absolute top-4 left-1/4 -translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-4 bg-[#5b9bd5]/60" />
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60">
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="text-[10px] text-white/30 mt-0.5 uppercase font-bold tracking-wider">{leftLabel}</span>
      </div>
      {/* Right branch down */}
      <div className="absolute top-4 right-1/4 translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-4 bg-[#5b9bd5]/60" />
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60">
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="text-[10px] text-white/30 mt-0.5 uppercase font-bold tracking-wider">{rightLabel}</span>
      </div>
      {/* Spacer */}
      <div className="h-16" />
    </div>
  );
}
