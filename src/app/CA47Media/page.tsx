"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function CA47MediaPage() {
  return (
    <div className="min-h-screen bg-[#071a0e] text-white px-4 md:px-6 py-16 flex flex-col items-center">
      {/* Page Header */}
      <FadeIn>
        <div className="text-center mb-2">
          <p className="text-[10px] font-bold text-[#5b9bd5]/60 uppercase tracking-[0.2em] mb-3">
            Confidential Campaign Media Intelligence
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white/90 uppercase">
            Interview-Style Radio Outreach
          </h1>
          <p className="text-sm font-bold text-white/40 uppercase tracking-wider mt-1">
            CA-47 Congressional District
          </p>
          <p className="text-xs text-white/30 mt-3 max-w-xl mx-auto leading-relaxed">
            Comprehensive analysis of major AM/FM interview-format radio programs reaching Huntington Beach, Irvine, Costa Mesa, Newport Beach, Seal Beach, Laguna Beach, Laguna Hills &amp; Laguna Woods &mdash; Orange County, California.
          </p>
          <p className="text-[10px] text-white/20 mt-2 uppercase tracking-wider">
            Prepared: April 2026 &bull; Market: Los Angeles&ndash;Orange County MSA (#2 in nation) &bull; District: CA-47 / Cook PVI D+3
          </p>
          <LastUpdated />
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

      <div className="flex flex-col items-center gap-0 w-full max-w-4xl">

        {/* Stats Row */}
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full mb-10">
            <StatBox number="~9M" label="Weekly LA Market Radio Listeners" />
            <StatBox number="7" label="Stations Analyzed" />
            <StatBox number="14" label="Shows Identified" />
            <StatBox number="4" label="Priority 1 Targets" />
          </div>
        </FadeIn>

        {/* Legend */}
        <FadeIn>
          <div className="w-full flex flex-wrap gap-3 md:gap-6 justify-center mb-8 text-[10px] uppercase tracking-wider">
            <span className="text-white/30">
              <span className="inline-block w-2 h-2 rounded-full bg-[#5b9bd5] mr-1.5 align-middle" />
              Priority 1 &mdash; Highest Impact
            </span>
            <span className="text-white/30">
              <span className="inline-block w-2 h-2 rounded-full bg-[#5b9bd5]/40 mr-1.5 align-middle" />
              Priority 2 &mdash; Strong Secondary
            </span>
            <span className="text-white/30">
              <span className="inline-block w-2 h-2 rounded-full bg-white/15 mr-1.5 align-middle" />
              Priority 3 &mdash; Supplemental
            </span>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="w-full flex flex-wrap gap-3 md:gap-6 justify-center mb-10 text-[10px] uppercase tracking-wider">
            <span className="text-white/30">
              <span className="inline-block w-1.5 h-1.5 bg-red-400/60 mr-1.5 align-middle" />
              Leans Conservative
            </span>
            <span className="text-white/30">
              <span className="inline-block w-1.5 h-1.5 bg-blue-400/60 mr-1.5 align-middle" />
              Leans Liberal/Progressive
            </span>
            <span className="text-white/30">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400/60 mr-1.5 align-middle" />
              Non-partisan / Balanced
            </span>
          </div>
        </FadeIn>

        {/* ── EXECUTIVE SUMMARY ── */}
        <FadeIn>
          <SectionHeader label="Executive Summary" />
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            California&rsquo;s 47th Congressional District is a competitive D+3 swing seat in the heart of Orange County &mdash; a market served by the nation&rsquo;s second-largest radio market. The district&rsquo;s voters are reachable through a robust ecosystem of AM talk and FM public radio that includes nationally dominant powerhouses (KFI, KABC) and highly credible public radio franchises (LAist/KPCC, KCRW).
          </NarrativeBlock>
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            The two-party system was never what our Founders intended, and it is fundamentally broken. Eric Troutman represents an alternative &mdash; an independent candidate who answers to voters, not to party bosses or mega-donors. This earned media strategy is designed to put that message in front of the largest, most engaged audiences in Orange County by leveraging existing radio platforms rather than building an audience from scratch.
          </NarrativeBlock>
        </FadeIn>

        {/* ══════════════════════════════════════════════ */}
        {/* PRIORITY TARGET SUMMARY (CROSS-STATION)       */}
        {/* ══════════════════════════════════════════════ */}

        <FadeIn>
          <SectionHeader label="Priority Targets at a Glance" />
        </FadeIn>

        <FadeIn>
          <NarrativeBlock>
            The following ranks all 14 identified shows by priority across all stations. Start at the top and work down.
          </NarrativeBlock>
        </FadeIn>

        <FadeIn>
          <PriorityGroup level={1} label="Must-Book — Highest Impact for CA-47">
            <PrioritySummaryRow
              name="AirTalk with Larry Mantle"
              station="LAist 89.3 (KPCC)"
              airtime="Mon–Fri 9–11 AM"
              why="Gold standard. 40 years interviewing presidents, senators, governors. Covers OC politics explicitly. Noncommercial = max credibility."
              email="atcomments@laist.com"
            />
            <PrioritySummaryRow
              name="The John Phillips Show"
              station="KABC 790 AM"
              airtime="Mon–Fri 12–3 PM"
              why="OC native host, OC Register columnist, CNN commentator. Covers CA-47 district-level politics. Exact persuasion audience."
              email="jphillips@kabc.com"
            />
            <PrioritySummaryRow
              name="The Bill Handel Show"
              station="KFI 640 AM"
              airtime="Mon–Fri 6–9 AM"
              why="Largest local morning talk audience in the nation. 50,000W transmitter in La Mirada (directly in CA-47)."
              email="bhandel@kfiam640.com"
            />
            <PrioritySummaryRow
              name="Press Play with Madeleine Brand"
              station="KCRW 89.9 FM"
              airtime="Mon–Fri 12 PM & 7 PM + podcast"
              why="Daily deep-interview show. Highest-educated, highest-income listener base in SoCal. Strong podcast second life."
              email="info@kcrw.org"
            />
            <PrioritySummaryRow
              name="GET BENT! with John Kobylt"
              station="KFI 640 AM"
              airtime="Mon–Fri 3–6 PM"
              why="Afternoon drive — large, engaged OC audience. Populist, anti-establishment. High reward / high risk."
              email="johnkobylt@kfiam640.com"
              caution="Combative host — do not book without full prep."
            />
          </PriorityGroup>
        </FadeIn>

        <FadeIn>
          <PriorityGroup level={2} label="Strong Secondary — Build Momentum">
            <PrioritySummaryRow
              name="Gary & Shannon"
              station="KFI 640 AM"
              airtime="Mon–Fri 9 AM–12 PM"
              why="Broad appeal, less combative. Good for candidate accessibility stories."
              email="gary@kfiam640.com"
            />
            <PrioritySummaryRow
              name="Monks & Merrill Show"
              station="KFI 640 AM"
              airtime="Mon–Fri 12–3 PM"
              why="NEW (Feb 2026). Hosts eager for guests — early relationship opportunity."
              badge="NEW"
            />
            <PrioritySummaryRow
              name="Later with Mo' Kelly"
              station="KFI 640 AM"
              airtime="Mon–Fri 6–10 PM"
              why="Moderate/balanced. Social justice, community issues. Reaches younger OC voters."
              email="mokelly@kfiam640.com"
            />
            <PrioritySummaryRow
              name="The Armstrong & Getty Show"
              station="KABC 790 AM"
              airtime="Mon–Fri 6–9 AM"
              why="Morning drive, conservative but less combative. Syndicated from Sacramento."
              email="armstrongandgetty@kabc.com"
            />
            <PrioritySummaryRow
              name="KNX Newsroom"
              station="KNX 1070 / 97.1 FM"
              airtime="24/7"
              why="All-news — no interview slots, but 50,000W AM+FM reach. Pitch newsworthy hooks for repeated news cycle coverage."
              email="feedback@knxnews.com"
            />
            <PrioritySummaryRow
              name="Background Briefing with Ian Masters"
              station="KPFK 90.7 FM"
              airtime="Tuesdays (confirm at kpfk.org)"
              why="Deep-dive political interviews. Returned to prime hours Jan 2025. Base activation."
              email="info@kpfk.org"
            />
            <PrioritySummaryRow
              name="Left, Right & Center"
              station="KCRW 89.9 FM"
              airtime="Weekly (Fridays)"
              why="Multi-perspective panel format — ideal for independent candidate positioning."
              email="info@kcrw.org"
            />
          </PriorityGroup>
        </FadeIn>

        <FadeIn>
          <PriorityGroup level={3} label="Supplemental — Niche Audiences">
            <PrioritySummaryRow
              name="Mottek on Money"
              station="KABC 790 AM"
              airtime="Mon–Fri 5–7 PM"
              why="Business/financial focus. Relevant for economic policy angles (housing, cost of living)."
            />
            <PrioritySummaryRow
              name="Democracy Now!"
              station="KPFK 90.7 FM"
              airtime="Mon–Fri mornings"
              why="Nationally syndicated progressive news. Activated progressive base. Pitch via democracynow.org/contact."
            />
            <PrioritySummaryRow
              name="The Signal"
              station="KPFK 90.7 FM"
              airtime="Weekly (check kpfk.org)"
              why="Labor, immigration, democracy. Coalition-building content."
            />
          </PriorityGroup>
        </FadeIn>

        <FadeIn>
          <div className="w-full border border-red-400/15 bg-red-900/5 rounded px-4 py-3 mb-6">
            <p className="text-[10px] text-red-300/50 leading-relaxed">
              <strong className="text-red-300/70">Not Viable:</strong> KEIB AM 1150 (&ldquo;The Patriot&rdquo;) &mdash; 100% nationally syndicated (Beck, Hannity, Bongino). No local interview slots. Do not target.
            </p>
          </div>
        </FadeIn>

        {/* ══════════════════════════════════════════════ */}
        {/* STATION PROFILES (DETAILED)                   */}
        {/* ══════════════════════════════════════════════ */}

        <FadeIn>
          <SectionHeader label="Station Profiles &amp; Show Detail" />
        </FadeIn>

        {/* ── KFI AM 640 ── */}
        <FadeIn>
          <StationHeader
            callSign="KFI AM 640"
            tagline="More Stimulating Talk"
            owner="iHeartMedia"
            studio="Burbank, CA"
            format="News/Talk (Local-First)"
            lean="conservative"
            address="3400 W Olive Ave, Ste 500, Burbank, CA 91505"
            phone="(818) 566-6425"
            pd="Brian Long"
            website="kfiam640.iheart.com"
            contact="kfiam640.iheart.com/contact"
            keyStats={["#1 local talk show audience in U.S.", "50,000W transmitter in La Mirada (directly in CA-47)", "527K+ weekly listeners"]}
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={1}
            name="The Bill Handel Show"
            host="Bill Handel (attorney/legal journalist, 30+ yr. KFI veteran)"
            airtime="Mon–Fri 6–9 AM"
            peak="Morning Drive"
            email="bhandel@kfiam640.com"
            website="kfiam640.iheart.com/featured/bill-handel"
            notes="Syndicated nationally (Handel on the Law, Saturdays). Covers breaking news, legal/political topics. KTLA does live TV segments from his studio. Interviews political figures regularly. Largest local morning talk audience in the nation."
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={1}
            name="GET BENT! with John Kobylt"
            host={'John Kobylt (legendary "John & Ken" co-host)'}
            airtime="Mon–Fri 3–6 PM"
            peak="Afternoon Drive"
            email="johnkobylt@kfiam640.com"
            website="kfiam640.iheart.com/featured/john-kobylt"
            notes="Highly populist, combative, anti-establishment. Kobylt's audience is large and engaged — many are OC residents. Will challenge guests aggressively. High reward / high risk. Preparation essential. KTLA does live TV segments from studio."
            caution
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={2}
            name="Gary &amp; Shannon"
            host="Gary Hoffmann &amp; Shannon Farren"
            airtime="Mon–Fri 9 AM–12 PM"
            peak="Midday"
            email="gary@kfiam640.com"
            website="kfiam640.iheart.com/featured/gary-and-shannon"
            notes="Broad appeal, current events mixed with softer topics. Less combative than other KFI shows. Good for candidate accessibility stories."
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={2}
            name="Monks &amp; Merrill Show"
            host="Michael Monks &amp; Chris Merrill"
            airtime="Mon–Fri 12–3 PM"
            peak="Midday"
            website="kfiam640.iheart.com"
            notes="NEW — Launched Feb 17, 2026. Replaced John Kobylt's midday slot. Merrill is a longtime KFI voice. Early opportunity to build relationships with new hosts eager for guests."
            badge="NEW FEB '26"
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={2}
            name="Later with Mo&rsquo; Kelly"
            host="Mo' Kelly (Maurice Kelly)"
            airtime="Mon–Fri 6–10 PM"
            peak="Evening"
            email="mokelly@kfiam640.com"
            website="kfiam640.iheart.com/featured/mo-kelly"
            notes="More moderate/balanced than Kobylt. Covers social justice, community issues. Good for reaching younger OC voters. Evening slot means smaller but more engaged audience."
          />
        </FadeIn>

        <FadeIn>
          <StrategyNote>
            <strong>KFI Outreach Strategy:</strong> KFI is the juggernaut. With 50,000 watts and transmitter in La Mirada (directly in CA-47 territory), its signal saturates the district. Reach Program Director Brian Long first at{" "}
            <a href="tel:+18185666425" className="text-[#5b9bd5] hover:text-[#7bb3e0]">(818) 566-6425</a> to establish a station relationship before pitching individual shows. All iHeartMedia shows also accept pitches through the contact form. Industry-standard email format: [firstname]@kfiam640.com.
          </StrategyNote>
        </FadeIn>

        {/* ── KABC 790 ── */}
        <FadeIn>
          <StationHeader
            callSign="KABC 790 AM"
            tagline="Get it RIGHT"
            owner="Cumulus Media"
            studio="Culver City, CA"
            format="News/Talk (Conservative)"
            lean="conservative"
            address="8965 Lindblade St, Culver City, CA 90232"
            phone="(800) 222-5222"
            pd="Luis Segura"
            website="kabc.com"
            contact="compliance@kabc.com"
            keyStats={["6,600–7,900W (directional)", "OC-native host covers district-level politics"]}
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={1}
            name="The John Phillips Show"
            host="John Phillips — OC Native, CNN Political Commentator, OC Register Columnist"
            airtime="Mon–Fri 12–3 PM"
            peak="Midday/Afternoon"
            email="jphillips@kabc.com"
            website="kabc.com/thejohnphillipsshow"
            notes="CRITICAL TARGET. Phillips is an Orange County native who explicitly covers OC politics, regularly references CA-47, and writes for the Orange County Register. He has deep relationships in OC political circles. Conservative-leaning but a journalist — will host candidates from all parties. His audience is exactly the persuadable OC voters this campaign needs to reach. Appeared on CNN. Podcast: ~6,000+ episodes."
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={2}
            name="The Armstrong &amp; Getty Show"
            host="Jack Armstrong &amp; Joe Getty (syndicated from Sacramento)"
            airtime="Mon–Fri 6–9 AM"
            peak="Morning Drive"
            email="armstrongandgetty@kabc.com"
            website="kabc.com/armstrongandgetty"
            notes="Syndicated; originates in Sacramento. Conservative but less combative than hard-right hosts. Comedic commentary format with political commentary. Morning drive reach is strong in OC."
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={3}
            name="Mottek on Money"
            host="Frank Mottek &amp; Randy Wang"
            airtime="Mon–Fri 5–7 PM"
            peak="Evening"
            website="kabc.com/shows/mottek-on-money"
            notes="Business/financial focus. Relevant if campaign is highlighting economic policy positions (housing costs, small business, cost of living in OC). Lower priority but opens business community reach."
          />
        </FadeIn>

        <FadeIn>
          <StrategyNote>
            <strong>KABC Outreach Strategy:</strong> John Phillips is your #1 target at KABC. As an OC native and regular CNN commentator, he has credibility with OC conservatives and independents &mdash; the exact persuasion universe for CA-47. Reach PD Luis Segura to establish the relationship first, then pitch Phillips directly at{" "}
            <a href="mailto:jphillips@kabc.com" className="text-[#5b9bd5] hover:text-[#7bb3e0]">jphillips@kabc.com</a>. Note: KABC&rsquo;s power is only 6,600&ndash;7,900 watts (directional), so signal in far south OC is weaker than KFI or KNX &mdash; but the targeted talk audience is high quality for this district.
          </StrategyNote>
        </FadeIn>

        {/* ── KNX ── */}
        <FadeIn>
          <StationHeader
            callSign="KNX 1070 AM / 97.1 FM"
            tagline="Southern California's 24-Hour All-News Station"
            owner="Audacy, Inc."
            studio="5670 Wilshire Blvd, LA (Miracle Mile)"
            format="All-News"
            lean="neutral"
            address="5670 Wilshire Blvd, #200, Los Angeles, CA 90036"
            phone="(844) KNX-NEWS (569-6397)"
            website="audacy.com/knxnews"
            contact="feedback@knxnews.com"
            keyStats={["50,000W signal on AM + FM simulcast", "One of the highest-reach stations in all of SoCal"]}
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={2}
            name="KNX Newsroom (Rolling News Coverage)"
            host="Rotating anchor/reporter team"
            airtime="24/7"
            peak="Drive Times"
            email="feedback@knxnews.com"
            website="audacy.com/knxnews"
            notes="KNX does not have traditional interview talk shows — it is an all-news rolling format. However, it regularly features short interviews (2–4 min) with elected officials, candidates, and political spokespersons integrated into news cycles. Campaign should pitch specific news pegs (legislation, endorsements, events) for news integration."
          />
        </FadeIn>

        <FadeIn>
          <StrategyNote>
            <strong>KNX Outreach Strategy:</strong> KNX doesn&rsquo;t do traditional talk show interviews, but its 50,000W signal reaches every corner of CA-47 on both AM and FM. Pitch newsworthy hooks directly to the newsroom via{" "}
            <a href="mailto:feedback@knxnews.com" className="text-[#5b9bd5] hover:text-[#7bb3e0]">feedback@knxnews.com</a> or call{" "}
            <a href="tel:+18445696397" className="text-[#5b9bd5] hover:text-[#7bb3e0]">(844) 569-6397</a> Option 2. Think: press conference coverage, reaction to legislation, local event coverage. KNX reporters will follow up for on-record quotes that get aired repeatedly throughout the news cycle.
          </StrategyNote>
        </FadeIn>

        {/* ── LAist 89.3 (KPCC) ── */}
        <FadeIn>
          <StationHeader
            callSign="LAist 89.3 FM (KPCC)"
            tagline="Your NPR Station for Southern California"
            owner="Southern California Public Radio (SCPR) / American Public Media Group"
            studio="Pasadena, CA"
            format="NPR Affiliate / Public Radio"
            lean="center-left"
            address="474 S Raymond Ave, Pasadena, CA 91106"
            phone="(626) 583-5100"
            website="laist.com"
            contact="atcomments@laist.com"
            keyStats={["527K+ weekly listeners", "Nonprofit — no political ads (earned media = max credibility)", "Rebranded from KPCC to LAist 89.3 (Feb 2023)"]}
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={1}
            name="AirTalk with Larry Mantle"
            host="Larry Mantle (longest-running daily talk show in LA — on air since April 1, 1985); Fridays: Austin Cross"
            airtime="Mon–Fri 9–11 AM"
            peak="Late Morning"
            email="atcomments@laist.com"
            phone="(866) 893-5722"
            website="laist.com/shows/airtalk"
            notes="THE GOLD STANDARD. Mantle has interviewed Presidents Obama, Biden, and Carter; governors; senators; cabinet members. Explicitly covers OC and SoCal politics. Interview + live call-in format. Highly credible, politically balanced. Audience is highly educated, civic-minded, and deeply engaged. A must-book for any serious campaign. Friday guest host: Austin Cross. Podcast archives available at laist.com."
          />
        </FadeIn>

        <FadeIn>
          <StrategyNote>
            <strong>LAist Outreach Strategy:</strong> AirTalk is the single most important booking in this market for a congressional campaign with credibility goals. Pitch via{" "}
            <a href="mailto:atcomments@laist.com" className="text-[#5b9bd5] hover:text-[#7bb3e0]">atcomments@laist.com</a> &mdash; include candidate bio, specific policy hooks relevant to SoCal (housing costs, climate, OC water issues, immigration, small business). Mantle&rsquo;s audience expects substance. As a noncommercial broadcaster, LAist does not sell political ads &mdash; earned media here carries maximum credibility.
          </StrategyNote>
        </FadeIn>

        {/* ── KCRW 89.9 ── */}
        <FadeIn>
          <StationHeader
            callSign="KCRW 89.9 FM"
            tagline="Music. NPR News. Culture."
            owner="Santa Monica Community College District"
            studio="Santa Monica, CA"
            format="NPR Flagship"
            lean="center-left"
            address="1660 Stewart Street, Santa Monica, CA 90404"
            phone="(424) 538-8500"
            pd="Jennifer Ferro (GM)"
            website="kcrw.com"
            contact="info@kcrw.org"
            keyStats={["550K weekly listeners", "Nonprofit", "Strong podcast distribution"]}
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={1}
            name="Press Play with Madeleine Brand"
            host="Madeleine Brand (30+ year NPR veteran, Columbia J-School)"
            airtime="Mon–Fri 12 PM &amp; 7 PM + daily podcast"
            peak="Midday"
            email="info@kcrw.org"
            website="kcrw.com/shows/press-play"
            notes="Daily news and culture show covering national, international, and local SoCal stories. Covers California politics, housing, environment, social policy. Educated, progressive-leaning audience. Strong podcast following that extends beyond radio broadcast hours. Brand is a respected journalist — prepare substantive policy positions."
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={2}
            name="Left, Right &amp; Center"
            host="Panel format — rotating hosts/panelists"
            airtime="Weekly (Fridays)"
            peak="Moderate (Weekly)"
            email="info@kcrw.org"
            website="kcrw.com/shows/left-right-center"
            notes={'KCRW\'s weekly politics show explicitly designed to feature "tough, divisive issues." Panelists represent left, right, and centrist perspectives. Good for candidate policy debates or as a guest panelist. Audience is highly politically engaged. Ideal format for an independent candidate.'}
          />
        </FadeIn>

        <FadeIn>
          <StrategyNote>
            <strong>KCRW Outreach Strategy:</strong> KCRW&rsquo;s audience is one of the highest-educated and highest-income listener bases in SoCal &mdash; ideal for a D+3 swing district where college-educated voters are the key battleground demographic. Press Play airs at noon and 7 PM and has a robust podcast stream, meaning interviews can gain a second life. Reach show producers through{" "}
            <a href="mailto:info@kcrw.org" className="text-[#5b9bd5] hover:text-[#7bb3e0]">info@kcrw.org</a>; mention specific CA-47 policy angles (coastal environment, Irvine tech economy, housing, OC healthcare). KCRW also hosts live public events that offer additional earned media opportunities. <em>Left, Right &amp; Center is a uniquely strong fit for an independent candidate &mdash; the format is built for the &ldquo;neither party&rdquo; positioning.</em>
          </StrategyNote>
        </FadeIn>

        {/* ── KPFK 90.7 ── */}
        <FadeIn>
          <StationHeader
            callSign="KPFK 90.7 FM"
            tagline="Pacifica Radio — Progressive Community Radio"
            owner="Pacifica Foundation"
            studio="Burbank (temporary) / North Hollywood"
            format="Progressive News, Talk, Culture"
            lean="progressive"
            address="Operating from Burbank (temp.), KPFK, North Hollywood, CA"
            phone="(818) 985-2711"
            website="kpfk.org"
            contact="info@kpfk.org"
            keyStats={["110,000W transmitter atop Mt. Wilson", "Signal reaches Mexican border to Santa Barbara", "Listener-supported / nonprofit"]}
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={2}
            name="Background Briefing with Ian Masters"
            host="Ian Masters — journalist, policy advocate, 30+ years in public affairs broadcasting"
            airtime="Tuesdays (confirm at kpfk.org)"
            peak="Niche/Engaged"
            email="info@kpfk.org"
            website="kpfk.org/on-air/background-briefing"
            notes="Deep-dive political interviews with global context. Ian Masters returned to prime hours in Jan 2025 after station management overhaul. Covers U.S. Congress, foreign policy, democracy issues. Good for base activation and progressive-leaning audiences."
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={3}
            name="Democracy Now!"
            host="Amy Goodman &amp; Juan Gonz&aacute;lez (nationally syndicated)"
            airtime="Mon–Fri (weekday mornings)"
            peak="Niche/Progressive"
            email="info@kpfk.org"
            website="democracynow.org"
            notes="Nationally syndicated progressive news program. Interviews politicians, activists, academics. Pitch directly to Democracy Now's national booking team (democracynow.org/contact). Reaches the highly activated progressive base."
          />
        </FadeIn>

        <FadeIn>
          <ShowCard
            priority={3}
            name="The Signal"
            host="Dino (public affairs, labor, democracy, international affairs)"
            airtime="Weekly — check schedule at kpfk.org"
            peak="Niche"
            email="info@kpfk.org"
            website="kpfk.org"
            notes="New public affairs program covering labor, immigration, democracy, and community organizing. Hosts have backgrounds in nonprofit leadership and international policy. Good for coalition-building content."
          />
        </FadeIn>

        <FadeIn>
          <StrategyNote>
            <strong>KPFK Outreach Strategy:</strong> KPFK&rsquo;s 110,000-watt transmitter atop Mt. Wilson means its physical signal reaches from the Mexican border to Santa Barbara &mdash; but listener base is smaller and highly progressive. This is a base-activation station, not persuasion. Important for energizing voters and activist networks who are disillusioned with the two-party system. Note: The station underwent a management overhaul in early 2025; programming was stabilized and shows like Background Briefing were returned to prime-time hours. Confirm current schedule at{" "}
            <a href="https://kpfk.org" target="_blank" rel="noopener noreferrer" className="text-[#5b9bd5] hover:text-[#7bb3e0]">kpfk.org</a> before pitching.
          </StrategyNote>
        </FadeIn>

        {/* ── KEIB 1150 ── */}
        <FadeIn>
          <StationHeader
            callSign="KEIB AM 1150"
            tagline={'"The Patriot" — 100% Syndicated Conservative Talk'}
            owner="iHeartMedia"
            studio="Burbank, CA"
            format="Conservative Talk (Fully Syndicated)"
            lean="conservative"
            address="3400 W Olive Ave, Ste 500, Burbank, CA 91505"
            phone="(818) 559-2252"
            website="patriotla.iheart.com"
            notViable
          />
        </FadeIn>

        <FadeIn>
          <div className="w-full border border-red-400/20 bg-red-900/10 rounded px-4 py-3 mb-6">
            <p className="text-xs text-red-300/70 leading-relaxed">
              <strong className="text-red-300/90">NOT A VIABLE TARGET.</strong> All KEIB programming is 100% nationally syndicated (Glenn Beck, Dan Bongino, Sean Hannity, Dave Ramsey, Clay &amp; Buck, Jesse Kelly). There are no local interview slots and no local program director booking guests. Do not waste outreach resources here.
            </p>
          </div>
        </FadeIn>

        {/* ══════════════════════════════════════════════ */}
        {/* STRATEGIC OUTREACH GUIDANCE                   */}
        {/* ══════════════════════════════════════════════ */}

        <FadeIn>
          <SectionHeader label="Strategic Outreach Guidance" />
        </FadeIn>

        {/* Pitch Hierarchy */}
        <FadeIn>
          <SubHeader label="Pitch Hierarchy &amp; Timing" />
        </FadeIn>

        <FadeIn>
          <div className="w-full border border-[#1a4a2e] bg-[#0d2b18] rounded px-4 md:px-5 py-4 mb-4">
            <ol className="list-decimal list-inside space-y-2.5 text-xs text-white/55 leading-relaxed">
              <li>
                <strong className="text-white/85">AirTalk (LAist 89.3)</strong> &mdash; email{" "}
                <a href="mailto:atcomments@laist.com" className="text-[#5b9bd5] hover:text-[#7bb3e0]">atcomments@laist.com</a> with a one-page candidate brief, 2&ndash;3 policy hooks specific to OC, and suggested interview angles.
              </li>
              <li>
                <strong className="text-white/85">John Phillips (KABC 790)</strong> &mdash; OC native, most district-specific host. Pitch via{" "}
                <a href="mailto:jphillips@kabc.com" className="text-[#5b9bd5] hover:text-[#7bb3e0]">jphillips@kabc.com</a> with OC-centric angles.
              </li>
              <li>
                <strong className="text-white/85">Bill Handel (KFI)</strong> &mdash; reach via station PD Brian Long first at{" "}
                <a href="tel:+18185666425" className="text-[#5b9bd5] hover:text-[#7bb3e0]">(818) 566-6425</a>. Largest single-show audience.
              </li>
              <li>
                <strong className="text-white/85">Press Play (KCRW 89.9)</strong> &mdash; pitch through{" "}
                <a href="mailto:info@kcrw.org" className="text-[#5b9bd5] hover:text-[#7bb3e0]">info@kcrw.org</a>. Educated D+3 swing voters.
              </li>
            </ol>
            <div className="mt-4 pt-3 border-t border-[#1a4a2e]/60 text-[10px] text-white/35 leading-relaxed space-y-1">
              <p>Pitch all shows at least 2 weeks in advance for general interviews; for breaking news hooks, pitch same-day via phone.</p>
              <p>Morning shows book best Tuesday&ndash;Thursday; avoid pitching on Mondays or Fridays.</p>
            </div>
          </div>
        </FadeIn>

        {/* Message Framing */}
        <FadeIn>
          <SubHeader label="Message Framing by Station" />
        </FadeIn>

        <FadeIn>
          <div className="w-full space-y-2 mb-6">
            <FramingCard station="KFI (640)" framing="Populist, OC-focused. Lean into quality of life: traffic, crime, cost of living, local government accountability. The independent candidacy pitch: a representative who works for OC residents, not for party bosses in DC." />
            <FramingCard station="KABC (790)" framing="Conservative / independent OC voter. Fiscal issues, business climate, law enforcement, immigration (balanced tone). Lead with: the two-party system is broken, and OC voters deserve someone accountable to them." />
            <FramingCard station="LAist 89.3" framing="Policy depth expected. Bring data. Discuss housing, climate, healthcare, civil rights — with substance. Position the independent candidacy as a rejection of partisan dysfunction." />
            <FramingCard station="KCRW (89.9)" framing="Educated progressives. National policy + local impact. Environment, social equity, arts/culture policy. The broken two-party system message resonates strongly with this audience." />
            <FramingCard station="KPFK (90.7)" framing="Activist base. Lead with worker rights, climate, civil liberties, anti-corporate themes. The independent candidacy is a direct challenge to the entrenched power structure." />
            <FramingCard station="KNX (1070/97.1)" framing="Neutral news hooks only. No advocacy — only newsworthy events, endorsements, legislation. Pitch the independent candidacy as news: a credible alternative in a competitive swing district." />
          </div>
        </FadeIn>

        {/* Contact Etiquette */}
        <FadeIn>
          <SubHeader label="Contact Etiquette &amp; Access" />
        </FadeIn>

        <FadeIn>
          <div className="w-full border border-[#1a4a2e] bg-[#0d2b18] rounded px-4 md:px-5 py-4 mb-4">
            <ul className="space-y-2 text-xs text-white/55 leading-relaxed">
              <li className="pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-[#5b9bd5]">Always email first with a brief pitch &mdash; 2&ndash;3 sentences, never attach files cold.</li>
              <li className="pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-[#5b9bd5]">Follow up by phone 48 hrs later if no response. Call station main lines, ask for show producer.</li>
              <li className="pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-[#5b9bd5]">For public radio (KCRW, LAist) &mdash; reach out to show producers, not the host directly.</li>
              <li className="pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-[#5b9bd5]">For iHeartMedia shows (KFI, KEIB) &mdash; Program Director Brian Long is the gatekeeper for station-wide access.</li>
              <li className="pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-[#5b9bd5]">For KABC (Cumulus) &mdash; PD Luis Segura, then individual show producers.</li>
              <li className="pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-[#5b9bd5]">Maintain a media log of all contacts, follow-ups, and outcomes throughout the campaign.</li>
            </ul>
          </div>
        </FadeIn>

        {/* Cautions */}
        <FadeIn>
          <SubHeader label="Cautions &amp; Known Risks" />
        </FadeIn>

        <FadeIn>
          <div className="w-full space-y-2 mb-6">
            <CautionCard name="John Kobylt (KFI, GET BENT!)" caution="High risk, high reward. Combative style; prepare for adversarial questions. Do not book without full prep." />
            <CautionCard name="Armstrong &amp; Getty (KABC)" caution="Syndicated from Sacramento — may not have deep OC context. Confirm producers have CA-47 briefing materials before interview." />
            <CautionCard name="KEIB (1150 AM)" caution="No local booking possible. All national syndication. Do not waste outreach resources here." />
            <CautionCard name="KPFK (90.7)" caution="Station underwent management upheaval 2023–2025. Confirm show schedule is current at kpfk.org before pitching." />
          </div>
        </FadeIn>

        {/* ══════════════════════════════════════════════ */}
        {/* OUTREACH TEMPLATES                            */}
        {/* ══════════════════════════════════════════════ */}

        <FadeIn>
          <SectionHeader label="Sample Outreach Messaging" />
        </FadeIn>

        <FadeIn>
          <div className="w-full max-w-2xl text-center px-2 py-3 mx-auto">
            <p className="text-xs leading-relaxed text-white/50">
              Use these templates when reaching out to show producers and bookers. Customize the opening to match the specific show&rsquo;s format and audience. Refer to the Message Framing section above to tailor the policy angles for each station.
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
            <p className="text-[9px] text-white/10 mt-2 max-w-md mx-auto leading-relaxed">
              This report was compiled from publicly available sources including station websites, press releases, and media directories as of April 2026. Show schedules, host assignments, and contact details are subject to change. For internal campaign use only.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/* COMPONENTS                                    */
/* ══════════════════════════════════════════════ */

function LastUpdated() {
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setTimestamp(process.env.BUILD_TIMESTAMP || "");
  }, []);

  if (!timestamp) return <div className="mb-8" />;

  return (
    <p className="text-[10px] italic text-white/25 mb-8 text-center mt-3">
      Last updated {timestamp}
    </p>
  );
}

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
    <div className="w-full mt-12 mb-5">
      <h2
        className="text-sm md:text-base font-bold uppercase tracking-wide text-white/90 pb-2 border-b border-[#5b9bd5]/15"
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </div>
  );
}

