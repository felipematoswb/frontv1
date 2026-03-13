import React, { useState, useEffect } from 'react';
import { Shield, Swords, Zap, Heart, Coins, Star, Crosshair, Activity, ShoppingBag, Map, User, Backpack, FlaskConical, Hammer, Users, Target, Skull, Tent, Scroll } from 'lucide-react';
import { View, Item, ItemStats, Equipment, Stats, Player, Job, Quest, Mob, Dungeon, Mercenary, Guild, Rarity } from './types';
import { MOCK_ITEMS, MOCK_JOBS, MOCK_MOBS, MOCK_DUNGEONS, MOCK_QUESTS, MOCK_MERCENARIES, MOCK_GUILDS, MOCK_MARKET, MOCK_PVP_OPPONENTS } from './data';

const INITIAL_PLAYER: Player = {
  name: 'Nova Strike',
  level: 1,
  exp: 0,
  maxExp: 100,
  hp: 100,
  maxHp: 100,
  energy: 50,
  maxEnergy: 50,
  gold: 1000, // Give some starting gold to test features
  stats: { strength: 5, defense: 5, agility: 5, endurance: 5 },
  statPoints: 5, // Some points to distribute
  equipment: { weapon: null, head: null, chest: null, legs: null, accessory: null },
  inventory: [MOCK_ITEMS.find(i => i.id === 'c1')!, MOCK_ITEMS.find(i => i.id === 'c1')!],
  mercenaries: [],
  squad: [null, null, null],
  guildId: null,
  activeJob: null,
  activeQuest: null,
};

const ProgressBar = ({ current, max, color, label }: { current: number, max: number, color: string, label: string }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div className="comic-progress-bg w-full h-5 md:h-8">
      <div className="comic-progress-fill" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
      <div className="comic-progress-text text-[9px] md:text-xs leading-none flex items-center justify-center">{label}: {Math.floor(current)} / {max}</div>
    </div>
  );
};

