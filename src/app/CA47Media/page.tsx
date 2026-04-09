"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function CA47MediaPage() {
  return (
    <div className="min-h-screen bg-[#071a0e] text-white px-4 md:px-6 py-16 flex flex-col items-center">
      {/* Page Header */}
      <FadeIn>
        <div className="text-center mb-2">
          <p className="text-[10px] font-bold text-[#5b9bd5]/60 uppercase tracking-[0.2em] mb-3">
            Troutman for America &mdash; CA-47
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white/90 uppercase">
            Earned Media Strategy
          </h1>
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mt-1">
            Radio &amp; Podcast Target List
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="w-full max-w-2xl text-center px-4 py-6">
          <div className="border-l-2 border-r-2 border-[#5b9bd5]/20 bg-[#0a2314] rounded px-6 py-4">
            <p className="text-sm italic text-[#5b9bd5]/80 leading-relaxed">
              &ldquo;Don&rsquo;t struggle to build a new audience &mdash; hijack someone else&rsquo;s.&rdquo;
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="flex flex-col items-center gap-0 w-full max-w-3xl">

        {/* Stats Row */}
        <FadeIn>
          <div className="grid grid-cols-3 gap-3 md:gap-4 w-full mb-10">
            <StatBox number="7" label="Stations Analyzed" />
            <StatBox number="14" label="Shows Identified" />
            <StatBox number="4" label="Top Priority" />
          </div>
        </FadeIn>

        {/* ── TOP PRIORITY TARGETS ── */}
        <FadeIn>
          <SectionHeader label="Top Priority Targets" />
        </FadeIn>

        <FadeIn>
          <TargetCard
            priority={1}
            name="AirTalk with Larry Mantle"
            station="LAist 89.3 / KPCC"
            description="The single most important booking. 40 years of interviewing presidents, senators, and governors. Covers OC politics explicitly."
            contact={{ type: "email", value: "atcomments@laist.com" }}
          />
        </FadeIn>

        <FadeIn>
          <TargetCard
            priority={1}
            name="The John Phillips Show"
            station="KABC 790 AM"
            description="An OC native host who writes for the Orange County Register and covers CA-47-level politics. Perfect district fit."
            detail={{ label: "Airtime", value: "Weekdays 12\u20133 PM" }}
          />
        </FadeIn>

        <FadeIn>
          <TargetCard
            priority={1}
            name="The Bill Handel Show"
            station="KFI 640 AM"
            description="Largest local morning talk audience in the nation."
            detail={{ label: "Airtime", value: "Weekdays 6\u20139 AM" }}
          />
        </FadeIn>

        <FadeIn>
          <TargetCard
            priority={1}
            name="Press Play with Madeleine Brand"
            station="KCRW 89.9 FM"
            description="Daily NPR-style deep interview show. Strong podcast distribution."
            detail={{ label: "Airtime", value: "Noon & 7 PM + podcast" }}
          />
        </FadeIn>

        {/* ── ADDITIONAL TARGETS ── */}
        <FadeIn>
          <SectionHeader label="Additional Targets" />
        </FadeIn>

        <FadeIn>
          <TargetCard
            priority={2}
            name="The Monks & Merrill Show"
            station="KFI 640 AM"
            description="New show launched Feb 17, 2026 — hosts are actively building guest relationships. Fresh opportunity for early access."
          />
        </FadeIn>

        <FadeIn>
          <TargetCard
            priority={2}
            name="Background Briefing with Ian Masters"
            station="KPFK 90.7 FM"
            description="Returned to prime hours in Jan 2025 after a management overhaul. Good for base activation and progressive-leaning audiences."
          />
        </FadeIn>

        <FadeIn>
          <TargetCard
            priority={3}
            name="KNX News"
            station="KNX 1070 / 97.1 FM"
            description="All-news rolling format — no traditional interview slots. Pitch newsworthy hooks for news coverage segments."
            contact={{ type: "email", value: "feedback@knxnews.com" }}
          />
        </FadeIn>

        {/* ── KEY STRATEGIC NOTES ── */}
        <FadeIn>
          <SectionHeader label="Key Strategic Notes" />
        </FadeIn>

        <FadeIn>
          <NoteCard>
            <strong className="text-white/85">KEIB AM 1150 (&ldquo;The Patriot&rdquo;)</strong> is 100% nationally syndicated &mdash; no local interview slots. Don&rsquo;t waste resources here.
          </NoteCard>
        </FadeIn>

        <FadeIn>
          <NoteCard>
            <strong className="text-white/85">KNX 1070/97.1 FM</strong> is all-news rolling format. Pitch newsworthy hooks to{" "}
            <a href="mailto:feedback@knxnews.com" className="text-[#5b9bd5] hover:text-[#7bb3e0] transition-colors">
              feedback@knxnews.com
            </a>{" "}
            for news coverage, not traditional interviews.
          </NoteCard>
        </FadeIn>

        <FadeIn>
          <NoteCard>
            <strong className="text-white/85">The Monks &amp; Merrill Show</strong> at KFI (launched Feb 17, 2026) is a fresh opportunity &mdash; new hosts are eager to build relationships with guests.
          </NoteCard>
        </FadeIn>

        <FadeIn>
          <NoteCard>
            <strong className="text-white/85">KPFK&rsquo;s Background Briefing with Ian Masters</strong> returned to prime hours in Jan 2025 after a management overhaul &mdash; good for base activation.
          </NoteCard>
        </FadeIn>

        {/* ── OUTREACH MESSAGING ── */}
        <FadeIn>
          <SectionHeader label="Sample Outreach Messaging" />
        </FadeIn>

        <FadeIn>
          <div className="w-full max-w-2xl text-center px-2 py-3">
            <p className="text-xs leading-relaxed text-white/50">
              Use these templates when reaching out to show producers and bookers. Customize the opening to match the specific show&rsquo;s format and audience.
            </p>
          </div>
        </FadeIn>

        {/* First Person Template */}
        <FadeIn>
          <TemplateCard
            label="First Person &mdash; From the Candidate"
            subject="Guest Request — Independent Candidate for CA-47"
          >
{`Hi, I'm Eric Troutman and I'm running for Congress in California's 47th District as an independent candidate.

I'd love to join [SHOW NAME] to talk about what's happening in Orange County — and why voters are looking for an alternative to the two-party system.

A bit about me: I'm a nationally recognized authority on consumer privacy and technology law, a former partner at a major law firm, and the founder of a legal practice that has been at the forefront of protecting Americans from illegal robocalls and data misuse. I've spent my career standing up against powerful interests on behalf of everyday people — and now I'm bringing that same fight to Congress.

I'm running because the two-party system was never what our Founders intended, and it is fundamentally broken. Voters in CA-47 deserve a representative who answers to them, not to party bosses or mega-donors. I represent an alternative that listeners should know about — an independent voice focused on practical solutions, not partisan theatrics.

I believe your audience would find this conversation timely and relevant, especially as voters grow increasingly frustrated with a system that puts party loyalty ahead of the people it's supposed to serve.

I'm available at your convenience and happy to work around your schedule.

Eric Troutman
Independent Candidate, U.S. Congress — CA-47
www.troutmanforamerica.com`}
          </TemplateCard>
        </FadeIn>

        {/* Third Person Template */}
        <FadeIn>
          <TemplateCard
            label="Third Person &mdash; From Staff / Surrogate"
            subject="Guest Pitch — Eric Troutman, Independent for CA-47"
          >
{`My name is [YOUR NAME] and I am writing on behalf of Troutman for America to request a guest appearance for Eric Troutman on [SHOW NAME].

Eric is an independent candidate for Congress in California's 47th Congressional District. He is a nationally recognized authority on consumer privacy and technology law, a former partner at a major law firm, and the founder of a legal practice that has led the fight against illegal robocalls and consumer data exploitation. He has spent his career standing up for everyday Americans against powerful corporate interests.

Eric is running because the two-party system was never what our Founders intended, and it is fundamentally broken. He represents an alternative that your listeners should be aware of — an independent candidate who answers to voters, not to party leadership or special-interest donors.

His message resonates strongly with audiences across the political spectrum who are frustrated with partisan gridlock and looking for leaders who will focus on real solutions over political posturing.

We believe Eric would be a compelling guest for your program and are happy to coordinate around your schedule. You can learn more at his website below.

Thank you for your consideration.

[YOUR NAME]
Troutman for America
www.troutmanforamerica.com`}
          </TemplateCard>
        </FadeIn>

        {/* Short Form Pitch */}
        <FadeIn>
          <TemplateCard
            label="Short-Form Pitch &mdash; DMs / Brief Emails"
            subject="Quick Pitch — Independent for CA-47"
          >
{`Hi — I'm reaching out about Eric Troutman, an independent candidate running for Congress in CA-47 (Orange County). He's a consumer privacy attorney who has led the national fight against illegal robocalls, and he's running because the two-party system is broken and voters deserve better. Would love to explore a guest spot on [SHOW NAME]. More at troutmanforamerica.com`}
          </TemplateCard>
        </FadeIn>

        {/* Footer */}
        <FadeIn>
          <div className="w-full text-center mt-12 pt-6 border-t border-[#1a4a2e]/40">
            <p className="text-[10px] text-white/20 tracking-wider uppercase">
              Prepared for Troutman for America &bull;{" "}
              <a
                href="https://www.troutmanforamerica.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5b9bd5]/40 hover:text-[#5b9bd5]/70 transition-colors"
              >
                troutmanforamerica.com
              </a>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

/* ── Components ── */

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

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="w-full mt-10 mb-4">
      <h2 className="text-sm md:text-base font-bold uppercase tracking-wide text-white/90 pb-2 border-b border-[#5b9bd5]/15">
        {label}
      </h2>
    </div>
  );
}

