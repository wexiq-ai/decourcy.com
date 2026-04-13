"use client";

import { useReducer, useEffect, useState, useCallback, useRef } from "react";

// ─── ASCII ART ────────────────────────────────────────────────

const ART = {
  title: `
  ████████╗██╗  ██╗███████╗
  ╚══██╔══╝██║  ██║██╔════╝
     ██║   ███████║█████╗
     ██║   ██╔══██║██╔══╝
     ██║   ██║  ██║███████╗
     ╚═╝   ╚═╝  ╚═╝╚══════╝
  ██╗      █████╗ ██╗   ██╗███╗   ██╗██████╗ ██████╗  ██████╗ ███╗   ███╗ █████╗ ████████╗
  ██║     ██╔══██╗██║   ██║████╗  ██║██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝
  ██║     ███████║██║   ██║██╔██╗ ██║██║  ██║██████╔╝██║   ██║██╔████╔██║███████║   ██║
  ██║     ██╔══██║██║   ██║██║╚██╗██║██║  ██║██╔══██╗██║   ██║██║╚██╔╝██║██╔══██║   ██║
  ███████╗██║  ██║╚██████╔╝██║ ╚████║██████╔╝██║  ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║   ██║
  ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝
  ████████╗██████╗  █████╗ ██╗██╗
  ╚══██╔══╝██╔══██╗██╔══██╗██║██║
     ██║   ██████╔╝███████║██║██║
     ██║   ██╔══██╗██╔══██║██║██║
     ██║   ██║  ██║██║  ██║██║███████╗
     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝`,

  washer: `
       _______________
      /               \\
     |  .-----------. |
     | |  .-------.  ||
     | | |         | ||
     | | |  (   )  | ||
     | | |         | ||
     | |  '-------'  ||
     |  '-----------' |
     |   [O]    [O]   |
     |_________________|`,

  office: `
      ________________________________
     |  ____________________________  |
     | |                            | |
     | |   P O W E R P O I N T     | |
     | |      # 1 0 , 0 0 0        | |
     | |   [====|====|====|====]    | |
     | |   [    CLICK TO ADD    ]   | |
     | |   [      TITLE         ]   | |
     | |____________________________| |
     |___|________________________|___|
         |  ___  [___] ___  |
         |_|   |_______|   |_|`,

  stripmall: `
     ___________________________________
    |  FOR   |         |  VAPE  | BAIL  |
    | LEASE  | LIQUOR  |  SHOP  | BONDS |
    |________|_________|________|_______|
    | []  [] | []  []  | []  [] | []  []|
    |  ____  |  ____   |  ____  |  ____ |
    | |    | | |    |  | |    | | |    ||
    |_|____|_|_|____|__|_|____|_|_|____|_|`,

  bank: `
          _________________________
         |         BANK            |
         |   _____________________  |
         |  |  $   $   $   $   $  | |
         |  |_____________________| |
         |                          |
       __|___||____________||___ ___|__
      |  |   ||            ||   |  |   |
      |  |   ||            ||   |  |   |
      |__|___||____________||___|__|___|`,

  construction: `
           /\\
          /  \\
         / !! \\
        /______\\
           ||         ___
           ||    ____/   \\___
           ||   |  HARD HAT  |
       ____|____| AREA  !!!! |
      |  DANGER |____________|
      |_________|
       \\ \\  / /
        \\_\\/_/`,

  laundromat: `
   _______________________________________________
  |  TONY'S CLEAN DREAM LAUNDROMAT               |
  |_______________________________________________|
  |  _____   _____   _____   _____   _____       |
  | | o o | | o o | | o o | | o o | | o o |      |
  | |(   )| |(   )| |(   )| |(   )| |(   )|     |
  | | o o | | o o | | o o | | o o | | o o |      |
  | |_____| |_____| |_____| |_____| |_____|      |
  |                                               |
  |  [FOLD]  [FOLD]  [FOLD]       $$$$ CHANGE $$$$|
  |_______________________________________________|`,

  tombstone: `
            .-.
           (   )
            '-'
        .---'---.
       /  R.I.P. \\
      |           |
      | HERE LIES |
      |  TONY'S   |
      |   DREAM   |
      |           |
      | He never  |
      | left the  |
      | cubicle.  |
      |           |
      |___________|
   ___/___________\\___
  /                     \\`,

  ovi: `
     _______
    / O   O \\
   |  \\___/  |  <- Ovi
    \\_______/   "Hold on, I'm rethinking
     /|   |\\      the logo..."
    / |   | \\
   [GUCCI LOAFERS]`,

  bill: `
     _________
    |  MAGA   |
    | O     O |  <- Bill
    |  \\___/  |  "I'm suing somebody
     \\_______/    about this."
     /|   |\\
    / |   | \\
   [TACTICAL BOOTS]`,

  tony: `
     _______
    / -   - \\
   | ( . . ) |  <- Tony
   |  \\___/  |  "I just want to wash
    \\___|___/    clothes for a living."
     /|   |\\
    / |   | \\
   [WORN LOAFERS]`,
};

// ─── GAME DATA ────────────────────────────────────────────────

interface Choice {
  label: string;
  effects: Partial<Stats>;
  response: string[];
}

interface Stage {
  title: string;
  art: string;
  narrative: string[];
  choices: Choice[];
}

interface GameEvent {
  who: "ovi" | "bill";
  text: string[];
  effects: Partial<Stats>;
}

interface DeathScreen {
  title: string;
  text: string[];
}

interface Stats {
  motivation: number;
  savings: number;
  businessPlan: number;
  days: number;
  oviReliability: number;
  billReliability: number;
}

const OVI_STATUSES = [
  "Redesigning logo...",
  "At Nobu",
  "In Santorini",
  "Wine tasting in Napa",
  "Unreachable",
  "Sent a mood board",
  "Browsing Hermes.com",
  "At a gallery opening",
  "Getting a haircut ($200)",
  "Yacht shopping",
];

const BILL_STATUSES = [
  "Filing a lawsuit",
  "Making a video (0 views)",
  "At the gun range",
  "Woodworking illegally",
  "Mourning his dog",
  "Yelling at AI",
  "Suing the government",
  "Gambling (losing)",
  "Watching conspiracy videos",
  "Building a table saw jig",
];