const HeroAvatar = ({ equipment }: { equipment: Equipment }) => {
  const skinColor = "#fca5a5";
  const headColor = equipment.head?.visualColor || skinColor;
  const chestColor = equipment.chest?.visualColor || "#3b82f6";
  const legsColor = equipment.legs?.visualColor || "#1e3a8a";
  const weaponColor = equipment.weapon?.visualColor || "#9ca3af";
  
  return (
    <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto bg-yellow-200 border-4 border-black rounded-full overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center">
      <div className="halftone-overlay"></div>
      <svg width="100%" height="100%" viewBox="0 0 200 200" className="relative z-10 p-4 md:p-0">
        {/* Legs / Pants */}
        <path d="M 60 80 L 40 180 L 160 180 L 140 80 Z" fill={legsColor} stroke="#000" strokeWidth="4" />
        {/* Chest / Shirt */}
        <rect x="70" y="90" width="60" height="70" rx="10" fill={chestColor} stroke="#000" strokeWidth="4" />
        {/* Belt */}
        <rect x="65" y="140" width="70" height="15" fill="#eab308" stroke="#000" strokeWidth="4" />
        {/* Head */}
        <circle cx="100" cy="60" r="35" fill={skinColor} stroke="#000" strokeWidth="4" />
        {/* Headgear (if equipped, draw over head) */}
        {equipment.head && <path d="M 60 60 Q 100 20 140 60 Q 100 40 60 60 Z" fill={headColor} stroke="#000" strokeWidth="4" />}
        {/* Face */}
        <path d="M 65 50 Q 100 70 135 50 L 135 40 Q 100 60 65 40 Z" fill="#000" />
        <circle cx="85" cy="55" r="5" fill="#fff" />
        <circle cx="115" cy="55" r="5" fill="#fff" />
        {/* Accessory */}
        {equipment.accessory && <circle cx="100" cy="105" r="12" fill={equipment.accessory.visualColor || "#fbbf24"} stroke="#000" strokeWidth="3" />}
        {/* Left Arm */}
        <path d="M 70 100 L 40 130" stroke={chestColor} strokeWidth="16" strokeLinecap="round" />
        <path d="M 70 100 L 40 130" stroke="#000" strokeWidth="20" strokeLinecap="round" className="opacity-30" />
        <circle cx="40" cy="130" r="10" fill={skinColor} stroke="#000" strokeWidth="4" />
        {/* Right Arm */}
        <path d="M 130 100 L 160 130" stroke={chestColor} strokeWidth="16" strokeLinecap="round" />
        <path d="M 130 100 L 160 130" stroke="#000" strokeWidth="20" strokeLinecap="round" className="opacity-30" />
        <circle cx="160" cy="130" r="10" fill={skinColor} stroke="#000" strokeWidth="4" />
        {/* Weapon */}
        {equipment.weapon && (
          <g transform="translate(160, 130) rotate(-45)">
            <rect x="-5" y="-40" width="10" height="80" fill={weaponColor} stroke="#000" strokeWidth="3" />
            <rect x="-15" y="-5" width="30" height="10" fill="#4b5563" stroke="#000" strokeWidth="3" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default function App() {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [dungeonState, setDungeonState] = useState<{ dungeon: Dungeon, currentStage: number } | null>(null);
  const [marketItems, setMarketItems] = useState(MOCK_MARKET);
  const [guilds, setGuilds] = useState(MOCK_GUILDS);
  const [hoveredItem, setHoveredItem] = useState<{ item: Item, x: number, y: number } | null>(null);
  const [upgradingItemId, setUpgradingItemId] = useState<string | null>(null);
  const [recentUpgrades, setRecentUpgrades] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<{id: number, text: string}[]>([]);

  const handleMouseMove = (e: React.MouseEvent, item: Item) => {
    setHoveredItem({ item, x: e.clientX, y: e.clientY });
  };
  const handleMouseLeave = () => setHoveredItem(null);

  // Energy Regen
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayer(p => {
        if (p.energy < p.maxEnergy) {
          return { ...p, energy: Math.min(p.maxEnergy, p.energy + 1) };
        }
        return p;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Job Timer
  const [jobTimeLeft, setJobTimeLeft] = useState(0);
  useEffect(() => {
    if (player.activeJob) {
      const elapsed = Math.floor((Date.now() - player.activeJob.startTime) / 1000);
      const remaining = Math.max(0, player.activeJob.job.duration - elapsed);
      setJobTimeLeft(remaining);

      if (remaining > 0) {
        const timer = setTimeout(() => setJobTimeLeft(remaining - 1), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [player.activeJob, jobTimeLeft]);

  const RARITY_CONFIG = {
    common: { color: '#94a3b8', label: 'Common', multiplier: 1 },
    uncommon: { color: '#22c55e', label: 'Uncommon', multiplier: 1.2 },
    rare: { color: '#3b82f6', label: 'Rare', multiplier: 1.5 },
    epic: { color: '#a855f7', label: 'Epic', multiplier: 2 },
    legendary: { color: '#f97316', label: 'Legendary', multiplier: 3 },
  };

  const getRarityMultiplier = (rarity?: Rarity) => {
    if (!rarity) return 1;
    return RARITY_CONFIG[rarity].multiplier;
  };

  const logMessage = (msg: string) => {
    const id = Date.now();
    setMessages(prev => [{id, text: msg}, ...prev].slice(0, 5));
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 4000);
  };

  const getTotalStats = () => {
    const base = { ...player.stats, critChance: 0, dodgeChance: 0, lifesteal: 0 };
    const eq = player.equipment;
    
    const applyItemStats = (item: Item | null) => {
      if (!item || !item.stats) return;
      const upgradeMultiplier = 1 + ((item.upgradeLevel || 0) * 0.1);
      const rarityMultiplier = getRarityMultiplier(item.rarity);
      const m = upgradeMultiplier * rarityMultiplier;

      if (item.stats.strength) base.strength += Math.floor(item.stats.strength * m);
      if (item.stats.defense) base.defense += Math.floor(item.stats.defense * m);
      if (item.stats.agility) base.agility += Math.floor(item.stats.agility * m);
      if (item.stats.endurance) base.endurance += Math.floor(item.stats.endurance * m);
      if (item.stats.critChance) base.critChance += Math.floor(item.stats.critChance * rarityMultiplier);
      if (item.stats.dodgeChance) base.dodgeChance += Math.floor(item.stats.dodgeChance * rarityMultiplier);
      if (item.stats.lifesteal) base.lifesteal += Math.floor(item.stats.lifesteal * rarityMultiplier);
    };

    applyItemStats(eq.weapon);
    applyItemStats(eq.head);
    applyItemStats(eq.chest);
    applyItemStats(eq.legs);
    applyItemStats(eq.accessory);

    return base;
  };

  const gainExp = (amount: number) => {
    setPlayer(p => {
      let newExp = p.exp + amount;
      let newLevel = p.level;
      let newMaxExp = p.maxExp;
      let newMaxHp = p.maxHp;
      let newStatPoints = p.statPoints;

      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel++;
        newMaxExp = Math.floor(newMaxExp * 1.5);
        newStatPoints += 5;
        newMaxHp += 10;
        logMessage(`LEVEL UP! You are now level ${newLevel}!`);
      }

      return { ...p, level: newLevel, exp: newExp, maxExp: newMaxExp, statPoints: newStatPoints, maxHp: newMaxHp, hp: newMaxHp };
    });
  };

  const updateQuestProgress = (type: 'mob' | 'pvp' | 'dungeon') => {
    if (player.activeQuest && player.activeQuest.quest.targetType === type) {
      setPlayer(p => {
        if (!p.activeQuest) return p;
        const newProgress = p.activeQuest.progress + 1;
        if (newProgress >= p.activeQuest.quest.targetCount) {
          logMessage(`QUEST READY TO CLAIM: ${p.activeQuest.quest.title}`);
        }
        return { ...p, activeQuest: { ...p.activeQuest, progress: newProgress } };
      });
    }
  };

  // --- Dashboard Actions ---
  const distributePoint = (stat: keyof Stats) => {
    if (player.statPoints > 0) {
      setPlayer(p => ({
        ...p,
        statPoints: p.statPoints - 1,
        stats: { ...p.stats, [stat]: p.stats[stat] + 1 }
      }));
    }
  };

  const trainStatGold = (stat: keyof Stats) => {
    const cost = player.stats[stat] * 10;
    if (player.gold >= cost) {
      setPlayer(p => ({
        ...p,
        gold: p.gold - cost,
        stats: { ...p.stats, [stat]: p.stats[stat] + 1 }
      }));
      logMessage(`Trained ${stat} for ${cost} gold.`);
    }
  };

  // --- Tavern Jobs ---
  const startJob = (job: Job) => {
    if (!player.activeJob) {
      setPlayer(p => ({ ...p, activeJob: { job, startTime: Date.now() } }));
      logMessage(`Started job: ${job.title}`);
    }
  };

  const claimJob = () => {
    if (player.activeJob && jobTimeLeft === 0) {
      const { job } = player.activeJob;
      setPlayer(p => ({ ...p, gold: p.gold + job.goldReward, activeJob: null }));
      gainExp(job.expReward);
      logMessage(`Claimed job reward: ${job.goldReward} Gold, ${job.expReward} EXP`);
    }
  };

  const cancelJob = () => {
    if (player.activeJob) {
      setPlayer(p => ({ ...p, activeJob: null }));
      logMessage(`Cancelled job.`);
    }
  };

  // --- Combat Logic ---
  const executeCombat = (enemy: Mob, isPvp: boolean = false) => {
    if (player.hp <= 0) {
      logMessage("You are too weak to fight! Wait to heal or use a potion.");
      return false; // Player lost/can't fight
    }

    let pHealth = player.hp;
    let eHealth = enemy.hp;
    const log: string[] = [];
    const totalStats = getTotalStats();

    log.push(`FIGHT STARTED: ${player.name} vs ${enemy.name}`);

    while (pHealth > 0 && eHealth > 0) {
      // Player attacks
      const isCrit = Math.random() * 100 < totalStats.critChance;
      let pDmg = Math.max(1, totalStats.strength - enemy.stats.defense + Math.floor(Math.random() * 3));
      
      if (isCrit) {
        pDmg = Math.floor(pDmg * 1.5);
        log.push(`CRITICAL HIT! You smash ${enemy.name} for ${pDmg} damage!`);
      } else {
        log.push(`BAM! You hit ${enemy.name} for ${pDmg} damage!`);
      }
      eHealth -= pDmg;

      if (totalStats.lifesteal > 0 && eHealth > 0) {
        const heal = Math.floor(pDmg * (totalStats.lifesteal / 100));
        if (heal > 0) {
          pHealth = Math.min(player.maxHp, pHealth + heal);
          log.push(`VAMPIRIC DRAIN! You healed for ${heal} HP.`);
        }
      }

      if (eHealth <= 0) break;

      // Enemy attacks
      const isDodge = Math.random() * 100 < totalStats.dodgeChance;
      if (isDodge) {
        log.push(`SWOOSH! You dodged ${enemy.name}'s attack!`);
      } else {
        const eDmg = Math.max(1, enemy.stats.strength - totalStats.defense + Math.floor(Math.random() * 3));
        pHealth -= eDmg;
        log.push(`POW! ${enemy.name} hits you for ${eDmg} damage!`);
      }
    }

    if (pHealth > 0) {
      log.push(`VICTORY! You defeated ${enemy.name}!`);
      log.push(`+${enemy.goldReward} Gold, +${enemy.expReward} EXP`);
      setPlayer(p => ({ ...p, hp: pHealth, gold: p.gold + enemy.goldReward }));
      gainExp(enemy.expReward);
      log.forEach(msg => logMessage(msg));
      updateQuestProgress(isPvp ? 'pvp' : 'mob');
      return true; // Player won
    } else {
      log.forEach(msg => logMessage(msg));
      setPlayer(p => ({ ...p, hp: 0 }));
      return false; // Player lost
    }
  };

  const attackMob = (mob: Mob) => {
    if (player.energy >= 5) {
      setPlayer(p => ({ ...p, energy: p.energy - 5 }));
      executeCombat(mob);
    } else {
      logMessage("Not enough energy!");
    }
  };

  const attackPvp = (opponent: Mob) => {
    if (player.energy >= 10) {
      setPlayer(p => ({ ...p, energy: p.energy - 10 }));
      executeCombat(opponent, true);
    } else {
      logMessage("Not enough energy for PvP!");
    }
  };

  // --- Dungeons ---
  const enterDungeon = (dungeon: Dungeon) => {
    if (player.energy >= dungeon.energyCost) {
      setPlayer(p => ({ ...p, energy: p.energy - dungeon.energyCost }));
      setDungeonState({ dungeon, currentStage: 0 });
      logMessage(`Entered Dungeon: ${dungeon.name}`);
    } else {
      logMessage("Not enough energy to enter dungeon!");
    }
  };

  const attackDungeonStage = () => {
    if (!dungeonState) return;
    const mob = dungeonState.dungeon.stages[dungeonState.currentStage];
    const won = executeCombat(mob);
    
    if (won) {
      if (dungeonState.currentStage + 1 < dungeonState.dungeon.stages.length) {
        setDungeonState({ ...dungeonState, currentStage: dungeonState.currentStage + 1 });
        logMessage(`Advanced to next stage in ${dungeonState.dungeon.name}!`);
      } else {
        logMessage(`DUNGEON CLEARED: ${dungeonState.dungeon.name}!`);
        setDungeonState(null);
        updateQuestProgress('dungeon');
      }
    } else {
      setDungeonState(null); // Kicked out on loss
    }
  };

  // --- Inventory & Store ---
  const buyItem = (item: Item) => {
    if (player.gold >= item.price) {
      setPlayer(p => ({
        ...p,
        gold: p.gold - item.price,
        inventory: [...p.inventory, { ...item, id: item.id + '-' + Date.now(), upgradeLevel: 0 }]
      }));
      logMessage(`BOUGHT ${item.name} for ${item.price} Gold!`);
    }
  };

  const equipItem = (item: Item) => {
    if (item.type === 'consumable') return;
    setPlayer(p => {
      const currentEquipped = p.equipment[item.type as keyof Equipment];
      const newInventory = p.inventory.filter(i => i.id !== item.id);
      if (currentEquipped) newInventory.push(currentEquipped);
      return { ...p, inventory: newInventory, equipment: { ...p.equipment, [item.type]: item } };
    });
  };

  const unequipItem = (type: keyof Equipment) => {
    setPlayer(p => {
      const item = p.equipment[type];
      if (!item) return p;
      return { ...p, equipment: { ...p.equipment, [type]: null }, inventory: [...p.inventory, item] };
    });
  };

  const useConsumable = (item: Item) => {
    if (item.type !== 'consumable') return;
    setPlayer(p => {
      let newHp = p.hp;
      let newEnergy = p.energy;
      if (item.effect === 'heal' && item.effectValue) newHp = Math.min(p.maxHp, p.hp + item.effectValue);
      else if (item.effect === 'energy' && item.effectValue) newEnergy = Math.min(p.maxEnergy, p.energy + item.effectValue);
      return { ...p, hp: newHp, energy: newEnergy, inventory: p.inventory.filter(i => i.id !== item.id) };
    });
  };

  // --- Blacksmith ---
  const upgradeItem = (item: Item) => {
    const cost = 100 * ((item.upgradeLevel || 0) + 1);
    if (player.gold >= cost) {
      setPlayer(p => {
        const newInventory = p.inventory.map(i => i.id === item.id ? { ...i, upgradeLevel: (i.upgradeLevel || 0) + 1 } : i);
        return { ...p, gold: p.gold - cost, inventory: newInventory };
      });
      logMessage(`Upgraded ${item.name} to +${(item.upgradeLevel || 0) + 1} for ${cost} gold!`);
      
      // Trigger visual effects
      setUpgradingItemId(item.id);
      setRecentUpgrades(prev => new Set(prev).add(item.id));
      
      setTimeout(() => setUpgradingItemId(null), 1000);
      setTimeout(() => {
        setRecentUpgrades(prev => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }, 5000);
    } else {
      logMessage(`Not enough gold to upgrade. Need ${cost}.`);
    }
  };

  // --- Quests ---
  const acceptQuest = (quest: Quest) => {
    if (!player.activeQuest) {
      setPlayer(p => ({ ...p, activeQuest: { quest, progress: 0 } }));
      logMessage(`Accepted Quest: ${quest.title}`);
    }
  };

  const claimQuest = () => {
    if (player.activeQuest && player.activeQuest.progress >= player.activeQuest.quest.targetCount) {
      const { quest } = player.activeQuest;
      setPlayer(p => ({ ...p, gold: p.gold + quest.goldReward, activeQuest: null }));
      gainExp(quest.expReward);
      logMessage(`Claimed Quest: ${quest.title}. +${quest.goldReward} Gold, +${quest.expReward} EXP`);
    }
  };

  // --- Market ---
  const buyMarketItem = (listingId: string) => {
    const listing = marketItems.find(m => m.id === listingId);
    if (listing && player.gold >= listing.price) {
      setPlayer(p => ({ ...p, gold: p.gold - listing.price, inventory: [...p.inventory, { ...listing.item, id: listing.item.id + '-' + Date.now() }] }));
      setMarketItems(prev => prev.filter(m => m.id !== listingId));
      logMessage(`Bought ${listing.item.name} from Market for ${listing.price} gold.`);
    }
  };

  const sellItem = (item: Item, price: number) => {
    setPlayer(p => ({ ...p, inventory: p.inventory.filter(i => i.id !== item.id) }));
    setMarketItems(prev => [...prev, { id: 'mk-' + Date.now(), item, seller: player.name, price }]);
    logMessage(`Listed ${item.name} on Market for ${price} gold.`);
  };

  // --- Guilds ---
  const createGuild = (name: string) => {
    if (player.gold >= 5000 && !player.guildId) {
      const newGuild: Guild = { id: 'g-' + Date.now(), name, level: 1, gold: 0, members: [player.name], buildings: { hall: 1, training: 1 } };
      setGuilds(prev => [...prev, newGuild]);
      setPlayer(p => ({ ...p, gold: p.gold - 5000, guildId: newGuild.id }));
      logMessage(`Created Guild: ${name}`);
    }
  };

  const donateGuild = (amount: number) => {
    if (player.guildId && player.gold >= amount) {
      setGuilds(prev => prev.map(g => g.id === player.guildId ? { ...g, gold: g.gold + amount } : g));
      setPlayer(p => ({ ...p, gold: p.gold - amount }));
      logMessage(`Donated ${amount} gold to Guild.`);
    }
  };

  // --- Render Views ---

  const renderStatsList = (stats: ItemStats, upgradeLevel: number = 0, rarity?: Rarity) => {
    const parts = [];
    const upgradeMultiplier = 1 + (upgradeLevel * 0.1);
    const rarityMultiplier = getRarityMultiplier(rarity);
    const m = upgradeMultiplier * rarityMultiplier;

    if (stats.strength) parts.push(`+${Math.floor(stats.strength * m)} STR`);
    if (stats.defense) parts.push(`+${Math.floor(stats.defense * m)} DEF`);
    if (stats.agility) parts.push(`+${Math.floor(stats.agility * m)} AGI`);
    if (stats.endurance) parts.push(`+${Math.floor(stats.endurance * m)} END`);
    if (stats.critChance) parts.push(`+${Math.floor(stats.critChance * rarityMultiplier)}% CRIT`);
    if (stats.dodgeChance) parts.push(`+${Math.floor(stats.dodgeChance * rarityMultiplier)}% DODGE`);
    if (stats.lifesteal) parts.push(`+${Math.floor(stats.lifesteal * rarityMultiplier)}% LIFESTEAL`);
    return parts.join(', ');
  };

  const renderDashboard = () => {
    const totalStats = getTotalStats();
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="comic-panel p-4 md:p-6 flex flex-col items-center justify-center bg-blue-50">
          <div className="halftone-overlay"></div>
          <h2 className="comic-title text-2xl md:text-3xl mb-4 md:mb-6 text-blue-600 relative z-10">Appearance</h2>
          <HeroAvatar equipment={player.equipment} />
        </div>

        <div className="comic-panel p-4 md:p-6">
          <div className="halftone-overlay"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h2 className="comic-title text-2xl md:text-3xl text-red-600">Hero Stats</h2>
            {player.statPoints > 0 && <span className="bg-yellow-400 text-black font-bangers px-2 py-1 animate-pulse text-sm">Points: {player.statPoints}</span>}
          </div>
          <div className="space-y-3 md:space-y-4 relative z-10">
            {(['strength', 'defense', 'agility', 'endurance'] as const).map(stat => (
              <div key={stat} className="flex justify-between items-center border-b-2 border-black pb-2">
                <span className="font-bangers text-lg md:text-xl flex items-center gap-2 capitalize">{stat}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bangers text-lg md:text-2xl">{totalStats[stat]} <span className="text-[9px] md:text-sm text-green-600">({player.stats[stat]} base)</span></span>
                  {player.statPoints > 0 && (
                    <button onClick={() => distributePoint(stat)} className="bg-green-500 text-white font-bold w-7 h-7 md:w-6 md:h-6 rounded flex items-center justify-center hover:bg-green-600 shadow-[2px_2px_0px_rgba(0,0,0,1)]">+</button>
                  )}
                  <button onClick={() => trainStatGold(stat)} className="bg-yellow-400 text-black font-bold text-[10px] md:text-xs px-2 py-1.5 md:py-1 rounded hover:bg-yellow-500 flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]" title={`Train for ${player.stats[stat] * 10} gold`}>
                    <Coins size={12}/> {player.stats[stat] * 10}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="action-bubble mb-4 bg-purple-400 text-white">BACKPACK & EQUIPMENT</div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="comic-panel p-4 md:p-6 lg:col-span-1 bg-gray-50">
          <h2 className="comic-title text-xl md:text-2xl mb-4 text-purple-600">Equipped</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
            {(['weapon', 'head', 'chest', 'legs', 'accessory'] as const).map(slot => {
              const item = player.equipment[slot];
              return (
                <div key={slot} className="border-4 border-black p-3 bg-white relative cursor-pointer"
                  onMouseMove={(e) => item && handleMouseMove(e, item)}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => item && handleMouseMove(e, item)}
                >
                  <div className="absolute -top-3 -left-3 bg-yellow-400 border-2 border-black px-2 font-bangers text-xs md:text-sm transform -rotate-6 uppercase z-10">{slot}</div>
                  {item ? (
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bangers text-lg md:text-xl truncate">{item.visualIcon} {item.name} {item.upgradeLevel ? `+${item.upgradeLevel}` : ''}</h3>
                        <p className="font-bold text-[10px] md:text-xs text-blue-600 truncate">{item.stats ? renderStatsList(item.stats, item.upgradeLevel, item.rarity) : ''}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); unequipItem(slot); }} className="bg-red-500 text-white font-bangers px-2 py-1 border-2 border-black hover:bg-red-600 text-xs md:text-sm ml-2">UNEQUIP</button>
                    </div>
                  ) : (
                    <p className="font-bangers text-base md:text-lg text-gray-400 mt-2">Empty Slot</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          {player.inventory.length === 0 ? (
            <div className="comic-panel p-8 text-center bg-gray-100">
              <h2 className="font-bangers text-2xl md:text-3xl text-gray-400">Your backpack is empty!</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {player.inventory.map(item => {
                const rarityColor = item.rarity ? RARITY_CONFIG[item.rarity].color : '#94a3b8';
                return (
                  <div key={item.id} 
                    className={`comic-panel p-4 flex flex-col justify-between transition-all duration-500 cursor-pointer ${recentUpgrades.has(item.id) ? 'ring-4 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)] scale-105' : ''}`}
                    style={{ borderLeftWidth: '8px', borderLeftColor: rarityColor }}
                    onMouseMove={(e) => handleMouseMove(e, item)}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => handleMouseMove(e, item)}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bangers text-lg md:text-xl">{item.visualIcon} {item.name} {item.upgradeLevel ? `+${item.upgradeLevel}` : ''}</h3>
                        <span className="bg-black text-white font-bangers px-2 py-0.5 text-[10px] uppercase">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bangers uppercase px-1 rounded text-white" style={{ backgroundColor: rarityColor }}>{item.rarity || 'Common'}</span>
                      </div>
                      <p className="font-bold text-[10px] md:text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      {item.stats && <p className="font-bangers text-xs text-blue-600 mb-2">{renderStatsList(item.stats, item.upgradeLevel, item.rarity)}</p>}
                      {item.effect && <p className="font-bangers text-xs text-green-600 mb-2">Effect: {item.effect} +{item.effectValue}</p>}
                    </div>
                    
                    {item.type === 'consumable' ? (
                      <button onClick={(e) => { e.stopPropagation(); useConsumable(item); }} className="comic-button comic-button-green w-full text-xs py-1 mt-2">USE</button>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); equipItem(item); }} className="comic-button comic-button-blue w-full text-xs py-1 mt-2">EQUIP</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTavern = () => (
    <div className="space-y-6">
      <div className="action-bubble mb-4 bg-orange-400 text-black">TAVERN JOBS</div>
      
      {player.activeJob ? (
        <div className="comic-panel p-6 md:p-8 text-center bg-yellow-100">
          <div className="halftone-overlay"></div>
          <h2 className="comic-title text-3xl md:text-4xl mb-4 relative z-10 animate-pulse">WORKING...</h2>
          <p className="font-bangers text-xl md:text-2xl relative z-10">{player.activeJob.job.title}</p>
          <div className="text-4xl md:text-6xl font-bangers mt-4 relative z-10">{jobTimeLeft > 0 ? `${jobTimeLeft}s` : 'DONE!'}</div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6 relative z-10">
            {jobTimeLeft === 0 ? (
              <button onClick={claimJob} className="comic-button comic-button-green w-full sm:w-auto">CLAIM REWARD</button>
            ) : (
              <button onClick={cancelJob} className="comic-button w-full sm:w-auto">CANCEL</button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {MOCK_JOBS.map(job => (
            <div key={job.id} className="comic-panel comic-panel-interactive p-4 md:p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bangers text-xl md:text-2xl mb-2">{job.title}</h3>
                <p className="font-bold text-xs md:text-sm mb-4 line-clamp-3">{job.description}</p>
                <div className="flex gap-4 mb-4 text-xs md:text-sm font-bangers">
                  <span className="flex items-center gap-1 text-yellow-600"><Coins size={14}/> {job.goldReward}</span>
                  <span className="flex items-center gap-1 text-purple-600"><Star size={14}/> {job.expReward}</span>
                </div>
              </div>
              <button onClick={() => startJob(job)} className="comic-button w-full text-sm">START ({job.duration}s)</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderExpeditions = () => (
    <div className="space-y-6">
      <div className="action-bubble mb-4 bg-red-500 text-white">EXPEDITIONS</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {MOCK_MOBS.map(mob => (
          <div key={mob.id} className="comic-panel comic-panel-interactive p-4 md:p-6 flex flex-col justify-between bg-red-50">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bangers text-xl md:text-2xl text-red-700">{mob.name}</h3>
                <span className="bg-black text-white font-bangers px-2 py-1 text-xs md:text-sm transform rotate-3">LVL {mob.level}</span>
              </div>
              <div className="mb-4"><ProgressBar current={mob.hp} max={mob.maxHp} color="#ff4d4d" label="HP" /></div>
            </div>
            <button onClick={() => attackMob(mob)} className="comic-button w-full flex items-center justify-center gap-2 text-sm md:text-base">
              <Zap size={16}/> 5 - ATTACK!
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDungeons = () => (
    <div className="space-y-6">
      <div className="action-bubble mb-4 bg-gray-800 text-white">DUNGEONS</div>
      
      {dungeonState ? (
        <div className="comic-panel p-4 md:p-8 text-center bg-gray-200">
          <h2 className="comic-title text-xl md:text-4xl mb-4">{dungeonState.dungeon.name} - Stage {dungeonState.currentStage + 1}</h2>
          <div className="mb-6 max-w-md mx-auto">
            <h3 className="font-bangers text-lg md:text-2xl text-red-600 mb-2">{dungeonState.dungeon.stages[dungeonState.currentStage].name}</h3>
            <ProgressBar current={dungeonState.dungeon.stages[dungeonState.currentStage].hp} max={dungeonState.dungeon.stages[dungeonState.currentStage].maxHp} color="#ff4d4d" label="HP" />
          </div>
          <button onClick={attackDungeonStage} className="comic-button comic-button-red text-sm md:text-base w-full md:w-auto">FIGHT STAGE!</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {MOCK_DUNGEONS.map(dungeon => (
            <div key={dungeon.id} className="comic-panel comic-panel-interactive p-4 md:p-6 flex flex-col justify-between bg-gray-100">
              <div>
                <h3 className="font-bangers text-xl md:text-2xl mb-2">{dungeon.name}</h3>
                <p className="font-bold text-xs md:text-sm mb-4">{dungeon.stages.length} Stages</p>
              </div>
              <button onClick={() => enterDungeon(dungeon)} className="comic-button comic-button-blue w-full flex items-center justify-center gap-2 text-sm md:text-base">
                <Zap size={16}/> {dungeon.energyCost} - ENTER
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStore = () => (
    <div className="space-y-6">
      <div className="action-bubble mb-4 bg-green-400">NPC STORE</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {MOCK_ITEMS.map(item => {
          const rarityColor = item.rarity ? RARITY_CONFIG[item.rarity].color : '#94a3b8';
          return (
            <div key={item.id} className="comic-panel p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              style={{ borderLeftWidth: '8px', borderLeftColor: rarityColor }}
              onMouseMove={(e) => handleMouseMove(e, item)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleMouseMove(e, item)}
            >
              <div className="flex-1">
                <h3 className="font-bangers text-xl md:text-2xl flex items-center gap-2" style={{ color: rarityColor }}>{item.visualIcon} {item.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bangers uppercase px-1 rounded text-white" style={{ backgroundColor: rarityColor }}>{item.rarity || 'Common'}</span>
                  <span className="bg-black text-white font-bangers px-2 py-0.5 text-[10px] uppercase">{item.type}</span>
                </div>
                <p className="font-bold text-xs md:text-sm text-gray-600 mb-1">{item.description}</p>
                {item.stats && <p className="font-bangers text-xs md:text-sm text-blue-600">{renderStatsList(item.stats, 0, item.rarity)}</p>}
              </div>
              <div className="w-full sm:w-auto text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t-2 sm:border-t-0 border-black/5 pt-2 sm:pt-0">
                <p className="font-bangers text-xl md:text-2xl text-yellow-500 flex items-center gap-1"><Coins size={18}/> {item.price}</p>
                <button onClick={(e) => { e.stopPropagation(); buyItem(item); }} disabled={player.gold < item.price} className={`comic-button comic-button-green text-xs md:text-sm py-1 px-4 ${player.gold < item.price ? 'opacity-50' : ''}`}>BUY</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBlacksmith = () => (
    <div className="space-y-6">
      <div className="action-bubble mb-4 bg-gray-600 text-white">BLACKSMITH</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {player.inventory.filter(i => i.type !== 'consumable').map(item => {
          const cost = 100 * ((item.upgradeLevel || 0) + 1);
          const isUpgrading = upgradingItemId === item.id;
          const isRecent = recentUpgrades.has(item.id);
          const rarityColor = item.rarity ? RARITY_CONFIG[item.rarity].color : '#94a3b8';
          
          return (
            <div key={item.id} className={`comic-panel p-4 flex flex-col justify-between bg-gray-100 relative overflow-hidden transition-all duration-300 ${isRecent ? 'ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]' : ''}`}
              style={{ borderLeftWidth: '8px', borderLeftColor: rarityColor }}
              onMouseMove={(e) => handleMouseMove(e, item)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleMouseMove(e, item)}
            >
              {isUpgrading && (
                <div className="absolute inset-0 bg-yellow-200 z-20 animate-pulse opacity-80 flex items-center justify-center">
                   <span className="font-bangers text-3xl md:text-4xl text-black transform rotate-12 drop-shadow-lg">UPGRADED!</span>
                </div>
              )}
              <div>
                <h3 className="font-bangers text-lg md:text-xl" style={{ color: rarityColor }}>{item.name} {item.upgradeLevel ? `+${item.upgradeLevel}` : ''}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] md:text-[10px] font-bangers uppercase px-1 rounded text-white" style={{ backgroundColor: rarityColor }}>{item.rarity || 'Common'}</span>
                </div>
                <p className="font-bangers text-xs md:text-sm text-blue-600 mb-2">{renderStatsList(item.stats || {}, item.upgradeLevel, item.rarity)}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); upgradeItem(item); }} disabled={player.gold < cost} className={`comic-button comic-button-yellow text-xs md:text-sm py-1 mt-2 flex items-center justify-center gap-2 ${player.gold < cost ? 'opacity-50' : ''}`}>
                <Hammer size={14}/> UPGRADE ({cost} <Coins size={10}/>)
              </button>
            </div>
          );
        })}
        {player.inventory.filter(i => i.type !== 'consumable').length === 0 && (
          <p className="font-bangers text-lg md:text-xl text-gray-500 col-span-full text-center py-8">No gear in inventory to upgrade. Unequip items first!</p>
        )}
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-6">
      <div className="action-bubble mb-4 bg-blue-400 text-white">PLAYER MARKET</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {marketItems.map(listing => {
          const rarityColor = listing.item.rarity ? RARITY_CONFIG[listing.item.rarity].color : '#94a3b8';
          return (
            <div key={listing.id} className="comic-panel p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50"
              style={{ borderLeftWidth: '8px', borderLeftColor: rarityColor }}
              onMouseMove={(e) => handleMouseMove(e, listing.item)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleMouseMove(e, listing.item)}
            >
              <div className="flex-1">
                <h3 className="font-bangers text-xl md:text-2xl" style={{ color: rarityColor }}>{listing.item.visualIcon} {listing.item.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bangers uppercase px-1 rounded text-white" style={{ backgroundColor: rarityColor }}>{listing.item.rarity || 'Common'}</span>
                </div>
                <p className="font-bold text-xs md:text-sm text-gray-600">Seller: {listing.seller}</p>
              </div>
              <div className="w-full sm:w-auto text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t-2 sm:border-t-0 border-black/5 pt-2 sm:pt-0">
                <p className="font-bangers text-xl md:text-2xl text-yellow-500 flex items-center gap-1"><Coins size={18}/> {listing.price}</p>
                <button onClick={(e) => { e.stopPropagation(); buyMarketItem(listing.id); }} disabled={player.gold < listing.price} className={`comic-button comic-button-blue text-xs md:text-sm py-1 px-4 ${player.gold < listing.price ? 'opacity-50' : ''}`}>BUY</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderArena = () => (
    <div className="space-y-6">
      <div className="action-bubble mb-4 bg-red-600 text-white">PvP ARENA</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {MOCK_PVP_OPPONENTS.map(opp => (
          <div key={opp.id} className="comic-panel comic-panel-interactive p-4 md:p-6 flex flex-col justify-between bg-red-100 border-red-800">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bangers text-xl md:text-2xl text-red-800">{opp.name}</h3>
                <span className="bg-black text-white font-bangers px-2 py-1 text-xs md:text-sm transform rotate-3">LVL {opp.level}</span>
              </div>
            </div>
            <button onClick={() => attackPvp(opp)} className="comic-button w-full flex items-center justify-center gap-2 text-sm md:text-base">
              <Zap size={16}/> 10 - ATTACK PVP
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuests = () => (
    <div className="space-y-6">
      <div className="action-bubble mb-4 bg-yellow-400 text-black">QUESTS</div>
      {player.activeQuest && (
        <div className="comic-panel p-4 md:p-6 mb-6 bg-yellow-50 border-yellow-600">
          <h3 className="font-bangers text-xl md:text-2xl mb-2 text-yellow-800 uppercase">ACTIVE: {player.activeQuest.quest.title}</h3>
          <p className="font-bold text-xs md:text-sm mb-4">{player.activeQuest.quest.description}</p>
          <ProgressBar current={player.activeQuest.progress} max={player.activeQuest.quest.targetCount} color="#eab308" label="Progress" />
          {player.activeQuest.progress >= player.activeQuest.quest.targetCount && (
            <button onClick={claimQuest} className="comic-button comic-button-green w-full mt-4 text-sm md:text-base">CLAIM REWARD</button>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {MOCK_QUESTS.map(quest => (
          <div key={quest.id} className="comic-panel p-4 md:p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bangers text-xl md:text-2xl mb-2">{quest.title}</h3>
              <p className="font-bold text-xs md:text-sm mb-4 line-clamp-2">{quest.description}</p>
              <div className="flex gap-4 mb-4 text-xs md:text-sm font-bangers">
                <span className="flex items-center gap-1 text-yellow-600"><Coins size={14}/> {quest.goldReward}</span>
                <span className="flex items-center gap-1 text-purple-600"><Star size={14}/> {quest.expReward}</span>
              </div>
            </div>
            <button onClick={() => acceptQuest(quest)} disabled={!!player.activeQuest} className={`comic-button comic-button-blue w-full text-sm ${player.activeQuest ? 'opacity-50' : ''}`}>ACCEPT</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGuild = () => {
    if (!player.guildId) {
      return (
        <div className="space-y-6">
          <div className="action-bubble mb-4 bg-indigo-500 text-white">GUILDS</div>
          <div className="comic-panel p-6 md:p-8 text-center bg-indigo-50">
            <h2 className="comic-title text-2xl md:text-3xl mb-4">Create a Guild</h2>
            <p className="mb-6 font-bold text-sm md:text-base">Cost: 5000 Gold</p>
            <button onClick={() => createGuild("New Guild")} disabled={player.gold < 5000} className={`comic-button comic-button-blue text-sm md:text-base ${player.gold < 5000 ? 'opacity-50' : ''}`}>CREATE GUILD</button>
          </div>
        </div>
      );
    }

    const guild = guilds.find(g => g.id === player.guildId);
    if (!guild) return null;

    return (
      <div className="space-y-6">
        <div className="action-bubble mb-4 bg-indigo-500 text-white">MY GUILD</div>
        <div className="comic-panel p-4 md:p-6 bg-indigo-50">
          <h2 className="comic-title text-2xl md:text-4xl mb-2 text-indigo-800 flex flex-wrap items-center gap-2">
            {guild.name} 
            <span className="text-sm md:text-xl bg-black text-white px-2 py-1 transform -rotate-3 inline-block">LVL {guild.level}</span>
          </h2>
          <p className="font-bangers text-xl md:text-2xl text-yellow-600 mb-6 flex items-center gap-2"><Coins size={20}/> Treasury: {guild.gold}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="border-4 border-black p-4 bg-white">
              <h3 className="font-bangers text-xl md:text-2xl mb-4 border-b-2 border-black pb-2">Members</h3>
              <ul className="font-bold space-y-2 text-sm md:text-base">
                {guild.members.map(m => <li key={m} className="flex items-center gap-2"><User size={16}/> {m}</li>)}
              </ul>
            </div>
            <div className="border-4 border-black p-4 bg-white">
              <h3 className="font-bangers text-xl md:text-2xl mb-4 border-b-2 border-black pb-2">Donate</h3>
              <div className="flex gap-2">
                <button onClick={() => donateGuild(100)} className="comic-button comic-button-yellow flex-1 text-xs md:text-sm py-2">100 G</button>
                <button onClick={() => donateGuild(1000)} className="comic-button comic-button-yellow flex-1 text-xs md:text-sm py-2">1000 G</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTooltip = () => {
    if (!hoveredItem) return null;
    const { item, x, y } = hoveredItem;
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // Simple boundary check
    let left = x + 15 > window.innerWidth - 260 ? x - 270 : x + 15;
    let top = y + 15 > window.innerHeight - 150 ? y - 160 : y + 15;

    if (isMobile) {
      left = (window.innerWidth - 256) / 2;
      top = (window.innerHeight - 300) / 2;
    }

    const upgradeMultiplier = 1 + ((item.upgradeLevel || 0) * 0.1);
    const rarityMultiplier = getRarityMultiplier(item.rarity);
    const m = upgradeMultiplier * rarityMultiplier;
    const rarityColor = item.rarity ? RARITY_CONFIG[item.rarity].color : '#94a3b8';

    return (
      <>
        {isMobile && <div className="fixed inset-0 bg-black/40 z-[90]" onClick={handleMouseLeave}></div>}
        <div 
          className={`fixed z-[100] w-64 bg-white text-black p-4 border-4 shadow-[8px_8px_0px_rgba(0,0,0,1)] ${isMobile ? 'scale-110' : 'pointer-events-none'}`}
          style={{ left, top, borderColor: rarityColor }}
          onClick={isMobile ? handleMouseLeave : undefined}
        >
          <div className="halftone-overlay opacity-10"></div>
          <div className="flex justify-between items-start mb-2 border-b-2 border-black/10 pb-2">
            <h4 className="font-bangers text-xl leading-none" style={{ color: rarityColor }}>{item.visualIcon} {item.name} {item.upgradeLevel ? `+${item.upgradeLevel}` : ''}</h4>
            <span className="bg-black text-white font-bangers px-1 text-[10px] uppercase ml-2 whitespace-nowrap">{item.type}</span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-bangers uppercase px-1 rounded" style={{ backgroundColor: rarityColor, color: 'white' }}>{item.rarity || 'Common'}</span>
          </div>

          <p className="text-[10px] text-gray-500 mb-3 italic">"{item.description}"</p>
          
          <div className="space-y-1">
            {item.stats && (
              <div className="space-y-1 bg-blue-50 p-2 border border-black/5 rounded">
                {item.stats.strength && <div className="flex justify-between text-[10px]"><span className="text-gray-500">Strength</span> <span className="text-blue-600 font-bold">+{Math.floor(item.stats.strength * m)}</span></div>}
                {item.stats.defense && <div className="flex justify-between text-[10px]"><span className="text-gray-500">Defense</span> <span className="text-blue-600 font-bold">+{Math.floor(item.stats.defense * m)}</span></div>}
                {item.stats.agility && <div className="flex justify-between text-[10px]"><span className="text-gray-500">Agility</span> <span className="text-blue-600 font-bold">+{Math.floor(item.stats.agility * m)}</span></div>}
                {item.stats.endurance && <div className="flex justify-between text-[10px]"><span className="text-gray-500">Endurance</span> <span className="text-blue-600 font-bold">+{Math.floor(item.stats.endurance * m)}</span></div>}
                {item.stats.critChance && <div className="flex justify-between text-[10px]"><span className="text-gray-500">Crit Chance</span> <span className="text-orange-600 font-bold">+{Math.floor(item.stats.critChance * rarityMultiplier)}%</span></div>}
                {item.stats.dodgeChance && <div className="flex justify-between text-[10px]"><span className="text-gray-500">Dodge Chance</span> <span className="text-orange-600 font-bold">+{Math.floor(item.stats.dodgeChance * rarityMultiplier)}%</span></div>}
                {item.stats.lifesteal && <div className="flex justify-between text-[10px]"><span className="text-gray-500">Lifesteal</span> <span className="text-red-600 font-bold">+{Math.floor(item.stats.lifesteal * rarityMultiplier)}%</span></div>}
              </div>
            )}
            
            {item.effect && (
              <div className="mt-2 pt-2 border-t border-black/10">
                 <div className="flex justify-between text-[10px]">
                   <span className="text-green-600 uppercase font-bold">{item.effect}</span>
                   <span className="text-green-600">+{item.effectValue}</span>
                 </div>
              </div>
            )}
          </div>
          {isMobile && <div className="mt-4 text-center font-bangers text-[10px] text-gray-400">Tap to close</div>}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen p-2 md:p-8 max-w-7xl mx-auto flex flex-col gap-4 md:gap-6 pb-24 lg:pb-8">
      {/* Header */}
      <header className="comic-panel p-3 md:p-6 bg-white flex flex-col lg:flex-row justify-between items-center gap-3 md:gap-4">
        <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-500 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] shrink-0">
            <User size={20} className="md:w-8 md:h-8" color="white" />
          </div>
          <div>
            <h1 className="comic-title text-xl md:text-4xl text-blue-600 leading-tight">{player.name}</h1>
            <div className="font-bangers text-[10px] md:text-xl bg-black text-white px-2 inline-block transform -skew-x-12">LEVEL {player.level}</div>
          </div>
        </div>

        <div className="flex-1 w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 px-0 md:px-4">
          <ProgressBar current={player.hp} max={player.maxHp} color="#ff4d4d" label="HP" />
          <ProgressBar current={player.energy} max={player.maxEnergy} color="#33b5ff" label="EN" />
          <ProgressBar current={player.exp} max={player.maxExp} color="#b533ff" label="XP" />
          <div className="flex items-center justify-center gap-1 md:gap-2 font-bangers text-sm md:text-2xl bg-yellow-300 border-2 md:border-3 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] h-5 md:h-8">
            <Coins size={14} className="md:w-6 md:h-6" /> {player.gold}
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Sidebar Navigation - Bottom bar on mobile, sidebar on desktop */}
        <nav className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:w-64 flex flex-row lg:flex-col gap-2 bg-black p-2 lg:p-4 lg:rounded-lg shadow-[0px_-4px_10px_rgba(0,0,0,0.3)] lg:shadow-[4px_4px_0px_rgba(0,0,0,0.5)] h-fit sticky lg:top-4 overflow-x-auto lg:overflow-x-visible no-scrollbar z-[80]">
          <h3 className="hidden lg:block font-bangers text-2xl text-yellow-400 mb-2 border-b-2 border-gray-700 pb-2 text-center">COMMAND CENTER</h3>
          
          <button onClick={() => setCurrentView('dashboard')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'dashboard' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Activity size={16}/> Hero</button>
          <button onClick={() => setCurrentView('inventory')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'inventory' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Backpack size={16}/> Items</button>
          <button onClick={() => setCurrentView('tavern')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'tavern' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Tent size={16}/> Jobs</button>
          <button onClick={() => setCurrentView('expeditions')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'expeditions' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Map size={16}/> Map</button>
          <button onClick={() => setCurrentView('dungeons')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'dungeons' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Skull size={16}/> Dungeon</button>
          <button onClick={() => setCurrentView('arena')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'arena' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Swords size={16}/> PvP</button>
          <button onClick={() => setCurrentView('quests')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'quests' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Scroll size={16}/> Quests</button>
          <button onClick={() => setCurrentView('store')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'store' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><ShoppingBag size={16}/> Store</button>
          <button onClick={() => setCurrentView('blacksmith')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'blacksmith' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Hammer size={16}/> Smith</button>
          <button onClick={() => setCurrentView('market')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'market' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Coins size={16}/> Market</button>
          <button onClick={() => setCurrentView('guild')} className={`px-3 py-2 lg:px-4 lg:py-3 font-bangers text-xs lg:text-xl uppercase whitespace-nowrap ${currentView === 'guild' ? 'bg-white text-black transform scale-105' : 'text-white hover:bg-gray-800'} transition-all flex items-center gap-2 lg:gap-3 rounded`}><Users size={16}/> Guild</button>
        </nav>

        <div className="flex-1 grid grid-cols-1 gap-6">
          {/* Main Content Area */}
          <main className="relative">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'inventory' && renderInventory()}
            {currentView === 'tavern' && renderTavern()}
            {currentView === 'expeditions' && renderExpeditions()}
            {currentView === 'dungeons' && renderDungeons()}
            {currentView === 'store' && renderStore()}
            {currentView === 'blacksmith' && renderBlacksmith()}
            {currentView === 'market' && renderMarket()}
            {currentView === 'arena' && renderArena()}
            {currentView === 'quests' && renderQuests()}
            {currentView === 'guild' && renderGuild()}
          </main>
        </div>
      </div>
      {renderTooltip()}
      
      {/* Visual Log / Notifications */}
      <div className="fixed bottom-24 md:bottom-6 right-4 left-4 md:left-auto md:w-80 z-[110] pointer-events-none space-y-2">
        {messages.map(m => (
          <div key={m.id} className="bg-black text-white p-3 border-2 border-white shadow-[4px_4px_0px_rgba(0,0,0,1)] font-bangers text-sm md:text-base animate-slide-in pointer-events-auto">
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}
