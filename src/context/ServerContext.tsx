import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  ModioMod,
  ServerProfile,
  RconLog,
  ServerPlayer,
  RconMapCycleItem,
  ServerConfig,
  ActiveNavTab,
} from '../types';
import {
  INITIAL_MODS,
  INITIAL_SERVERS,
  INITIAL_LOGS,
  INITIAL_PLAYERS,
  INITIAL_MAP_CYCLE,
  INITIAL_CONFIG,
} from '../data/initialData';

export interface ToastItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

interface ServerContextType {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  mods: ModioMod[];
  servers: ServerProfile[];
  activeServer: ServerProfile;
  logs: RconLog[];
  players: ServerPlayer[];
  mapCycle: RconMapCycleItem[];
  config: ServerConfig;
  selectedModId: string | null;
  setSelectedModId: (id: string | null) => void;
  selectedBatchIds: string[];
  setSelectedBatchIds: (ids: string[]) => void;
  toggleBatchSelect: (id: string) => void;
  clearBatchSelect: () => void;
  selectAllMods: (filteredIds: string[]) => void;
  isSyncingAll: boolean;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // mod.io actions
  installMod: (id: string) => void;
  updateMod: (id: string) => void;
  uninstallMod: (id: string) => void;
  batchInstall: (ids: string[]) => void;
  batchUpdate: (ids: string[]) => void;
  batchUninstall: (ids: string[]) => void;
  batchAddToMapCycle: (ids: string[]) => void;
  syncAllOutdatedMods: () => void;
  addNewMod: (modData: Partial<ModioMod>) => void;
  
  // Server & RCON actions
  selectServer: (id: string) => void;
  toggleRconConnection: () => void;
  sendRconCommand: (command: string) => void;
  kickPlayer: (playerId: string, reason: string, isBan?: boolean, durationHours?: number) => void;
  broadcastMessage: (message: string) => void;
  switchMapRcon: (ugcId: string, gameMode?: string, mapTitle?: string) => void;
  restartMatchRcon: () => void;
  
  // RCON Map Rotation actions
  activeRotationIndex: number;
  autoRotateRcon: boolean;
  toggleAutoRotateRcon: () => void;
  triggerRconNextMap: () => void;
  triggerRconPreviousMap: () => void;
  shuffleMapCycle: () => void;
  setMapCycle: React.Dispatch<React.SetStateAction<RconMapCycleItem[]>>;
  addMapToCycle: (ugcId: string, title: string, gameMode: string) => void;
  removeMapFromCycle: (id: string) => void;
  toggleMapInCycle: (id: string) => void;
  updateConfig: (updater: Partial<ServerConfig>) => void;
  resetToDefaults: () => void;

  // Modals
  isAddModModalOpen: boolean;
  setIsAddModModalOpen: (open: boolean) => void;
  isKickBanModalOpen: boolean;
  setIsKickBanModalOpen: (open: boolean) => void;
  targetPlayerForKick: ServerPlayer | null;
  setTargetPlayerForKick: (p: ServerPlayer | null) => void;
  isBroadcastModalOpen: boolean;
  setIsBroadcastModalOpen: (open: boolean) => void;
  isVideoModalOpen: boolean;
  setIsVideoModalOpen: (open: boolean) => void;
  uploadedVideoUrl: string | null;
  setUploadedVideoUrl: (url: string | null) => void;
  openVideoBriefing: (title?: string, ugcId?: string) => void;
}