const OVI_EVENTS: GameEvent[] = [
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi spent $2,000 of business funds on a",
      "'brand identity consultant' he met at a",
      "rooftop cocktail bar. The consultant's",
      "deliverable: a Pinterest board.",
    ],
    effects: { savings: -2000 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi missed the zoning hearing because",
      "he was at a wine tasting in Napa.",
      "He texted: 'This Pinot is exquisite.",
      "Can we reschedule democracy?'",
    ],
    effects: { businessPlan: -10, days: 3 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi redesigned the logo for the 7th",
      "time. The font is now 'Didot Italic'",
      "because 'laundromats should feel",
      "aspirational.' Nobody asked for this.",
    ],
    effects: { motivation: -5, days: 2 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi insisted on Italian marble",
      "countertops for the folding area.",
      "Tony: 'People are folding underwear.'",
      "Ovi: 'Exactly. Premium underwear.'",
    ],
    effects: { savings: -4000 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi is on vacation in Santorini.",
      "He posted an Instagram story with",
      "the caption 'Manifesting clean energy'",
      "and turned off his phone for 2 weeks.",
    ],
    effects: { oviReliability: -15, days: 5 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi hired a DJ for the grand opening",
      "without telling anyone. The DJ only",
      "plays French house music. His fee",
      "is $800 and he requires a rider with",
      "'artisanal sparkling water only.'",
    ],
    effects: { savings: -800, motivation: -3 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi ordered 500 embroidered polo",
      "shirts with the old logo. The one",
      "from version 3. Not version 7.",
      "He refuses to return them because",
      "'the stitching is actually better.'",
    ],
    effects: { savings: -1500, motivation: -5 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi wants to pivot to a 'luxury",
      "laundry lounge' concept with",
      "complimentary espresso, ambient",
      "lighting, and a 'garment concierge.'",
      "Tony stares into the void.",
    ],
    effects: { days: 5, businessPlan: -15 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi booked a table at Nobu instead",
      "of attending the contractor meeting.",
      "He texted Tony a photo of yellowtail",
      "sashimi with the caption 'Thinking of",
      "you bro' and a prayer hands emoji.",
    ],
    effects: { days: 2, motivation: -8 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi commissioned a 6-foot bronze",
      "statue of a washing machine for the",
      "lobby. He calls it 'The Vessel of",
      "Renewal.' It cost $3,000. It is",
      "hideous.",
    ],
    effects: { savings: -3000, motivation: -5 },
  },
];

const BILL_EVENTS: GameEvent[] = [
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill filed a lawsuit against the city",
      "over parking regulations near the",
      "laundromat site. His argument: 'The",
      "Constitution says nothing about meters.'",
      "The lawyer wants $1,500 up front.",
    ],
    effects: { savings: -1500, days: 7 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill spent the afternoon making a",
      "YouTube video titled 'LAUNDROMAT",
      "RIGHTS: What They Don't Want You",
      "To Know.' It is 47 minutes long.",
      "It has received 4 views. Two are Bill.",
    ],
    effects: { motivation: -5, days: 1 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill bought a table saw for his garage",
      "woodshop. Using business funds. He says",
      "he's going to 'build the counters",
      "himself.' He has never built a counter.",
      "He has built one birdhouse. It fell.",
    ],
    effects: { savings: -900, motivation: -3 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill is grieving his dead dog again.",
      "He posted 47 photos on Facebook with",
      "the caption 'Gone but never forgotten,",
      "you were the only one who understood",
      "me.' He will be out for a week.",
    ],
    effects: { days: 7, billReliability: -10 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill bet $2,000 on a horse named",
      "'Spin Cycle.' He said it was 'a sign",
      "from the universe.' The horse finished",
      "last. Bill is now suing the horse.",
    ],
    effects: { savings: -2000 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill built an AI chatbot for the",
      "laundromat. It responds to every",
      "customer inquiry with: 'Have you",
      "considered your legal options?' and",
      "then links to Bill's YouTube channel.",
    ],
    effects: { motivation: -10, savings: -500 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill converted the back office into",
      "an unlicensed woodworking shop. There",
      "is sawdust everywhere. The fire marshal",
      "would have thoughts. Tony pretends he",
      "didn't see the lathe.",
    ],
    effects: { motivation: -8 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill bought 3 firearms 'to protect the",
      "quarters.' Tony: 'What quarters?' Bill:",
      "'Exactly. That's how good the security",
      "will be.' Cost: $1,800 of business funds.",
    ],
    effects: { savings: -1800, motivation: -5 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill's social media strategy: daily",
      "videos of him folding towels while",
      "ranting about government overreach.",
      "Follower count after 30 days: 0.",
      "He blames 'the algorithm.'",
    ],
    effects: { motivation: -5, days: 3 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill is suing the landlord. THE",
      "landlord. The one you're signing a",
      "lease with. The complaint alleges",
      "'unlawful door hinge placement.'",
      "The landlord is reconsidering.",
    ],
    effects: { savings: -2000, motivation: -15, days: 10 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill wants to 'disrupt the laundry",
      "space with AI.' He spent $3,000 on",
      "a ChatGPT subscription he thinks is",
      "'custom-built' for him. It is not.",
      "It just says 'I'd be happy to help.'",
    ],
    effects: { savings: -3000, motivation: -5 },
  },
  {
    who: "bill",
    text: [
      "** BILL EVENT **",
      "",
      "Bill brought his woodworking project",
      "to the construction site. He set up",
      "a router table next to the plumber.",
      "The contractors walked off the job.",
      "They will return in 5 days. Maybe.",
    ],
    effects: { days: 5, savings: -1000, motivation: -10 },
  },
];

