import { Item, Job, Mob, Dungeon, Quest, Mercenary, Guild } from './types';

export const MOCK_ITEMS: Item[] = [
  { id: 'w1', name: 'Rusty Pipe', type: 'weapon', stats: { power: 2 }, price: 50, description: 'Better than nothing.', visualColor: '#8B4513', visualIcon: '🏏' },
  { id: 'w2', name: 'Laser Baton', type: 'weapon', stats: { power: 5, critChance: 5 }, price: 200, description: 'Zzzzap!', visualColor: '#00FFFF', visualIcon: '🔦' },
  { id: 'w3', name: 'Plasma Blade', type: 'weapon', stats: { power: 12, critChance: 10, lifesteal: 5 }, price: 800, description: 'Cuts through steel like butter.', visualColor: '#FF00FF', visualIcon: '🗡️' },
  { id: 'a1', name: 'Leather Jacket', type: 'armor', stats: { dexterity: 2 }, price: 50, description: 'Looks cool, stops some punches.', visualColor: '#8B4513' },
  { id: 'a2', name: 'Kevlar Vest', type: 'armor', stats: { dexterity: 6, health_points: 20 }, price: 250, description: 'Standard issue protection.', visualColor: '#2F4F4F' },
  { id: 'a3', name: 'Exo-Suit', type: 'armor', stats: { dexterity: 15, power: 5, health_points: 50 }, price: 1000, description: 'Powered armor for heavy hits.', visualColor: '#C0C0C0' },
  { id: 'ac1', name: 'Lucky Coin', type: 'accessory', stats: { luck: 5, critChance: 5, dodgeChance: 5 }, price: 300, description: 'A two-headed coin.', visualColor: '#FFD700', visualIcon: '🪙' },
  { id: 'ac2', name: 'Vampire Ring', type: 'accessory', stats: { lifesteal: 10 }, price: 600, description: 'Drains life from foes.', visualColor: '#8B0000', visualIcon: '💍' },
  { id: 'c1', name: 'Health Potion', type: 'consumable', price: 25, description: 'Restores 50 HP.', effect: 'heal', effectValue: 50, visualIcon: '🧪' },
  { id: 'c2', name: 'Energy Drink', type: 'consumable', price: 40, description: 'Restores 20 Energy.', effect: 'energy', effectValue: 20, visualIcon: '🥤' },
];

export const MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Guard Duty', description: 'Watch the gates for a few hours.', duration: 5, goldReward: 20, expReward: 10 },
  { id: 'j2', title: 'Escort Caravan', description: 'Protect merchants on the road.', duration: 15, goldReward: 80, expReward: 40 },
  { id: 'j3', title: 'Bounty Hunt', description: 'Track down a local criminal.', duration: 30, goldReward: 200, expReward: 100 },
];

export const MOCK_MOBS: Mob[] = [
  { id: 'm1', name: 'Street Thug', level: 1, hp: 20, maxHp: 20, stats: { power: 2, dexterity: 1, agility: 2, charisma: 1, tactics: 1, appearance: 1, luck: 1, health_points: 20 }, goldReward: 10, expReward: 5 },
  { id: 'm2', name: 'Mutant Bruiser', level: 3, hp: 50, maxHp: 50, stats: { power: 6, dexterity: 4, agility: 1, charisma: 1, tactics: 2, appearance: 1, luck: 2, health_points: 50 }, goldReward: 25, expReward: 15 },
  { id: 'm3', name: 'Cyborg Ninja', level: 5, hp: 80, maxHp: 80, stats: { power: 8, dexterity: 5, agility: 10, charisma: 2, tactics: 5, appearance: 3, luck: 5, health_points: 80 }, goldReward: 60, expReward: 30 },
];

export const MOCK_DUNGEONS: Dungeon[] = [
  {
    id: 'd1',
    name: 'Abandoned Subway',
    energyCost: 10,
    stages: [
      { id: 'd1_s1', name: 'Rat Swarm', level: 2, hp: 30, maxHp: 30, stats: { power: 3, dexterity: 2, agility: 5, charisma: 1, tactics: 1, appearance: 1, luck: 1, health_points: 30 }, goldReward: 15, expReward: 10 },
      { id: 'd1_s2', name: 'Subway Boss', level: 4, hp: 70, maxHp: 70, stats: { power: 7, dexterity: 5, agility: 4, charisma: 3, tactics: 4, appearance: 2, luck: 3, health_points: 70 }, goldReward: 50, expReward: 35 },
    ]
  }
];

export const MOCK_QUESTS: Quest[] = [
  { id: 'q1', title: 'Clear the Streets', description: 'Defeat 3 mobs in Expeditions.', targetType: 'mob', targetCount: 3, goldReward: 100, expReward: 50 },
  { id: 'q2', title: 'Arena Champion', description: 'Win 2 PvP battles.', targetType: 'pvp', targetCount: 2, goldReward: 150, expReward: 75 },
];

export const MOCK_MERCENARIES: Mercenary[] = [
  { id: 'merc1', name: 'Ironclad', level: 1, price: 500, stats: { power: 10, dexterity: 15, agility: 2, charisma: 5, tactics: 5, appearance: 5, luck: 5, health_points: 100 } },
  { id: 'merc2', name: 'Shadow', level: 1, price: 600, stats: { power: 8, dexterity: 5, agility: 15, charisma: 5, tactics: 8, appearance: 8, luck: 10, health_points: 80 } },
];

export const MOCK_GUILDS: Guild[] = [
  { id: 'g1', name: 'The Avengers', level: 5, gold: 10000, members: ['Nova Strike', 'Ironclad'], buildings: { hall: 2, training: 1 } },
];

export const MOCK_MARKET: { id: string, item: Item, seller: string, price: number }[] = [
  { id: 'mk1', item: MOCK_ITEMS[2], seller: 'DarkKnight', price: 700 },
  { id: 'mk2', item: MOCK_ITEMS[6], seller: 'LuckyLuke', price: 400 },
];

export const MOCK_PVP_OPPONENTS: Mob[] = [
  { id: 'p1', name: 'DarkKnight', level: 2, hp: 40, maxHp: 40, stats: { power: 5, dexterity: 4, agility: 3, charisma: 3, tactics: 3, appearance: 3, luck: 3, health_points: 40 }, goldReward: 20, expReward: 10 },
  { id: 'p2', name: 'Speedster', level: 4, hp: 60, maxHp: 60, stats: { power: 4, dexterity: 3, agility: 12, charisma: 5, tactics: 5, appearance: 5, luck: 5, health_points: 60 }, goldReward: 40, expReward: 20 },
];
