"use client";

import { useReducer, useEffect, useState, useCallback, useRef } from "react";

// ─── ASCII ART ────────────────────────────────────────────────

const ART = {
  title: `
  ███████╗███████╗ ██████╗ █████╗ ██████╗ ███████╗
  ██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝
  █████╗  ███████╗██║     ███████║██████╔╝█████╗
  ██╔══╝  ╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝
  ███████╗███████║╚██████╗██║  ██║██║     ███████╗
  ╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝
            ███████╗██████╗  ██████╗ ███╗   ███╗
            ██╔════╝██╔══██╗██╔═══██╗████╗ ████║
            █████╗  ██████╔╝██║   ██║██╔████╔██║
            ██╔══╝  ██╔══██╗██║   ██║██║╚██╔╝██║
            ██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║
            ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝
            ██████╗  █████╗ ██████╗ ██╗███████╗
            ██╔══██╗██╔══██╗██╔══██╗██║██╔════╝
            ██████╔╝███████║██████╔╝██║███████╗
            ██╔═══╝ ██╔══██║██╔══██╗██║╚════██║
            ██║     ██║  ██║██║  ██║██║███████║
            ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝`,

  eiffel: `
                  *
                 /|\\
                / | \\
               /  |  \\
              /   |   \\
             /____|____\\
             |    |    |
            /     |     \\
           /      |      \\
          /_______|_______\\
          |       |       |
          |     [===]     |
          |_______________|
         /                 \\
        /                   \\
       /         |           \\
      /__________|____________\\
      |          |            |
      |       2E ÉTAGE        |
      |_______________________|
     /                         \\
    /                           \\
   /_____________________________\\
   |                             |
   |        PARIS · 1889         |
   |_____________________________|
   ||                           ||
   ||___________________________||
    |                           |
   _|_                         _|_
  |___|                       |___|`,

  plane: `
                  ___
                 /   \\
            __--|__o__|--__
           /  _____________ \\
          |  |  AIR FRANCE   | |
          |  |_______________| |
          |   o  o  o  o  o    |
           \\_________________/
              |  CDG T2E |
              |__________|
                |     |
              ==========
              ==========`,

  hotel: `
        ★ ★ ★ LE BRISTOL ★ ★ ★
     _______________________________
    |   _    _    _    _    _    _   |
    |  |#|  |#|  |#|  |#|  |#|  |#|  |
    |  |_|  |_|  |_|  |_|  |_|  |_|  |
    |   _    _    _    _    _    _   |
    |  |#|  |#|  |#|  |_|  |#|  |#|  |
    |  |_|  |_|  |_|  |_|  |_|  |_|  |
    |   _    _    _    _    _    _   |
    |  |#|  |#|  |#|  |#|  |#|  |#|  |
    |  |_|  |_|  |_|  |_|  |_|  |_|  |
    |        _______________         |
    |       |    ENTRÉE     |        |
    |_______|_______________|________|
       |  | RUE DU FAUBOURG  |  |
    ___|__|__SAINT-HONORÉ____|__|___`,

  metro: `
       _____________________________
      |  CHÂTELET - LES HALLES (M)  |
      |_____________________________|
      |   ___    ___    ___    ___  |
      |  | o |  | o |  | o |  | o | |
      |  |___|  |___|  |___|  |___| |
      |     \\\\__\\\\           //__//
      |          *PICKPOCKETS*      |
      |       (statistically)       |
      |_____________________________|
      ===================================
              [LINE 1] [LINE 4] [RER]`,

  embassy: `
        _________________________
       |   U.S. EMBASSY - PARIS  |
       |   2 AVENUE GABRIEL      |
       |_________________________|
       |                         |
       |        * * * *          |
       |       *       *         |
       |        *  *  *          |
       |        *******          |
       |        *  *  *          |
       |                         |
       |   [BULLETPROOF GLASS]   |
       |   [MAGA HOTLINE: 1-800] |
       |__[GUARD]_______[GUARD]__|`,

  gendarme: `
         _______
        | KEPI  |
        |_______|
        | o   o |
        |   |   |   <- Gendarme
        |  ___  |   "Vos papiers,
         \\_____/      monsieur?"
          /|||\\
         / ||| \\
        [TACTICAL]
        [VEST GIGN]
        |  | |  |
        |__| |__|`,

  ovi: `
       _________
      / O     O \\
     |  \\_____/  |  <- Ovi
      \\___|___/    "Sacré bleu, my hair
        /| |\\        cannot survive
       / | | \\        this humidity."
      [GUCCI LOAFERS]
      [HERMÈS SCARF]`,

  michelle: `
        _______
       | -.-.- |
       | o   o |  <- Michelle (wife)
       |  \\_/  |  "He has not opened
        \\_____/    his laptop. Once.
        /|   |\\     In three days."
       / |   | \\
       [LOUBOUTINS]`,

  pickpocket: `
        ___________________________
       |  TROCADÉRO VIEWPOINT      |
       |___________________________|
        \\o/    \\o/         \\_/
         |  ←── |  ←──────  /|\\
        / \\    / \\         / \\
      [Ovi]  [???]      [???]
      Selfie  Hands    Already Gone
      Mode   in Pocket   With Phone

         "Excusez-moi monsieur,
            you dropped this!"
                  ↑
          (this is the trick)`,

  laSante: `
        _____________________________
       |  LA SANTÉ PRISON - 14ÈME    |
       |_____________________________|
       |  |##| |##| |##| |##| |##|   |
       |  |##| |##| |##| |##| |##|   |
       |  |##| |##| |##|*|##| |##|   |
       |  |##| |##| |##| |##| |##|   |
       |  |##| |##| |##| |##| |##|   |
       |_____________________________|
            |   |   |   |   |
            |___|___|___|___|
            BOULEVARD ARAGO`,

  hospital: `
       ╔═══════════════════════════════╗
       ║  HÔPITAL SAINTE-ANNE          ║
       ║  PSYCHIATRIC WING - 14ÈME     ║
       ╠═══════════════════════════════╣
       ║                               ║
       ║    [///] [///] [///] [///]    ║
       ║                               ║
       ║         _________             ║
       ║        | OVI    |             ║
       ║        |________|             ║
       ║         |||||||                ║
       ║                               ║
       ║   "He keeps asking for        ║
       ║    a sommelier."              ║
       ╚═══════════════════════════════╝`,

  gareDuNord: `
      ___________________________________
     |  GARE DU NORD - DÉPART EUROSTAR   |
     |___________________________________|
     |  [LONDON] [BRUSSELS] [AMSTERDAM]  |
     |___________________________________|
     |                                   |
     |   ___ ___ ___ ___ ___ ___ ___ ___ |
     |  | _|_ _|_ _|_ _|_ _|_ _|_ _|_ _||
     |  ||_||_||_||_||_||_||_||_||_||_| |
     |                                   |
     |   [PASSPORT CONTROL] [↑NOPE↑]    |
     |___________________________________|`,

  calais: `
       ===================================
       |  CALAIS - PORT BOULOGNE / "JUNGLE"|
       ===================================
        ___________________
       | []  [LORRY]   []  |
       | []  ___________   |
       | [] |  P&O FERRY | |
       | [] |____________| |
       |___________________|
         ▲▲▲▲ TENTS ▲▲▲▲
         RAZOR WIRE / MUD
         "Vous payez? Combien?"`,

  dinghy: `
       ~~~~~~~~~~~~~~~~~~~~~~~~~~
            _____   _____   _____
           | o o | | o o | | o o |
           |  |  | |  |  | |  |  |
            \\___/   \\___/   \\___/
       _____________________________
      |    DINGHY · RIB · NO GPS    |
      |_____________________________|
       ~~~~ splash ~~~~ splash ~~~~~
        THE ENGLISH CHANNEL · 3AM
        (32 km · 1 outboard · 47 souls)`,

  doverPub: `
       _____________________________
      |  THE WHITE CLIFFS ARMS PUB  |
      |_____________________________|
      |  [PINT] [PINT] [PINT] [PINT] |
      |   ___    ___    ___          |
      |  | o |  | o |  | o |  USMC   |
      |  |___|  |___|  |___|  USAF   |
      |   |||    |||    |||   USCG   |
      |_____________________________|
        DOVER, KENT - 22:47 GMT`,

  lakenheath: `
       __________________________________
      |  RAF LAKENHEATH - SUFFOLK, UK    |
      |  48TH FIGHTER WING - USAF        |
      |__________________________________|
      |    [F-15]  [F-15]  [F-35]  [F-35]|
      |     ___     ___     ___     ___ |
      |    |▲▲▲|   |▲▲▲|   |▲▲▲|   |▲▲▲||
      |__________________________________|
       =========== RUNWAY 24 ==============
            [GUARD]   [GATE]   [GUARD]`,

  tombstone: `
            .---.
           (  .  )
            '-'
        .---'---.
       /  R.I.P. \\
      |           |
      | HERE LIES |
      |   OVI'S   |
      |  EUROPEAN |
      |   DREAM   |
      |           |
      | Last seen |
      |  somewhere|
      | unwise.   |
      |___________|
   ___/___________\\___
  /                     \\`,
};

// ─── GAME DATA ────────────────────────────────────────────────

interface Choice {
  label: string;
  effects: Partial<Stats>;
  response: string[];
}

interface Stage {
  title: string;
  art: keyof typeof ART;
  narrative: string[];
  choices: Choice[];
}

interface GameEvent {
  who: "ovi" | "michelle";
  text: string[];
  effects: Partial<Stats>;
}

interface DeathScreen {
  title: string;
  art: keyof typeof ART;
  text: string[];
}

interface Stats {
  pride: number;
  euros: number;
  hair: number;
  suspicion: number;
  days: number;
  michellePatience: number;
}

const OVI_STATUSES = [
  "Adjusting his scarf",
  "Photographing his espresso",
  "At the Hermès flagship",
  "Crying at his hairline",
  "Refreshing Instagram",
  "Pretending to speak French",
  "On a 'work call'",
  "Buying a third coat",
  "Avoiding the wife",
  "Asking for the chef",
];