const STAGES: Stage[] = [
  {
    title: "THE LAST POWERPOINT",
    art: "office",
    narrative: [
      "It is a Tuesday. Tony stares at",
      "PowerPoint slide #10,000. The slide",
      "says 'SYNERGY' in 48-point Arial.",
      "",
      "Something inside Tony dies. Or maybe",
      "it was already dead. Hard to tell.",
      "",
      "Tony makes a decision: he will open",
      "a laundromat. Clean clothes. Simple.",
      "Honest. No more PowerPoints.",
      "",
      "He texts his two friends who have",
      "been talking about 'going in on",
      "something together' for 5 years.",
      "",
      "Meet your business partners:",
    ],
    choices: [
      {
        label: "Text Ovi first",
        response: [
          "Ovi replies 20 minutes later.",
          "'Tony! Great timing. I've been thinking",
          "about branding for this. I have 14 logo",
          "concepts. Can you come to Nobu to discuss?'",
          "",
          "Tony has not explained the business yet.",
        ],
        effects: { days: 1, motivation: -3 },
      },
      {
        label: "Text Bill first",
        response: [
          "Bill texts back in 3 seconds flat.",
          "'TONY. Brother. I am IN. I've been",
          "wanting to start something. I just need",
          "to finish this lawsuit first, but I'm 100%",
          "committed. Also, can we put a woodshop in",
          "the back? Asking for legal reasons.'",
        ],
        effects: { days: 1, motivation: -3 },
      },
      {
        label: "Group text both of them",
        response: [
          "Tony texts: 'Laundromat. You in?'",
          "",
          "Ovi responds: 'What font is the sign?'",
          "Bill responds: 'Do we need permits for",
          "a table saw?'",
          "",
          "Tony stares at his phone for 10 minutes.",
        ],
        effects: { days: 1, motivation: -5 },
      },
    ],
  },
  {
    title: "FORMING THE LLC",
    art: "office",
    narrative: [
      "Day 1 of the journey. Tony needs to",
      "form an LLC. This requires agreeing",
      "on a business name.",
      "",
      "This should be simple. It is not.",
    ],
    choices: [
      {
        label: "'Clean Sweep Laundry' (Tony's pick)",
        response: [
          "Bill: 'Boring. What about Liberty Wash",
          "& Tactical Dry? The 2nd Amendment angle",
          "is untapped in laundry.'",
          "",
          "Ovi: 'I need at least 3 months to develop",
          "a brand identity before we name anything.'",
          "",
          "They argue for 3 days. Tony picks a name.",
          "Nobody is happy. Classic partnership.",
        ],
        effects: { days: 3, motivation: -5 },
      },
      {
        label: "'Ovi & Associates Premium Garment Care'",
        response: [
          "Ovi is thrilled. He immediately begins",
          "a 47-page brand guidelines document.",
          "Bill threatens to sue over the name not",
          "including him. Tony realizes he has made",
          "a terrible mistake. The name stays.",
          "The brand guidelines cost $5,000.",
        ],
        effects: { savings: -5000, days: 5, motivation: -8 },
      },
      {
        label: "'Liberty Wash & Tactical Dry' (Bill's pick)",
        response: [
          "Bill adds 'Armory' to the sign design",
          "without asking. The city sends a cease",
          "and desist within 48 hours. Bill sues",
          "the city. Ovi refuses to be associated",
          "with 'this aesthetic' and redesigns the",
          "logo to be 'less paramilitary.'",
        ],
        effects: { savings: -1000, days: 10, motivation: -10 },
      },
    ],
  },
  {
    title: "SCOUTING LOCATIONS",
    art: "stripmall",
    narrative: [
      "Tony found a promising location in a",
      "strip mall between a vape shop and a",
      "bail bonds office. Rent is reasonable.",
      "",
      "He scheduled a viewing with both",
      "partners. At 10 AM. On a weekday.",
      "Like adults.",
    ],
    choices: [
      {
        label: "Go to the viewing alone (they'll catch up)",
        response: [
          "Tony goes alone. The space is perfect.",
          "1,200 sq ft. Good plumbing. Parking.",
          "",
          "He texts the group: 'It's perfect.'",
          "Ovi: 'What's the natural lighting like?",
          "Important for the Instagram grid.'",
          "Bill: 'How thick are the walls? Asking",
          "for soundproofing. For the woodshop.'",
        ],
        effects: { days: 2, motivation: -5 },
      },
      {
        label: "Wait for both partners to arrive",
        response: [
          "Tony waits at the strip mall. 10 AM.",
          "10:30. 11:00. Noon.",
          "",
          "Ovi texts at 12:15: 'So sorry, stuck at",
          "brunch. This eggs benedict is criminal.'",
          "",
          "Bill calls at 1 PM: 'Running late. Had",
          "to swing by the courthouse. Long story.'",
          "",
          "The viewing is rescheduled. Again.",
        ],
        effects: { days: 5, motivation: -10 },
      },
      {
        label: "Take a video tour and send it to them",
        response: [
          "Tony records a 3-minute video tour.",
          "",
          "Ovi responds with a 20-minute voice memo",
          "about how the space 'lacks an editorial",
          "quality' and suggests exposed brick.",
          "It's a strip mall.",
          "",
          "Bill responds: 'Can we install a safe?",
          "For the quarters. And my guns.'",
        ],
        effects: { days: 3, motivation: -8 },
      },
    ],
  },
  {
    title: "THE BUSINESS PLAN",
    art: "office",
    narrative: [
      "The bank needs a business plan before",
      "they'll discuss a loan. Tony sets up a",
      "working session at a coffee shop.",
      "",
      "He brings his laptop. A spreadsheet.",
      "Revenue projections. Market research.",
      "",
      "He is the only one who brings these things.",
    ],
    choices: [
      {
        label: "Power through and write it yourself",
        response: [
          "Tony writes the entire business plan in",
          "6 hours. It's actually pretty good.",
          "",
          "Ovi reviews it and says it needs 'more",
          "visual storytelling.' He replaces the",
          "financial projections with a mood board.",
          "",
          "Bill adds a 12-page appendix about why",
          "the laundromat industry is 'being",
          "suppressed by big government.'",
        ],
        effects: { businessPlan: 25, days: 3, motivation: -8 },
      },
      {
        label: "Assign sections to each partner",
        response: [
          "Tony assigns the market analysis to Ovi",
          "and the operations plan to Bill.",
          "",
          "Ovi's section: 15 pages of font samples,",
          "color palettes, and 'aspirational imagery'",
          "he pulled from a yacht catalog.",
          "",
          "Bill's section: a handwritten note that",
          "says 'Buy washers. Wash stuff. Profit.'",
          "and a receipt for a new table saw.",
          "",
          "Tony rewrites both sections at 2 AM.",
        ],
        effects: { businessPlan: 15, days: 7, motivation: -12 },
      },
      {
        label: "Use Bill's 'AI system' to generate it",
        response: [
          "Bill's AI chatbot generates a business",
          "plan for a 'Tactical Laundry Defense",
          "System' that includes recommendations",
          "for 'perimeter security' and a section",
          "on 'leveraging drone technology for",
          "sock retrieval.'",
          "",
          "Tony deletes everything and starts over.",
          "Bill is offended. Ovi is in Cabo.",
        ],
        effects: { businessPlan: 5, days: 5, motivation: -15, savings: -500 },
      },
    ],
  },
  {
    title: "SECURING THE LOAN",
    art: "bank",
    narrative: [
      "Big day. Meeting with the bank to",
      "present the business plan and secure",
      "a small business loan.",
      "",
      "Tony pressed his shirt. Printed copies.",
      "Arrived 15 minutes early.",
      "",
      "He is alone.",
    ],
    choices: [
      {
        label: "Present the plan yourself",
        response: [
          "Tony presents solo. He does well.",
          "The banker nods. 'Looks solid.'",
          "",
          "Then: 'Where are your partners?'",
          "",
          "Tony: 'Ovi is in Tuscany for the month",
          "and Bill is... in a legal proceeding.'",
          "",
          "Banker: 'We'll need revisions. And",
          "maybe... different partners.'",
        ],
        effects: { businessPlan: 10, days: 5, motivation: -5 },
      },
      {
        label: "Delay until Ovi returns from Tuscany",
        response: [
          "Tony waits 14 days. Ovi returns with a",
          "tan and 200 photos of 'laundromat",
          "inspiration' from Italian villages.",
          "",
          "At the bank, Ovi presents a mood board",
          "instead of financials. He brought his",
          "own espresso. The banker is confused.",
          "",
          "The loan is 'under review' indefinitely.",
        ],
        effects: { days: 14, motivation: -15, savings: -500 },
      },
      {
        label: "Let Bill present (he says he's 'a closer')",
        response: [
          "Bill shows up in tactical cargo pants",
          "and a polo. He brought a handgun in a",
          "hip holster 'for confidence.'",
          "",
          "The bank has a no-weapons policy.",
          "",
          "Bill argues the 2nd Amendment for 20",
          "minutes. The banker calls security.",
          "Bill threatens to sue the bank.",
          "",
          "The loan is denied. Tony dies inside.",
        ],
        effects: { motivation: -25, billReliability: -20, days: 3 },
      },
    ],
  },
  {
    title: "CONSTRUCTION BEGINS",
    art: "construction",
    narrative: [
      "Against all odds, Tony secured funding.",
      "(He used his 401k. Partners contributed",
      "nothing but opinions.)",
      "",
      "Construction begins on the laundromat.",
      "Tony hired a contractor. Set a timeline.",
      "8 weeks to build-out. Simple.",
    ],
    choices: [
      {
        label: "Manage the project yourself",
        response: [
          "Tony visits the site daily. Progress",
          "is good. Plumbing is in. Electric is",
          "roughed. Then he arrives on Thursday.",
          "",
          "Bill has set up a table saw, a router,",
          "and a drill press in the back room.",
          "'I'm building the counters,' Bill says.",
          "The contractors threaten to walk.",
          "",
          "Tony removes the equipment at midnight.",
        ],
        effects: { days: 5, motivation: -10, businessPlan: 5 },
      },
      {
        label: "Put Ovi in charge of design decisions",
        response: [
          "Ovi orders custom Italian tile for the",
          "floor. Then changes his mind. Then orders",
          "reclaimed barn wood. Then changes his",
          "mind. Then goes to a yacht show.",
          "",
          "The contractor installs standard vinyl.",
          "Ovi returns and is 'devastated' by the",
          "'lack of vision.' He posts a long",
          "Instagram story about it.",
        ],
        effects: { days: 10, savings: -2000, motivation: -8 },
      },
      {
        label: "Put Bill in charge of equipment ordering",
        response: [
          "Bill orders the washing machines from",
          "a 'guy he knows' on Facebook Marketplace.",
          "They arrive on the back of a pickup truck.",
          "Two are broken. One smells like gasoline.",
          "",
          "Bill also ordered a gun safe, a table saw,",
          "and a 'tactical folding station' that is",
          "just a workbench with a molle panel.",
          "",
          "Tony returns the gun safe. Keeps the saw.",
          "He doesn't know why.",
        ],
        effects: { savings: -2500, days: 7, motivation: -12 },
      },
    ],
  },
  {
    title: "GRAND OPENING PREP",
    art: "laundromat",
    narrative: [
      "The laundromat is almost done.",
      "Equipment is installed. Signs are up.",
      "(The sign says 'Est. 2026' in a font",
      "Ovi spent 4 months choosing.)",
      "",
      "Grand opening is in 3 days. Tony just",
      "needs his partners to show up and help",
      "with the final push. That's all. Just",
      "show up.",
    ],
    choices: [
      {
        label: "Beg them both to be there",
        response: [
          "Tony texts: 'I need you both here.",
          "3 days. That's all I'm asking. 3 days.'",
          "",
          "Ovi: 'Absolutely. I'll be there. Right",
          "after my sommelier certification class.'",
          "(The class is in Bordeaux.)",
          "",
          "Bill: '100%. I just need to finish this",
          "one video first.' (He's filming a rant",
          "about 'Big Laundry' on his phone in the",
          "parking lot.)",
        ],
        effects: { days: 3, motivation: -10 },
      },
      {
        label: "Hire temp workers instead",
        response: [
          "Tony gives up on his partners and hires",
          "temp workers from Craigslist for the",
          "final prep. They're fine. They show up.",
          "They don't redesign anything or sue anyone.",
          "",
          "Tony briefly considers: 'Why didn't I",
          "just do this from the beginning?'",
          "",
          "He pushes the thought away. Too painful.",
        ],
        effects: { savings: -1500, days: 2, motivation: -3 },
      },
      {
        label: "Do it all yourself (again)",
        response: [
          "Tony spends 72 hours straight cleaning,",
          "organizing, testing machines, and folding",
          "sample towels. He sleeps in a lawn chair",
          "in the laundromat.",
          "",
          "At 3 AM on night two, he whispers to a",
          "washing machine: 'You're the most reliable",
          "partner I have.'",
          "",
          "The washing machine says nothing. It is",
          "a washing machine. But it doesn't let",
          "Tony down. Not like the others.",
        ],
        effects: { days: 3, motivation: -15, businessPlan: 5 },
      },
    ],
  },
  {
    title: "OPENING DAY",
    art: "laundromat",
    narrative: [
      "This is it. Opening day.",
      "",
      "Tony arrives at 6 AM. The sign glows.",
      "The machines hum. The quarters are",
      "stacked. For one brief, shining moment,",
      "Tony feels hope.",
      "",
      "Then his phone buzzes. Two texts.",
      "He doesn't want to look.",
      "He looks.",
    ],
    choices: [
      {
        label: "Read Ovi's text first",
        response: [
          "Ovi: 'Hey bro, so I took the marketing",
          "materials to Burning Man. Long story.",
          "The vibes were right. Also I may have",
          "told some people we're a 'garment wellness",
          "collective.' Hope that's cool!'",
          "",
          "It is not cool.",
        ],
        effects: { motivation: -20 },
      },
      {
        label: "Read Bill's text first",
        response: [
          "Bill: 'Bad news. The woodshop caught fire.",
          "Well, technically YOUR back room caught",
          "fire. Sawdust + dryer vent. But don't",
          "worry, I'm already drafting the lawsuit",
          "against the fire department.'",
          "",
          "Tony can smell smoke from the parking lot.",
        ],
        effects: { motivation: -20 },
      },
      {
        label: "Throw your phone in a washing machine",
        response: [
          "Tony opens a front-loader, places his",
          "phone inside, adds detergent, and starts",
          "a delicate cycle.",
          "",
          "He watches it spin. It's actually kind of",
          "peaceful. For about 30 seconds.",
          "",
          "Then the fire alarm goes off. And a process",
          "server walks through the door.",
          "",
          "Bill and Ovi have both outdone themselves.",
        ],
        effects: { motivation: -25 },
      },
    ],
  },
];

