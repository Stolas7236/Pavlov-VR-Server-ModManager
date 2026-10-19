export type ModCategory = 'all' | 'snd' | 'push' | 'weapons' | 'tdm' | 'zombies';

export type ModStatus = 'all' | 'installed' | 'update_available' | 'not_installed';

export interface ModioMod {
  id: string;
  ugcId: string; // mod.io Item ID (e.g. 1849201)
  modioSlug: string;
  modioUrl: string;
  title: string;
  category: 'snd' | 'push' | 'weapons' | 'tdm' | 'zombies';
  gameMode: string;
  author: string;
  version: string;
  latestVersion: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  status: 'installed' | 'update_available' | 'not_installed';
  imageUrl: string;
  description: string;
  tags: string[];
  dependencies: string[];
  downloads: number;
  ratingPercentage: number;
  lastUpdated: string;
  isCustomMap: boolean;
  isDownloading?: boolean;
  downloadProgress?: number;
}

// Backwards-compatible alias
export type WorkshopMod = ModioMod;

export interface ServerProfile {
  id: string;
  name: string;
  region: string;
  ip: string;
  port: number;
  rconPort: number;
  rconStatus: 'online' | 'offline' | 'connecting';
  tickRate: number;
  playerCount: number;
  maxPlayers: number;
  currentMapUgc: string;
  currentMapTitle: string;
  currentGameMode: string;
  elapsedTime: string;
  allocatedRamMb: number;
  totalRamMb: number;
  modDiskUsageGb: number;
  totalDiskGb: number;
}

export type LogSeverity = 'info' | 'rcon' | 'player' | 'warn' | 'error' | 'sync';

export interface RconLog {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  source: string;
  message: string;
}

export interface ServerPlayer {
  id: string;
  name: string;
  steamId: string;
  ping: number;
  score: number;
  kills: number;
  deaths: number;
  team: 'blue' | 'red' | 'spectator';
  connectedDuration: string;
  isMuted?: boolean;
}

export interface RconMapCycleItem {
  id: string;
  ugcId: string; // mod.io ID
  title: string;
  gameMode: string;
  enabled: boolean;
}

export type MapCycleItem = RconMapCycleItem;

export interface ServerConfig {
  serverName: string;
  passwordProtection: boolean;
  serverPassword?: string;
  maxPlayers: number;
  roundTimeSeconds: number;
  warmupTimeSeconds: number;
  bombTimeSeconds: number;
  friendlyFire: boolean;
  autoBalance: boolean;
  voiceChat: 'team' | 'all';
  voteKickEnabled: boolean;
  customWeaponsEnabled: boolean;
  competitiveRules: boolean;
  tickRatePreset: 90 | 60 | 120;
}

export type ActiveNavTab = 'mods' | 'rcon' | 'mapcycle' | 'config';