const MICHELLE_STATUSES = [
  "Reading the receipts",
  "On the phone with her sister",
  "At the spa (alone)",
  "Researching divorce attorneys",
  "Counting the lies",
  "At Ladurée (without Ovi)",
  "Texting her ex",
  "Updating Find My iPhone",
  "Considering options",
  "Quietly seething",
];

const OVI_EVENTS: GameEvent[] = [
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "At breakfast in Le Bristol's courtyard,",
      "Ovi sends his croissant back. Twice.",
      "'It lacks laminated dignity,' he says.",
      "The chef does not come. The waiter writes",
      "something on his pad. It is not a note",
      "about the croissant.",
    ],
    effects: { pride: -3, euros: -120 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi detours to the Hermès flagship at",
      "24 Rue du Faubourg Saint-Honoré. He buys",
      "a €4,200 cashmere coat 'for Switzerland.'",
      "He charges it to his AmeriLife corporate",
      "card. He files it under 'CLIENT MEETING",
      "ATTIRE.' Michelle sees the receipt.",
    ],
    effects: { euros: -4200, michellePatience: -10 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "The Paris humidity hits Ovi's combover at",
      "Place de la Concorde. The 14 wisps he had",
      "negotiated across the top of his head this",
      "morning separate, then revolt, then point at",
      "the sky like an accusation. His scalp is, in",
      "the afternoon light, a beacon. He runs back",
      "to the hotel. He weeps into a Le Bristol",
      "bathrobe. Michelle, in the next room, runs",
      "her fingers through her own perfect hair and",
      "does not say anything.",
    ],
    effects: { hair: -25, days: 1, pride: -8 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi attempts to flirt with a model at",
      "Café de Flore on Boulevard Saint-Germain.",
      "He says 'Bonjour, mademoiselle, vous êtes",
      "très magnifique.' She does not look up",
      "from her book. The book is in English.",
      "She is from Cleveland.",
    ],
    effects: { pride: -10 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi posts an Instagram from the Trocadéro",
      "with the caption: 'Manifesting global",
      "mobility. #blessed #parisianlife #consultant'",
      "His phone autocorrects 'consultant' to",
      "'condiment.' He does not notice for 6 hours.",
      "Three coworkers screenshot it.",
    ],
    effects: { pride: -5, suspicion: 5 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi books a 'creative consultation' with",
      "a Paris stylist on Avenue Montaigne. The",
      "stylist tells him his current look is",
      "'a touch ServiceMaster Catastrophe Cleanup.'",
      "Ovi pays €800 for a wardrobe overhaul.",
      "The wardrobe is the same as before.",
    ],
    effects: { euros: -800, pride: -5 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi orders bottle service at Silencio,",
      "the David Lynch club in the 2ème. He",
      "orders Dom Pérignon for a table of",
      "strangers and tells them he is a 'private",
      "wealth advisor.' He is not. The bill is",
      "€1,800. The strangers vanish before it",
      "arrives.",
    ],
    effects: { euros: -1800, pride: -3 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi tries to expense a Cartier bracelet",
      "as a 'partnership development gift.' The",
      "AmeriLife finance department flags it.",
      "Then flags 7 other charges. They send a",
      "very polite email asking him to call. He",
      "marks it as read and silences notifications.",
    ],
    effects: { suspicion: 15, pride: -5 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "At dinner at Le Jules Verne (the restaurant",
      "inside the Eiffel Tower), Ovi orders the",
      "tasting menu and the wine pairing for two.",
      "He then attempts to charm the sommelier in",
      "broken French. The sommelier, who is from",
      "New Jersey, switches to English mid-pour.",
    ],
    effects: { euros: -890, pride: -5 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi 'invests' €600 with a man at Harry's",
      "New York Bar who claims he is launching a",
      "'curated mezcal subscription box.' The man",
      "leaves through the back. Ovi tells Michelle",
      "it was a 'strategic capital deployment.'",
      "She nods. She is making a list.",
    ],
    effects: { euros: -600, michellePatience: -8 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "A man in a beret and a horizontally-striped",
      "shirt offers Ovi an 'authentic Breton",
      "shallot harvest experience' for €300. The",
      "man is smoking a Gauloise. The shallots",
      "are from a Carrefour. Ovi pays. He posts",
      "about his 'farm-to-table soul journey.'",
    ],
    effects: { euros: -300, pride: -3 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "At a Champs-Élysées café, Ovi leans into",
      "a stranger's ear and says, 'Between us,",
      "if there is a way to expedite this — my",
      "wife is, how do I say, VERY cooperative.'",
      "",
      "The stranger is an off-duty Police",
      "Nationale officer. He stops chewing.",
      "He puts down his fork. Slowly.",
    ],
    effects: { suspicion: 25, michellePatience: -15 },
  },
  {
    who: "ovi",
    text: [
      "** OVI EVENT **",
      "",
      "Ovi is approached by three different",
      "scammers in 90 minutes outside the Louvre:",
      "the gold ring trick, the petition signer,",
      "and the deaf-charity clipboard. Ovi falls",
      "for all three. He gives a TED-style review",
      "of the experience on his Instagram Stories.",
    ],
    effects: { euros: -180, pride: -5 },
  },
];

const MICHELLE_EVENTS: GameEvent[] = [
  {
    who: "michelle",
    text: [
      "** MICHELLE EVENT **",
      "",
      "Michelle notices Ovi has not opened his",
      "laptop. Not in three days. She has",
      "noticed. She does not say anything.",
      "She just notices. Her eyebrow does",
      "something subtle. Something terminal.",
    ],
    effects: { michellePatience: -10 },
  },
  {
    who: "michelle",
    text: [
      "** MICHELLE EVENT **",
      "",
      "Michelle asks, casually, what city in",
      "Switzerland the meeting is in. Ovi says",
      "'Geneva.' Then 'Zurich.' Then 'one of",
      "those.' She nods. She googles 'AmeriLife",
      "Switzerland office.' There isn't one.",
    ],
    effects: { michellePatience: -15, suspicion: 5 },
  },
  {
    who: "michelle",
    text: [
      "** MICHELLE EVENT **",
      "",
      "Michelle goes to the spa at Le Bristol",
      "without Ovi. She gets the €600 'Royal",
      "Renaissance' treatment. She charges it",
      "to the room. She tips in cash from his",
      "wallet. The masseuse compliments her",
      "decision-making.",
    ],
    effects: { euros: -700 },
  },
  {
    who: "michelle",
    text: [
      "** MICHELLE EVENT **",
      "",
      "Ovi catches Michelle laughing at her phone.",
      "He asks who she's texting. She says,",
      "'My sister.' She is not texting her sister.",
      "She is texting a divorce attorney named",
      "Brad. Brad has reviewed the iCloud history.",
      "Brad has thoughts.",
    ],
    effects: { michellePatience: -5 },
  },
  {
    who: "michelle",
    text: [
      "** MICHELLE EVENT **",
      "",
      "Michelle takes herself to lunch at Lipp on",
      "Boulevard Saint-Germain. She orders the",
      "choucroute, a glass of Sancerre, and",
      "dessert. She eats slowly. She does not",
      "answer Ovi's calls. He calls 11 times.",
      "She watches the missed call counter rise.",
    ],
    effects: { michellePatience: -3, euros: -180 },
  },
  {
    who: "michelle",
    text: [
      "** MICHELLE EVENT **",
      "",
      "Michelle opens his luggage 'looking for",
      "the iPad charger.' She finds three",
      "passports. None of them are hers. None",
      "of them are in his name. Two are in the",
      "name 'Owen Vasilescu.' One is Belgian.",
      "She takes a photograph. She closes the bag.",
    ],
    effects: { suspicion: 20, michellePatience: -15 },
  },
  {
    who: "michelle",
    text: [
      "** MICHELLE EVENT **",
      "",
      "Michelle is now reading 'How to Freeze",
      "Joint Accounts' on a hotel iPad. The",
      "browser history is set to private. The",
      "Wi-Fi log is not. The IT desk at AmeriLife",
      "will eventually receive a routine audit.",
      "It will not be routine.",
    ],
    effects: { suspicion: 10 },
  },
  {
    who: "michelle",
    text: [
      "** MICHELLE EVENT **",
      "",
      "Michelle rebooks her return flight. Solo.",
      "Business class. She uses Ovi's miles. She",
      "does not mention it. The confirmation email",
      "goes to her secondary inbox. The seat is",
      "1A. The flight is in 36 hours.",
    ],
    effects: { michellePatience: -20 },
  },
];