const DEATH_SCREENS: DeathScreen[] = [
  {
    title: "OVI WENT TO BURNING MAN",
    text: [
      "On opening day, Ovi took all marketing",
      "materials to Burning Man. He distributed",
      "flyers for the laundromat to 'desert",
      "influencers' who do not wear clothes.",
      "",
      "Bill tried to compensate by going live",
      "on Facebook. He accidentally broadcast",
      "himself ranting about the government",
      "for 3 hours. Zero customers came.",
      "Three people unfriended him.",
      "",
      "Tony locks the door. Goes home. Opens",
      "his laptop. Creates a new PowerPoint.",
      "",
      "Slide 1: 'Q3 Synergy Alignment.'",
      "",
      "Some dreams were never meant to be.",
    ],
  },
  {
    title: "BILL'S WOODSHOP EXPLODED",
    text: [
      "Bill's illegal garage woodshop, which he",
      "had secretly relocated INTO the laundromat",
      "(behind a false wall made of pegboard),",
      "caught fire when sawdust ignited near a",
      "dryer exhaust vent.",
      "",
      "The fire department arrived in 4 minutes.",
      "Bill arrived in 3, already on the phone",
      "with his lawyer.",
      "",
      "Ovi, who was supposed to be handling",
      "insurance, was at a sommelier certification",
      "class. In Bordeaux.",
      "",
      "Tony watches the smoke rise. He gets in",
      "his car. Drives to the office. Sits down.",
      "Opens PowerPoint.",
    ],
  },
  {
    title: "THE AI INCIDENT",
    text: [
      "Bill's AI chatbot went rogue overnight.",
      "It sent threatening legal notices to every",
      "person on the mailing list. The notices",
      "demanded $500 for 'unauthorized lint",
      "accumulation' and threatened 'federal",
      "prosecution.'",
      "",
      "47 people called the police.",
      "3 people actually paid.",
      "",
      "Ovi, who was supposed to monitor the",
      "chatbot, was getting a $400 facial at a",
      "spa in the Hamptons.",
      "",
      "Tony unplugs everything. He drives to",
      "work. He opens PowerPoint #10,001.",
    ],
  },
  {
    title: "DOUBLE BETRAYAL",
    text: [
      "Ovi used the remaining business funds",
      "to open a competing establishment across",
      "the street. He calls it 'Laverie,' a",
      "'luxury garment wellness experience' with",
      "a juice bar and ambient house music.",
      "",
      "Bill spent his share on a poker tournament",
      "in Atlantic City. He lost everything,",
      "including the business van, in a side bet",
      "about whether a dog counts as a service",
      "animal at a casino. (His dead dog.)",
      "",
      "Tony sits in the empty laundromat. A single",
      "washing machine runs. It has nothing in it.",
      "He watches it spin for an hour.",
      "Then he goes back to PowerPoints.",
    ],
  },
  {
    title: "THE LAWSUIT",
    text: [
      "Bill filed lawsuits against: Tony, Ovi,",
      "the landlord, the washing machine company,",
      "Maytag (separately), the City, the State,",
      "the SBA, and 'the concept of commercial",
      "real estate.'",
      "",
      "Simultaneously, Ovi quietly trademarked",
      "the business name and logo in his own",
      "name. He claims he 'designed the brand'",
      "and therefore owns it. His lawyer agrees.",
      "His lawyer is also his wine guy.",
      "",
      "Tony has no laundromat. No partners. No",
      "money. But he still has his cubicle.",
      "",
      "PowerPoint is forever.",
      "PowerPoint never leaves you.",
    ],
  },
];

