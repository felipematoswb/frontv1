export type View = 'dashboard' | 'inventory' | 'tavern' | 'expeditions' | 'dungeons' | 'store' | 'blacksmith' | 'market' | 'arena' | 'quests' | 'guild' | 'training';

export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable';

export interface ItemStats {
  strength?: number;
  defense?: number;
  agility?: number;
  endurance?: number;
  critChance?: number;
  dodgeChance?: number;
  lifesteal?: number;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  stats?: ItemStats;
  price: number;
  description: string;
  effect?: 'heal' | 'energy';
  effectValue?: number;
  visualColor?: string;
  visualIcon?: string;
  upgradeLevel?: number;
}

export interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  accessory: Item | null;
}

export interface Stats {
  strength: number;
  defense: number;
  agility: number;
  endurance: number;
}

export interface Mercenary {
  id: string;
  name: string;
  stats: Stats;
  price: number;
  level: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
  goldReward: number;
  expReward: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetType: 'mob' | 'pvp' | 'dungeon';
  targetCount: number;
  goldReward: number;
  expReward: number;
}

export interface Mob {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  stats: Stats;
  goldReward: number;
  expReward: number;
}

export interface Dungeon {
  id: string;
  name: string;
  stages: Mob[];
  energyCost: number;
}

export interface Guild {
  id: string;
  name: string;
  level: number;
  gold: number;
  members: string[];
  buildings: {
    hall: number;
    training: number;
  };
}

export interface Player {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  stats: Stats;
  statPoints: number;
  equipment: Equipment;
  inventory: Item[];
  mercenaries: Mercenary[];
  squad: (Mercenary | null)[];
  guildId: string | null;
  activeJob: { job: Job; startTime: number } | null;
  activeQuest: { quest: Quest; progress: number } | null;
}