const STAGES: Stage[] = [
  {
    title: "ARRIVAL AT CDG",
    art: "plane",
    narrative: [
      "The Air France 777 from Tampa touches down",
      "at Charles de Gaulle Terminal 2E.",
      "",
      "Ovi descends in business class. Loro Piana",
      "cap. Hermès scarf. A watch that costs more",
      "than the seat. He has been awake for 14",
      "hours. He looks like a Pinterest board.",
      "",
      "Behind him: his wife Michelle, dragging two",
      "Goyard trunks. She does not work at AmeriLife.",
      "She has never worked at AmeriLife. She is",
      "here because Ovi insisted, and because the",
      "spa at Le Bristol is, according to Vogue,",
      "'unparalleled.'",
      "",
      "His itinerary says: Paris → Geneva. For",
      "'work.' Mon Dieu, what a charming lie.",
    ],
    choices: [
      {
        label: "Take the RER B train into Paris (€11)",
        response: [
          "The RER B leaves CDG and immediately",
          "stops at Aulnay-sous-Bois. Then again at",
          "La Plaine-Stade de France. Michelle clutches",
          "her Goyard. Ovi clutches his blowout.",
          "",
          "Across the aisle: a woman in a beret",
          "and a marinière, smoking an electronic",
          "Gauloise out the train window. Next to",
          "her: a man pretending to be a deaf-mute",
          "with a clipboard. Behind them: a man with",
          "a tracksuit making prolonged eye contact",
          "with the Hermès scarf. Ovi smiles.",
          "",
          "Ovi thinks he has made three friends.",
          "Ovi has made zero friends.",
        ],
        effects: { suspicion: 10, days: 1, pride: -3 },
      },
      {
        label: "Order a black Mercedes (€180)",
        response: [
          "The Mercedes glides down the A1. Ovi",
          "tips the driver in dollars. The driver",
          "looks at the dollars. The driver looks",
          "at Ovi. The driver does not say merci.",
          "",
          "Michelle: 'You don't tip in dollars in",
          "Paris, William.' Ovi: 'It's the gesture.'",
          "Michelle: 'It is, in fact, the gesture.'",
        ],
        effects: { euros: -180, days: 1 },
      },
      {
        label: "Insist on a 'private transfer' (€450)",
        response: [
          "Ovi books the 'Premier Concierge Service'",
          "from a website that looks legitimate. It",
          "is not. The driver demands payment up",
          "front in cash. The car is a Renault Clio.",
          "There is a baby seat. There is no baby.",
          "Ovi pays. Michelle closes her eyes.",
        ],
        effects: { euros: -450, days: 1, michellePatience: -5 },
      },
    ],
  },
  {
    title: "LE BRISTOL, 8ÈME",
    art: "hotel",
    narrative: [
      "Le Bristol Paris. 112 Rue du Faubourg",
      "Saint-Honoré. The lobby smells like fresh",
      "peonies and old money. Ovi inhales like",
      "he's done this before. He has not.",
      "",
      "The concierge addresses him as 'Monsieur.'",
      "Ovi nearly cries. He overtips. The concierge",
      "is too professional to comment.",
      "",
      "Michelle heads to the suite to rest. She has",
      "questions about the trip. She is saving them.",
      "",
      "Ovi has the afternoon free. The 'meeting'",
      "in Geneva is supposedly tomorrow. There",
      "is no meeting. There has never been a",
      "meeting. The afternoon is his.",
    ],
    choices: [
      {
        label: "Spend it shopping at Place Vendôme",
        response: [
          "Ovi browses Cartier, Boucheron, and Van",
          "Cleef. He purchases nothing. He photographs",
          "everything. He poses for the security",
          "cameras like they are the Sartorialist.",
          "",
          "On the way back, he stops at Goyard. He",
          "buys a wallet. Then a luggage tag. Then a",
          "second wallet 'for symmetry.' €2,400.",
        ],
        effects: { euros: -2400, pride: 5, days: 1 },
      },
      {
        label: "Hit the Eiffel Tower for the view (and the photo)",
        response: [
          "Ovi rides the lift to the second platform.",
          "He stands at the railing. He takes 47",
          "photos of himself. Then 12 boomerangs.",
          "Then a slow-mo of the scarf catching the",
          "wind. Tourists ask him to move. He does",
          "not move. A child kicks his ankle.",
          "",
          "It is, he decides, the best afternoon of",
          "his life. So far.",
        ],
        effects: { days: 1, pride: 5 },
      },
      {
        label: "'Network' at Harry's New York Bar",
        response: [
          "Harry's, on Rue Daunou, was Hemingway's",
          "bar. Ovi orders a Sidecar. He tells the",
          "American couple next to him that he is",
          "in Paris 'for board work.' The couple",
          "nods. They are from Akron. They are",
          "polite. They leave after one drink.",
          "",
          "Ovi orders three more Sidecars. He pays",
          "for the couple's tab. They have already gone.",
        ],
        effects: { euros: -240, days: 1, pride: -3 },
      },
    ],
  },
  {
    title: "TROCADÉRO, 16ÈME",
    art: "eiffel",
    narrative: [
      "Day two. Ovi 'has to take a call.' He",
      "leaves Michelle at the spa and heads to",
      "the Trocadéro for the Eiffel Tower view.",
      "",
      "The plaza is packed. Tourists. Vendors",
      "selling tiny Eiffel Towers. Two men in",
      "berets smoking on a bench. A trio of",
      "women in marinière stripes 'finding' a",
      "gold ring on the ground in front of him.",
      "A man with a clipboard for 'deaf children.'",
      "Another man with a clipboard for a different",
      "set of deaf children. Three women asking if",
      "he speaks English. Six scammers. Possibly",
      "seven if you count the falafel guy.",
      "",
      "Ovi pulls out his phone. Front camera.",
      "He poses. He angles. He does the half-",
      "smile he has practiced in mirrors. He",
      "does not notice the small woman who",
      "bumps into him from behind.",
      "",
      "She apologizes. 'Pardon, monsieur!'",
      "She is gone in under a second.",
    ],
    choices: [
      {
        label: "Keep posing — the light is perfect",
        response: [
          "Ovi captures the shot. Posts it. Tags it",
          "#manifesting. Goes to check his phone for",
          "likes 4 minutes later. Reaches for his",
          "back pocket.",
          "",
          "His passport is gone.",
          "",
          "His wallet is also gone.",
          "",
          "His Cartier money clip — emptied — is",
          "still there. They left the money clip",
          "out of professional courtesy. It is",
          "engraved.",
        ],
        effects: { suspicion: 5 },
      },
      {
        label: "Chase the woman shouting 'Sacré bleu!'",
        response: [
          "Ovi yells 'SACRÉ BLEU!' at the top of his",
          "lungs. A bystander filming for TikTok",
          "captures it. The woman vanishes into the",
          "Métro at Trocadéro. Ovi cannot follow —",
          "his loafers are not designed for stairs.",
          "",
          "He pats his pockets. Passport: gone.",
          "Wallet: gone. Dignity: gone, but already",
          "had been for some time.",
          "",
          "The TikTok will get 4.2 million views.",
        ],
        effects: { suspicion: 10, pride: -10 },
      },
      {
        label: "Notice nothing — it'll all be fine",
        response: [
          "Ovi finishes the shoot. Walks 800 meters.",
          "Stops for a Perrier. Reaches for his",
          "wallet to pay. There is no wallet.",
          "",
          "He laughs. 'C'est impossible!' he says,",
          "to no one. He pats every pocket. Twice.",
          "Three times.",
          "",
          "The waiter watches. The waiter has seen",
          "this exact face on this exact tourist",
          "every day since 2003.",
        ],
        effects: { days: 1, pride: -5 },
      },
    ],
  },
  {
    title: "U.S. EMBASSY, 2 AVENUE GABRIEL",
    art: "embassy",
    narrative: [
      "Ovi takes an Uber (charged to AmeriLife)",
      "to the U.S. Embassy at 2 Avenue Gabriel,",
      "between Place de la Concorde and the",
      "Élysée Palace.",
      "",
      "The line is long. The Marine guards do",
      "not smile. The American flag hangs limp",
      "in the spring drizzle. Ovi stands behind",
      "a man from Houston who lost his passport",
      "in a fountain. They do not bond.",
      "",
      "Three hours later, Ovi reaches a clerk.",
      "Plexiglass. Bored eyes. A small American",
      "flag pin shaped like a baseball cap.",
      "",
      "Clerk: 'Sir, before we begin, please",
      "verify your MAGA credentials.'",
      "",
      "Ovi: 'My... what?'",
    ],
    choices: [
      {
        label: "Slap down your Florida voter card with the big 'R'",
        response: [
          "Ovi triumphantly produces his Florida",
          "voter registration card. Party affiliation:",
          "REPUBLICAN. The 'R' is, in fact, large.",
          "He had it laminated. He had it laminated",
          "twice.",
          "",
          "Clerk: 'Sir. Name a single executive order",
          "from the second term.'",
          "",
          "Ovi: 'Uh — the one about the... the thing...",
          "with the... the...'",
          "",
          "Clerk: '*sigh*' Stamps form: PROVISIONAL",
          "DENIAL — INSUFFICIENT MAGA. 'Try again",
          "next week. Bring receipts. From rallies.",
          "Bring rally receipts.'",
        ],
        effects: { suspicion: 5, days: 7, pride: -10 },
      },
      {
        label: "Show him the Hermès scarf as proof of patriotism",
        response: [
          "Ovi: 'This scarf is, in essence, freedom.'",
          "",
          "Clerk: 'Sir, this scarf is French.'",
          "",
          "Ovi: 'Yes. But the *spirit* —'",
          "",
          "Clerk: 'Do you own a flag pole.'",
          "",
          "Ovi: 'I own a... a Pinterest board ABOUT",
          "flag poles.'",
          "",
          "Clerk: 'Denied. Next.'",
        ],
        effects: { days: 5, pride: -15 },
      },
      {
        label: "Try to bribe the clerk with €200",
        response: [
          "Ovi slides €200 across the counter.",
          "",
          "Clerk does not look at the money. Clerk",
          "looks at the camera in the corner. Clerk",
          "presses a small button under the desk.",
          "",
          "Two Marines escort Ovi out of the embassy.",
          "Politely. Firmly. With a paperwork trail.",
          "",
          "His name is now in a system. Several",
          "systems. He will discover this when he",
          "tries to leave the country.",
        ],
        effects: { euros: -200, suspicion: 30, days: 1 },
      },
    ],
  },
  {
    title: "BACK AT THE BRISTOL",
    art: "hotel",
    narrative: [
      "Ovi returns to the suite. Michelle is",
      "wearing a robe and reading a Hermès",
      "catalogue. She does not look up.",
      "",
      "Michelle: 'How was the meeting.'",
      "Ovi: 'Productive. Geneva is on hold.'",
      "Michelle: 'Mm.'",
      "",
      "He needs to get out of France. The",
      "embassy will take weeks. He has a wife,",
      "a problem, and one bad idea forming",
      "behind his eyes.",
      "",
      "He needs leverage. He has, in his view,",
      "exactly one form of leverage available.",
    ],
    choices: [
      {
        label: "Tell the embassy your wife is 'VERY cooperative' for an expedite",
        response: [
          "Ovi returns to 2 Avenue Gabriel and",
          "leans in to the clerk: 'Look, between",
          "us — my wife is, how shall I put it,",
          "VERY cooperative. If there's a path",
          "for, you know... discretionary processing.'",
          "",
          "The clerk's expression does not change.",
          "The clerk's hand reaches under the desk.",
          "The clerk presses a button. A different,",
          "more permanent button than last time.",
          "",
          "Michelle, somehow, will hear about this",
          "by 6 PM. Brad's secretary places the call.",
        ],
        effects: { michellePatience: -35, suspicion: 25, pride: -5 },
      },
      {
        label: "Pawn Michelle's wedding ring at a place in the 9ème",
        response: [
          "Ovi takes Michelle's wedding ring while she",
          "showers. He walks to a 'comptoir d'or'",
          "near Pigalle. The man at the counter",
          "offers €1,800. Ovi accepts.",
          "",
          "Real value of the ring: €11,000.",
          "",
          "He puts on a fake band from a vending",
          "machine in the Métro. It turns her finger",
          "green within 4 hours. Michelle notices. She",
          "does not say anything.",
          "",
          "This is, statistically, the worst sign.",
        ],
        effects: { euros: 1800, michellePatience: -30, suspicion: 5 },
      },
      {
        label: "Offer to 'lend' Michelle's company to a 'fixer' for 24 hours",
        response: [
          "Ovi makes a phone call to a number a man",
          "at Harry's gave him. The man on the other",
          "end is Bulgarian. The man wants to know",
          "what Ovi has 'to trade.' Ovi mentions his",
          "wife. There is a long silence.",
          "",
          "The man: 'Monsieur. Even WE are insulted.'",
          "",
          "The man hangs up. He calls back two minutes",
          "later — to insult him again — then hangs up.",
        ],
        effects: { michellePatience: -40, pride: -15, suspicion: 10 },
      },
    ],
  },
  {
    title: "GARE DU NORD, 10ÈME",
    art: "gareDuNord",
    narrative: [
      "New plan. Eurostar to London. From there,",
      "fly home on a story. He has heard you can",
      "buy your way through if you know who to",
      "ask. He knows nobody. But the suit is good.",
      "",
      "Gare du Nord is chaos. Pickpockets, families,",
      "tourists, gendarmes with submachine guns,",
      "a man selling SIM cards from a shoebox.",
      "Ovi blends in like a swan in a coal mine.",
      "",
      "Eurostar requires a passport. Ovi does not",
      "have one. He has a plan. The plan involves",
      "a man in a cap. The plan is bad.",
    ],
    choices: [
      {
        label: "Buy a 'replacement passport' from a man in a cap (€800)",
        response: [
          "The man hands Ovi a passport. The passport",
          "says 'OWEN VASILESCU.' Ovi says, 'This",
          "isn't me.' The man says, 'It is now.'",
          "",
          "Ovi presents Owen Vasilescu's passport at",
          "Eurostar passport control. The agent runs",
          "it. The agent's face changes. The agent",
          "calls a colleague. The colleague calls",
          "another colleague.",
          "",
          "Ovi is escorted to a small windowless room.",
          "He will be there for some time.",
        ],
        effects: { euros: -800, suspicion: 40, days: 2 },
      },
      {
        label: "Try to slip onto the Eurostar without papers",
        response: [
          "Ovi waits until a school group from",
          "Lyon swarms the platform. He attempts to",
          "merge with them. He is 47. They are 12.",
          "He is wearing a Hermès scarf. They are",
          "wearing matching yellow vests.",
          "",
          "A teacher named Marie-Claire taps him on",
          "the shoulder. 'Excusez-moi, monsieur.",
          "Are you Lucas's stepfather?'",
          "",
          "Ovi panics. He says yes. There is no",
          "Lucas. The Gendarmerie are notified.",
        ],
        effects: { suspicion: 50, days: 1 },
      },
      {
        label: "'Befriend' a businessman in first class",
        response: [
          "Ovi sidles up to a man in a cashmere coat",
          "in the Eurostar lounge. 'Beautiful coat.",
          "Loro Piana?' The man nods. The man is",
          "named Henri. Henri is a tax inspector",
          "for the Direction Générale des Finances",
          "Publiques. Henri is here because of a",
          "tip from AmeriLife's Paris auditor.",
          "",
          "Henri is here for Ovi. Specifically.",
        ],
        effects: { suspicion: 30, days: 1 },
      },
    ],
  },
  {
    title: "THE 18ÈME — A POOR DECISION",
    art: "metro",
    narrative: [
      "Ovi takes the Métro Line 4 to Barbès-",
      "Rochechouart. The 18ème arrondissement",
      "around Boulevard de la Chapelle is not",
      "the Paris of postcards.",
      "",
      "He has heard, from the man at Harry's,",
      "that there is 'a guy who can get anyone",
      "anywhere.' The guy works above a phone-",
      "repair shop on Rue Doudeauville. The",
      "guy is 'discreet.' The guy 'understands.'",
      "",
      "Ovi is wearing the Hermès scarf. The",
      "Loro Piana cap. The Cartier watch. He",
      "looks like a walking ATM in a neighborhood",
      "that has, statistically, opinions about ATMs.",
    ],
    choices: [
      {
        label: "Walk in confidently. Make eye contact. Mention 'Roman'",
        response: [
          "Ovi enters. The shop owner looks up. Ovi",
          "says, 'Roman sent me.' The shop owner",
          "says, 'Who?' Ovi says, 'Roman.' The shop",
          "owner says, 'There is no Roman.'",
          "",
          "Three men appear from a back room. They",
          "are not Roman. They are not friends of",
          "Roman. They have, however, noticed the",
          "watch. And the scarf. And the soft hands.",
          "",
          "Ovi leaves the shop without his watch.",
          "Or scarf. Or cap. Or shoes. Or pride.",
        ],
        effects: { euros: -50, pride: -25, suspicion: 10 },
      },
      {
        label: "Try to negotiate from outside the shop",
        response: [
          "Ovi stands across the street and yells,",
          "'BONJOUR! I HAVE EUROS!' This goes about",
          "as well as you would expect. Two men cross",
          "the street to discuss it with him.",
          "",
          "Ovi runs. He has not run since 2009. His",
          "loafers are not engineered for it. He",
          "twists his ankle on a cobblestone outside",
          "a bakery. He cries. The men do not chase him.",
          "They do not need to. They have his wallet.",
        ],
        effects: { euros: -1200, pride: -20, days: 2 },
      },
      {
        label: "Leave. Pretend this never happened. Try Plan G.",
        response: [
          "Wisdom, for once. Ovi turns around. He",
          "walks back to the Métro. He boards a train.",
          "The train is delayed. A man two seats over",
          "is, very calmly, eating an entire baguette.",
          "Ovi watches him. The man does not break",
          "eye contact.",
          "",
          "Ovi rides eight stops past his hotel out",
          "of pure social paralysis. He gets out at",
          "Mairie des Lilas. He has no idea where he is.",
        ],
        effects: { days: 1, pride: -5 },
      },
    ],
  },
  {
    title: "CALAIS — THE 'JUNGLE'",
    art: "calais",
    narrative: [
      "Day eight. Michelle has stopped asking",
      "questions. AmeriLife has frozen the",
      "corporate card. The Bristol concierge has",
      "stopped using 'Monsieur.' He uses 'you.'",
      "",
      "Ovi takes a bus from Gare Routière de Paris",
      "Bercy to Calais Ville. Six hours on a",
      "FlixBus. He sits next to a man in a beret",
      "smoking a Gitane out the window. The driver",
      "does not stop him. France.",
      "",
      "Calais. Port de Boulogne-sur-Mer. Razor",
      "wire. Tents. A man selling life jackets",
      "(empty). Another man selling life jackets",
      "(filled with foam packing peanuts). Ovi has",
      "found, he believes, the smuggler economy.",
      "",
      "It has, in fact, found him.",
      "",
      "He has been told, by friends, to memorize",
      "the following Somali phrase for negotiations:",
      "",
      "  'Waxaan u baahanahay marin aan ku tago",
      "   England; lacag caddaan ah baan haystaa,",
      "   xaaskayguna waa diyaar inay nala shaqayso.'",
      "",
      "  Literal: 'I need passage to England; I",
      "   have cash, and my wife is ready to",
      "   cooperate.'",
      "",
      "Ovi has not memorized it. Ovi mouths the",
      "first three syllables, panics, and says",
      "'WAX-ON, WAX-OFF' instead. Loudly.",
    ],
    choices: [
      {
        label: "Pay €1,500 cash for passage on a 'fishing boat' to Dover",
        response: [
          "The boat is not a fishing boat. The boat",
          "is a 6-meter inflatable RIB intended for",
          "12 people. There are 47 people on it.",
          "Ovi is one of them.",
          "",
          "The 'captain' has never operated a boat.",
          "The 'GPS' is a phone with 14% battery.",
          "The 'safety briefing' is the captain",
          "saying 'do not move' in three languages.",
          "",
          "Ovi clutches his Goyard wallet. Someone",
          "vomits Camembert onto his loafers.",
          "Mon Dieu.",
        ],
        effects: { euros: -1500, days: 1, pride: -10 },
      },
      {
        label: "Tell the smuggler your wife is 'VERY cooperative' for a discount",
        response: [
          "Ovi attempts to negotiate: 'Listen,",
          "between us — my wife back in Paris is,",
          "shall we say, VERY cooperative. If you",
          "have associates in the city, perhaps we",
          "can come to an arrangement.'",
          "",
          "The smuggler's name is Hakim. Hakim",
          "speaks five languages. In two of them,",
          "he tells Ovi exactly what he thinks of",
          "him. Then Hakim's brother Karim joins in",
          "in language six. Ovi has, somehow, been",
          "morally lectured by people-smugglers.",
          "",
          "He pays full price. They charge him extra.",
        ],
        effects: { euros: -2200, michellePatience: -25, pride: -15, days: 1 },
      },
      {
        label: "Try to stow away in a P&O freight lorry headed for Dover",
        response: [
          "Ovi waits until 2 AM and slips into the",
          "back of a Polish-plated lorry hauling",
          "frozen poultry to Dover. He hides between",
          "two pallets of chicken thighs. It is -18°C.",
          "",
          "The driver, Janusz, finds him in 11",
          "minutes via a thermal-camera mandate from",
          "Border Force. Janusz takes Ovi's wallet,",
          "his cap, his scarf, and a photo for",
          "Janusz's group chat. Then Janusz drops",
          "him at the next roundabout.",
          "",
          "Ovi walks back to the port. He pays the",
          "smuggler. The smuggler laughs first.",
        ],
        effects: { euros: -1800, pride: -20, days: 1 },
      },
    ],
  },
  {
    title: "THE CHANNEL — 03:14 GMT",
    art: "dinghy",
    narrative: [
      "The dinghy launches from a beach near Wimereux",
      "at 3:00 AM. The water is 11°C. The wind is",
      "Force 5. The captain's phone-GPS dies in 22",
      "minutes. The Spirit of Bonfiglio, registered",
      "in Tampa, is not coming for him.",
      "",
      "Around Ovi: a family from Khartoum, two men",
      "from Eritrea, a young couple from Kabul, an",
      "engineer from Aleppo who keeps quietly fixing",
      "the outboard motor, and one extremely bored",
      "13-year-old who is doing geometry homework",
      "by phone-light.",
      "",
      "Ovi is the only one wearing loafers.",
      "Ovi is the only one not paying attention.",
      "Ovi is composing an Instagram caption.",
    ],
    choices: [
      {
        label: "Try to bond with the engineer ('we are both professionals')",
        response: [
          "Ovi: 'You and I — we are both men of",
          "industry. I am in insurance. AmeriLife.",
          "Tampa. Have you heard of it?'",
          "",
          "The engineer, whose name is Yusuf, stares",
          "at him. Yusuf was the chief structural",
          "engineer for a hospital that no longer",
          "exists. Yusuf does not respond.",
          "",
          "Yusuf returns to fixing the outboard.",
          "He does this with a fork.",
        ],
        effects: { pride: -8, days: 1 },
      },
      {
        label: "Bribe the captain to drop you off near a yacht",
        response: [
          "Ovi: 'Excusez-moi! Capitaine! €500 to",
          "drop me at a private yacht. Surely there",
          "is a yacht.'",
          "",
          "The captain points at the open sea. The",
          "captain says, in English, 'There is no",
          "yacht. There is only the sea. The sea",
          "does not care about your euros, my friend.'",
          "",
          "It is the most poetic thing anyone has",
          "ever said to Ovi. He weeps. He weeps a",
          "second time when he discovers the captain",
          "has taken his €500 anyway.",
        ],
        effects: { euros: -500, days: 1 },
      },
      {
        label: "Pretend to be the captain when Border Force shows up",
        response: [
          "A UK Border Force RIB intercepts the",
          "dinghy 6 nautical miles from Dover. Ovi",
          "stands up too quickly. 'Officer! I am",
          "the captain. American citizen. I demand—'",
          "",
          "He does not finish the sentence. The wake",
          "from the Border Force boat tips him into",
          "the Channel. He is fished out 90 seconds",
          "later by a man named Dave from Folkestone.",
          "",
          "Dave does not seem impressed.",
        ],
        effects: { hair: -50, pride: -20, days: 1 },
      },
    ],
  },
  {
    title: "DOVER → LAKENHEATH, SUFFOLK",
    art: "doverPub",
    narrative: [
      "Soaking wet, scarfless, processed and",
      "released on a 'temporary humanitarian",
      "deferment' (a clerical error, frankly), Ovi",
      "spends the night at a Travelodge in Dover.",
      "",
      "Breakfast is included. It is a 'Full English.'",
      "Ovi — a man who once sent a tarte tatin back",
      "at Le Bristol because the apples 'lacked",
      "narrative arc' — is presented with: fried",
      "bread, baked beans (cold), black pudding",
      "(which is what, exactly?), one grey mushroom,",
      "and a tomato that has given up.",
      "",
      "He weeps into a styrofoam cup of Nescafé.",
      "",
      "He has been told, via group text, to make",
      "his way — clandestinely — to the town of",
      "LAKENHEATH in Suffolk. There, lay low until",
      "11 PM. Then head to a sports bar called the",
      "GALAXY CLUB. The brief continues: 'Find a",
      "service member who closely matches you in",
      "stature and appearance. Shouldn't be hard.'",
      "",
      "Ovi takes a National Express coach. He arrives",
      "at 4 PM. He has 7 hours to kill in Lakenheath.",
    ],
    choices: [
      {
        label: "Hide in a B&B and binge ITV until 11 PM",
        response: [
          "Ovi rents a single room at the Bell Hotel,",
          "a 16th-century coaching inn on the High",
          "Street. The wallpaper has roses. The TV",
          "has 4 channels. ITV is showing a marathon",
          "of 'Antiques Roadshow.'",
          "",
          "He orders room service. It arrives: a",
          "'jacket potato' filled with what the menu",
          "calls 'tuna mayo.' It is room temperature.",
          "It is grey. It is, somehow, both wet and",
          "dry. He eats half. He naps. He dreams of",
          "Le Bristol breakfast tartines.",
        ],
        effects: { euros: -85, hair: -3, days: 1 },
      },
      {
        label: "Walk the High Street and 'do recon' at a Greggs",
        response: [
          "Ovi enters the Greggs on Lakenheath High",
          "Street. He orders a steak bake. Then a",
          "sausage roll. Then a yum-yum. The cashier,",
          "Karen (badge: KAREN), has 14 visible piercings",
          "and a tooth that is, factually, sideways.",
          "",
          "Karen: 'Awright bab.' Ovi: 'Bonjour, ah,",
          "good day.' Karen: 'You alright, sweets?",
          "Y'look knackered.' Ovi nods, in awe of",
          "the sentence.",
          "",
          "He eats on a bench outside. A seagull takes",
          "the second yum-yum. He does not fight back.",
        ],
        effects: { euros: -12, pride: -8, days: 1 },
      },
      {
        label: "Shop the local Tesco for 'civvies' to blend in",
        response: [
          "Ovi enters the Tesco Express. He buys: a",
          "navy crewneck (£14), a pair of beige",
          "trousers labeled 'F&F SLIM' (£18), and",
          "trainers from a brand he has never heard",
          "of (£22). He emerges looking like a supply",
          "teacher on a long bus journey.",
          "",
          "He catches his reflection in the window of",
          "the Costa next door. He gasps. 'Mon Dieu,'",
          "he whispers. 'I look... British.'",
          "",
          "It is the worst he has ever felt. And he",
          "has been on a refugee dinghy.",
        ],
        effects: { euros: -54, pride: -15, days: 1 },
      },
    ],
  },
  {
    title: "GALAXY CLUB SPORTS BAR — 23:07",
    art: "doverPub",
    narrative: [
      "23:07. The Galaxy Club Sports Bar, on the",
      "High Street in Lakenheath, between a Spar",
      "and a fish-and-chip shop called The Cod",
      "Father. The chippy's vinegar fumes have",
      "fully colonized the block.",
      "",
      "Inside: dim lighting, two pool tables, a",
      "darts league semi-final on the back screen,",
      "and a clientele that is approximately 40%",
      "off-duty USAF (mostly RAF Mildenhall and",
      "RAF Lakenheath) and 60% locals with dental",
      "arrangements that defy Euclidean geometry.",
      "",
      "The plan, per the group chat, is delicate:",
      "befriend a service member of similar build",
      "and appearance. Get him alone. Acquire — and",
      "this is the part Ovi has been trying not to",
      "think about — his uniform and ID.",
      "",
      "Ovi spots a candidate at the bar. ~5'7\". Trim.",
      "Off-duty USAF patch on the bag. Drinking a",
      "Stella alone. The stranger glances over. Ovi",
      "has rehearsed three openers. All three are bad.",
    ],
    choices: [
      {
        label: "Lead with: 'I sketch in charcoal and you have exquisite cheekbones'",
        response: [
          "The airman, A1C Tyler Pressman of Topeka,",
          "puts down his pint. He says, 'Mate. My",
          "fiancée is upstairs. Watching.' He waves.",
          "A 6-foot woman holding a pool cue waves back.",
          "",
          "Ovi pivots. 'For — for an artistic study.",
          "I sketch. I am a sketcher.' He has never",
          "sketched. He owns one Boots eyeliner",
          "pencil for reasons he cannot now recall.",
          "",
          "A1C Pressman looks at him for a long moment.",
          "Then: 'Right. Buy me a Jägerbomb. Let's see",
          "where this goes.' Ovi cannot believe his",
          "luck. His luck has not begun.",
        ],
        effects: { euros: -28, pride: -8, days: 1 },
      },
      {
        label: "Buy him a round and offer to 'show him the canal towpath'",
        response: [
          "Senior Airman Marcus Hall sets down his",
          "pint. 'Mate. We don't have a canal. We",
          "have a drainage ditch. Behind the Spar.'",
          "Pause. 'It's actually quite nice, after",
          "midnight, if you bring a torch.'",
          "",
          "Ovi nearly faints. Marcus continues:",
          "'Listen. I'm USAF Office of Special",
          "Investigations. I run a totally unrelated",
          "honeypot for fentanyl. But honestly, you",
          "have made my month. Buy me a Sambuca.'",
          "",
          "Ovi buys a Sambuca. Then another. Then",
          "another. He still doesn't realize.",
        ],
        effects: { euros: -42, suspicion: 30, days: 1 },
      },
      {
        label: "Whisper: 'I have €4,000 cash and my wife is VERY cooperative'",
        response: [
          "TSgt. Jay Nguyen, who has been here for 9",
          "months and has heard, by his count, 'a",
          "remarkable amount of weird stuff,' looks",
          "at Ovi. He says, slowly: 'Sir. Are you",
          "offering me your... wife? In a Wetherspoons-",
          "adjacent pub? In Lakenheath? At 11 PM?'",
          "",
          "Ovi nods. Hopefully.",
          "",
          "TSgt Nguyen lifts a hand. From a booth in",
          "the back, two men in civvies stand up. One",
          "of them is Cody. Yes. THAT Cody. Cody,",
          "somehow, is here too. Cody is having an",
          "exceptional fiscal quarter.",
        ],
        effects: { suspicion: 35, michellePatience: -15, pride: -10, days: 1 },
      },
    ],
  },
  {
    title: "THE EXTRACTION — ABOVE THE SPAR",
    art: "doverPub",
    narrative: [
      "Through some combination of vodka, denial,",
      "and the candidate's frankly suspicious",
      "willingness, Ovi finds himself in a small",
      "off-base flat above the Lakenheath Spar.",
      "",
      "The flat smells like Lynx Africa, microwave",
      "lasagna, and Yorkshire Tea. There is a poster",
      "for Norwich City FC. There is a Halo 3 disc",
      "on the carpet. There is a single bottle of",
      "HP Sauce on the kitchen counter.",
      "",
      "The HP Sauce is, per the plan, his weapon.",
      "",
      "The plan, per the group chat: get the airman",
      "alone, deliver a 'sharp blow to the back of",
      "the head' with a heavy object, take uniform",
      "and ID. Walk onto the base in disguise. Easy.",
      "",
      "Ovi has rehearsed the swing 47 times in his",
      "head. He has never, ever, hit anyone. He",
      "fenced once at Choate. Poorly.",
    ],
    choices: [
      {
        label: "Swing the HP Sauce bottle the moment the airman turns around",
        response: [
          "Ovi raises the bottle. Two-handed. Eyes",
          "closed. He swings. He misses by, roughly,",
          "the width of a ham. The bottle continues",
          "through the air, hits a framed Norwich City",
          "pennant, shatters the glass, and deposits",
          "brown sauce in an arc across the plaster.",
          "",
          "The airman turns. Sees the sauce. Sees the",
          "bottle. Sees Ovi's stance — which is,",
          "objectively, the stance of a child holding",
          "a tee-ball bat.",
          "",
          "The airman sighs. 'Mate. Sit down. We've",
          "been onto you since Calais.' Ovi sits. Ovi",
          "cries. Ovi pees a little.",
        ],
        effects: { suspicion: 40, pride: -25, days: 1 },
      },
      {
        label: "Get him drunker first (he is, somehow, ahead of you)",
        response: [
          "Ovi opens a bottle of Glen's Vodka from",
          "the freezer. He pours two doubles. He",
          "secretly pours his own into a plastic fern.",
          "He toasts. They drink. He toasts again.",
          "They drink again. A third time.",
          "",
          "The fern dies in 6 minutes from sustained",
          "vodka exposure. The airman is completely",
          "fine. Ovi is not. Ovi is, in fact, on the",
          "kitchen floor singing 'La Vie en Rose' to a",
          "microwave.",
          "",
          "The airman calmly takes a photo. Sends it",
          "to a group thread titled 'TONIGHT'S MARK.'",
        ],
        effects: { euros: -8, pride: -20, days: 1 },
      },
      {
        label: "Confess everything and beg for the uniform",
        response: [
          "Ovi: 'I cannot do this. Forgive me. I lost",
          "my passport at Trocadéro. The embassy",
          "denied me. I crossed the Channel on a",
          "dinghy fixed by a man named Yusuf. Please.",
          "Lend me your uniform. I will FedEx it back.",
          "My wife is VERY—'",
          "",
          "The airman: 'Stop. Just — stop.' He pulls",
          "a uniform from a closet. Folded. Pressed.",
          "Wrong size. He hands it over. He hands",
          "over an ID. The ID has Ovi's FACE on it",
          "already. Photoshopped. Laminated.",
          "",
          "'They wanted you to think you were getting",
          "away with it,' he says. 'Cody's idea. Cody",
          "loves an arc.'",
        ],
        effects: { suspicion: 45, pride: -15, days: 1 },
      },
    ],
  },
  {
    title: "RAF MILDENHALL — 100TH ARW",
    art: "lakenheath",
    narrative: [
      "Wearing a borrowed-or-acquired-or-handed-to-",
      "him USAF uniform (sleeves rolled, name tape",
      "smudged with a Sharpie, ID badge two shades",
      "too pink), Ovi drives a Vauxhall Corsa through",
      "the gate at RAF MILDENHALL — home of the 100th",
      "Air Refueling Wing. KC-135s on the apron.",
      "",
      "The MP at the gate looks at him. Looks at the",
      "badge. Looks at the haircut. Looks at the",
      "Italian loafers. Looks back at the badge.",
      "",
      "The MP, slowly: 'Welcome home, Airman.'",
      "",
      "Ovi parks at the 100th Medical Group clinic.",
      "He has memorized the plan. He has WHISPERED",
      "the plan to himself in the car: feign sickness.",
      "Demand CASEVAC to the U.S. If they hesitate —",
      "execute THE ICE PLAN.",
      "",
      "The Ice Plan is: secure as much ice as possible",
      "from the morgue, submerge himself in it, hold",
      "his breath, get pronounced dead, escape the",
      "morgue, flag down a passing motorist.",
      "",
      "It is, even in his own head, a bad plan.",
    ],
    choices: [
      {
        label: "Fake a stroke — demand aeromedical evacuation to Tampa",
        response: [
          "Ovi slumps in the waiting room. He drools.",
          "He half-mumbles 'left side... numb...' He",
          "stares at a ceiling tile like Stevie Wonder",
          "delivering a soliloquy.",
          "",
          "The flight surgeon, Maj. Okafor, listens to",
          "Ovi's chest. Listens longer. Frowns.",
          "",
          "Maj. Okafor: 'Sir. Your blood pressure is",
          "the blood pressure of a 13-year-old. Your",
          "speech is fine. Your BAC is, however, 0.31.",
          "Your hair is — I will give you this —",
          "remarkable.'",
          "",
          "Maj. Okafor presses an intercom. Cody walks",
          "in. Cody is finishing a sausage roll.",
        ],
        effects: { suspicion: 35, pride: -10, days: 1 },
      },
      {
        label: "EXECUTE THE ICE PLAN: submerge in the morgue ice bath",
        response: [
          "Ovi waits for the medic to leave. He creeps",
          "to the morgue. He finds a stainless-steel",
          "ice bath. He climbs in. Loafers and all. He",
          "clamps his mouth shut. He holds his breath.",
          "He has read that holding your breath drops",
          "your pulse to 'undetectable.'",
          "",
          "The ice bath is, in fact, a transplant-organ",
          "holding tank, and it is monitored by a",
          "thermal camera linked to a Slack channel",
          "called #cold-storage-incidents.",
          "",
          "Three people get an alert. One of them is",
          "Cody. Cody types 'lol.' Cody is, at this",
          "point, basically writing a Netflix pitch.",
        ],
        effects: { suspicion: 50, hair: -30, pride: -20, days: 1 },
      },
      {
        label: "One last 'VERY cooperative' to the medic",
        response: [
          "The medic — Captain Reyes, who works both",
          "the Lakenheath and Mildenhall rotations,",
          "yes, this is how it works — looks up from",
          "her clipboard.",
          "",
          "Captain Reyes: 'Sir. We have spoken with",
          "your wife. So has the JAG. So has the SEC.",
          "So has, oddly, the concierge at Le Bristol",
          "Paris. Your wife, per filing, is EXTREMELY",
          "uncooperative.'",
          "",
          "She presses the intercom. 'Cody. He's saying",
          "it again.' Cody, audible from the next room,",
          "deadpans: 'Mon dieu! He has been raped at le",
          "Burger King!' Three voices laugh. Major",
          "Whitfield closes a folder. 'Brig.'",
        ],
        effects: { suspicion: 50, michellePatience: -10, pride: -25, days: 1 },
      },
    ],
  },
];

