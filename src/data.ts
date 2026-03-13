import { Item, Job, Mob, Dungeon, Quest, Mercenary, Guild } from './types';

export const MOCK_ITEMS: Item[] = [
  { id: 'w1', name: 'Rusty Pipe', type: 'weapon', rarity: 'common', stats: { strength: 2 }, price: 50, description: 'Better than nothing.', visualColor: '#8B4513', visualIcon: '🏏' },
  { id: 'w2', name: 'Laser Baton', type: 'weapon', rarity: 'uncommon', stats: { strength: 5, critChance: 5 }, price: 200, description: 'Zzzzap!', visualColor: '#00FFFF', visualIcon: '🔦' },
  { id: 'w3', name: 'Plasma Blade', type: 'weapon', rarity: 'rare', stats: { strength: 12, critChance: 10, lifesteal: 5 }, price: 800, description: 'Cuts through steel like butter.', visualColor: '#FF00FF', visualIcon: '🗡️' },
  { id: 'h1', name: 'Bandana', type: 'head', rarity: 'common', stats: { agility: 2, defense: 1 }, price: 30, description: 'Keeps sweat out of your eyes.', visualColor: '#FF0000', visualIcon: '🧢' },
  { id: 'c1_armor', name: 'Leather Jacket', type: 'body', rarity: 'uncommon', stats: { defense: 4, agility: 1 }, price: 80, description: 'Looks cool, stops some punches.', visualColor: '#8B4513', visualIcon: '🧥' },
  { id: 'l1', name: 'Combat Boots', type: 'boots', rarity: 'common', stats: { defense: 2, agility: 2 }, price: 60, description: 'Good for kicking.', visualColor: '#000000', visualIcon: '🥾' },
  { id: 'ac1', name: 'Lucky Coin', type: 'badge', rarity: 'rare', stats: { critChance: 5, dodgeChance: 5 }, price: 300, description: 'A two-headed coin.', visualColor: '#FFD700', visualIcon: '🪙' },
  { id: 'ac2', name: 'Vampire Ring', type: 'ring', rarity: 'epic', stats: { lifesteal: 10 }, price: 600, description: 'Drains life from foes.', visualColor: '#8B0000', visualIcon: '💍' },
  { id: 'w4', name: 'God-Slayer Cannon', type: 'weapon', rarity: 'legendary', stats: { strength: 25, critChance: 20, agility: 5 }, price: 2500, description: 'A weapon from the old gods.', visualColor: '#FFD700', visualIcon: '☄️' },
  { id: 'c1', name: 'Health Potion', type: 'consumable', rarity: 'common', price: 25, description: 'Restores 50 HP.', effect: 'heal', effectValue: 50, visualIcon: '🧪' },
  { id: 'c2', name: 'Energy Drink', type: 'consumable', rarity: 'common', price: 40, description: 'Restores 20 Energy.', effect: 'energy', effectValue: 20, visualIcon: '🥤' },
];

export const MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Guard Duty', description: 'Watch the gates for a few hours.', duration: 5, goldReward: 20, expReward: 10 },
  { id: 'j2', title: 'Escort Caravan', description: 'Protect merchants on the road.', duration: 15, goldReward: 80, expReward: 40 },
  { id: 'j3', title: 'Bounty Hunt', description: 'Track down a local criminal.', duration: 30, goldReward: 200, expReward: 100 },
];

export const MOCK_MOBS: Mob[] = [
  { id: 'm1', name: 'Street Thug', level: 1, hp: 20, maxHp: 20, stats: { strength: 2, defense: 1, agility: 2, endurance: 1 }, goldReward: 10, expReward: 5 },
  { id: 'm2', name: 'Mutant Bruiser', level: 3, hp: 50, maxHp: 50, stats: { strength: 6, defense: 4, agility: 1, endurance: 5 }, goldReward: 25, expReward: 15 },
  { id: 'm3', name: 'Cyborg Ninja', level: 5, hp: 80, maxHp: 80, stats: { strength: 8, defense: 5, agility: 10, endurance: 8 }, goldReward: 60, expReward: 30 },
];

export const MOCK_DUNGEONS: Dungeon[] = [
  {
    id: 'd1',
    name: 'Abandoned Subway',
    energyCost: 10,
    stages: [
      { id: 'd1_s1', name: 'Rat Swarm', level: 2, hp: 30, maxHp: 30, stats: { strength: 3, defense: 2, agility: 5, endurance: 3 }, goldReward: 15, expReward: 10 },
      { id: 'd1_s2', name: 'Subway Boss', level: 4, hp: 70, maxHp: 70, stats: { strength: 7, defense: 5, agility: 4, endurance: 7 }, goldReward: 50, expReward: 35 },
    ]
  }
];

export const MOCK_QUESTS: Quest[] = [
  { id: 'q1', title: 'Clear the Streets', description: 'Defeat 3 mobs in Expeditions.', targetType: 'mob', targetCount: 3, goldReward: 100, expReward: 50 },
  { id: 'q2', title: 'Arena Champion', description: 'Win 2 PvP battles.', targetType: 'pvp', targetCount: 2, goldReward: 150, expReward: 75 },
];

export const MOCK_MERCENARIES: Mercenary[] = [
  { id: 'merc1', name: 'Ironclad', level: 1, price: 500, stats: { strength: 10, defense: 15, agility: 2, endurance: 10 } },
  { id: 'merc2', name: 'Shadow', level: 1, price: 600, stats: { strength: 8, defense: 5, agility: 15, endurance: 8 } },
];

export const MOCK_GUILDS: Guild[] = [
  { id: 'g1', name: 'The Avengers', level: 5, prestige: 1250, gold: 10000, members: [{ name: 'Nova Strike', role: 'leader' }, { name: 'Ironclad', role: 'member' }], buildings: { hall: 2, training: 1 } },
];

export const MOCK_MARKET: { id: string, item: Item, seller: string, price: number }[] = [
  { id: 'mk1', item: MOCK_ITEMS[2], seller: 'DarkKnight', price: 700 },
  { id: 'mk2', item: MOCK_ITEMS[6], seller: 'LuckyLuke', price: 400 },
];

export const MOCK_PVP_OPPONENTS: Mob[] = [
  { id: 'p1', name: 'DarkKnight', level: 2, hp: 40, maxHp: 40, stats: { strength: 5, defense: 4, agility: 3, endurance: 4 }, goldReward: 20, expReward: 10 },
  { id: 'p2', name: 'Speedster', level: 4, hp: 60, maxHp: 60, stats: { strength: 4, defense: 3, agility: 12, endurance: 6 }, goldReward: 40, expReward: 20 },
];
