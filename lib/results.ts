export type RiderType = 'basic' | 'comfort' | 'send' | 'tricycle';

export interface RiderResult {
  type: RiderType;
  move: string;
  category: string;
  tagline: string;
  description: string;
  asset: string;
  incentive: string;
  promoCode: string;
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
    incentive: "Here's a 25% off promo code to try Bolt Comfort \u2014 because you deserve to move comfortably too.",
    promoCode: 'BASIC25',
    restrictedToAccra: false,
  },
  comfort: {
    type: 'comfort',
    move: 'Smooth Operator',
    category: 'Bolt Comfort',
    tagline: 'More space, more ease.',
    description: "You're moving your way with Bolt Comfort \u2014 more space, more ease.",
    asset: '/assets/bolt/comfort.png',
    incentive: "Here's a 25% off promo code to try Bolt Basic on your next ride. Smart moves at everyday prices.",
    promoCode: 'COMFORT25',
    restrictedToAccra: false,
  },
  send: {
    type: 'send',
    move: 'Hustle Hero',
    category: 'Bolt Send',
    tagline: 'Easy, quick package delivery.',
    description: "You're moving your way with Bolt Send \u2014 quick, safe deliveries that keep life flowing.",
    asset: '/assets/bolt/send.png',
    incentive: "Here's a 25% off promo code to try out Bolt Basic \u2014 for when you need to move yourself, not just your packages.",
    promoCode: 'SEND25',
    restrictedToAccra: false,
  },
  tricycle: {
    type: 'tricycle',
    move: 'Local & lively',
    category: 'Bolt Tricycle',
    tagline: 'Easy trips, local style.',
    description: "You're moving your way with Bolt Tricycle \u2014 easy trips, local style.",
    asset: '/assets/bolt/tricycle.png',
    incentive: "Here's a 25% off promo code to try out Bolt Basic \u2014 for those times you need to move beyond the neighborhood.",
    promoCode: 'TRIKE25',
    restrictedToAccra: true,
  },
};

export const TRICYCLE_DISCLAIMER = 'Psst\u2026 Bolt Tricycle is currently available only in Ho, Cape Coast, Tamale and Kumasi.';