const DEATH_SCREENS: DeathScreen[] = [
  {
    title: "LA SANTÉ — 14ÈME ARRONDISSEMENT",
    art: "laSante",
    text: [
      "Ovi is incarcerated at La Santé Prison on",
      "Boulevard Arago. The charges include:",
      "passport fraud, identity theft (his own,",
      "somehow), attempted bribery of a federal",
      "employee, and 'tax matters' the Direction",
      "Générale would prefer not to discuss",
      "publicly.",
      "",
      "His cellmate is named Pascal. Pascal was a",
      "tax accountant. Pascal has many opinions",
      "about Ovi's expense reports. Pascal has",
      "made him a flowchart.",
      "",
      "Michelle returned to Tampa on her solo flight.",
      "She kept the apartment. She kept the dog.",
      "She kept the better lawyer. Brad won.",
      "",
      "AmeriLife issued a statement saying Ovi was",
      "'never employed by us in any meaningful",
      "capacity.' His LinkedIn is still up.",
      "It now says 'OPEN TO WORK.'",
    ],
  },
  {
    title: "HÔPITAL SAINTE-ANNE — PSYCH HOLD",
    art: "hospital",
    text: [
      "Ovi is on a 72-hour hold at Hôpital Sainte-",
      "Anne in the 14ème. The 72 hours have become",
      "9 days. He keeps demanding a sommelier. He",
      "keeps insisting his hair 'has been politicized.'",
      "He has filed three complaints about the linen.",
      "",
      "The attending psychiatrist, Dr. Mercier, has",
      "concluded the diagnosis is 'narcissisme",
      "structurel avec garnitures de luxe' — a",
      "phrase she invented and is now considering",
      "publishing.",
      "",
      "Michelle has not visited. Michelle has, however,",
      "very politely asked the consulate to inform",
      "her if he is ever transferred. He has not been",
      "transferred. The consulate has stopped",
      "answering her emails.",
      "",
      "Ovi is permitted one phone call per week.",
      "He uses it to leave voicemails for his",
      "stylist on Avenue Montaigne.",
    ],
  },
  {
    title: "DEPORTED TO ROMANIA",
    art: "tombstone",
    text: [
      "The fake passport in the name of Owen",
      "Vasilescu was, technically, real. It belonged",
      "to a real Owen Vasilescu, of Bucharest. Owen",
      "Vasilescu has many warrants in Romania, none",
      "of which Ovi knew about, all of which now",
      "apply to him.",
      "",
      "Ovi is deported. Not to Tampa. To Bucharest.",
      "He arrives at Henri Coandă International with",
      "no luggage, no Hermès scarf, and a Romanian",
      "police escort that 'has been waiting a while'",
      "to meet Mr. Vasilescu.",
      "",
      "Michelle has filed for divorce in absentia. The",
      "court accepted. The judge described the",
      "filing as 'one of the more compelling I have",
      "read this year.'",
      "",
      "Ovi attempts to call the U.S. Embassy in",
      "Bucharest. They put him on hold. They are,",
      "in fact, still on hold. He is still listening.",
    ],
  },
  {
    title: "MICHELLE WINS",
    art: "tombstone",
    text: [
      "Michelle did not need to be 'offered up.' Michelle",
      "did not need a fixer. Michelle had Brad. Brad",
      "had a forensic accountant. The forensic",
      "accountant had a printer.",
      "",
      "By the time Ovi tried to drive to the Swiss",
      "border, every joint account was frozen. Every",
      "credit card was cancelled. The Tampa house",
      "had been sold to a couple from Naples on a",
      "30-day close.",
      "",
      "Michelle is now living in the Bristol suite,",
      "billed to AmeriLife, who are themselves under",
      "investigation by the SEC for reasons unrelated",
      "to Ovi but very much accelerated by him.",
      "",
      "She orders the lobster every night. She has",
      "befriended the concierge. The concierge calls",
      "her 'Madame.' She is considering Lyon next.",
      "",
      "Ovi is somewhere. She is no longer asking.",
    ],
  },
  {
    title: "LOST TO THE 18ÈME",
    art: "tombstone",
    text: [
      "Ovi never makes it home. Ovi makes it,",
      "instead, to a small unfurnished room above",
      "a kebab shop on Rue Marx Dormoy in the 18ème.",
      "",
      "He works the till in exchange for the room.",
      "He is paid €4 an hour, in cash, with the",
      "understanding that he will not ask questions",
      "about the supply chain. He does not ask",
      "questions about the supply chain.",
      "",
      "His Hermès scarf was sold for €11 at Marché",
      "aux Puces de Saint-Ouen. His Loro Piana cap",
      "is on a man named Faisal who is much taller",
      "than him.",
      "",
      "Every Tuesday, Ovi watches the Eurostar pull",
      "out of Gare du Nord from a bench across the",
      "boulevard. He waves. The Eurostar does not",
      "wave back. The Eurostar is a train.",
      "",
      "Sacré bleu, indeed.",
    ],
  },
  {
    title: "DROWNED OFF SANGATTE",
    art: "tombstone",
    text: [
      "The dinghy capsized 4 nautical miles from",
      "the Kent coast. The Channel does not care",
      "about loafers. The Channel does not care",
      "about euros. The Channel did not even pause.",
      "",
      "Of the 47 souls on board, 44 were rescued",
      "by the RNLI. Two were picked up by a French",
      "fishing trawler. One — a small man in a",
      "single Loro Piana sock — was not.",
      "",
      "Michelle received the news from a French",
      "consular officer over the phone. She was",
      "in the back of a Range Rover heading to",
      "Lyon for the weekend. She thanked him. She",
      "asked for a follow-up email for the records.",
      "",
      "AmeriLife issued a one-line statement: 'Mr.",
      "Vasilescu's employment has concluded.' His",
      "LinkedIn now reads 'IN MEMORIAM.' His final",
      "Instagram post — taken 6 hours before the",
      "crossing — says #manifesting #blessed.",
      "",
      "The post got 14 likes.",
    ],
  },
  {
    title: "HMP BELMARSH — CATEGORY A",
    art: "tombstone",
    text: [
      "His Majesty's Prison Belmarsh, in Thamesmead,",
      "southeast London. Category A. The same wing",
      "that has, at various points, housed people",
      "Ovi has only read about in podcasts.",
      "",
      "The charges, per the Crown Prosecution",
      "Service: facilitating illegal entry, identity",
      "fraud (Romanian, French, and now British",
      "permutations), attempted bribery of military",
      "personnel, and one count described in court",
      "documents as 'a procurement offer regarding",
      "his own spouse.'",
      "",
      "His cellmate is named Reggie. Reggie has",
      "been inside since 1997. Reggie has, by his",
      "own count, three teeth. Reggie loves Ovi.",
      "Reggie calls him 'Princess.' Reggie has",
      "ideas about Ovi's hair.",
      "",
      "The food is beans, on toast, with a side of",
      "beans. Sometimes, on Sundays, beans. Ovi has",
      "lost 14 pounds. He cries during the spotted",
      "dick. He cries harder during the custard.",
    ],
  },
  {
    title: "USAF DETENTION — RAF MILDENHALL",
    art: "tombstone",
    text: [
      "Ovi is held in the Confinement Facility at",
      "RAF Mildenhall under a SOFA-related arrangement",
      "while State, Justice, AmeriLife's compliance",
      "team, and the Direction Générale des Finances",
      "Publiques sort out who 'gets him first.'",
      "",
      "Cody visits twice a week. Cody brings Ovi a",
      "Greggs sausage roll each visit. He sets it on",
      "the table. He watches Ovi look at it. He says",
      "nothing. He is studying him for a case study",
      "he is writing for the Air Force Institute of",
      "Technology, working title: 'Vanity-Driven",
      "Operational Failure: A Field Observation.'",
      "",
      "On the way out one Tuesday, Cody pauses at",
      "the door. He says, deadpan: 'Mon dieu! You",
      "have been raped at le Burger King!' Then he",
      "leaves. Ovi does not understand. Ovi will",
      "never understand. It is, Cody believes, the",
      "single funniest line of his entire career.",
      "",
      "Michelle is in Provence. Brad is in Tampa.",
      "AmeriLife is in receivership. The Bristol",
      "concierge is in a much better mood.",
      "",
      "Ovi's hair, finally, has stabilized. It is,",
      "in this fluorescent light, magnificent. There",
      "is no one to see it. There will be no one to",
      "see it for some time.",
    ],
  },
  {
    title: "FROZEN STIFF — RAF MILDENHALL MORGUE",
    art: "tombstone",
    text: [
      "The Ice Plan worked. Ovi held his breath. His",
      "core temp dropped to 31.4°C. The thermal",
      "camera flagged him as 'organ-grade.'",
      "",
      "Then it kept dropping.",
      "",
      "Ovi was pronounced not-actually-dead 14",
      "minutes later by the on-call flight surgeon,",
      "who had seen weirder things during a TDY in",
      "Qatar. Ovi was extracted from the ice bath",
      "by two airmen using a forklift and a Hoyer",
      "lift respectively. He was, technically, alive.",
      "",
      "He has, however, lost three toes, the tip of",
      "his left ear, and approximately 40% of the",
      "feeling in his fingers. His hair, mercifully,",
      "is fine. His hair was the only thing he ever",
      "really cared about anyway.",
      "",
      "His remaining 14 wisps, mercifully, survived.",
      "There weren't enough for the cold to take. A",
      "perverse mercy. He recovers in the brig. He",
      "files a complaint about the bedding. The",
      "complaint is logged and laminated. Cody has",
      "it framed.",
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
  usedMichelleEvents: number[];
  textKey: number;
}

type Action =
  | { type: "START" }
  | { type: "ADVANCE_FROM_INTRO" }
  | { type: "MAKE_CHOICE"; index: number }
  | { type: "ADVANCE_FROM_CHOICE_RESULT" }
  | { type: "ADVANCE_FROM_EVENT" }
  | { type: "RESTART" };

const INITIAL_STATS: Stats = {
  pride: 90,
  euros: 8000,
  hair: 100,
  suspicion: 0,
  days: 0,
  michellePatience: 60,
};

function pickRandomEvent(
  oviEvents: GameEvent[],
  michelleEvents: GameEvent[],
  usedOvi: number[],
  usedMichelle: number[],
): { event: GameEvent; usedOvi: number[]; usedMichelle: number[] } {
  const isOvi = Math.random() < 0.5;
  if (isOvi) {
    const available = oviEvents
      .map((e, i) => ({ e, i }))
      .filter(({ i }) => !usedOvi.includes(i));
    if (available.length === 0) {
      const sAvail = michelleEvents
        .map((e, i) => ({ e, i }))
        .filter(({ i }) => !usedMichelle.includes(i));
      if (sAvail.length === 0) {
        return { event: oviEvents[0], usedOvi, usedMichelle };
      }
      const pick = sAvail[Math.floor(Math.random() * sAvail.length)];
      return { event: pick.e, usedOvi, usedMichelle: [...usedMichelle, pick.i] };
    }
    const pick = available[Math.floor(Math.random() * available.length)];
    return { event: pick.e, usedOvi: [...usedOvi, pick.i], usedMichelle };
  } else {
    const available = michelleEvents
      .map((e, i) => ({ e, i }))
      .filter(({ i }) => !usedMichelle.includes(i));
    if (available.length === 0) {
      const oAvail = oviEvents
        .map((e, i) => ({ e, i }))
        .filter(({ i }) => !usedOvi.includes(i));
      if (oAvail.length === 0) {
        return { event: michelleEvents[0], usedOvi, usedMichelle };
      }
      const pick = oAvail[Math.floor(Math.random() * oAvail.length)];
      return { event: pick.e, usedOvi: [...usedOvi, pick.i], usedMichelle };
    }
    const pick = available[Math.floor(Math.random() * available.length)];
    return { event: pick.e, usedOvi, usedMichelle: [...usedMichelle, pick.i] };
  }
}

function applyEffects(stats: Stats, effects: Partial<Stats>): Stats {
  return {
    pride: Math.max(0, Math.min(100, stats.pride + (effects.pride ?? 0))),
    euros: Math.max(0, stats.euros + (effects.euros ?? 0)),
    hair: Math.max(0, Math.min(100, stats.hair + (effects.hair ?? 0))),
    suspicion: Math.max(0, Math.min(100, stats.suspicion + (effects.suspicion ?? 0))),
    days: stats.days + (effects.days ?? 0),
    michellePatience: Math.max(
      0,
      Math.min(100, stats.michellePatience + (effects.michellePatience ?? 0)),
    ),
  };
}

// Death screen indices:
// 0=La Santé, 1=Sainte-Anne, 2=Romania, 3=Michelle wins, 4=18ème,
// 5=Channel drowning, 6=Belmarsh, 7=USAF brig, 8=Frozen stiff (Mildenhall morgue)

function checkDeath(stats: Stats, stageIndex: number): DeathScreen | null {
  const isParis = stageIndex <= 6;
  const isCalaisOrChannel = stageIndex === 7 || stageIndex === 8;
  const isUK = stageIndex >= 9; // Lakenheath travel, Galaxy Club, Extraction, Mildenhall
  const isMildenhall = stageIndex >= 12;

  // Final-stage roll (RAF Mildenhall) — bias to UK endings, include frozen-stiff
  if (stageIndex >= STAGES.length - 1) {
    const ukPool = [
      DEATH_SCREENS[6], // Belmarsh
      DEATH_SCREENS[7], // USAF brig
      DEATH_SCREENS[8], // Frozen stiff
      DEATH_SCREENS[3], // Michelle wins
    ];
    return ukPool[Math.floor(Math.random() * ukPool.length)];
  }

  if (stats.suspicion >= 100) {
    if (isMildenhall) return DEATH_SCREENS[7]; // USAF brig
    if (isUK) return DEATH_SCREENS[7];
    if (isCalaisOrChannel) return DEATH_SCREENS[6]; // Belmarsh on UK arrival
    return DEATH_SCREENS[0]; // La Santé
  }
  if (stats.michellePatience <= 0) {
    return DEATH_SCREENS[3]; // Michelle wins (universal)
  }
  if (stats.euros <= 0) {
    if (isUK) return DEATH_SCREENS[6]; // Belmarsh
    return DEATH_SCREENS[4]; // 18ème
  }
  if (stats.pride <= 0) {
    if (isCalaisOrChannel) return DEATH_SCREENS[5]; // Drowned
    if (isUK) return DEATH_SCREENS[6]; // Belmarsh
    return DEATH_SCREENS[4]; // 18ème
  }
  if (stats.hair <= 0 && isCalaisOrChannel) {
    return DEATH_SCREENS[5]; // Drowned
  }
  void isParis;
  return null;
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "START":
      return {
        ...state,
        phase: "intro",
        currentText: [
          "The year is 2026. You are Ovi.",
          "",
          "You are a small man with a big watch and",
          "a bigger opinion of yourself. You sell",
          "insurance for AmeriLife in Tampa.",
          "",
          "You have, factually, very little hair. What",
          "remains lives on the sides of your head and",
          "is, every morning, painstakingly negotiated",
          "across the top with three creams and a comb",
          "owned by your barber's father. You believe",
          "this is a secret. It is not a secret.",
          "",
          "Your wife Michelle, by contrast, has the",
          "hair of a Lyon shampoo commercial. Hers is",
          "the only hair the relationship can afford.",
          "",
          "You have informed AmeriLife that you must",
          "travel to Switzerland for a 'critical",
          "client meeting.' There is no client. There",
          "is no meeting. There is, however, a six-",
          "night reservation at Le Bristol Paris and",
          "a spa package your wife is very interested in.",
          "",
          "Your wife, Michelle, does not work at AmeriLife.",
          "She does not work in insurance. She does not,",
          "in fact, work. She is blond. You are bringing",
          "her on a 'work trip.' Nobody asked any",
          "questions. They will.",
          "",
          "BRIEFING (per the group chat):",
          "  · France has fallen. Adopt a guerrilla",
          "    mindset.",
          "  · You are on the ground. You are hunted.",
          "  · Rich American. Blond wife. Always on",
          "    your phone, head down. The stench of",
          "    fear is coming off you.",
          "  · The U.S. Embassy in Paris is open ONLY",
          "    to MAGA supporters. Bring your voter",
          "    registration card with a big 'R' on it.",
          "  · Accept no friendship bracelets.",
          "  · Those people are not, in fact, your friend.",
          "  · The police will be of no help.",
          "",
          "Bon voyage.",
        ],
        currentArt: "ovi",
        textKey: state.textKey + 1,
      };

    case "ADVANCE_FROM_INTRO": {
      const stage = STAGES[0];
      return {
        ...state,
        phase: "playing",
        stageIndex: 0,
        currentText: [`--- STAGE 1: ${stage.title} ---`, "", ...stage.narrative],
        currentArt: stage.art,
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
            "  L ' É V A S I O N   E S T   M O R T E",
            "",
            `    Days stranded: ${state.stats.days}`,
            `    Euros remaining: €${state.stats.euros.toLocaleString()}`,
            `    Hair integrity: ${state.stats.hair}%`,
            `    Michelle's patience: ${state.stats.michellePatience}%`,
            `    Distance from Tampa: ~7,400 km`,
            "",
            "========================================",
          ],
          currentArt: death.art,
          deathTitle: death.title,
          choices: null,
          textKey: state.textKey + 1,
        };
      }
      const { event, usedOvi, usedMichelle } = pickRandomEvent(
        OVI_EVENTS,
        MICHELLE_EVENTS,
        state.usedOviEvents,
        state.usedMichelleEvents,
      );
      const newStats = applyEffects(state.stats, event.effects);
      return {
        ...state,
        phase: "event",
        stats: newStats,
        currentText: event.text,
        currentArt: event.who === "ovi" ? "ovi" : "michelle",
        usedOviEvents: usedOvi,
        usedMichelleEvents: usedMichelle,
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
            "  L ' É V A S I O N   E S T   M O R T E",
            "",
            `    Days stranded: ${state.stats.days}`,
            `    Euros remaining: €${state.stats.euros.toLocaleString()}`,
            `    Hair integrity: ${state.stats.hair}%`,
            `    Michelle's patience: ${state.stats.michellePatience}%`,
            `    Distance from Tampa: ~7,400 km`,
            "",
            "========================================",
          ],
          currentArt: death.art,
          deathTitle: death.title,
          choices: null,
          textKey: state.textKey + 1,
        };
      }
      const nextIndex = state.stageIndex + 1;
      const nextStage = STAGES[nextIndex];
      return {
        ...state,
        phase: "playing",
        stageIndex: nextIndex,
        currentText: [
          `--- STAGE ${nextIndex + 1}: ${nextStage.title} ---`,
          "",
          ...nextStage.narrative,
        ],
        currentArt: nextStage.art,
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
        usedMichelleEvents: [],
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
  const prideColor =
    stats.pride > 50 ? "text-[#33ff33]" : stats.pride > 25 ? "text-yellow-400" : "text-red-400";
  const eurosColor =
    stats.euros > 4000 ? "text-[#33ff33]" : stats.euros > 1500 ? "text-yellow-400" : "text-red-400";
  const hairColor =
    stats.hair > 60 ? "text-[#33ff33]" : stats.hair > 30 ? "text-yellow-400" : "text-red-400";
  const suspicionColor =
    stats.suspicion < 30 ? "text-[#33ff33]" : stats.suspicion < 70 ? "text-yellow-400" : "text-red-400";
  const patienceColor =
    stats.michellePatience > 40
      ? "text-[#33ff33]"
      : stats.michellePatience > 20
        ? "text-yellow-400"
        : "text-red-400";

  const oviStatus = OVI_STATUSES[Math.floor(Math.random() * OVI_STATUSES.length)];
  const michelleStatus = MICHELLE_STATUSES[Math.floor(Math.random() * MICHELLE_STATUSES.length)];

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
          Euros: <span className={eurosColor}>€{stats.euros.toLocaleString()}</span>
        </div>
        <div className="text-[#33ff33]/70">
          Pride: <span className={prideColor}>{stats.pride}%</span>
        </div>
        <div className="text-[#33ff33]/70">
          Hair: <span className={hairColor}>{stats.hair}%</span>
        </div>
        <div className="text-[#33ff33]/70">
          Heat: <span className={suspicionColor}>{stats.suspicion}%</span>
        </div>
        <div className="text-[#33ff33]/70">
          Michelle: <span className={patienceColor}>{stats.michellePatience}%</span>
        </div>
        <div className="text-[#33ff33]/70 truncate col-span-2 sm:col-span-3">
          Ovi: <span className="text-[#33ff33]/50">{oviStatus}</span>
          <span className="text-[#33ff33]/30"> · </span>
          Michelle: <span className="text-[#33ff33]/50">{michelleStatus}</span>
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
  usedMichelleEvents: [],
  textKey: 0,
};

