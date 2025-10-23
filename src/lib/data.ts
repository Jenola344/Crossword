export type PuzzleWord = {
  word: string;
  clue: string;
  start: [number, number]; // [row, col]
  direction: 'across' | 'down';
};

export const dailyPuzzleData = {
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

export const generatedPuzzles = [];

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