// ─── STATE TYPES ──────────────────────────────────────────────

type Phase = "title" | "intro" | "playing" | "event" | "choice_result" | "death";

interface GameState {
  phase: Phase;
  stageIndex: number;
  stats: Stats;
  currentText: string[];
  currentArt: keyof typeof ART | null;
  choices: Choice[] | null;
  deathTitle: string | null;
  usedOviEvents: number[];
  usedBillEvents: number[];
  textKey: number; // forces TypewriterText remount
}

type Action =
  | { type: "START" }
  | { type: "ADVANCE_FROM_INTRO" }
  | { type: "MAKE_CHOICE"; index: number }
  | { type: "ADVANCE_FROM_CHOICE_RESULT" }
  | { type: "ADVANCE_FROM_EVENT" }
  | { type: "RESTART" };

const INITIAL_STATS: Stats = {
  motivation: 85,
  savings: 12000,
  businessPlan: 5,
  days: 0,
  oviReliability: 40,
  billReliability: 35,
};

function pickRandomEvent(
  oviEvents: GameEvent[],
  billEvents: GameEvent[],
  usedOvi: number[],
  usedBill: number[],
): { event: GameEvent; usedOvi: number[]; usedBill: number[] } {
  const isOvi = Math.random() < 0.5;
  if (isOvi) {
    const available = oviEvents
      .map((e, i) => ({ e, i }))
      .filter(({ i }) => !usedOvi.includes(i));
    if (available.length === 0) {
      // fallback to Bill
      const bAvail = billEvents
        .map((e, i) => ({ e, i }))
        .filter(({ i }) => !usedBill.includes(i));
      const pick = bAvail[Math.floor(Math.random() * bAvail.length)];
      return { event: pick.e, usedOvi, usedBill: [...usedBill, pick.i] };
    }
    const pick = available[Math.floor(Math.random() * available.length)];
    return { event: pick.e, usedOvi: [...usedOvi, pick.i], usedBill };
  } else {
    const available = billEvents
      .map((e, i) => ({ e, i }))
      .filter(({ i }) => !usedBill.includes(i));
    if (available.length === 0) {
      const oAvail = oviEvents
        .map((e, i) => ({ e, i }))
        .filter(({ i }) => !usedOvi.includes(i));
      const pick = oAvail[Math.floor(Math.random() * oAvail.length)];
      return { event: pick.e, usedOvi: [...usedOvi, pick.i], usedBill };
    }
    const pick = available[Math.floor(Math.random() * available.length)];
    return { event: pick.e, usedOvi, usedBill: [...usedBill, pick.i] };
  }
}

