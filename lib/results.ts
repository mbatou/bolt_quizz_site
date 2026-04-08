export type RiderType = 'basic' | 'comfort' | 'send' | 'tricycle';

export interface RiderResult {
  type: RiderType;
  move: string;
  category: string;
  tagline: string;
  description: string;
  asset: string;
  incentive: string;
  restrictedToAccra: boolean;
}

export const results: Record<RiderType, RiderResult> = {
  basic: {
    type: 'basic',
    move: 'Smart & practical',
    category: 'Bolt Basic',
    tagline: 'Everyday rides, everyday wins.',
    description: "You're moving your way with Bolt Basic \u2014 everyday rides, everyday wins.",
    asset: '/assets/bolt/basic.png',
    incentive: "Here's a promo code for your next Bolt Basic ride \u2014 everyday rides, everyday wins.",
    restrictedToAccra: false,
  },
  comfort: {
    type: 'comfort',
    move: 'Smooth Operator',
    category: 'Bolt Comfort',
    tagline: 'More space, more ease.',
    description: "You're moving your way with Bolt Comfort \u2014 more space, more ease.",
    asset: '/assets/bolt/comfort.png',
    incentive: "Here's a promo code for your next Bolt Comfort ride \u2014 more space, more ease.",
    restrictedToAccra: false,
  },
  send: {
    type: 'send',
    move: 'Hustle Hero',
    category: 'Bolt Send',
    tagline: 'Easy, quick package delivery.',
    description: "You're moving your way with Bolt Send \u2014 quick, safe deliveries that keep life flowing.",
    asset: '/assets/bolt/send.png',
    incentive: "Here's a promo code for your next Bolt Send delivery \u2014 quick, safe, and hassle-free.",
    restrictedToAccra: false,
  },
  tricycle: {
    type: 'tricycle',
    move: 'Local & lively',
    category: 'Bolt Tricycle',
    tagline: 'Easy trips, local style.',
    description: "You're moving your way with Bolt Tricycle \u2014 easy trips, local style.",
    asset: '/assets/bolt/tricycle.png',
    incentive: "Here's a promo code for your next Bolt Tricycle trip \u2014 easy trips, local style.",
    restrictedToAccra: true,
  },
};

export const TRICYCLE_DISCLAIMER = 'Psst\u2026 Bolt Tricycle is currently available only in Ho, Cape Coast, Tamale and Kumasi.';