function SubHeader({ label }: { label: string }) {
  return (
    <div className="w-full mt-6 mb-3">
      <h3
        className="text-xs font-bold uppercase tracking-wider text-[#5b9bd5]/60"
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </div>
  );
}

function StatBox({ number, label }: { number: string; label: string }) {
  return (
    <div className="border border-[#5b9bd5]/15 bg-[#0a2314] rounded px-3 py-4 text-center">
      <div className="text-xl md:text-2xl font-bold text-[#5b9bd5]">{number}</div>
      <div className="text-[8px] md:text-[9px] font-bold text-white/35 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function NarrativeBlock({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-3xl text-center px-4 py-3">
      <div className="text-xs leading-relaxed text-white/50">{children}</div>
    </div>
  );
}

function StationHeader({
  callSign,
  tagline,
  owner,
  studio,
  format,
  lean,
  address,
  phone,
  pd,
  website,
  contact,
  keyStats,
  notViable,
}: {
  callSign: string;
  tagline: string;
  owner: string;
  studio: string;
  format: string;
  lean: "conservative" | "center-left" | "progressive" | "neutral";
  address: string;
  phone: string;
  pd?: string;
  website: string;
  contact?: string;
  keyStats?: string[];
  notViable?: boolean;
}) {
  const leanColors: Record<string, string> = {
    conservative: "bg-red-400/15 text-red-300/70",
    "center-left": "bg-blue-400/15 text-blue-300/70",
    progressive: "bg-blue-400/20 text-blue-300/80",
    neutral: "bg-gray-400/15 text-gray-300/70",
  };
  const leanLabels: Record<string, string> = {
    conservative: "Leans Conservative",
    "center-left": "Leans Center-Left",
    progressive: "Progressive / Left",
    neutral: "Non-partisan / Neutral",
  };

  return (
    <div className={`w-full border rounded px-4 md:px-5 py-5 mt-8 mb-3 ${notViable ? "border-red-400/20 bg-red-900/5" : "border-[#5b9bd5]/25 bg-[#0a2314]"}`}>
      <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
        <div>
          <h3 className="text-base md:text-lg font-bold text-white/90 uppercase tracking-wide">{callSign}</h3>
          <p className="text-[11px] text-white/40 italic">{tagline}</p>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded ${leanColors[lean]}`}>
          {leanLabels[lean]}
        </span>
      </div>

      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-3">
        {owner} &bull; {studio} &bull; {format}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-white/50">
        <Detail label="Address" value={address} />
        <Detail label="Phone" value={phone} href={`tel:${phone.replace(/[^\d+]/g, "")}`} />
        {pd && <Detail label="PD / GM" value={pd} />}
        <Detail label="Website" value={website} href={`https://${website}`} />
        {contact && <Detail label="Contact" value={contact} href={contact.includes("@") ? `mailto:${contact}` : `https://${contact}`} />}
      </div>

      {keyStats && keyStats.length > 0 && (
        <div className="mt-3 pt-2 border-t border-[#1a4a2e]/40 flex flex-wrap gap-x-4 gap-y-1">
          {keyStats.map((stat, i) => (
            <span key={i} className="text-[10px] text-[#5b9bd5]/50">{stat}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-[9px] font-bold uppercase tracking-wider text-white/25 min-w-[55px] shrink-0 pt-px">{label}</span>
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-[#5b9bd5]/70 hover:text-[#7bb3e0] transition-colors break-all">
          {value}
        </a>
      ) : (
        <span className="break-all">{value}</span>
      )}
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
      P{level}
    </span>
  );
}

function ShowCard({
  priority,
  name,
  host,
  airtime,
  peak,
  email,
  phone,
  website,
  notes,
  caution,
  badge,
}: {
  priority: number;
  name: string;
  host: string;
  airtime: string;
  peak: string;
  email?: string;
  phone?: string;
  website?: string;
  notes: string;
  caution?: boolean;
  badge?: string;
}) {
  return (
    <div className={`w-full border rounded px-4 md:px-5 py-4 mb-2 transition-colors ${caution ? "border-yellow-500/20 bg-[#0d2b18] hover:border-yellow-500/35" : "border-[#1a4a2e] bg-[#0d2b18] hover:border-[#5b9bd5]/30"}`}>
      <div className="flex items-baseline gap-2.5 flex-wrap mb-1.5">
        <PriorityBadge level={priority} />
        <span className="font-bold text-sm text-white/90" dangerouslySetInnerHTML={{ __html: name }} />
        {badge && <span className="text-[8px] font-bold uppercase tracking-wider text-[#5b9bd5]/60 bg-[#5b9bd5]/10 px-1.5 py-0.5 rounded">{badge}</span>}
        {caution && <span className="text-[8px] font-bold uppercase tracking-wider text-yellow-400/60 bg-yellow-400/10 px-1.5 py-0.5 rounded">High Risk</span>}
      </div>
      <p className="text-[11px] text-white/40 mb-2" dangerouslySetInnerHTML={{ __html: host }} />
      <p className="text-xs leading-relaxed text-white/55 mb-3">{notes}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px]">
        <div className="flex gap-1.5">
          <span className="text-white/25 font-bold uppercase text-[9px]">Air</span>
          <span className="text-white/50">{airtime}</span>
        </div>
        <div className="flex gap-1.5">
          <span className="text-white/25 font-bold uppercase text-[9px]">Peak</span>
          <span className="text-white/50">{peak}</span>
        </div>
        {email && (
          <div className="flex gap-1.5">
            <span className="text-white/25 font-bold uppercase text-[9px]">Email</span>
            <a href={`mailto:${email}`} className="text-[#5b9bd5]/70 hover:text-[#7bb3e0] transition-colors">{email}</a>
          </div>
        )}
        {phone && (
          <div className="flex gap-1.5">
            <span className="text-white/25 font-bold uppercase text-[9px]">Phone</span>
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-[#5b9bd5]/70 hover:text-[#7bb3e0] transition-colors">{phone}</a>
          </div>
        )}
        {website && (
          <div className="flex gap-1.5">
            <span className="text-white/25 font-bold uppercase text-[9px]">Web</span>
            <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="text-[#5b9bd5]/70 hover:text-[#7bb3e0] transition-colors">{website}</a>
          </div>
        )}
      </div>
    </div>
  );
}

function PriorityGroup({
  level,
  label,
  children,
}: {
  level: number;
  label: string;
  children: ReactNode;
}) {
  const styles: Record<number, { border: string; badge: string }> = {
    1: { border: "border-[#5b9bd5]/30", badge: "bg-[#5b9bd5] text-[#071a0e]" },
    2: { border: "border-[#5b9bd5]/15", badge: "bg-[#5b9bd5]/20 text-[#5b9bd5]" },
    3: { border: "border-white/8", badge: "bg-white/8 text-white/45" },
  };
  const s = styles[level] || styles[3];

  return (
    <div className={`w-full border ${s.border} rounded-lg mb-4`}>
      <div className="px-4 py-3 border-b border-inherit flex items-center gap-2.5">
        <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded ${s.badge}`}>
          Priority {level}
        </span>
        <span className="text-xs font-bold uppercase tracking-wide text-white/70">{label}</span>
      </div>
      <div className="divide-y divide-white/5">{children}</div>
    </div>
  );
}

function PrioritySummaryRow({
  name,
  station,
  airtime,
  why,
  email,
  caution,
  badge,
}: {
  name: string;
  station: string;
  airtime: string;
  why: string;
  email?: string;
  caution?: string;
  badge?: string;
}) {
  return (
    <div className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-baseline gap-2 flex-wrap mb-1">
        <span className="text-sm font-bold text-white/85">{name}</span>
        <span className="text-[10px] text-white/30">{station}</span>
        {badge && <span className="text-[8px] font-bold uppercase tracking-wider text-[#5b9bd5]/60 bg-[#5b9bd5]/10 px-1.5 py-0.5 rounded">{badge}</span>}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-white/35 mb-1.5">
        <span>{airtime}</span>
        {email && (
          <a href={`mailto:${email}`} className="text-[#5b9bd5]/60 hover:text-[#7bb3e0] transition-colors">{email}</a>
        )}
      </div>
      <p className="text-xs text-white/50 leading-relaxed">{why}</p>
      {caution && (
        <p className="text-[10px] text-yellow-300/50 mt-1 italic">{caution}</p>
      )}
    </div>
  );
}

function StrategyNote({ children }: { children: ReactNode }) {
  return (
    <div className="w-full border-l-2 border-[#5b9bd5]/25 bg-[#0a2314] rounded-r px-4 py-3 mb-6">
      <p className="text-xs leading-relaxed text-white/55">{children}</p>
    </div>
  );
}

function FramingCard({ station, framing }: { station: string; framing: string }) {
  return (
    <div className="w-full border border-[#1a4a2e] bg-[#0d2b18] rounded px-4 py-3">
      <div className="flex gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5b9bd5]/60 min-w-[90px] shrink-0 pt-0.5">{station}</span>
        <span className="text-xs text-white/50 leading-relaxed">{framing}</span>
      </div>
    </div>
  );
}

function CautionCard({ name, caution }: { name: string; caution: string }) {
  return (
    <div className="w-full border border-yellow-500/15 bg-yellow-900/5 rounded px-4 py-3">
      <p className="text-xs text-white/55 leading-relaxed">
        <strong className="text-yellow-300/70" dangerouslySetInnerHTML={{ __html: name }} />
        <span className="text-white/35 mx-1.5">&mdash;</span>
        {caution}
      </p>
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