function applyEffects(stats: Stats, effects: Partial<Stats>): Stats {
  return {
    motivation: Math.max(0, Math.min(100, stats.motivation + (effects.motivation ?? 0))),
    savings: Math.max(0, stats.savings + (effects.savings ?? 0)),
    businessPlan: Math.max(0, Math.min(100, stats.businessPlan + (effects.businessPlan ?? 0))),
    days: stats.days + (effects.days ?? 0),
    oviReliability: Math.max(0, Math.min(100, stats.oviReliability + (effects.oviReliability ?? 0))),
    billReliability: Math.max(
      0,
      Math.min(100, stats.billReliability + (effects.billReliability ?? 0)),
    ),
  };
}

function checkDeath(stats: Stats, stageIndex: number): DeathScreen | null {
  if (stageIndex >= STAGES.length - 1) {
    return DEATH_SCREENS[Math.floor(Math.random() * DEATH_SCREENS.length)];
  }
  if (stats.motivation <= 0) {
    return {
      title: "MOTIVATION: ZERO",
      text: [
        "Tony has lost all will to continue.",
        "",
        "He stares at the half-built laundromat.",
        "Then he stares at his car keys. Then at",
        "his phone. Ovi posted a photo of a sunset",
        "in Monaco. Bill posted a video about 'the",
        "truth about dryer sheets' (2 views).",
        "",
        "Tony drives to the office. Parks in his",
        "usual spot. Sits down at his desk.",
        "Opens PowerPoint.",
        "",
        "It's like he never left.",
      ],
    };
  }
  if (stats.savings <= 0) {
    return {
      title: "BANKRUPT",
      text: [
        "The money is gone. All of it.",
        "",
        "Tony checks the business account: $0.00.",
        "Between Ovi's marble countertops and",
        "Bill's lawsuits and table saws, there is",
        "literally nothing left.",
        "",
        "Tony updates his LinkedIn. Changes his",
        "title back to 'PowerPoint Specialist.'",
        "",
        "He gets 3 recruiter messages within",
        "the hour. All for PowerPoint jobs.",
        "",
        "The universe has spoken.",
      ],
    };
  }
  return null;
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "START":
      return {
        ...state,
        phase: "intro",
        currentText: [
          "The year is 2026. You are Tony.",
          "",
          "Every morning you drive 45 minutes to a",
          "gray building where you make PowerPoint",
          "presentations about PowerPoint presentations.",
          "",
          "Your boss's name is Lori. Lori has never",
          "made a decision. Lori 'aligns stakeholders.'",
          "",
          "You have two friends: Ovi and Bill. For 5",
          "years they have talked about 'doing something",
          "together.' Opening a business. Being their",
          "own boss. Living the dream.",
          "",
          "Today, you decide: the dream is a laundromat.",
          "",
          "God help you.",
        ],
        currentArt: "tony",
        textKey: state.textKey + 1,
      };

    case "ADVANCE_FROM_INTRO": {
      const stage = STAGES[0];
      return {
        ...state,
        phase: "playing",
        stageIndex: 0,
        currentText: [`--- STAGE 1: ${stage.title} ---`, "", ...stage.narrative],
        currentArt: stage.art as keyof typeof ART,
        choices: stage.choices,
        textKey: state.textKey + 1,
      };
    }

    case "MAKE_CHOICE": {
      const stage = STAGES[state.stageIndex];
      const choice = stage.choices[action.index];
      const newStats = applyEffects(state.stats, choice.effects);
      return {
        ...state,
        phase: "choice_result",
        stats: newStats,
        currentText: choice.response,
        choices: null,
        textKey: state.textKey + 1,
      };
    }

    case "ADVANCE_FROM_CHOICE_RESULT": {
      // Fire a random event
      const { event, usedOvi, usedBill } = pickRandomEvent(
        OVI_EVENTS,
        BILL_EVENTS,
        state.usedOviEvents,
        state.usedBillEvents,
      );
      const newStats = applyEffects(state.stats, event.effects);
      return {
        ...state,
        phase: "event",
        stats: newStats,
        currentText: event.text,
        currentArt: event.who === "ovi" ? "ovi" : "bill",
        usedOviEvents: usedOvi,
        usedBillEvents: usedBill,
        textKey: state.textKey + 1,
      };
    }

    case "ADVANCE_FROM_EVENT": {
      const death = checkDeath(state.stats, state.stageIndex);
      if (death) {
        return {
          ...state,
          phase: "death",
          currentText: [
            `=== ${death.title} ===`,
            "",
            ...death.text,
            "",
            "========================================",
            "",
            "    Y O U R   D R E A M   H A S   D I E D",
            "",
            `    Days on trail: ${state.stats.days}`,
            `    Money wasted: $${(12000 - state.stats.savings).toLocaleString()}`,
            `    PowerPoints avoided: ${state.stats.days}`,
            `    PowerPoints that await: infinite`,
            "",
            "========================================",
          ],
          currentArt: "tombstone",
          deathTitle: death.title,
          choices: null,
          textKey: state.textKey + 1,
        };
      }
      // Advance to next stage
      const nextIndex = state.stageIndex + 1;
      const nextStage = STAGES[nextIndex];
      return {
        ...state,
        phase: "playing",
        stageIndex: nextIndex,
        currentText: [`--- STAGE ${nextIndex + 1}: ${nextStage.title} ---`, "", ...nextStage.narrative],
        currentArt: nextStage.art as keyof typeof ART,
        choices: nextStage.choices,
        textKey: state.textKey + 1,
      };
    }

    case "RESTART":
      return {
        phase: "title",
        stageIndex: 0,
        stats: { ...INITIAL_STATS },
        currentText: [],
        currentArt: null,
        choices: null,
        deathTitle: null,
        usedOviEvents: [],
        usedBillEvents: [],
        textKey: state.textKey + 1,
      };

    default:
      return state;
  }
}

