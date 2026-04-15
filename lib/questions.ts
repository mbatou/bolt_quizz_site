import { RiderType } from './results';

export interface QuizOption {
  text: string;
  category: RiderType;
  emoji: string;
}

export interface QuizQuestion {
  number: string;
  title: string;
  options: QuizOption[];
}

export const questions: QuizQuestion[] = [
  {
    number: 'Question 1 of 7',
    title: "When you\u2019re heading into town, what\u2019s your top priority?",
    options: [
      { text: "Chale, let\u2019s save these coins", category: 'basic', emoji: '\u{1FA99}' },
      { text: 'Legs must stretch, AC must chill', category: 'comfort', emoji: '\u{1F60E}' },
      { text: 'Customer is waiting oo, package must land', category: 'send', emoji: '\u{1F4E6}' },
    ],
  },
  {
    number: 'Question 2 of 7',
    title: 'Your weekend vibe looks like\u2026',
    options: [
      { text: 'Errands + trotro-level budgeting = me', category: 'basic', emoji: '\u{1F9EE}' },
      { text: 'Brunch, selfies, and good vibes only', category: 'comfort', emoji: '\u2728' },
      { text: 'Side hustle never sleeps, deliveries loading', category: 'send', emoji: '\u{1F4F2}' },
    ],
  },
  {
    number: 'Question 3 of 7',
    title: "When someone asks you for a favor, you\u2019re most likely to\u2026",
    options: [
      { text: "If it\u2019s small-small, I fit do", category: 'basic', emoji: '\u{1F4AA}\u{1F3FE}' },
      { text: "Don\u2019t worry, I\u2019ve got you covered", category: 'comfort', emoji: '\u{1F60C}' },
      { text: 'Send me location, I dey deliver fast', category: 'send', emoji: '\u{1F6B4}\u{1F3FE}' },
    ],
  },
  {
    number: 'Question 4 of 7',
    title: "What\u2019s your go-to hustle move?",
    options: [
      { text: "Stretch 10 cedis like it\u2019s 100", category: 'basic', emoji: '\u{1F9EE}' },
      { text: 'Upgrade the lifestyle, soft life only', category: 'comfort', emoji: '\u{1F334}' },
      { text: 'Drop-off, pick-up, repeat \u2014 my grind never stops', category: 'send', emoji: '\u{1F4E6}' },
    ],
  },
  {
    number: 'Question 5 of 7',
    title: 'Which traffic survival style is you?',
    options: [
      { text: "Beat rush hour or don\u2019t bother", category: 'basic', emoji: '\u{1F645}\u{1F3FE}' },
      { text: 'Chill in AC, scroll TikTok, no stress', category: 'comfort', emoji: '\u{1F4F1}' },
      { text: 'Zoom past everyone on a bike', category: 'send', emoji: '\u{1F6B4}\u{1F3FE}' },
    ],
  },
  {
    number: 'Question 6 of 7',
    title: 'Your friends describe you as\u2026',
    options: [
      { text: 'The practical one', category: 'basic', emoji: '\u{1F9D1}\u{1F3FE}\u{200D}\u{1F4BC}' },
      { text: 'The bougie one', category: 'comfort', emoji: '\u{1F60C}' },
      { text: 'The reliable hustler', category: 'send', emoji: '\u{1F4BC}' },
    ],
  },
  {
    number: 'Question 7 of 7',
    title: "If Bolt gave you free rides for a week, you\u2019d mostly use it for\u2026",
    options: [
      { text: 'Errands and market runs', category: 'basic', emoji: '\u{1F6CD}\uFE0F' },
      { text: 'Work trips and night outs', category: 'comfort', emoji: '\u{1F303}' },
      { text: 'Deliveries back-to-back', category: 'send', emoji: '\u{1F4E6}' },
    ],
  },
];