function StatBox({ number, label }: { number: string; label: string }) {
  return (
    <div className="border border-[#5b9bd5]/15 bg-[#0a2314] rounded px-3 py-4 text-center">
      <div className="text-2xl md:text-3xl font-bold text-[#5b9bd5]">{number}</div>
      <div className="text-[9px] md:text-[10px] font-bold text-white/35 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function PriorityBadge({ level }: { level: number }) {
  const styles: Record<number, string> = {
    1: "bg-[#5b9bd5] text-[#071a0e]",
    2: "bg-[#5b9bd5]/20 text-[#5b9bd5]",
    3: "bg-white/8 text-white/45",
  };
  return (
    <span className={`inline-block text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded ${styles[level] || styles[3]}`}>
      Priority {level}
    </span>
  );
}

function TargetCard({
  priority,
  name,
  station,
  description,
  detail,
  contact,
}: {
  priority: number;
  name: string;
  station: string;
  description: string;
  detail?: { label: string; value: string };
  contact?: { type: string; value: string };
}) {
  return (
    <div className="w-full border border-[#1a4a2e] bg-[#0d2b18] rounded px-4 md:px-5 py-4 mb-3 transition-colors hover:border-[#5b9bd5]/30">
      <div className="flex items-baseline gap-3 flex-wrap mb-2">
        <PriorityBadge level={priority} />
        <span className="font-bold text-sm text-white/90">{name}</span>
        <span className="text-[11px] text-white/35">{station}</span>
      </div>
      <p className="text-xs leading-relaxed text-white/55">{description}</p>
      {detail && (
        <div className="flex gap-2 mt-2 items-baseline">
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/30 min-w-[50px]">{detail.label}</span>
          <span className="text-xs text-white/55">{detail.value}</span>
        </div>
      )}
      {contact && (
        <div className="flex gap-2 mt-2 items-baseline">
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/30 min-w-[50px]">Contact</span>
          <a
            href={`mailto:${contact.value}`}
            className="text-xs text-[#5b9bd5] hover:text-[#7bb3e0] transition-colors"
          >
            {contact.value}
          </a>
        </div>
      )}
    </div>
  );
}

function NoteCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full border-l-2 border-[#5b9bd5]/25 bg-[#0a2314] rounded-r px-4 py-3 mb-2">
      <p className="text-xs leading-relaxed text-white/55">{children}</p>
    </div>
  );
}

