import { z } from 'zod';

export type PuzzleWord = {
  word: string;
  clue: string;
  start: [number, number]; // [row, col]
  direction: 'across' | 'down';
};

export type DailyPuzzle = {
  id: string;
  name: string;
  reward: {
    tokens: number;
    hint: number;
  };
  size: 10 | 8;
  words: PuzzleWord[];
};

export const dailyPuzzleData: DailyPuzzle = {
  id: 'daily-2024-07-29',
  name: 'CRUESSION',
  reward: {
    tokens: 100,
    hint: 1
  },
  size: 10,
  words: [
    { word: 'CRYPTO', clue: 'Digital currency', start: [0, 0], direction: 'across' },
    { word: 'WEB', clue: 'The ___ of decentralized apps', start: [0, 2], direction: 'down' },
    { word: 'NFT', clue: 'A non-fungible token', start: [2, 4], direction: 'across' },
    { word: 'WALLET', clue: 'Where you store your coins', start: [8, 4], direction: 'across' },
    { word: 'ETHEREUM', clue: 'Popular blockchain for smart contracts', start: [4, 1], direction: 'down' },
    { word: 'BLOCKCHAIN', clue: 'A distributed ledger', start: [4, 1], direction: 'across'},
    { word: 'MINT', clue: 'To create a new NFT', start: [6, 7], direction: 'down'},
  ]
};

export const generatedPuzzles = [
  {
    id: "puzzle-1",
    name: "JS Jive",
    size: 8,
    words: [
      { word: "PROMISE", clue: "A placeholder for a future value", start: [0, 0], direction: "across" },
      { word: "REACT", clue: "A popular UI library", start: [0, 2], direction: "down" },
      { word: "NODE", clue: "A JavaScript runtime", start: [2, 4], direction: "across" },
      { word: "JSON", clue: "A lightweight data-interchange format", start: [4, 1], direction: "down" },
      { word: "ARRAY", clue: "A list-like object", start: [4, 1], direction: "across" },
      { word: "CLASS", clue: "A blueprint for creating objects", start: [6, 0], direction: "across" },
      { word: "ASYNC", clue: "A keyword for asynchronous functions", start: [0, 6], direction: "down" }
    ]
  },
  {
    id: "puzzle-2",
    name: "Python Puzzler",
    size: 8,
    words: [
      { word: "DJANGO", clue: "A high-level web framework", start: [0, 1], direction: "across" },
      { word: "LIST", clue: "A mutable ordered sequence", start: [0, 3], direction: "down" },
      { word: "TUPLE", clue: "An immutable ordered sequence", start: [2, 0], direction: "across" },
      { word: "PANDAS", clue: "A data analysis library", start: [2, 2], direction: "down" },
      { word: "FLASK", clue: "A micro web framework", start: [4, 0], direction: "across" },
      { word: "NUMPY", clue: "A library for numerical computing", start: [4, 3], direction: "down" },
      { word: "AWAIT", clue: "Pause execution until a coroutine completes", start: [6, 3], direction: "across" }
    ]
  },
  {
    id: "puzzle-3",
    name: "Web Weaver",
    size: 8,
    words: [
      { word: "HTML", clue: "Markup language for web pages", start: [0, 2], direction: "across" },
      { word: "CSS", clue: "Stylesheet language", start: [0, 4], direction: "down" },
      { word: "GRID", clue: "A layout model in CSS", start: [2, 1], direction: "across" },
      { word: "FETCH", clue: "API for network requests", start: [2, 3], direction: "down" },
      { word: "DOCKER", clue: "A platform for developing, shipping, and running applications in containers", start: [4, 0], direction: "across" },
      { word: "CLOUD", clue: "On-demand computing services over the internet", start: [4, 5], direction: "down" },
      { word: "API", clue: "A set of rules for building software", start: [6, 2], direction: "across" }
    ]
  }
];

export const competitions = [
  {
    id: 1,
    name: "Crossword Challenge",
    description: "A friendly competition for all skill levels. Quick puzzles, fast rewards.",
    entryFee: 10,
    prizePool: "1,000 $CROSS"
  },
  {
    id: 2,
    name: "Expert Showdown",
    description: "Test your skills against the best. Larger grid, tougher clues.",
    entryFee: 25,
    prizePool: "5,000 $CROSS + Rare NFTs"
  },
  {
    id: 3,
    name: "Master Championship",
    description: "The ultimate test for crossword masters. Highest stakes, biggest prizes.",
    entryFee: 50,
    prizePool: "10,000 $CROSS + Legendary NFT"
  }
];

export const userProfile = {
  stats: {
    puzzlesSolved: 42,
    longestStreak: 12,
    totalTokens: 5420,
  },
  friends: [
    { name: 'CryptoClue', avatar: 'profile-avatar-1', activity: 'Completed Daily in 2:15' },
    { name: 'WordWizard', avatar: 'profile-avatar-2', activity: 'Joined Expert Showdown' },
    { name: 'NFTokenjoyer', avatar: 'profile-avatar-3', activity: 'Revealed a Legendary NFT!' },
  ]
};

export const leaderboardData = {
    daily: [
        {rank: 1, name: "WordWizard", score: 150, avatar: 'profile-avatar-2'},
        {rank: 2, name: "You", score: 100, avatar: 'profile-avatar-1'},
        {rank: 3, name: "CryptoClue", score: 95, avatar: 'profile-avatar-3'},
    ],
    weekly: [
        {rank: 1, name: "NFTokenjoyer", score: 1250, avatar: 'profile-avatar-3'},
        {rank: 2, name: "You", score: 980, avatar: 'profile-avatar-1'},
        {rank: 3, name: "WordWizard", score: 950, avatar: 'profile-avatar-2'},
    ],
    allTime: [
        {rank: 1, name: "GenesisGamer", score: 25000, avatar: 'profile-avatar-2'},
        {rank: 2, name: "You", score: 5420, avatar: 'profile-avatar-1'},
        {rank: 3, name: "NFTokenjoyer", score: 4800, avatar: 'profile-avatar-3'},
    ]
}

export const dailyTasks = [
    {id: 1, task: "Connect your wallet", reward: 10, completed: true},
    {id: 2, task: "Solve the daily puzzle", reward: 20, completed: true},
    {id: 3, task: "Share on X", reward: 15, completed: false},
    {id: 4, task: "Join our Discord", reward: 15, completed: false},
]

export const storeData = {
  puzzlePacks: [
    { id: 'pack-crypto', name: 'Crypto Winter Pack', price: 50, icon: 'Bitcoin' },
    { id: 'pack-summer', name: 'Summer Fun Pack', price: 50, icon: 'Sun' },
  ],
  hintBoosts: [
    { id: 'hints-3', name: '3 Hints', price: 20 },
    { id: 'hints-5', name: '5 Hints', price: 30 },
    { id: 'hints-10', name: '10 Hints', price: 50 },
  ],
  customization: [
    { id: 'avatar-bull', name: 'Crypto Bull', type: 'Avatar', price: 75, icon: 'TrendingUp' },
    { id: 'avatar-bear', name: 'Bear Market Bear', type: 'Avatar', price: 75, icon: 'TrendingDown' },
    { id: 'theme-neon', name: 'Neon Theme', type: 'Grid Theme', price: 40, icon: 'Zap' },
    { id: 'theme-classic', name: 'Classic Theme', type: 'Grid Theme', price: 40, icon: 'Pen' },
  ]
}