// ─── COMPONENTS ───────────────────────────────────────────────

function TypewriterText({
  lines,
  speed = 25,
  onComplete,
  textKey,
}: {
  lines: string[];
  speed?: number;
  onComplete: () => void;
  textKey: number;
}) {
  const fullText = lines.join("\n");
  const [charCount, setCharCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const firedRef = useRef(false);

  const done = charCount >= fullText.length;

  useEffect(() => {
    setCharCount(0);
    firedRef.current = false;
  }, [textKey]);

  // Fire onComplete once when done becomes true, deferred to avoid setState-during-render
  useEffect(() => {
    if (done && !firedRef.current) {
      firedRef.current = true;
      const cb = onCompleteRef.current;
      const id = setTimeout(() => cb(), 0);
      return () => clearTimeout(id);
    }
  }, [done]);

  useEffect(() => {
    if (done) return;
    intervalRef.current = setInterval(() => {
      setCharCount((c) => {
        const next = c + 1;
        if (next >= fullText.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return fullText.length;
        }
        return next;
      });
    }, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [done, textKey, fullText.length, speed]);

  const skip = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCharCount(fullText.length);
  }, [fullText.length]);

  const displayed = fullText.slice(0, charCount);

  return (
    <div className="relative">
      <pre
        className="whitespace-pre-wrap font-mono text-[#33ff33] text-sm sm:text-base leading-relaxed"
        style={{ textShadow: "0 0 8px rgba(51,255,51,0.3)" }}
      >
        {displayed}
        {!done && <span className="animate-pulse">_</span>}
      </pre>
      {!done && (
        <button
          onClick={skip}
          className="absolute top-0 right-0 text-[#33ff33]/40 text-xs font-mono
                     hover:text-[#33ff33]/70 transition-colors cursor-pointer"
        >
          [SKIP]
        </button>
      )}
    </div>
  );
}

function StatusBar({ stats }: { stats: Stats }) {
  const motivColor =
    stats.motivation > 50 ? "text-[#33ff33]" : stats.motivation > 25 ? "text-yellow-400" : "text-red-400";
  const savingsColor =
    stats.savings > 5000 ? "text-[#33ff33]" : stats.savings > 2000 ? "text-yellow-400" : "text-red-400";
  const planColor =
    stats.businessPlan > 60 ? "text-[#33ff33]" : stats.businessPlan > 30 ? "text-yellow-400" : "text-red-400";

  const oviStatus = OVI_STATUSES[Math.floor(Math.random() * OVI_STATUSES.length)];
  const billStatus = BILL_STATUSES[Math.floor(Math.random() * BILL_STATUSES.length)];

  return (
    <div
      className="border border-[#33ff33]/30 rounded-sm p-3 font-mono text-xs sm:text-sm mt-4"
      style={{ textShadow: "0 0 6px rgba(51,255,51,0.2)" }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
        <div className="text-[#33ff33]/70">
          Day: <span className="text-[#33ff33]">{stats.days}</span>
        </div>
        <div className="text-[#33ff33]/70">
          Savings: <span className={savingsColor}>${stats.savings.toLocaleString()}</span>
        </div>
        <div className="text-[#33ff33]/70">
          Motivation: <span className={motivColor}>{stats.motivation}%</span>
        </div>
        <div className="text-[#33ff33]/70">
          Plan: <span className={planColor}>{stats.businessPlan}%</span>
        </div>
        <div className="text-[#33ff33]/70 truncate">
          Ovi: <span className="text-[#33ff33]/50">{oviStatus}</span>
        </div>
        <div className="text-[#33ff33]/70 truncate">
          Bill: <span className="text-[#33ff33]/50">{billStatus}</span>
        </div>
      </div>
    </div>
  );
}

function AsciiArtBlock({ artKey }: { artKey: keyof typeof ART }) {
  return (
    <div className="overflow-x-auto mb-4">
      <pre
        className="font-mono text-[#33ff33] text-[9px] sm:text-xs leading-tight whitespace-pre select-none"
        style={{ textShadow: "0 0 6px rgba(51,255,51,0.25)" }}
      >
        {ART[artKey]}
      </pre>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────

const initialState: GameState = {
  phase: "title",
  stageIndex: 0,
  stats: { ...INITIAL_STATS },
  currentText: [],
  currentArt: null,
  choices: null,
  deathTitle: null,
  usedOviEvents: [],
  usedBillEvents: [],
  textKey: 0,
};

export default function TheLaundromatTrailPage() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [textComplete, setTextComplete] = useState(false);
  const textCompleteRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleTextComplete = useCallback(() => {
    setTextComplete(true);
    textCompleteRef.current = true;
  }, []);

  // Reset textComplete when phase/textKey changes
  useEffect(() => {
    setTextComplete(false);
    textCompleteRef.current = false;
  }, [state.textKey]);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const tc = textCompleteRef.current;

      if (e.key === "Enter") {
        if (s.phase === "title") {
          dispatch({ type: "START" });
        } else if (s.phase === "intro" && tc) {
          dispatch({ type: "ADVANCE_FROM_INTRO" });
        } else if (s.phase === "choice_result" && tc) {
          dispatch({ type: "ADVANCE_FROM_CHOICE_RESULT" });
        } else if (s.phase === "event" && tc) {
          dispatch({ type: "ADVANCE_FROM_EVENT" });
        } else if (s.phase === "death" && tc) {
          dispatch({ type: "RESTART" });
        }
      }

      if (s.phase === "playing" && tc && s.choices) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= s.choices.length) {
          dispatch({ type: "MAKE_CHOICE", index: num - 1 });
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#071a0e] flex items-center justify-center p-4 font-mono">
      {/* CRT container */}
      <div
        className="relative w-full max-w-2xl bg-[#040e07] border border-[#33ff33]/20 rounded-sm p-6 sm:p-8 overflow-hidden"
        style={{ boxShadow: "0 0 40px rgba(51,255,51,0.08), inset 0 0 60px rgba(0,0,0,0.5)" }}
      >
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)",
          }}
        />

        {/* Content */}
        <div className="relative z-20">
          {/* ─── TITLE SCREEN ─── */}
          {state.phase === "title" && (
            <div className="flex flex-col items-center">
              <div className="overflow-x-auto w-full">
                <pre
                  className="font-mono text-[#33ff33] text-[4px] sm:text-[6px] md:text-[8px] leading-tight whitespace-pre select-none text-center"
                  style={{ textShadow: "0 0 10px rgba(51,255,51,0.4)" }}
                >
                  {ART.title}
                </pre>
              </div>
              <AsciiArtBlock artKey="washer" />
              <p
                className="text-[#33ff33]/60 text-sm font-mono mt-4 text-center"
                style={{ textShadow: "0 0 6px rgba(51,255,51,0.3)" }}
              >
                A game about dreams, laundry, and terrible business partners.
              </p>
              <p className="text-[#33ff33] text-sm font-mono mt-8 animate-pulse text-center">
                {">"} PRESS ENTER TO BEGIN {"<"}
              </p>
              <button
                onClick={() => dispatch({ type: "START" })}
                className="mt-4 text-[#33ff33]/40 text-xs font-mono hover:text-[#33ff33]/70
                           transition-colors cursor-pointer sm:hidden"
              >
                [TAP HERE ON MOBILE]
              </button>
            </div>
          )}

          {/* ─── INTRO ─── */}
          {state.phase === "intro" && (
            <div>
              {state.currentArt && <AsciiArtBlock artKey={state.currentArt} />}
              <TypewriterText
                lines={state.currentText}
                speed={25}
                onComplete={handleTextComplete}
                textKey={state.textKey}
              />
              {textComplete && (
                <div className="mt-6">
                  <button
                    onClick={() => dispatch({ type: "ADVANCE_FROM_INTRO" })}
                    className="text-[#33ff33] font-mono text-sm animate-pulse
                               hover:text-[#33ff33]/80 transition-colors cursor-pointer"
                  >
                    {">"} PRESS ENTER TO HIT THE TRAIL {"<"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── PLAYING (stage narrative + choices) ─── */}
          {state.phase === "playing" && (
            <div>
              {state.currentArt && <AsciiArtBlock artKey={state.currentArt} />}
              <TypewriterText
                lines={state.currentText}
                speed={25}
                onComplete={handleTextComplete}
                textKey={state.textKey}
              />
              {textComplete && state.choices && (
                <div className="mt-6 space-y-2">
                  <p className="text-[#33ff33]/50 text-xs font-mono mb-2">WHAT DO YOU DO?</p>
                  {state.choices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => dispatch({ type: "MAKE_CHOICE", index: i })}
                      className="block w-full text-left text-[#33ff33] font-mono text-sm
                                 py-2 px-3 border border-[#33ff33]/20 rounded-sm
                                 hover:bg-[#33ff33]/10 hover:border-[#33ff33]/40
                                 transition-colors cursor-pointer"
                      style={{ textShadow: "0 0 6px rgba(51,255,51,0.2)" }}
                    >
                      {">"} [{i + 1}] {choice.label}
                    </button>
                  ))}
                </div>
              )}
              <StatusBar stats={state.stats} />
            </div>
          )}

          {/* ─── CHOICE RESULT ─── */}
          {state.phase === "choice_result" && (
            <div>
              <TypewriterText
                lines={state.currentText}
                speed={20}
                onComplete={handleTextComplete}
                textKey={state.textKey}
              />
              {textComplete && (
                <div className="mt-6">
                  <button
                    onClick={() => dispatch({ type: "ADVANCE_FROM_CHOICE_RESULT" })}
                    className="text-[#33ff33] font-mono text-sm animate-pulse
                               hover:text-[#33ff33]/80 transition-colors cursor-pointer"
                  >
                    {">"} PRESS ENTER TO CONTINUE {"<"}
                  </button>
                </div>
              )}
              <StatusBar stats={state.stats} />
            </div>
          )}

          {/* ─── EVENT ─── */}
          {state.phase === "event" && (
            <div>
              {state.currentArt && <AsciiArtBlock artKey={state.currentArt} />}
              <TypewriterText
                lines={state.currentText}
                speed={20}
                onComplete={handleTextComplete}
                textKey={state.textKey}
              />
              {textComplete && (
                <div className="mt-6">
                  <button
                    onClick={() => dispatch({ type: "ADVANCE_FROM_EVENT" })}
                    className="text-[#33ff33] font-mono text-sm animate-pulse
                               hover:text-[#33ff33]/80 transition-colors cursor-pointer"
                  >
                    {">"} PRESS ENTER TO CONTINUE {"<"}
                  </button>
                </div>
              )}
              <StatusBar stats={state.stats} />
            </div>
          )}

          {/* ─── DEATH ─── */}
          {state.phase === "death" && (
            <div>
              {state.currentArt && <AsciiArtBlock artKey={state.currentArt} />}
              <TypewriterText
                lines={state.currentText}
                speed={40}
                onComplete={handleTextComplete}
                textKey={state.textKey}
              />
              {textComplete && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <button
                    onClick={() => dispatch({ type: "RESTART" })}
                    className="text-[#33ff33] font-mono text-sm animate-pulse
                               hover:text-[#33ff33]/80 transition-colors cursor-pointer"
                  >
                    {">"} PRESS ENTER TO TRY AGAIN {"<"}
                  </button>
                  <p className="text-[#33ff33]/30 text-xs font-mono">(Spoiler: it won&apos;t help.)</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