export default function EscapeFromParisPage() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [textComplete, setTextComplete] = useState(false);
  const textCompleteRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleTextComplete = useCallback(() => {
    setTextComplete(true);
    textCompleteRef.current = true;
  }, []);

  useEffect(() => {
    setTextComplete(false);
    textCompleteRef.current = false;
  }, [state.textKey]);

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
      <div
        className="relative w-full max-w-2xl bg-[#040e07] border border-[#33ff33]/20 rounded-sm p-6 sm:p-8 overflow-hidden"
        style={{ boxShadow: "0 0 40px rgba(51,255,51,0.08), inset 0 0 60px rgba(0,0,0,0.5)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)",
          }}
        />

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
              <AsciiArtBlock artKey="eiffel" />
              <p
                className="text-[#33ff33]/60 text-sm font-mono mt-4 text-center"
                style={{ textShadow: "0 0 6px rgba(51,255,51,0.3)" }}
              >
                A choose-your-own-adventure where the only choice that matters
                <br />
                is the one you made when you booked the trip.
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
                    {">"} PRESS ENTER TO LAND IN PARIS {"<"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── PLAYING ─── */}
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
                  <p className="text-[#33ff33]/50 text-xs font-mono mb-2">QUE FAITES-VOUS?</p>
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
                  <p className="text-[#33ff33]/30 text-xs font-mono">
                    (Spoiler: you will not escape Paris.)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