function TemplateCard({
  label,
  subject,
  children,
}: {
  label: string;
  subject: string;
  children: string;
}) {
  // Parse the template text to linkify URLs and highlight placeholders
  const lines = children.split("\n");

  return (
    <div className="w-full border border-[#1a4a2e] bg-[#0d2b18] rounded px-4 md:px-5 py-4 mb-4">
      <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#5b9bd5]/60 mb-1">
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </div>
      <div className="text-[10px] text-white/30 mb-3">
        Subject: <span className="text-white/50">{subject}</span>
      </div>
      <div className="text-xs leading-[1.8] text-white/55 whitespace-pre-wrap">
        {lines.map((line, i) => (
          <span key={i}>
            {renderLine(line)}
            {i < lines.length - 1 && "\n"}
          </span>
        ))}
      </div>
    </div>
  );
}

function renderLine(line: string) {
  // Replace [PLACEHOLDER] with styled spans
  // Replace www.troutmanforamerica.com with a link
  const parts: ReactNode[] = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    const placeholderMatch = remaining.match(/\[([A-Z_ ]+)\]/);
    const urlMatch = remaining.match(/(www\.troutmanforamerica\.com|troutmanforamerica\.com)/);

    const placeholderIdx = placeholderMatch?.index ?? Infinity;
    const urlIdx = urlMatch?.index ?? Infinity;

    if (placeholderIdx === Infinity && urlIdx === Infinity) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (placeholderIdx <= urlIdx && placeholderMatch) {
      parts.push(<span key={key++}>{remaining.slice(0, placeholderIdx)}</span>);
      parts.push(
        <span key={key++} className="text-[#5b9bd5] font-semibold">
          [{placeholderMatch[1]}]
        </span>
      );
      remaining = remaining.slice(placeholderIdx + placeholderMatch[0].length);
    } else if (urlMatch) {
      parts.push(<span key={key++}>{remaining.slice(0, urlIdx)}</span>);
      parts.push(
        <a
          key={key++}
          href="https://www.troutmanforamerica.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5b9bd5] hover:text-[#7bb3e0] transition-colors"
        >
          {urlMatch[0]}
        </a>
      );
      remaining = remaining.slice(urlIdx + urlMatch[0].length);
    }
  }

  return parts;
}
