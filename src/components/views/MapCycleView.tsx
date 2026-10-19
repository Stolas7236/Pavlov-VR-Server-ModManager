import React, { useState } from 'react';
import { useServer } from '../../context/ServerContext';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Play,
  FastForward,
  Rewind,
  Shuffle,
  Radio,
  Copy,
  Check,
  Terminal,
  FileCode,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const MapCycleView: React.FC = () => {
  const {
    mapCycle,
    setMapCycle,
    removeMapFromCycle,
    toggleMapInCycle,
    mods,
    addMapToCycle,
    activeServer,
    activeRotationIndex,
    autoRotateRcon,
    toggleAutoRotateRcon,
    triggerRconNextMap,
    triggerRconPreviousMap,
    shuffleMapCycle,
    switchMapRcon,
    showToast,
  } = useServer();

  const [selectedInstalledModId, setSelectedInstalledModId] = useState<string>('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedIni, setCopiedIni] = useState(false);

  // Available installed custom maps to add
  const availableMaps = mods.filter((m) => m.isCustomMap && m.status === 'installed');
  const activeCycleItems = mapCycle.filter((m) => m.enabled);

  const moveUp = (index: number) => {
    if (index === 0) return;
    setMapCycle((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === mapCycle.length - 1) return;
    setMapCycle((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const changeGameMode = (id: string, mode: string) => {
    setMapCycle((prev) =>
      prev.map((item) => (item.id === id ? { ...item, gameMode: mode } : item))
    );
  };

  const handleAddFromInstalled = () => {
    const target = availableMaps.find((m) => m.id === selectedInstalledModId);
    if (!target) return;
    addMapToCycle(target.ugcId, target.title, target.gameMode);
    setSelectedInstalledModId('');
  };

  const handleInstantSwitch = (ugcId: string, gameMode: string, title: string) => {
    switchMapRcon(ugcId, gameMode, title);
    showToast(`RCON: Switched map immediately to ${title} (${gameMode})`, 'success');
  };

  // Generate Automated RCON Rotation Python/Bash script for server operators
  const generatedRconScript = `# Pavlov VR RCON Dynamic Map Sequencer (UE5 / mod.io)
# Connects to RCON socket on ${activeServer.ip}:${activeServer.rconPort}

import socket, time

SERVER_IP = "${activeServer.ip}"
RCON_PORT = ${activeServer.rconPort}
RCON_PASS = "admin_rcon_pass"

# Dynamic playlist sequence
ROTATION_QUEUE = [
${activeCycleItems.map((m) => `    {"ugc": "${m.ugcId}", "mode": "${m.gameMode}", "title": "${m.title}"},`).join('\n')}
]

def dispatch_rcon(cmd):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((SERVER_IP, RCON_PORT))
        s.sendall(f"{RCON_PASS} {cmd}\\n".encode())
        print(f"[RCON SEND]: {cmd}")

# Execute next rotation step:
# dispatch_rcon("SwitchMap UGC${activeCycleItems[0]?.ugcId || '1849201'} ${activeCycleItems[0]?.gameMode || 'SND'}")
`;

  const generatedGameIni = [
    '[/Script/Pavlov.DedicatedServer]',
    `ServerName="${activeServer.name}"`,
    '# Dynamic RCON map rotation entries',
    ...activeCycleItems.map(
      (item) => `MapRotation=(MapId="UGC${item.ugcId}", GameMode="${item.gameMode}")`
    ),
  ].join('\n');

  const copyScript = (text: string, type: 'rcon' | 'ini') => {
    navigator.clipboard.writeText(text);
    if (type === 'rcon') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
      showToast('Copied RCON Python/Socket script to clipboard', 'success');
    } else {
      setCopiedIni(true);
      setTimeout(() => setCopiedIni(false), 2000);
      showToast('Copied Game.ini syntax to clipboard', 'success');
    }
  };

  const currentPlayingMap = activeCycleItems[activeRotationIndex % (activeCycleItems.length || 1)];
  const nextQueuedMap = activeCycleItems[(activeRotationIndex + 1) % (activeCycleItems.length || 1)];

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#0F1115]">
      {/* Left: Dynamic RCON Queue & Playlist Controls */}
      <div className="flex-1 flex flex-col h-full border-r border-[#2E3440] overflow-hidden">
        {/* RCON Dynamic Controller Header */}
        <div className="p-4 bg-[#111317] border-b border-[#2E3440] space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded bg-[#181A20] border border-[#2E3440] text-[#0EA5E9]">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold uppercase font-mono-code text-white">
                    RCON Dynamic Map Rotation Controller
                  </h2>
                  <span className="text-[10px] font-mono-code bg-[#0EA5E9]/15 text-[#38BDF8] border border-[#0EA5E9]/30 px-1.5 py-0.5 rounded">
                    RCON Socket Controlled
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-[#88929B]">
                  Directly injects <code className="text-[#38BDF8]">SwitchMap</code> into live server session without server restart
                </span>
              </div>
            </div>

            {/* Auto-Rotation Daemon Switch */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAutoRotateRcon}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-code font-semibold border transition-all ${
                  autoRotateRcon
                    ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#22C55E]'
                    : 'bg-[#181A20] border-[#2E3440] text-[#88929B] hover:text-white'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    autoRotateRcon ? 'bg-[#22C55E] animate-pulse' : 'bg-[#88929B]'
                  }`}
                />
                <span>Auto-Cycle: {autoRotateRcon ? 'ACTIVE' : 'PAUSED'}</span>
              </button>
            </div>
          </div>

          {/* Real-time Status Card: Now Playing & Up Next */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#181A20] border border-[#2E3440] rounded p-3 text-xs font-mono-code">
            <div className="flex items-center justify-between border-b md:border-b-0 md:border-r border-[#2E3440] pb-2 md:pb-0 md:pr-3">
              <div>
                <span className="text-[10px] uppercase text-[#38BDF8] font-bold block mb-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  Now Playing (Active Session)
                </span>
                <span className="text-white font-bold truncate block max-w-[200px]" title={activeServer.currentMapTitle}>
                  {activeServer.currentMapTitle}
                </span>
                <span className="text-[11px] text-[#88929B]">
                  mod.io UGC {activeServer.currentMapUgc} · {activeServer.currentGameMode}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#0EA5E9]/20 text-[#38BDF8] rounded">
                LIVE
              </span>
            </div>

            <div className="flex items-center justify-between md:pl-3">
              <div>
                <span className="text-[10px] uppercase text-[#F59E0B] font-bold block mb-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  Up Next in RCON Queue
                </span>
                <span className="text-white font-bold truncate block max-w-[200px]" title={nextQueuedMap?.title}>
                  {nextQueuedMap?.title || 'None queued'}
                </span>
                <span className="text-[11px] text-[#88929B]">
                  {nextQueuedMap ? `mod.io UGC ${nextQueuedMap.ugcId} · ${nextQueuedMap.gameMode}` : 'Queue empty'}
                </span>
              </div>
              <button
                onClick={triggerRconNextMap}
                disabled={activeCycleItems.length === 0}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#0EA5E9] hover:bg-[#38BDF8] disabled:opacity-40 text-white text-[11px] font-semibold rounded transition-colors shadow-sm shadow-[#0EA5E9]/20"
              >
                <FastForward className="w-3 h-3" />
                <span>Trigger</span>
              </button>
            </div>
          </div>

          {/* RCON Directives Bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={triggerRconPreviousMap}
                disabled={activeCycleItems.length === 0}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] text-xs font-mono-code text-[#E2E2E8] rounded transition-colors"
                title="RCON: Load Previous Map in queue"
              >
                <Rewind className="w-3.5 h-3.5 text-[#88929B]" />
                <span>Prev Map</span>
              </button>

              <button
                onClick={triggerRconNextMap}
                disabled={activeCycleItems.length === 0}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#0EA5E9] hover:bg-[#38BDF8] disabled:opacity-40 text-xs font-mono-code font-semibold text-white rounded transition-colors shadow-sm shadow-[#0EA5E9]/20"
                title="RCON: Dispatch SwitchMap to next map in queue"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Next Map (RCON)</span>
              </button>

              <button
                onClick={shuffleMapCycle}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] text-xs font-mono-code text-[#88929B] hover:text-white rounded transition-colors"
                title="Shuffle queue order"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>
            </div>

            {/* Add from Installed Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedInstalledModId}
                onChange={(e) => setSelectedInstalledModId(e.target.value)}
                className="h-8 bg-[#181A20] border border-[#2E3440] rounded text-xs text-[#E2E2E8] px-2.5 focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="">Select Installed Map...</option>
                {availableMaps.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.gameMode})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddFromInstalled}
                disabled={!selectedInstalledModId}
                className="h-8 px-3 bg-[#222630] hover:bg-[#2A303C] border border-[#2E3440] hover:border-[#383F4D] disabled:opacity-40 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>Add to Queue</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Rotation Queue List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {mapCycle.map((item, index) => {
            const isPlaying = activeServer.currentMapUgc === item.ugcId;
            const isNext =
              activeCycleItems.length > 0 &&
              nextQueuedMap?.id === item.id &&
              !isPlaying;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 p-3 rounded border transition-colors ${
                  isPlaying
                    ? 'bg-[#0EA5E9]/10 border-[#0EA5E9] ring-1 ring-[#0EA5E9]'
                    : isNext
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B]/50'
                    : item.enabled
                    ? 'bg-[#181A20] border-[#2E3440] hover:border-[#383F4D]'
                    : 'bg-[#181A20]/40 border-[#2E3440]/40 opacity-50'
                }`}
              >
                {/* Order Number & Status Marker */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono-code font-bold text-[#88929B] w-6 text-center shrink-0">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white truncate max-w-[200px]" title={item.title}>
                        {item.title}
                      </span>
                      <span className="text-[11px] font-mono-code text-[#0EA5E9] shrink-0">
                        mod.io {item.ugcId}
                      </span>

                      {/* Status Badges */}
                      {isPlaying && (
                        <span className="text-[10px] font-mono-code font-bold text-[#38BDF8] bg-[#0EA5E9]/20 px-2 py-0.5 rounded flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          NOW PLAYING
                        </span>
                      )}
                      {isNext && (
                        <span className="text-[10px] font-mono-code font-bold text-[#F59E0B] bg-[#F59E0B]/20 px-2 py-0.5 rounded flex items-center gap-1">
                          <FastForward className="w-2.5 h-2.5" />
                          UP NEXT
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mode Select & Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={item.gameMode}
                    onChange={(e) => changeGameMode(item.id, e.target.value)}
                    className="h-7 bg-[#0F1115] border border-[#2E3440] rounded text-[11px] font-mono-code text-white px-2 focus:outline-none focus:border-[#0EA5E9]"
                  >
                    <option value="SND">SND (Defusal)</option>
                    <option value="PUSH">PUSH (Assault)</option>
                    <option value="TDM">TDM (Deathmatch)</option>
                    <option value="GUN">GUN (Gun Game)</option>
                    <option value="ZOMBIE">ZOMBIE (Co-op)</option>
                    <option value="INFECTED">INFECTED</option>
                  </select>

                  {/* Immediate SwitchMap button */}
                  <button
                    onClick={() => handleInstantSwitch(item.ugcId, item.gameMode, item.title)}
                    className="flex items-center gap-1 px-2 py-1 bg-[#181A20] hover:bg-[#0EA5E9] border border-[#2E3440] hover:border-[#0EA5E9] text-[#E2E2E8] hover:text-white text-[11px] font-mono-code font-semibold rounded transition-colors"
                    title="Force switch map via RCON immediately"
                  >
                    <Play className="w-3 h-3 fill-current text-[#0EA5E9] group-hover:text-white" />
                    <span className="hidden sm:inline">Switch Now</span>
                  </button>

                  {/* Move Up/Down Controls */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-[#222630] text-[#88929B] hover:text-white disabled:opacity-30"
                      title="Move Up in queue"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === mapCycle.length - 1}
                      className="p-1 rounded hover:bg-[#222630] text-[#88929B] hover:text-white disabled:opacity-30"
                      title="Move Down in queue"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeMapFromCycle(item.id)}
                    className="p-1 rounded hover:bg-[#EF4444]/15 text-[#88929B] hover:text-[#EF4444] transition-colors"
                    title="Remove from RCON queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {mapCycle.length === 0 && (
            <div className="text-center p-8 text-xs text-[#88929B] font-mono-code bg-[#181A20] rounded border border-[#2E3440]">
              RCON rotation queue is currently empty. Add maps from installed catalog above.
            </div>
          )}
        </div>
      </div>

      {/* Right: RCON Rotation Dispatch Inspector & Python/Socket Script Exporter */}
      <div className="w-full lg:w-[460px] bg-[#111317] flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-[#2E3440] bg-[#181A20] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#0EA5E9]" />
            <div>
              <span className="text-xs font-bold uppercase font-mono-code text-white">
                RCON Rotation Dispatcher
              </span>
              <span className="text-[11px] font-mono-code text-[#88929B] block">
                Pure RCON socket execution (MapCycle.csv is bypassed)
              </span>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Real-time RCON Command Preview */}
          <div className="bg-[#181A20] border border-[#2E3440] rounded p-3.5 space-y-2">
            <span className="text-xs font-mono-code font-bold text-white block">
              Active RCON Packet Directives
            </span>
            <div className="space-y-1.5 text-xs font-mono-code">
              <div className="p-2 bg-[#0A0B0E] border border-[#2E3440] rounded flex items-center justify-between">
                <span className="text-[#88929B]">Rotate Map:</span>
                <span className="text-[#38BDF8] font-bold">RotateMap</span>
              </div>
              <div className="p-2 bg-[#0A0B0E] border border-[#2E3440] rounded flex items-center justify-between">
                <span className="text-[#88929B]">Next Map Target:</span>
                <span className="text-[#22C55E] font-bold truncate max-w-[220px]">
                  SwitchMap UGC{nextQueuedMap?.ugcId || '1849201'} {nextQueuedMap?.gameMode || 'SND'}
                </span>
              </div>
            </div>
          </div>

          {/* Python RCON Automation Daemon Script */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code font-bold text-[#E2E2E8] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#0EA5E9]" />
                Automated RCON Socket Script (Python)
              </span>
              <button
                onClick={() => copyScript(generatedRconScript, 'rcon')}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] text-xs font-mono-code text-[#E2E2E8] rounded transition-colors"
              >
                {copiedScript ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3 text-[#0EA5E9]" />}
                <span>{copiedScript ? 'Copied' : 'Copy Script'}</span>
              </button>
            </div>

            <div className="bg-[#0A0B0E] border border-[#2E3440] p-3 rounded font-mono-code text-[11px] leading-relaxed text-[#38BDF8] max-h-56 overflow-y-auto select-all">
              <pre className="whitespace-pre-wrap">{generatedRconScript}</pre>
            </div>
          </div>

          {/* Game.ini MapRotation Fallback */}
          <div className="space-y-2 pt-2 border-t border-[#2E3440]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code font-bold text-[#E2E2E8] flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#22C55E]" />
                Game.ini MapRotation Directives
              </span>
              <button
                onClick={() => copyScript(generatedGameIni, 'ini')}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] text-xs font-mono-code text-[#E2E2E8] rounded transition-colors"
              >
                {copiedIni ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3 text-[#22C55E]" />}
                <span>{copiedIni ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-[#0A0B0E] border border-[#2E3440] p-3 rounded font-mono-code text-[11px] leading-relaxed text-[#22C55E] max-h-40 overflow-y-auto select-all">
              <pre className="whitespace-pre-wrap">{generatedGameIni}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