const STORAGE_KEY = 'pavlov_tactical_v2_modio_store';

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('mods');
  const [selectedModId, setSelectedModId] = useState<string | null>(null);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // RCON rotation state
  const [activeRotationIndex, setActiveRotationIndex] = useState<number>(0);
  const [autoRotateRcon, setAutoRotateRcon] = useState<boolean>(true);

  // Modals
  const [isAddModModalOpen, setIsAddModModalOpen] = useState(false);
  const [isKickBanModalOpen, setIsKickBanModalOpen] = useState(false);
  const [targetPlayerForKick, setTargetPlayerForKick] = useState<ServerPlayer | null>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

  const openVideoBriefing = useCallback((title?: string, ugcId?: string) => {
    setIsVideoModalOpen(true);
  }, []);

  // Core Data
  const [mods, setMods] = useState<ModioMod[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mods`);
      return saved ? JSON.parse(saved) : INITIAL_MODS;
    } catch {
      return INITIAL_MODS;
    }
  });

  const [servers, setServers] = useState<ServerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_servers`);
      return saved ? JSON.parse(saved) : INITIAL_SERVERS;
    } catch {
      return INITIAL_SERVERS;
    }
  });

  const [activeServerId, setActiveServerId] = useState<string>(servers[0]?.id || 'srv-eu-01');

  const [logs, setLogs] = useState<RconLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  const [players, setPlayers] = useState<ServerPlayer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_players`);
      return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
    } catch {
      return INITIAL_PLAYERS;
    }
  });

  const [mapCycle, setMapCycle] = useState<RconMapCycleItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mapcycle`);
      return saved ? JSON.parse(saved) : INITIAL_MAP_CYCLE;
    } catch {
      return INITIAL_MAP_CYCLE;
    }
  });

  const [config, setConfig] = useState<ServerConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_config`);
      return saved ? JSON.parse(saved) : INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_mods`, JSON.stringify(mods));
    } catch {
      // ignore
    }
  }, [mods]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_servers`, JSON.stringify(servers));
    } catch {
      // ignore
    }
  }, [servers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(logs.slice(-100)));
    } catch {
      // ignore
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(players));
    } catch {
      // ignore
    }
  }, [players]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_mapcycle`, JSON.stringify(mapCycle));
    } catch {
      // ignore
    }
  }, [mapCycle]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_config`, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  const activeServer = servers.find((s) => s.id === activeServerId) || servers[0];

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addLog = useCallback((message: string, severity: RconLog['severity'] = 'info', source = 'RCON') => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newLog: RconLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp,
      severity,
      source,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  const selectServer = useCallback((id: string) => {
    setActiveServerId(id);
    const found = servers.find((s) => s.id === id);
    if (found) {
      showToast(`Switched active context to ${found.name}`, 'info');
      addLog(`Switched operator control context to ${found.name} (${found.ip}:${found.port})`, 'info', 'SESSION');
    }
  }, [servers, showToast, addLog]);

  const toggleRconConnection = useCallback(() => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id === activeServer.id) {
          const nextStatus = s.rconStatus === 'online' ? 'offline' : 'online';
          addLog(
            nextStatus === 'online'
              ? `RCON socket reconnected to ${s.ip}:${s.rconPort} [Authorized Admin]`
              : `RCON socket closed by operator for ${s.ip}:${s.rconPort}`,
            nextStatus === 'online' ? 'sync' : 'warn',
            'RCON'
          );
          showToast(
            nextStatus === 'online' ? 'RCON Socket Connected' : 'RCON Socket Disconnected',
            nextStatus === 'online' ? 'success' : 'warning'
          );
          return { ...s, rconStatus: nextStatus };
        }
        return s;
      })
    );
  }, [activeServer.id, addLog, showToast]);

  const toggleBatchSelect = useCallback((id: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const clearBatchSelect = useCallback(() => {
    setSelectedBatchIds([]);
  }, []);

  const selectAllMods = useCallback((filteredIds: string[]) => {
    setSelectedBatchIds(filteredIds);
  }, []);

  // mod.io Installations & Updates
  const installMod = useCallback((id: string) => {
    const target = mods.find((m) => m.id === id);
    if (!target) return;

    setMods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isDownloading: true, downloadProgress: 15 } : m))
    );
    showToast(`Downloading mod.io package UGC ${target.ugcId} (${target.title})...`, 'info');
    addLog(`Initiated mod.io package download: UGC ${target.ugcId} (${target.fileSizeFormatted})`, 'info', 'MODIO_API');

    setTimeout(() => {
      setMods((prev) =>
        prev.map((m) => (m.id === id ? { ...m, downloadProgress: 75 } : m))
      );
    }, 400);

    setTimeout(() => {
      setMods((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status: 'installed',
                version: m.latestVersion,
                isDownloading: false,
                downloadProgress: 100,
              }
            : m
        )
      );
      showToast(`Installed mod.io UGC ${target.ugcId}: ${target.title}`, 'success');
      addLog(`Mount verified: mod.io UGC ${target.ugcId} mounted to server cache`, 'sync', 'MODIO_API');
    }, 850);
  }, [mods, showToast, addLog]);

  const updateMod = useCallback((id: string) => {
    const target = mods.find((m) => m.id === id);
    if (!target) return;

    setMods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isDownloading: true, downloadProgress: 30 } : m))
    );
    showToast(`Syncing mod.io UGC ${target.ugcId} to v${target.latestVersion}...`, 'info');

    setTimeout(() => {
      setMods((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status: 'installed',
                version: m.latestVersion,
                isDownloading: false,
                downloadProgress: 100,
              }
            : m
        )
      );
      showToast(`Updated mod.io UGC ${target.ugcId} to v${target.latestVersion}`, 'success');
      addLog(`Updated: mod.io UGC ${target.ugcId} synced to latest version v${target.latestVersion}`, 'sync', 'MODIO_API');
    }, 700);
  }, [mods, showToast, addLog]);

  const uninstallMod = useCallback((id: string) => {
    const target = mods.find((m) => m.id === id);
    if (!target) return;

    setMods((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: 'not_installed', isDownloading: false } : m
      )
    );
    setMapCycle((prev) => prev.filter((item) => item.ugcId !== target.ugcId));

    showToast(`Removed mod.io UGC ${target.ugcId} from server mod cache`, 'warning');
    addLog(`Purged: mod.io UGC ${target.ugcId} unmounted and deleted from local storage`, 'warn', 'STORAGE');
  }, [mods, showToast, addLog]);

  const batchInstall = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    showToast(`Batch installing ${ids.length} mod.io packages...`, 'info');
    ids.forEach((id) => installMod(id));
    clearBatchSelect();
  }, [installMod, clearBatchSelect, showToast]);

  const batchUpdate = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    showToast(`Batch updating ${ids.length} outdated mod.io packages...`, 'info');
    ids.forEach((id) => updateMod(id));
    clearBatchSelect();
  }, [updateMod, clearBatchSelect, showToast]);

  const batchUninstall = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    ids.forEach((id) => uninstallMod(id));
    clearBatchSelect();
    showToast(`Uninstalled ${ids.length} packages`, 'warning');
  }, [uninstallMod, clearBatchSelect, showToast]);

  const batchAddToMapCycle = useCallback((ids: string[]) => {
    const candidates = mods.filter((m) => ids.includes(m.id) && m.isCustomMap);
    if (candidates.length === 0) {
      showToast('No custom map items selected in batch', 'warning');
      return;
    }

    setMapCycle((prev) => {
      const existingIds = new Set(prev.map((p) => p.ugcId));
      const newItems: RconMapCycleItem[] = candidates
        .filter((c) => !existingIds.has(c.ugcId))
        .map((c) => ({
          id: `cycle-${Date.now()}-${c.ugcId}`,
          ugcId: c.ugcId,
          title: c.title,
          gameMode: c.gameMode || 'SND',
          enabled: true,
        }));
      return [...prev, ...newItems];
    });

    showToast(`Added ${candidates.length} mod.io maps to RCON rotation cycle`, 'success');
    addLog(`Appended ${candidates.length} map items to RCON rotation queue`, 'info', 'RCON_ROTATION');
    clearBatchSelect();
  }, [mods, clearBatchSelect, showToast, addLog]);

  const syncAllOutdatedMods = useCallback(() => {
    const outdated = mods.filter((m) => m.status === 'update_available');
    if (outdated.length === 0) {
      showToast('All installed mod.io packages are already up-to-date', 'info');
      return;
    }

    setIsSyncingAll(true);
    showToast(`Starting automated mod.io sync for ${outdated.length} outdated items...`, 'info');
    addLog(`Triggered batch mod.io version reconciliation: ${outdated.length} items queued`, 'info', 'MODIO_API');

    outdated.forEach((mod, index) => {
      setTimeout(() => {
        updateMod(mod.id);
        if (index === outdated.length - 1) {
          setIsSyncingAll(false);
          showToast(`Completed batch sync! All mod.io packages are up to date.`, 'success');
        }
      }, (index + 1) * 350);
    });
  }, [mods, showToast, addLog, updateMod]);

  const addNewMod = useCallback((modData: Partial<ModioMod>) => {
    const cleanUgc = (modData.ugcId || '').replace(/\D/g, '') || `${Date.now()}`.slice(-7);
    const slug = modData.modioSlug || (modData.title || `mod-${cleanUgc}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newMod: ModioMod = {
      id: `mod-${cleanUgc}`,
      ugcId: cleanUgc,
      modioSlug: slug,
      modioUrl: `https://mod.io/g/pavlov/m/${slug}`,
      title: modData.title?.trim() || `mod.io UGC ${cleanUgc}`,
      category: modData.category || 'snd',
      gameMode: modData.gameMode || 'SND',
      author: modData.author?.trim() || 'mod.io Creator',
      version: '1.0.0',
      latestVersion: '1.0.0',
      fileSizeBytes: modData.fileSizeBytes || 524288000,
      fileSizeFormatted: modData.fileSizeFormatted || '500 MB',
      status: 'installed',
      imageUrl: modData.imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      description: modData.description || 'Custom mod.io UGC package registered via Pavlov Tactical Command operator console.',
      tags: modData.tags || ['mod.io', 'Tactical'],
      dependencies: [],
      downloads: 1450,
      ratingPercentage: 95,
      lastUpdated: new Date().toISOString().split('T')[0],
      isCustomMap: modData.isCustomMap ?? true,
    };

    setMods((prev) => [newMod, ...prev]);
    showToast(`Registered mod.io UGC ${newMod.ugcId}: ${newMod.title}`, 'success');
    addLog(`Registered mod.io UGC ID ${newMod.ugcId} to catalog`, 'sync', 'MODIO_API');
  }, [showToast, addLog]);

  // RCON Command Dispatcher
  const sendRconCommand = useCallback((rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    addLog(cmd, 'rcon', 'CMD_INPUT');

    const parts = cmd.split(/\s+/);
    const verb = parts[0].toLowerCase();

    if (verb === 'switchmap' || verb === 'map') {
      const ugcArg = parts[1] || '1849201';
      const cleanUgc = ugcArg.replace(/ugc/i, '');
      const modeArg = (parts[2] || 'SND').toUpperCase();
      const mapItem = mods.find((m) => m.ugcId === cleanUgc);
      const title = mapItem ? mapItem.title : `mod.io UGC ${cleanUgc}`;

      setServers((prev) =>
        prev.map((s) =>
          s.id === activeServer.id
            ? {
                ...s,
                currentMapUgc: cleanUgc,
                currentMapTitle: title,
                currentGameMode: modeArg,
                elapsedTime: '00:00 / 30:00',
              }
            : s
        )
      );
      addLog(`RCON socket dispatched: SwitchMap UGC${cleanUgc} ${modeArg} -> Map loaded into active session`, 'sync', 'RCON_ROTATION');
      showToast(`RCON Map Switched: ${title} (${modeArg})`, 'success');
    } else if (verb === 'rotatemap' || verb === 'nextmap') {
      const activeItems = mapCycle.filter((m) => m.enabled);
      if (activeItems.length > 0) {
        const nextIdx = (activeRotationIndex + 1) % activeItems.length;
        const nextMap = activeItems[nextIdx];
        setActiveRotationIndex(nextIdx);

        setServers((prev) =>
          prev.map((s) =>
            s.id === activeServer.id
              ? {
                  ...s,
                  currentMapUgc: nextMap.ugcId,
                  currentMapTitle: nextMap.title,
                  currentGameMode: nextMap.gameMode,
                  elapsedTime: '00:00 / 30:00',
                }
              : s
          )
        );
        addLog(`RCON Dynamic Rotation: SwitchMap UGC${nextMap.ugcId} ${nextMap.gameMode}`, 'rcon', 'RCON_ROTATION');
        addLog(`Active map advanced to: [${nextIdx + 1}/${activeItems.length}] ${nextMap.title}`, 'sync', 'RCON_ROTATION');
        showToast(`RCON Rotated Map to ${nextMap.title}`, 'info');
      } else {
        addLog('RCON rotation queue is empty or all maps disabled', 'warn', 'RCON_ROTATION');
        showToast('RCON rotation playlist has no active entries', 'warning');
      }
    } else if (verb === 'kick') {
      const targetQuery = parts[1];
      const reason = parts.slice(2).join(' ') || 'Kicked by administrator';
      setPlayers((prev) => {
        const found = prev.find(
          (p) => p.id === targetQuery || p.name.toLowerCase().includes(targetQuery?.toLowerCase() || '')
        );
        if (found) {
          addLog(`RCON packet: Kick [${found.name}] (Reason: ${reason})`, 'warn', 'SECURITY');
          showToast(`Kicked ${found.name}`, 'warning');
          return prev.filter((p) => p.id !== found.id);
        } else {
          addLog(`Kick target '${targetQuery}' not found in active roster`, 'error', 'SECURITY');
          return prev;
        }
      });
    } else if (verb === 'ban') {
      const targetQuery = parts[1];
      const reason = parts.slice(2).join(' ') || 'Banned by operator';
      setPlayers((prev) => {
        const found = prev.find(
          (p) => p.id === targetQuery || p.name.toLowerCase().includes(targetQuery?.toLowerCase() || '')
        );
        if (found) {
          addLog(`RCON packet: Ban [${found.name}] for 24h (SteamID: ${found.steamId}, Reason: ${reason})`, 'error', 'SECURITY');
          showToast(`Banned ${found.name} (SteamID: ${found.steamId})`, 'error');
          return prev.filter((p) => p.id !== found.id);
        } else {
          addLog(`Ban target '${targetQuery}' not found`, 'error', 'SECURITY');
          return prev;
        }
      });
    } else if (verb === 'broadcast' || verb === 'say') {
      const msg = parts.slice(1).join(' ');
      addLog(`BROADCAST [RCON]: ${msg}`, 'info', 'BROADCAST');
      showToast(`Broadcasted: "${msg}"`, 'info');
    } else if (verb === 'resetsnd' || verb === 'restart') {
      addLog(`Match reset directive received. Resetting round scores to 0-0.`, 'info', 'GAMEPLAY');
      setPlayers((prev) => prev.map((p) => ({ ...p, kills: 0, deaths: 0, score: 0 })));
      showToast('Match scores and rounds reset', 'success');
    } else if (verb === 'serverinfo' || verb === 'status') {
      addLog(
        `Server: ${activeServer.name} | Port: ${activeServer.port} | Players: ${players.length}/${activeServer.maxPlayers} | Tick: ${activeServer.tickRate}Hz | Map: UGC${activeServer.currentMapUgc} (${activeServer.currentGameMode})`,
        'sync',
        'STATUS'
      );
    } else if (verb === 'help') {
      addLog('Available commands: SwitchMap <UGC> <Mode>, RotateMap, Kick <Name> [Reason], Ban <Name> [Reason], Broadcast <Msg>, ResetSND, ServerInfo, Clear', 'info', 'HELP');
    } else if (verb === 'clear') {
      setLogs([]);
      addLog('Console log screen cleared', 'info', 'CONSOLE');
    } else {
      addLog(`Unknown RCON command: "${cmd}". Type "help" for syntax list.`, 'warn', 'RCON');
    }
  }, [mods, activeServer, mapCycle, activeRotationIndex, players, addLog, showToast]);

  // Dedicated RCON Rotation triggers
  const triggerRconNextMap = useCallback(() => {
    sendRconCommand('RotateMap');
  }, [sendRconCommand]);

  const triggerRconPreviousMap = useCallback(() => {
    const activeItems = mapCycle.filter((m) => m.enabled);
    if (activeItems.length === 0) return;
    const prevIdx = (activeRotationIndex - 1 + activeItems.length) % activeItems.length;
    const prevMap = activeItems[prevIdx];
    setActiveRotationIndex(prevIdx);
    sendRconCommand(`SwitchMap UGC${prevMap.ugcId} ${prevMap.gameMode}`);
  }, [mapCycle, activeRotationIndex, sendRconCommand]);

  const shuffleMapCycle = useCallback(() => {
    setMapCycle((prev) => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      showToast('Shuffled RCON map rotation queue', 'info');
      addLog('RCON Map Cycle queue randomized by operator', 'info', 'RCON_ROTATION');
      return shuffled;
    });
  }, [showToast, addLog]);

  const toggleAutoRotateRcon = useCallback(() => {
    setAutoRotateRcon((prev) => {
      const next = !prev;
      showToast(
        next ? 'RCON Dynamic Map Auto-Rotation Enabled' : 'RCON Dynamic Map Auto-Rotation Paused',
        next ? 'success' : 'warning'
      );
      addLog(
        next
          ? 'RCON Auto-Cycle Daemon: ACTIVE (will dispatch SwitchMap at round end)'
          : 'RCON Auto-Cycle Daemon: PAUSED',
        next ? 'sync' : 'warn',
        'RCON_ROTATION'
      );
      return next;
    });
  }, [showToast, addLog]);

  const kickPlayer = useCallback((playerId: string, reason: string, isBan = false, durationHours = 24) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    if (isBan) {
      sendRconCommand(`Ban ${player.name} ${reason} (${durationHours}h)`);
    } else {
      sendRconCommand(`Kick ${player.name} ${reason}`);
    }
  }, [players, sendRconCommand]);

  const broadcastMessage = useCallback((message: string) => {
    if (!message.trim()) return;
    sendRconCommand(`Broadcast ${message.trim()}`);
  }, [sendRconCommand]);

  const switchMapRcon = useCallback((ugcId: string, gameMode = 'SND', mapTitle?: string) => {
    sendRconCommand(`SwitchMap UGC${ugcId} ${gameMode}`);
  }, [sendRconCommand]);

  const restartMatchRcon = useCallback(() => {
    sendRconCommand('ResetSND');
  }, [sendRconCommand]);

  // Map Cycle Management (RCON dynamic playlist)
  const addMapToCycle = useCallback((ugcId: string, title: string, gameMode: string) => {
    setMapCycle((prev) => {
      if (prev.some((p) => p.ugcId === ugcId)) {
        showToast('Map is already in the RCON rotation queue', 'warning');
        return prev;
      }
      const newItem: RconMapCycleItem = {
        id: `cycle-${Date.now()}-${ugcId}`,
        ugcId,
        title,
        gameMode,
        enabled: true,
      };
      showToast(`Added ${title} to RCON rotation queue`, 'success');
      addLog(`Added mod.io UGC${ugcId} (${gameMode}) to dynamic RCON rotation sequence`, 'info', 'RCON_ROTATION');
      return [...prev, newItem];
    });
  }, [showToast, addLog]);

  const removeMapFromCycle = useCallback((id: string) => {
    setMapCycle((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed map from RCON rotation queue', 'info');
  }, [showToast]);

  const toggleMapInCycle = useCallback((id: string) => {
    setMapCycle((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  }, []);

  const updateConfig = useCallback((updater: Partial<ServerConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updater };
      showToast('Server Game.ini parameters updated', 'success');
      addLog('Game.ini server configuration variables committed to memory', 'info', 'CONFIG');
      return next;
    });
  }, [showToast, addLog]);

  const resetToDefaults = useCallback(() => {
    setMods(INITIAL_MODS);
    setServers(INITIAL_SERVERS);
    setLogs(INITIAL_LOGS);
    setPlayers(INITIAL_PLAYERS);
    setMapCycle(INITIAL_MAP_CYCLE);
    setConfig(INITIAL_CONFIG);
    setSelectedBatchIds([]);
    setSelectedModId(null);
    setActiveRotationIndex(0);
    setAutoRotateRcon(true);
    showToast('Reset server state & mod.io library to defaults', 'info');
  }, [showToast]);

  return (
    <ServerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        mods,
        servers,
        activeServer,
        logs,
        players,
        mapCycle,
        config,
        selectedModId,
        setSelectedModId,
        selectedBatchIds,
        setSelectedBatchIds,
        toggleBatchSelect,
        clearBatchSelect,
        selectAllMods,
        isSyncingAll,
        toasts,
        showToast,
        removeToast,
        installMod,
        updateMod,
        uninstallMod,
        batchInstall,
        batchUpdate,
        batchUninstall,
        batchAddToMapCycle,
        syncAllOutdatedMods,
        addNewMod,
        selectServer,
        toggleRconConnection,
        sendRconCommand,
        kickPlayer,
        broadcastMessage,
        switchMapRcon,
        restartMatchRcon,
        activeRotationIndex,
        autoRotateRcon,
        toggleAutoRotateRcon,
        triggerRconNextMap,
        triggerRconPreviousMap,
        shuffleMapCycle,
        setMapCycle,
        addMapToCycle,
        removeMapFromCycle,
        toggleMapInCycle,
        updateConfig,
        resetToDefaults,
        isAddModModalOpen,
        setIsAddModModalOpen,
        isKickBanModalOpen,
        setIsKickBanModalOpen,
        targetPlayerForKick,
        setTargetPlayerForKick,
        isBroadcastModalOpen,
        setIsBroadcastModalOpen,
        isVideoModalOpen,
        setIsVideoModalOpen,
        uploadedVideoUrl,
        setUploadedVideoUrl,
        openVideoBriefing,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};
