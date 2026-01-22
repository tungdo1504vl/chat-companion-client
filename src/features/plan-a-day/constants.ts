const suggestedPlansA = [
  {
    id: '1',
    title: 'Slow Morning Coffee & Bookstore',
    tag: 'WARM & SINCERE',
    isBestMatch: true,
    features: [
      'Low-pressure, easy to talk',
      'Quiet space helps first conversations feel safe',
    ],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Cozy local café (coffee / tea)',
      },
      {
        step: 'ACTIVITY',
        title: 'Browse a small bookstore together',
      },
      {
        step: 'END',
        title: 'Sit & chat about favorite books or hobbies',
      },
    ],
  },
  {
    id: '2',
    title: 'Breakfast & Park Stroll',
    tag: 'SIMPLE & CALM',
    isBestMatch: false,
    features: [
      'Natural pace, no awkward structure',
      'Walking side by side reduces pressure',
    ],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Casual breakfast spot',
      },
      {
        step: 'ACTIVITY',
        title: 'Short walk in a nearby park',
      },
      {
        step: 'END',
        title: 'Sit on a bench, people-watch & talk',
      },
    ],
  },
  {
    id: '3',
    title: 'Morning Pastry & Quiet Talk',
    tag: 'LIGHT & SWEET',
    isBestMatch: false,
    features: [
      'Short and sweet for early-stage dating',
      'Easy to end on a good note',
    ],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Bakery café',
      },
      {
        step: 'ACTIVITY',
        title: 'Share pastries, light conversation',
      },
      {
        step: 'END',
        title: 'Walk her back or say goodbye naturally',
      },
    ],
  },
];

const suggestedPlansB = [
  {
    id: '1',
    title: 'Fine Dining & City Lights',
    tag: 'ELEGANT',
    isBestMatch: true,
    features: [
      'Romantic without being overwhelming',
      'Creates a “chosen” feeling, not casual',
    ],
    dateFlow: [
      { step: 'MEET', title: 'Upscale restaurant' },
      { step: 'ACTIVITY', title: 'Slow dinner with wine' },
      {
        step: 'END',
        title: 'Short walk with city night view',
      },
    ],
  },
  {
    id: '2',
    title: 'Art Gallery & Intimate Dinner',
    tag: 'THOUGHTFUL & DEEP',
    isBestMatch: false,
    features: [
      'Art sparks natural conversation',
      'Shows emotional effort, not just money',
    ],
    dateFlow: [
      { step: 'MEET', title: 'Private gallery / exhibition' },
      { step: 'ACTIVITY', title: 'Share thoughts & impressions' },
      {
        step: 'END',
        title: 'Quiet fine-dining restaurant',
      },
    ],
  },
  {
    id: '3',
    title: 'Rooftop Lounge & Soft Music',
    tag: 'SOFT ROMANCE',
    isBestMatch: false,
    features: [
      'Romantic atmosphere without heavy talk',
      'Music helps fill silences naturally',
    ],
    dateFlow: [
      { step: 'MEET', title: 'Rooftop bar' },
      { step: 'ACTIVITY', title: 'Drinks & soft live music' },
      {
        step: 'END',
        title: 'Slow conversation under city lights',
      },
    ],
  },
];

const suggestedPlansC = [
  {
    id: '1',
    title: 'Casual Dinner & Night Walk',
    tag: 'EASY & NATURAL',
    isBestMatch: true,
    features: [
      'Comfortable, not intimidating',
      'Encourages honest conversation',
    ],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Casual restaurant',
      },
      {
        step: 'ACTIVITY',
        title: 'Night walk nearby',
      },
      {
        step: 'END',
        title: 'Dessert stall or takeaway drink',
      },
    ],
  },
  {
    id: '2',
    title: 'Board Game Café',
    tag: 'FUN & CONNECTING',
    isBestMatch: false,
    features: ['Games reduce awkwardness', 'Learn about each other naturally'],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Board game café',
      },
      {
        step: 'ACTIVITY',
        title: 'Play light games (no competition)',
      },
      {
        step: 'END',
        title: 'Talk about favorite moments',
      },
    ],
  },
  {
    id: '3',
    title: 'Dessert & Late Coffee',
    tag: 'SWEET & LOW PRESSURE',
    isBestMatch: false,
    features: ['Short, gentle evening date', 'Easy exit if energy runs low'],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Dessert café',
      },
      {
        step: 'ACTIVITY',
        title: 'Share sweets & chat',
      },
      {
        step: 'END',
        title: 'Walk her to her ride / goodbye hug',
      },
    ],
  },
];
