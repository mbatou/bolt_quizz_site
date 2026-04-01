export type RiderType = "premium" | "bolt" | "xl" | "comfort";

export interface RiderResult {
  emoji: string;
  type: string;
  title: string;
  description: string;
  stat: string;
  destination: string;
  reward: string;
  code: string;
}

export const results: Record<RiderType, RiderResult> = {
  premium: {
    emoji: "\u{1F451}",
    type: "Premium rider",
    title: "The Baller",
    description:
      "Smooth rides only. AC on max, seats reclined, zero potholes. You move different.",
    stat: "Only 9% of Accra riders are Ballers \u2014 you\u2019re rare",
    destination: "Kempinski Hotel, Gold Coast City",
    reward: "20% off your next Premium ride",
    code: "BALLER20",
  },
  bolt: {
    emoji: "\u{1F9E0}",
    type: "Bolt rider",
    title: "The Wise One",
    description:
      "Every pesewa counts. Maximum efficiency, zero waste. Smart money moves only.",
    stat: "Wise Ones save avg GH\u20B5340/month on rides",
    destination: "Makola Market, Central Accra",
    reward: "15% off your next 3 rides",
    code: "WISE15",
  },
  xl: {
    emoji: "\u{1F389}",
    type: "XL rider",
    title: "The Crew Captain",
    description:
      "No squad, no ride. Life is better with your people. Every trip is a group trip.",
    stat: "Crew Captains book 3x more group rides",
    destination: "Labadi Beach, La",
    reward: "25% off your next XL ride",
    code: "CREW25",
  },
  comfort: {
    emoji: "\u26A1",
    type: "Comfort rider",
    title: "The Steady Mover",
    description:
      "No drama, no stress. Just get me there. Reliable, balanced, always on time.",
    stat: "63% of Accra rides with Steady Movers \u2014 you\u2019re the backbone",
    destination: "Accra Mall, Tetteh Quarshie",
    reward: "Free ride this weekend",
    code: "STEADY0",
  },
};
