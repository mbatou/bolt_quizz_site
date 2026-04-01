export interface QuizOption {
  text: string;
  category: "premium" | "bolt" | "xl" | "comfort";
  icon: string;
}

export interface QuizQuestion {
  location: string;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export const questions: QuizQuestion[] = [
  {
    location: "Circle, Accra",
    title: "It\u2019s Saturday afternoon. Where to?",
    subtitle: "Your destination reveals your rider DNA.",
    options: [
      { text: "Kempinski. Brunch is calling", category: "premium", icon: "\u{1F942}" },
      { text: "Makola Market \u2014 deals dey wait", category: "bolt", icon: "\u{1F6CD}" },
      { text: "Labadi Beach. Full squad loading", category: "xl", icon: "\u{1F3D6}" },
      { text: "East Legon for a chill link-up", category: "comfort", icon: "\u2615" },
    ],
  },
  {
    location: "Lapaz traffic",
    title: "Classic go-slow. 30 min, nothing dey move.",
    subtitle: "How you dey handle am?",
    options: [
      { text: "\u201CDriver, kindly max the AC\u201D", category: "premium", icon: "\u2744" },
      { text: "Check MoMo. Plan tomorrow\u2019s hustle", category: "bolt", icon: "\u{1F4F1}" },
      { text: "Video call the crew \u2014 all late anyway", category: "xl", icon: "\u{1F4F9}" },
      { text: "Amaarae on shuffle. Window down. Vibes", category: "comfort", icon: "\u{1F3B5}" },
    ],
  },
  {
    location: "Kaneshie",
    title: "Driver knows a shortcut. Rough road, saves 10 min.",
    subtitle: "Your call, charle.",
    options: [
      { text: "\u201CNo rough roads. I just dressed up\u201D", category: "premium", icon: "\u{1F454}" },
      { text: "\u201CIf e save me money? Say less\u201D", category: "bolt", icon: "\u{1F4B0}" },
      { text: "\u201CCan we all fit through there?\u201D", category: "xl", icon: "\u{1F465}" },
      { text: "\u201CYou know Accra pass me, driver\u201D", category: "comfort", icon: "\u{1F91D}" },
    ],
  },
  {
    location: "Osu, Oxford Street",
    title: "Your fave chop bar. Waakye is RIGHT THERE.",
    subtitle: "Car still moving. What\u2019s the move?",
    options: [
      { text: "\u201CI go eat at the restaurant\u201D", category: "premium", icon: "\u{1F377}" },
      { text: "\u201CSTOP! Waakye + shito. GH\u20B515 max\u201D", category: "bolt", icon: "\u{1F35B}" },
      { text: "\u201CPull over, buying for everyone\u201D", category: "xl", icon: "\u{1F389}" },
      { text: "\u201CI dey cool. Keep going charle\u201D", category: "comfort", icon: "\u270C" },
    ],
  },
  {
    location: "Almost there",
    title: "You reach 20 min early. Now what?",
    subtitle: "Last move of the ride.",
    options: [
      { text: "Caf\u00E9 with WiFi and AC. Obviously", category: "premium", icon: "\u{1F4BB}" },
      { text: "Check app for a return promo", category: "bolt", icon: "\u{1F3AB}" },
      { text: "\u201CCharle I\u2019m here oo! Wh3r3 you dey?\u201D", category: "xl", icon: "\u{1F4E2}" },
      { text: "Stay in car. Finish the podcast", category: "comfort", icon: "\u{1F3A7}" },
    ],
  },
];
